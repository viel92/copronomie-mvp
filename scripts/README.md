# Scripts de gestion du serveur de développement

## Problème résolu

Lorsque les serveurs de développement (API sur le port 4000 et Web sur le port 3000) ne se terminent pas correctement, ils peuvent bloquer les ports et empêcher un redémarrage propre. Ce script permet de nettoyer ces processus zombies de manière sécurisée.

## Solution

### Script `cleanup-dev.js`

Ce script :
- Identifie les processus occupant les ports de développement (3000-3003, 4000)
- Vérifie que ce ne sont pas des processus Claude Code
- Tue uniquement les processus dev server (tsx, turbo, next)
- Attend que les ports soient libérés
- Affiche un rapport de l'état des ports

### Utilisation

#### Nettoyer les processus zombies uniquement
```bash
pnpm cleanup
```

#### Nettoyer puis redémarrer les serveurs
```bash
pnpm dev:clean
```

#### Redémarrage manuel en 2 étapes
```bash
# 1. Nettoyer
node scripts/cleanup-dev.js

# 2. Démarrer
pnpm dev
```

## Sécurité

Le script **ne tuera jamais** :
- Les processus Claude Code
- Les processus non liés au développement
- Les processus système

Il cible uniquement les processus contenant "tsx", "turbo", ou "next" dans leur ligne de commande.

## En cas de problème

Si le script ne libère pas les ports :
1. Vérifier quels processus occupent les ports : `netstat -ano | findstr ":4000"`
2. Identifier le processus : `wmic process where "ProcessId=<PID>" get CommandLine`
3. Le tuer manuellement : `taskkill /F /T /PID <PID>`