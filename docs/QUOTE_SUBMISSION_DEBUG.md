# Debug de la soumission de devis

## Problèmes identifiés (1er Octobre 2025)

### 1. ✅ RÉSOLU: Colonne `tva_rate` n'existe pas
**Solution**: Supprimé `tva_rate` du schema d'input du router

### 2. ✅ RÉSOLU: RLS bloque la création
**Solution**: Utilisé `supabaseAdmin` au lieu de `supabaseClient`

### 3. ✅ RÉSOLU: Colonne `total_amount` NOT NULL
**Solution**: Ajouté valeur par défaut 0

### 4. ✅ RÉSOLU: Colonne `delivery_days` NOT NULL
**Solution**: Ajouté valeur par défaut 30 pour `delay_days` et `delivery_days`

### 5. ✅ RÉSOLU: Contrainte unique sur project_id + company_id
**Solution**: Ajouté logique pour supprimer les devis en brouillon existants avant création

### 6. ✅ RÉSOLU: Statut du devis et affichage dashboard
**Problème**: Le devis était créé en "draft" mais jamais soumis
**Solution**: Ajouté appel à `submitQuote` après création des lignes pour passer le statut à "submitted"

Le dashboard affiche seulement les devis avec statut "submitted", donc maintenant ils apparaissent correctement.

**Fichiers concernés:**
- `apps/web/src/app/company/projects/[id]/page.tsx:188-192`

### 7. 🆕 TODO: Affichage du titre du projet

**Problème**: Affiche "Projet #UUID" au lieu du vrai titre

**À vérifier**: Où exactement ? (liste des projets, détail, etc.)

### 8. 🆕 TODO: Clarifier la logique "en analyse"

**Question**: Comment/quand un projet passe en statut "analyzing" ?

## Code ajouté pour debug

```typescript
// apps/web/src/app/company/projects/[id]/page.tsx
console.log('Creating quote...')
console.log('Quote created:', quote)
console.log('Creating quote lines...')
console.log('Quote lines created successfully')
```

## Solution contrainte unique (Problem #5)

**Logique implémentée:**
1. Avant de créer un nouveau devis, on récupère tous les devis du projet
2. On filtre pour trouver les devis en "draft" de l'entreprise courante
3. On supprime ces devis draft existants
4. On crée le nouveau devis

**Code ajouté:**
```typescript
// Step 1: Check for existing draft quotes from this company and delete them
const existingQuotes = projectQuotesData?.quotes || []
const myDraftQuotes = existingQuotes.filter(
  q => q.company_id === user.user.id && q.status === 'draft'
)

if (myDraftQuotes.length > 0) {
  console.log(`Deleting ${myDraftQuotes.length} existing draft quote(s)...`)
  for (const draftQuote of myDraftQuotes) {
    await deleteQuoteMutation.mutateAsync({ id: draftQuote.id })
  }
}
```

**Pourquoi cette approche:**
- Permet à l'entreprise de re-soumettre/corriger son devis
- Ne supprime que les brouillons (pas les devis déjà soumis)
- Respecte la contrainte unique de la base de données

## Prochaines étapes

1. Collecter les logs console du navigateur
2. Vérifier la base de données Supabase :
   - Table `quotes` : nouveau devis créé ?
   - Table `quote_lines` : lignes créées ?
   - Totaux mis à jour par le trigger ?
3. Corriger l'affichage du titre du projet
4. Documenter le workflow des statuts
