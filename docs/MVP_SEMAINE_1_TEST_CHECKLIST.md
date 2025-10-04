# MVP Semaine 1 - Checklist de Test

**Date:** 30 septembre 2025
**Statut:** ✅ Serveurs démarrés (Web: 3000, API: 4000)

## 🎯 Objectifs de la Semaine 1

Valider le workflow complet:
1. EmailService fonctionnel
2. CompanyQuotes page avec filtres
3. EditProject page pour syndics
4. Error boundaries et skeleton loaders

---

## ✅ Tests Automatiques Complétés

### 1. Infrastructure
- ✅ Frontend démarré sur http://localhost:3000
- ✅ API démarrée sur http://localhost:4000
- ✅ Health check API: `{"status":"ok"}`
- ✅ Supabase connecté (URL + clés chargées)

### 2. EmailService
- ✅ Service créé (`apps/api/src/services/email.service.ts`)
- ✅ Router tRPC créé (`apps/api/src/trpc/routers/email.router.ts`)
- ✅ 3 endpoints exposés: `send`, `sendQuoteReceived`, `sendQuoteAccepted`
- ✅ Templates HTML professionnels
- ✅ Test script exécuté avec succès (2 emails envoyés)
- ✅ Email reçu à vielcorporation@gmail.com

### 3. CompanyQuotes Page
- ✅ Page créée (`apps/web/src/app/company/quotes/page.tsx`)
- ✅ Filtres par statut (tabs): Tous, En attente, Acceptés, Rejetés, Expirés
- ✅ Cartes statistiques (4 cards avec compteurs)
- ✅ Liste détaillée avec badges de statut
- ✅ Skeleton loaders pendant chargement
- ✅ Bouton "Voir le projet" pour chaque devis

### 4. EditProject Page
- ✅ Page créée (`apps/web/src/app/syndic/projects/[id]/edit/page.tsx`)
- ✅ Chargement automatique des données projet
- ✅ Validation: seuls projets "draft" modifiables
- ✅ Champs modifiables: titre, description, deadline
- ✅ Champs protégés: type, copropriété, budgets
- ✅ 2 actions: Sauvegarder (draft) / Publier
- ✅ Skeleton loader pendant chargement

### 5. Polish & UX
- ✅ Error boundary global créé (`components/ErrorBoundary.tsx`)
- ✅ Next.js error pages (`app/error.tsx`, `app/global-error.tsx`)
- ✅ ErrorBoundary intégré dans TRPCProvider
- ✅ Composant Skeleton réutilisable créé
- ✅ Skeleton loaders appliqués sur CompanyQuotes et EditProject

---

## 📋 Tests Manuels à Effectuer (À faire par l'utilisateur)

### Test 1: Navigation & Auth
- [ ] Ouvrir http://localhost:3000 
- [ ] Vérifier page d'accueil s'affiche
- [ ] Se connecter comme Syndic
- [ ] Vérifier redirection vers dashboard syndic

### Test 2: Créer un Projet (Syndic)
- [ ] Aller sur `/syndic/projects/new`
- [ ] Remplir formulaire nouveau projet
- [ ] Sauvegarder en brouillon
- [ ] Vérifier projet apparaît dans liste projets

### Test 3: Modifier un Projet (Syndic)
- [ ] Aller sur `/syndic/projects`
- [ ] Cliquer sur un projet en "draft"
- [ ] Cliquer "Modifier"
- [ ] Vérifier `/syndic/projects/[id]/edit` s'ouvre
- [ ] Modifier titre et description
- [ ] Sauvegarder
- [ ] Vérifier modifications enregistrées
- [ ] Tester bouton "Publier"

### Test 4: Skeleton Loaders (EditProject)
- [ ] Aller sur `/syndic/projects/[id]/edit`
- [ ] Vérifier skeleton loader pendant chargement
- [ ] Vérifier transition fluide vers formulaire

### Test 5: Voir Devis (Entreprise)
- [ ] Se connecter comme Entreprise
- [ ] Aller sur `/company/quotes`
- [ ] Vérifier 4 cartes statistiques affichées
- [ ] Vérifier tabs de filtrage fonctionnent
- [ ] Cliquer sur "Tous" → voir tous les devis
- [ ] Cliquer sur "En attente" → filtrage correct
- [ ] Cliquer sur "Acceptés" → filtrage correct

### Test 6: Skeleton Loaders (CompanyQuotes)
- [ ] Rafraîchir `/company/quotes`
- [ ] Vérifier skeleton cards pendant chargement
- [ ] Vérifier transition fluide vers liste devis

### Test 7: Workflow Complet Devis
- [ ] Syndic crée projet → Publie
- [ ] Entreprise soumet devis
- [ ] Vérifier devis apparaît dans `/company/quotes`
- [ ] Syndic accepte devis
- [ ] Vérifier email envoyé "Devis accepté" (check console API)
- [ ] Vérifier statut devis change à "Accepté" dans `/company/quotes`

### Test 8: Error Boundaries
- [ ] Forcer erreur dans console (ex: throw new Error("Test"))
- [ ] Vérifier error boundary s'affiche
- [ ] Vérifier boutons "Réessayer" et "Retour accueil"
- [ ] Tester bouton "Réessayer"

### Test 9: EmailService Integration
- [ ] Syndic accepte un devis
- [ ] Vérifier logs API console: "Email sent successfully"
- [ ] Vérifier email reçu par entreprise (si email config OK)

### Test 10: Edge Cases
- [ ] Essayer modifier projet publié → vérifier message "Modification impossible"
- [ ] CompanyQuotes sans devis → vérifier message "Aucun devis trouvé"
- [ ] Accès non autorisé → vérifier message "Accès non autorisé"

---

## 🐛 Bugs à Investiguer

### Bugs Potentiels à Tester
1. **company_id temporaire**: Dans `company/quotes/new/page.tsx:78`, il y a `company_id: 'temp-company-id'`
   - [ ] Vérifier si soumission devis fonctionne
   - [ ] Fix: Récupérer vrai company_id depuis user

2. **Status mapping**: Vérifier cohérence statuts entre:
   - Types: `pending | approved | rejected | expired`
   - Code CompanyQuotes: utilise ces statuts
   - Base de données: vérifier schéma quotes

3. **Router quote types**: Page utilise statut différent du router
   - Router: `draft | submitted | accepted | rejected`
   - Page: `pending | approved | rejected | expired`
   - [ ] Harmoniser les types

---

## 📊 Résultats Attendus

### ✅ Critères de Succès MVP Semaine 1
- [x] EmailService envoie emails (testé avec succès)
- [ ] CompanyQuotes affiche et filtre devis correctement
- [ ] EditProject permet modification projets draft
- [ ] Skeleton loaders affichent pendant chargement
- [ ] Error boundaries catchent et affichent erreurs
- [ ] Navigation entre pages fluide
- [ ] Pas d'erreurs console critiques

### ⚠️ Bugs Bloquants Identifiés
*(À remplir après tests manuels)*

### 🔧 Bugs Non-Bloquants Identifiés
*(À remplir après tests manuels)*

---

## 🚀 Prochaines Étapes (Semaine 2)

Selon roadmap, Semaine 2 devrait couvrir:
1. Intégration Stripe pour paiements
2. Dashboard analytics pour syndics
3. Notifications en temps réel
4. Tests E2E automatisés
5. Préparation déploiement beta

**Note:** Attendre validation tests Semaine 1 avant de continuer.
