### Test 1: Navigation & Auth
- [OK] Ouvrir http://localhost:3000 
- [OK] Vérifier page d'accueil s'affiche
- [OK] Se connecter comme Syndic
- [OK] Vérifier redirection vers dashboard syndic

### Test 2: Créer un Projet (Syndic)
- [OK] Aller sur `/syndic/projects/new`
- [OK] Remplir formulaire nouveau projet
- [OK] Sauvegarder en brouillon -> il manque un refresh auto + indication comme quoi le projet est bien registré en brouillon (notification en bas à droite ?)
- [OK] Vérifier projet apparaît dans liste projets

### Test 3: Modifier un Projet (Syndic)
- [OK] Aller sur `/syndic/projects`
- [OK] Cliquer sur un projet en "draft"
- [OK] Cliquer "Modifier"
- [OK] Vérifier `/syndic/projects/[id]/edit` s'ouvre
- [OK] Modifier titre et description
- [Ne fonctionne pas] Sauvegarder
- [X] Vérifier modifications enregistrées
- [Ne fonctionne pas] Tester bouton "Publier"

### Test 4: Skeleton Loaders (EditProject)
- [OK] Aller sur `/syndic/projects/[id]/edit`
- [Non] Vérifier skeleton loader pendant chargement
- [Non] Vérifier transition fluide vers formulaire

### Test 5: Voir Devis (Entreprise)
- [Failed to create company profile ] Se connecter comme Entreprise