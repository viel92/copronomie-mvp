# Test du Flux MVP

## Prérequis
- Serveurs démarrés : `pnpm dev`
- API: http://localhost:4000
- Web: http://localhost:3000
- Base de données Supabase connectée

## 1️⃣ Flux Syndic → Company → Syndic

### Étape 1 : Créer un compte Syndic
1. Aller sur http://localhost:3000/auth/register
2. Créer un compte avec role='syndic'
3. Se connecter

### Étape 2 : Créer une copropriété
1. Aller sur /syndic/condos
2. Cliquer "Ajouter une copropriété"
3. Remplir le formulaire (nom, adresse, ville, code postal)
4. Vérifier que la copro apparaît dans la liste

### Étape 3 : Créer un projet
1. Aller sur /syndic/projects
2. Cliquer "Créer un projet"
3. Remplir :
   - Titre : "Rénovation façade immeuble A"
   - Type : "property"
   - Budget : 50000
   - Description : "Travaux de rénovation de la façade côté rue"
   - Deadline : Date dans 3 mois
   - Copro : Sélectionner celle créée
4. Vérifier que le projet apparaît en statut "draft"

### Étape 4 : Publier le projet
1. Dans la liste des projets, cliquer sur le projet créé
2. Cliquer "Publier le projet"
3. Vérifier que le statut passe à "published"

### Étape 5 : Se connecter en tant qu'Entreprise
1. Se déconnecter
2. Créer un nouveau compte avec role='company'
3. Nom entreprise : "Entreprise Travaux Pro"
4. Se connecter

### Étape 6 : Voir les projets disponibles
1. Aller sur /company/projects
2. Vérifier que le projet "Rénovation façade immeuble A" apparaît
3. Voir les détails (budget, deadline, copro, description)

### Étape 7 : Soumettre un devis
1. Cliquer "Soumettre un devis" sur le projet
2. Remplir le formulaire :
   - Montant : 45000
   - Délai : 60 jours
   - Détails : "Devis incluant échafaudage, peinture façade, garantie 5 ans"
3. Soumettre
4. Vérifier la redirection vers /company/dashboard

### Étape 8 : Voir le devis côté Syndic
1. Se déconnecter et se reconnecter en tant que Syndic
2. Aller sur /syndic/projects
3. Cliquer sur le projet "Rénovation façade immeuble A"
4. Dans l'onglet "Devis", vérifier que le devis de "Entreprise Travaux Pro" apparaît
5. Voir : montant (45000€), délai (60j), statut (pending)

### Étape 9 : Accepter le devis
1. Cliquer "Accepter" sur le devis
2. Vérifier que :
   - Le statut du devis passe à "accepted"
   - Les autres devis passent à "rejected"
   - Le statut du projet passe à "in_progress"

## 2️⃣ Points de vérification

### Backend (API)
- [ ] POST /auth/register → Crée utilisateur Supabase
- [ ] POST /auth/login → Retourne JWT token
- [ ] GET /projects → Liste projets (filtre par syndic/company selon role)
- [ ] POST /projects → Crée projet
- [ ] PATCH /projects/:id → Publie projet (status=published)
- [ ] POST /quotes → Crée devis
- [ ] PATCH /quotes/:id → Accepte/Rejette devis
- [ ] GET /condos → Liste copros par syndic

### Frontend (Next.js)
- [ ] /auth/register → Formulaire inscription
- [ ] /auth/login → Formulaire connexion
- [ ] /syndic/dashboard → Dashboard syndic
- [ ] /syndic/condos → Liste copros + Créer copro
- [ ] /syndic/projects → Liste projets + Créer projet
- [ ] /syndic/projects/[id] → Détails projet + Devis
- [ ] /company/dashboard → Dashboard entreprise
- [ ] /company/projects → Liste projets publiés
- [ ] /company/quotes/new?projectId=X → Formulaire devis

### Base de données (Supabase)
- [ ] Table users : id, email, role, company_name
- [ ] Table condos : id, name, address, syndic_id
- [ ] Table projects : id, title, type, budget, status, syndic_id, condo_id
- [ ] Table quotes : id, project_id, company_id, amount, status, details

## 3️⃣ Erreurs possibles

### Erreur 1 : "Not authorized"
- Vérifier que le JWT token est bien envoyé dans les headers
- Vérifier que ctx.user est bien rempli dans les procedures tRPC

### Erreur 2 : "Company not found"
- Créer une entrée dans table `companies` après inscription
- Vérifier que company_id est bien lié à l'utilisateur

### Erreur 3 : Projet non visible côté Company
- Vérifier que le statut du projet est "published"
- Vérifier le filtre dans CompanyProjectsPage

### Erreur 4 : Devis non créé
- Vérifier que company_id existe
- Vérifier les champs obligatoires (project_id, amount, details)

## 4️⃣ Commandes utiles

```bash
# Démarrer les serveurs
pnpm dev

# Voir les logs API
tail -f apps/api/logs/api.log

# Nettoyer .next (si erreur)
rm -rf apps/web/.next

# Vérifier tables Supabase
psql $DATABASE_URL -c "SELECT * FROM projects WHERE status='published';"
```

## 5️⃣ Résultat attendu

✅ Flux complet fonctionnel :
1. Syndic crée copro → OK
2. Syndic crée projet → OK
3. Syndic publie projet → OK
4. Company voit projet → OK
5. Company soumet devis → OK
6. Syndic voit devis → OK
7. Syndic accepte devis → OK
8. Projet passe "in_progress" → OK

🎯 MVP Ready pour déploiement !