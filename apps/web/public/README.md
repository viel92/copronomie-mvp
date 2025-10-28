# Dossier Public - Fichiers Statiques

Ce dossier contient tous les fichiers statiques accessibles publiquement via l'URL `/`.

## Fichiers Actuels

### SEO & Crawlers
- **`robots.txt`** - Instructions pour les moteurs de recherche
  - Autorise l'indexation de la landing page uniquement
  - Bloque les pages privées (dashboards, auth)
  - Référence le sitemap

- **`sitemap.xml`** - Carte du site pour le SEO
  - Liste toutes les pages publiques
  - Priorités et fréquences de crawl définies
  - À mettre à jour lors de l'ajout de nouvelles pages

### PWA (Progressive Web App)
- **`manifest.json`** - Métadonnées pour l'installation en tant qu'app
  - Nom de l'application
  - Icônes (à ajouter)
  - Couleurs de thème
  - Configuration standalone

### Favicon
- **`favicon.svg`** - Favicon temporaire (lettre C)
  - **TODO**: Remplacer par un vrai favicon professionnel
  - Générer avec: https://realfavicongenerator.net/
  - Formats requis: .ico, .png (192x192, 512x512), .svg

## Fichiers à Ajouter

### Icônes PWA (Requis pour manifest.json)
```bash
public/
├── icon-192.png          # 192x192px
├── icon-512.png          # 512x512px
├── apple-touch-icon.png  # 180x180px pour iOS
└── favicon.ico           # 32x32px multi-size
```

**Comment générer:**
1. Créer un logo carré (minimum 512x512px)
2. Aller sur https://realfavicongenerator.net/
3. Upload le logo
4. Télécharger le package complet
5. Copier tous les fichiers dans `public/`

### Images Landing Page (Futures)
```bash
public/images/
├── hero-bg.webp          # Background hero section
├── features/
│   ├── dashboard.webp    # Screenshot dashboard
│   └── projects.webp     # Screenshot projets
└── testimonials/
    └── avatars/          # Photos des témoignages
```

### Documents (Optionnels)
```bash
public/docs/
├── guide-utilisateur.pdf
└── presentation.pdf
```

## Bonnes Pratiques

### Optimisation Images
- **Format**: Préférer WebP (meilleur compression)
- **Taille**: Max 500 KB par image
- **Responsive**: Fournir plusieurs tailles (srcset)
- **Lazy loading**: Images below-the-fold

### Nommage
- Utiliser kebab-case: `hero-background.webp`
- Noms descriptifs: `syndic-dashboard-screenshot.png`
- Pas d'espaces ni caractères spéciaux

### SEO
- Mettre à jour `sitemap.xml` à chaque nouvelle page publique
- Vérifier `robots.txt` si ajout de routes privées
- Ajouter images avec alt text approprié

## URLs d'Accès

Tous les fichiers de ce dossier sont accessibles via:
```
https://staging-app.copronomie.fr/nom-du-fichier.ext
```

**Exemples:**
- `https://staging-app.copronomie.fr/robots.txt`
- `https://staging-app.copronomie.fr/sitemap.xml`
- `https://staging-app.copronomie.fr/manifest.json`
- `https://staging-app.copronomie.fr/favicon.svg`

## Next.js Image Optimization

Pour les images, préférer le composant `next/image`:
```tsx
import Image from 'next/image'

<Image
  src="/images/hero-bg.webp"
  alt="Hero background"
  width={1920}
  height={1080}
  priority // Pour images above-the-fold
/>
```

## Maintenance

- [ ] Générer favicon professionnel (.ico + PNG)
- [ ] Ajouter icônes PWA (192x192, 512x512)
- [ ] Créer dossier `/images` pour landing page
- [ ] Mettre à jour sitemap.xml après ajout landing
- [ ] Tester PWA install sur mobile

---

**Dernière mise à jour**: 28 octobre 2025
