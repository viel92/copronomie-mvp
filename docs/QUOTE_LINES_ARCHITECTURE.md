# Architecture Devis avec Lignes et Multiples Taux de TVA

## Vue d'ensemble

Le système de devis a été repensé pour supporter **plusieurs lignes avec des taux de TVA différents** (20%, 5.5%, 10%, etc.) qui peuvent se cumuler. Ceci est nécessaire pour la conformité fiscale française où certains travaux peuvent avoir des taux réduits.

## Architecture

### Base de données

#### Table `quote_lines`

```sql
CREATE TABLE quote_lines (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,

  -- Détails de la ligne
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit_price_ht DECIMAL(10, 2) NOT NULL,

  -- Montants calculés
  total_ht DECIMAL(10, 2) NOT NULL,
  vat_rate DECIMAL(5, 2) NOT NULL,
  total_vat DECIMAL(10, 2) NOT NULL,
  total_ttc DECIMAL(10, 2) NOT NULL,

  -- Ordre d'affichage
  line_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Trigger automatique

Un trigger PostgreSQL met à jour automatiquement les totaux du devis parent (`quotes` table) quand des lignes sont ajoutées/modifiées/supprimées:

```sql
CREATE TRIGGER trigger_update_quote_totals
  AFTER INSERT OR UPDATE OR DELETE ON quote_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_quote_totals();
```

**Avantages:**
- Cohérence garantie entre lignes et totaux
- Pas besoin de recalculer manuellement
- Transaction atomique

### Backend

#### Services

**`apps/api/src/services/quote-line.service.ts`**

Fonctionnalités:
- `createLine()`: Créer une ligne avec calcul auto des totaux
- `createBulkLines()`: Créer plusieurs lignes en une transaction
- `updateLine()`: Mettre à jour et recalculer
- `deleteLine()`: Supprimer une ligne
- `getLinesByQuote()`: Récupérer toutes les lignes d'un devis
- `getQuoteVATSummary()`: Récapitulatif TVA groupé par taux

**Calcul des totaux:**
```typescript
total_ht = quantity * unit_price_ht
total_vat = total_ht * (vat_rate / 100)
total_ttc = total_ht + total_vat
```

#### Routers tRPC

**`apps/api/src/trpc/routers/quote-line.router.ts`**

Endpoints:
- `quoteLines.getByQuote({ quoteId })`
- `quoteLines.create({ quote_id, description, quantity, unit_price_ht, vat_rate })`
- `quoteLines.createBulk({ lines: [...] })`
- `quoteLines.update({ id, ... })`
- `quoteLines.delete({ id })`
- `quoteLines.getVATSummary({ quoteId })` - Récapitulatif par taux de TVA

**Enregistrement dans l'app router:**
```typescript
// apps/api/src/trpc/routers/index.ts
export const appRouter = router({
  // ...
  quoteLines: quoteLineRouter,
})
```

### Frontend

#### Composants

**1. `QuoteLinesForm` - Formulaire de saisie (entreprises)**

`apps/web/src/components/quotes/QuoteLinesForm.tsx`

Features:
- Ajouter/supprimer des lignes dynamiquement
- Champs par ligne: description, quantité, prix unitaire HT, taux TVA
- Calcul automatique des totaux par ligne
- Récapitulatif TVA groupé par taux en temps réel
- Validation: minimum 1 ligne

Usage:
```tsx
const [lines, setLines] = useState<QuoteLine[]>([
  {
    id: 'temp-1',
    description: 'Travaux de toiture',
    quantity: 1,
    unit_price_ht: 15000,
    vat_rate: 10, // TVA réduite pour travaux de rénovation
    total_ht: 0,
    total_vat: 0,
    total_ttc: 0,
  }
])

<QuoteLinesForm
  lines={lines}
  onChange={setLines}
  disabled={isSubmitting}
/>
```

**2. `QuoteLinesView` - Affichage lecture seule (syndics)**

`apps/web/src/components/quotes/QuoteLinesView.tsx`

Features:
- Tableau détaillé avec toutes les colonnes
- Récapitulatif TVA groupé par taux
- Total général (HT, TVA, TTC)
- Format français pour les nombres

Usage:
```tsx
const { data } = trpc.quoteLines.getByQuote.useQuery({ quoteId })

<QuoteLinesView lines={data?.lines || []} />
```

## Migration depuis l'ancien système

### 1. Appliquer le schéma SQL

```bash
psql -d votre_database < scripts/create-quote-lines.sql
```

**Note:** Ce script ajoute aussi les colonnes `total_ht` et `total_ttc` à la table `quotes` si elles n'existent pas.

### 2. Migrer les devis existants (optionnel)

Si vous avez des devis existants avec l'ancien système (champs `total_amount`, `total_ht`, `total_ttc`, `tva_rate` dans `quotes`), vous pouvez créer une ligne unique:

```sql
-- Pour chaque devis existant, créer une ligne par défaut
INSERT INTO quote_lines (quote_id, description, quantity, unit_price_ht, vat_rate, total_ht, total_vat, total_ttc, line_order)
SELECT
  id as quote_id,
  COALESCE(description, 'Montant global du devis') as description,
  1 as quantity,
  total_ht as unit_price_ht,
  COALESCE(tva_rate, 20) as vat_rate,
  total_ht,
  (total_ttc - total_ht) as total_vat,
  total_ttc,
  0 as line_order
FROM quotes
WHERE total_ht IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM quote_lines WHERE quote_lines.quote_id = quotes.id);
```

### 3. Mettre à jour le formulaire entreprise

**Remplacer:**
`apps/web/src/app/company/projects/[id]/page.tsx`

**Ancien formulaire (montants HT/TTC simples):**
```tsx
<Input type="number" value={quoteAmountTTC} ... />
<Input type="number" value={quoteAmountHT} ... />
```

**Nouveau formulaire (lignes de devis):**
```tsx
import { QuoteLinesForm } from '@/components/quotes/QuoteLinesForm'

const [quoteLines, setQuoteLines] = useState<QuoteLine[]>([
  {
    id: 'temp-1',
    description: '',
    quantity: 1,
    unit_price_ht: 0,
    vat_rate: 20,
    total_ht: 0,
    total_vat: 0,
    total_ttc: 0,
  }
])

// Dans le formulaire
<QuoteLinesForm
  lines={quoteLines}
  onChange={setQuoteLines}
  disabled={submitQuoteMutation.isPending}
/>
```

**Soumission du devis:**
```tsx
// Créer le devis d'abord (sans montants)
const quote = await createQuoteMutation.mutateAsync({
  project_id: projectId,
  company_id: user.user.id,
  description: quoteDescription,
  delay_days: quoteDelay ? parseInt(quoteDelay) : undefined,
  pdf_url: pdfUrl,
})

// Ensuite créer les lignes (trigger mettra à jour les totaux automatiquement)
await createQuoteLinesMutation.mutateAsync({
  lines: quoteLines.map((line, index) => ({
    quote_id: quote.id,
    description: line.description,
    quantity: line.quantity,
    unit_price_ht: line.unit_price_ht,
    vat_rate: line.vat_rate,
    line_order: index,
  }))
})
```

### 4. Mettre à jour la vue syndic

**Dans:**
`apps/web/src/app/syndic/projects/[id]/page.tsx`

**Ajouter:**
```tsx
import { QuoteLinesView } from '@/components/quotes/QuoteLinesView'

// Dans le composant de devis
const { data: linesData } = trpc.quoteLines.getByQuote.useQuery({
  quoteId: quote.id
})

// Dans le rendu
{linesData?.lines && linesData.lines.length > 0 && (
  <div className="pt-4 border-t">
    <h4 className="font-medium mb-3">Détail du devis</h4>
    <QuoteLinesView lines={linesData.lines} />
  </div>
)}
```

## Exemples d'utilisation

### Exemple 1: Devis simple (un taux de TVA)

```typescript
const lines = [
  {
    description: 'Travaux de peinture intérieure',
    quantity: 150, // m²
    unit_price_ht: 25, // €/m²
    vat_rate: 20,
  }
]

// Résultat:
// Total HT: 3,750.00 €
// TVA 20%: 750.00 €
// Total TTC: 4,500.00 €
```

### Exemple 2: Devis avec plusieurs taux de TVA

```typescript
const lines = [
  {
    description: 'Rénovation énergétique (isolation)',
    quantity: 1,
    unit_price_ht: 12000,
    vat_rate: 5.5, // TVA réduite
  },
  {
    description: 'Peinture',
    quantity: 1,
    unit_price_ht: 3000,
    vat_rate: 10, // TVA intermédiaire
  },
  {
    description: 'Fournitures diverses',
    quantity: 1,
    unit_price_ht: 500,
    vat_rate: 20, // TVA normale
  }
]

// Résultat:
// TVA 5.5%:  12,000.00 € HT + 660.00 € TVA = 12,660.00 € TTC
// TVA 10%:    3,000.00 € HT + 300.00 € TVA =  3,300.00 € TTC
// TVA 20%:      500.00 € HT + 100.00 € TVA =    600.00 € TTC
// TOTAL:     15,500.00 € HT + 1,060.00 € TVA = 16,560.00 € TTC
```

### Exemple 3: Devis détaillé avec quantités

```typescript
const lines = [
  {
    description: 'Tuiles en terre cuite',
    quantity: 250, // unités
    unit_price_ht: 3.50, // €/tuile
    vat_rate: 10,
  },
  {
    description: 'Main d\'œuvre pose toiture',
    quantity: 40, // heures
    unit_price_ht: 45, // €/heure
    vat_rate: 10,
  },
  {
    description: 'Échafaudage (location)',
    quantity: 15, // jours
    unit_price_ht: 80, // €/jour
    vat_rate: 20,
  }
]

// Résultat:
// Ligne 1: 250 × 3.50 € = 875.00 € HT
// Ligne 2: 40 × 45 € = 1,800.00 € HT
// Ligne 3: 15 × 80 € = 1,200.00 € HT
//
// TVA 10%: 2,675.00 € HT + 267.50 € TVA = 2,942.50 € TTC
// TVA 20%: 1,200.00 € HT + 240.00 € TVA = 1,440.00 € TTC
// TOTAL: 3,875.00 € HT + 507.50 € TVA = 4,382.50 € TTC
```

## Taux de TVA courants en France (2025)

| Taux | Usage | Exemples de travaux |
|------|-------|---------------------|
| **5.5%** | TVA super-réduite | Rénovation énergétique, isolation, pompes à chaleur, chaudières efficaces |
| **10%** | TVA intermédiaire | Travaux d'amélioration, transformation, aménagement de logements >2 ans |
| **20%** | TVA normale | Construction neuve, fournitures sans pose, travaux de confort |

**Source:** [Service Public - TVA dans le bâtiment](https://www.service-public.fr/particuliers/vosdroits/F1266)

## Validation et règles métier

### Validations frontend
- ✅ Minimum 1 ligne par devis
- ✅ Description obligatoire (min 1 caractère)
- ✅ Quantité > 0
- ✅ Prix unitaire HT ≥ 0
- ✅ Taux TVA entre 0% et 100%
- ✅ Calcul automatique des totaux

### Validations backend (Zod)
```typescript
z.object({
  quote_id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit_price_ht: z.number().positive('Unit price must be positive'),
  vat_rate: z.number().min(0).max(100, 'VAT rate must be between 0 and 100'),
})
```

### RLS Policies
- ✅ Syndic peut voir lignes des devis de ses projets
- ✅ Entreprise peut voir lignes de ses propres devis
- ✅ Entreprise peut créer/modifier lignes de devis en statut `draft` uniquement
- ✅ Cascade delete: suppression devis → suppression lignes

## Performance

### Optimisations
- Index sur `quote_id` pour récupération rapide
- Trigger PostgreSQL évite recalculs multiples
- Bulk insert pour création de plusieurs lignes
- Pas de N+1 queries (select avec join)

### Bonnes pratiques
- Utiliser `createBulk` pour créer plusieurs lignes en une transaction
- Éviter de créer/supprimer des lignes une par une (utiliser transactions)
- Le trigger se déclenche automatiquement, pas besoin de recalculer manuellement

## Roadmap / Améliorations futures

### Court terme (Semaine 4-5)
- [ ] Importer lignes depuis PDF (extraction automatique)
- [ ] Templates de lignes réutilisables (entreprises)
- [ ] Export Excel du détail des lignes

### Moyen terme (Phase 2)
- [ ] Catégories de lignes (matériaux, main d'œuvre, etc.)
- [ ] Photos par ligne (justificatifs)
- [ ] Remises/majorations par ligne ou globales
- [ ] Validation TVA selon type de travaux (alertes si taux incorrect)

### Long terme (Phase 3+)
- [ ] Comparaison avancée ligne par ligne entre devis
- [ ] Historique modifications lignes (audit trail)
- [ ] Suggestion IA de taux TVA selon description
- [ ] Integration comptabilité (export FEC)

## Support

Pour toute question sur l'architecture ou l'implémentation:
- Documentation technique: ce fichier
- Exemples de code: voir composants `QuoteLinesForm` et `QuoteLinesView`
- Tests manuels: utiliser le formulaire entreprise pour créer un devis avec plusieurs lignes et vérifier le récapitulatif TVA

---

**Dernière mise à jour:** 1er Octobre 2025
**Version:** 1.0
**Auteur:** Équipe Copronomie
