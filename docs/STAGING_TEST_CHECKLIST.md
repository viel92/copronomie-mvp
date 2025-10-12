# Checklist Tests Manuels - Environnement STAGING

**Date:** 12 Octobre 2025
**Environnement:** https://staging-app.copronomie.fr
**API:** https://staging-api.copronomie.fr

---

## Pré-requis

- [ ] Application accessible sur https://staging-app.copronomie.fr
- [ ] API accessible sur https://staging-api.copronomie.fr
- [ ] Certificats SSL valides (pas d'avertissement navigateur)
- [ ] Console navigateur ouverte (F12) pour détecter erreurs

---

## 1. Tests Authentification & Inscription

### 1.1 Inscription Syndic
- [ ] Aller sur https://staging-app.copronomie.fr
- [ ] Cliquer sur "S'inscrire" ou aller sur `/auth/register`
- [ ] Remplir le formulaire syndic :
  - Email: `syndic-test-$(date +%s)@copronomie.fr`
  - Mot de passe: `TestPassword123!`
  - Nom: "Syndic Test"
  - Type: Syndic
- [ ] Soumettre le formulaire
- [ ] **Vérifier:** Redirection vers `/syndic/dashboard`
- [ ] **Vérifier:** Pas d'erreurs console
- [ ] **Vérifier:** Dashboard s'affiche avec message "Bienvenue"

### 1.2 Déconnexion
- [ ] Cliquer sur menu utilisateur (coin supérieur droit)
- [ ] Cliquer sur "Déconnexion"
- [ ] **Vérifier:** Redirection vers page login
- [ ] **Vérifier:** Session effacée (pas de redirection auto vers dashboard)

### 1.3 Connexion Syndic
- [ ] Aller sur `/auth/login`
- [ ] Saisir email et mot de passe du syndic créé
- [ ] **Vérifier:** Connexion réussie → redirection `/syndic/dashboard`
- [ ] **Vérifier:** Persistance session (rafraîchir page, toujours connecté)

---

## 2. Tests Module Syndic

### 2.1 Création Copropriété (Méthode Manuelle)
- [ ] Aller sur `/syndic/condos`
- [ ] Cliquer sur "Nouvelle copropriété"
- [ ] Choisir "Saisie manuelle"
- [ ] Remplir le formulaire :
  - Nom: "Résidence Les Fleurs"
  - Adresse: "123 Avenue de la République"
  - Ville: "Paris"
  - Code postal: "75011"
  - Nombre de lots: "25"
- [ ] Soumettre
- [ ] **Vérifier:** Redirection vers `/syndic/condos`
- [ ] **Vérifier:** Copropriété apparaît dans la liste
- [ ] **Vérifier:** Pas d'erreurs console

### 2.2 Création Projet
- [ ] Aller sur `/syndic/projects`
- [ ] Cliquer sur "Nouveau projet"
- [ ] Remplir le formulaire :
  - Titre: "Rénovation toiture Résidence Les Fleurs"
  - Type: "Toiture"
  - Copropriété: Sélectionner "Résidence Les Fleurs"
  - Description: "Rénovation complète de la toiture avec isolation"
  - Budget min: 15000
  - Budget max: 25000
  - Deadline: Date dans 30 jours
- [ ] Cliquer sur "Sauvegarder en brouillon"
- [ ] **Vérifier:** Projet créé avec statut "draft"
- [ ] **Vérifier:** Projet apparaît dans liste avec badge "Brouillon"

### 2.3 Publication Projet
- [ ] Aller sur la page détail du projet créé
- [ ] Cliquer sur "Publier le projet"
- [ ] Confirmer la publication
- [ ] **Vérifier:** Statut passe à "published"
- [ ] **Vérifier:** Badge devient "Publié"
- [ ] **Vérifier:** Bouton "Publier" disparaît

### 2.4 Analytics Syndic
- [ ] Aller sur `/syndic/analytics`
- [ ] **Vérifier:** Graphiques s'affichent
- [ ] **Vérifier:** KPIs affichent des valeurs (au moins le projet créé)
- [ ] **Vérifier:** Pas d'erreurs console

---

## 3. Tests Module Company

### 3.1 Inscription Company
- [ ] Ouvrir un nouvel onglet navigation privée
- [ ] Aller sur https://staging-app.copronomie.fr
- [ ] Cliquer sur "S'inscrire"
- [ ] Remplir le formulaire company :
  - Email: `company-test-$(date +%s)@copronomie.fr`
  - Mot de passe: `TestPassword123!`
  - Nom: "Entreprise BTP Test"
  - Type: Company
  - Spécialité: "Toiture" (important pour voir le projet)
- [ ] Soumettre
- [ ] **Vérifier:** Redirection vers `/company/dashboard`
- [ ] **Vérifier:** Pas d'erreurs console

### 3.2 Voir Projets Disponibles
- [ ] Aller sur `/company/projects`
- [ ] **Vérifier:** Le projet "Rénovation toiture" apparaît dans la liste
- [ ] **Vérifier:** Statut "Publié" visible
- [ ] **Vérifier:** Budget range affiché
- [ ] Cliquer sur le projet pour voir les détails

### 3.3 Soumettre un Devis
- [ ] Sur la page détail du projet, cliquer "Soumettre un devis"
- [ ] Remplir le formulaire devis :
  - Montant: 20000
  - Délai: 45
  - Description: "Devis pour rénovation toiture complète avec garantie 10 ans"
  - Notes: "Matériaux de qualité premium"
- [ ] Cliquer "Sauvegarder en brouillon" d'abord
- [ ] **Vérifier:** Devis enregistré
- [ ] Revenir sur le devis, cliquer "Soumettre le devis"
- [ ] **Vérifier:** Statut passe à "submitted"
- [ ] **Vérifier:** Email envoyé au syndic (vérifier dans logs Resend ou inbox)

### 3.4 Voir Mes Devis
- [ ] Aller sur `/company/quotes`
- [ ] **Vérifier:** Devis soumis apparaît avec statut "Soumis"
- [ ] **Vérifier:** Statistiques affichent "1 devis soumis"

---

## 4. Tests Workflow Complet (Syndic Accepte Devis)

### 4.1 Syndic Voit le Devis
- [ ] Retourner sur l'onglet syndic (ou se reconnecter)
- [ ] Aller sur `/syndic/projects`
- [ ] Ouvrir le projet "Rénovation toiture"
- [ ] **Vérifier:** Section "Devis reçus" affiche 1 devis
- [ ] **Vérifier:** Détails du devis visibles (montant 20000€, délai 45j)

### 4.2 Accepter le Devis
- [ ] Cliquer sur le devis pour voir les détails
- [ ] Cliquer sur "Accepter le devis"
- [ ] Confirmer l'acceptation
- [ ] **Vérifier:** Statut devis passe à "accepted"
- [ ] **Vérifier:** Statut projet passe à "awarded"
- [ ] **Vérifier:** Email envoyé à l'entreprise (vérifier logs/inbox)

### 4.3 Company Voit l'Acceptation
- [ ] Retourner sur l'onglet company
- [ ] Aller sur `/company/quotes`
- [ ] **Vérifier:** Devis a statut "Accepté"
- [ ] **Vérifier:** Badge vert "Accepté" visible
- [ ] **Vérifier:** Statistiques mises à jour (1 devis accepté)

---

## 5. Tests Emails (Resend)

### 5.1 Email Nouveau Devis (Syndic)
- [ ] Vérifier inbox email syndic (`syndic-test-*@copronomie.fr`)
- [ ] **Vérifier:** Email reçu avec sujet "Nouveau devis reçu"
- [ ] **Vérifier:** Contenu mentionne le projet et l'entreprise
- [ ] **Vérifier:** Lien vers le projet fonctionne

### 5.2 Email Devis Accepté (Company)
- [ ] Vérifier inbox email company (`company-test-*@copronomie.fr`)
- [ ] **Vérifier:** Email reçu avec sujet "Votre devis a été accepté"
- [ ] **Vérifier:** Contenu mentionne le projet et le montant
- [ ] **Vérifier:** Lien vers le devis fonctionne

---

## 6. Tests Performance & UX

### 6.1 Temps de Chargement
- [ ] Ouvrir DevTools > Network
- [ ] Recharger `/syndic/dashboard`
- [ ] **Vérifier:** Temps load total < 3s
- [ ] **Vérifier:** First Contentful Paint < 1.5s

### 6.2 Navigation
- [ ] Tester navigation entre pages (Dashboard, Projects, Condos, Analytics)
- [ ] **Vérifier:** Transitions fluides
- [ ] **Vérifier:** Pas de flash de contenu
- [ ] **Vérifier:** Skeleton loaders s'affichent pendant chargement

### 6.3 Responsive (Optionnel)
- [ ] Ouvrir DevTools > Device Mode
- [ ] Tester sur mobile (375px)
- [ ] **Vérifier:** Menu hamburger fonctionne
- [ ] **Vérifier:** Tableaux scrollables
- [ ] **Vérifier:** Formulaires utilisables

---

## 7. Tests Erreurs & Edge Cases

### 7.1 Formulaires Validation
- [ ] Essayer créer projet sans remplir champs obligatoires
- [ ] **Vérifier:** Messages d'erreur s'affichent
- [ ] **Vérifier:** Validation côté client fonctionne

### 7.2 Session Expirée
- [ ] Attendre 30 min ou supprimer cookie session manuellement
- [ ] Essayer naviguer vers `/syndic/dashboard`
- [ ] **Vérifier:** Redirection vers `/auth/login`
- [ ] **Vérifier:** Message "Session expirée" (si implémenté)

### 7.3 Réseau Lent (Optionnel)
- [ ] DevTools > Network > Throttling "Slow 3G"
- [ ] Recharger une page avec beaucoup de données
- [ ] **Vérifier:** Skeleton loaders s'affichent
- [ ] **Vérifier:** Pas de crash ou timeout

---

## 8. Tests Console & Erreurs

### 8.1 Console Browser
- [ ] Ouvrir Console DevTools (F12)
- [ ] Naviguer à travers toute l'application
- [ ] **Vérifier:** Aucune erreur rouge
- [ ] **Vérifier:** Aucun warning critique
- [ ] Warnings acceptables: deprecation notices, hydration warnings mineurs

### 8.2 Network Requests
- [ ] Ouvrir Network DevTools
- [ ] Tester workflow complet
- [ ] **Vérifier:** Toutes requêtes API retournent 200 (sauf erreurs intentionnelles)
- [ ] **Vérifier:** Headers CORS corrects
- [ ] **Vérifier:** Pas de requêtes en boucle infinie

---

## 9. Récapitulatif Bugs Identifiés

### Bugs Critiques (Bloquants)
_À remplir pendant les tests_

- [ ] Bug 1: [Description]
- [ ] Bug 2: [Description]

### Bugs Mineurs (Non bloquants)
_À remplir pendant les tests_

- [ ] Bug 1: [Description]
- [ ] Bug 2: [Description]

### Améliorations UX Suggérées
_À remplir pendant les tests_

- [ ] Amélioration 1: [Description]
- [ ] Amélioration 2: [Description]

---

## 10. Validation Finale

- [ ] Workflow complet fonctionne (syndic → company → award)
- [ ] Emails sont envoyés et reçus
- [ ] Pas de bugs critiques identifiés
- [ ] Performance acceptable (< 3s load)
- [ ] HTTPS fonctionne correctement
- [ ] Pas d'erreurs console critiques

---

## Notes de Test

_Utiliser cette section pour noter des observations pendant les tests_

**Date test:** ___________
**Navigateur:** ___________
**Testeur:** ___________

**Observations:**
-
-
-

---

## Résultat Final

- [ ] ✅ **STAGING VALIDÉ** - Prêt pour production
- [ ] ⚠️ **STAGING AVEC BUGS MINEURS** - Corrections nécessaires mais non bloquant
- [ ] ❌ **STAGING ÉCHOUÉ** - Bugs critiques à corriger avant production

**Décision:** ___________
**Prochaine étape:** ___________
