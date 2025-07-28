# Structure complète d'un projet Next.js professionnel

```
my-nextjs-project/
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── .prettierignore
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── components.json (si shadcn/ui)
│
├── public/
│   ├── icons/
│   │   ├── favicon.ico
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── images/
│   │   ├── logo.png
│   │   └── hero/
│   └── manifest.json
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── register/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── security/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── template.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   └── LoginButton.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardStats.tsx
│   │   │   │   └── DashboardChart.tsx
│   │   │   └── profile/
│   │   │       ├── ProfileCard.tsx
│   │   │       └── ProfileForm.tsx
│   │   │
│   │   └── common/
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── SEO.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useApi.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   └── api.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   └── providers.tsx
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   │
│   └── middleware.ts
│
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── tests/
│   ├── __mocks__/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── setup.ts
│
└── scripts/
    ├── build.sh
    ├── deploy.sh
    └── seed.js
```

## Explication des dossiers principaux

### `/src/app/` - App Router de Next.js 13+
- **Route groups** : `(auth)`, `(dashboard)` pour organiser sans affecter l'URL
- **Fichiers spéciaux** : `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`
- **API Routes** : Dans `/api/` avec la nouvelle structure

### `/src/components/` - Composants réutilisables
- **`ui/`** : Composants UI de base (boutons, inputs, modals)
- **`forms/`** : Formulaires spécifiques
- **`layout/`** : Composants de mise en page
- **`features/`** : Composants organisés par fonctionnalité
- **`common/`** : Composants communs (Loading, Error, SEO)

### `/src/hooks/` - Hooks personnalisés
- Logique réutilisable pour la gestion d'état et effets

### `/src/lib/` - Utilitaires et configurations
- **`auth.ts`** : Configuration d'authentification
- **`db.ts`** : Configuration base de données
- **`utils.ts`** : Fonctions utilitaires
- **`validations.ts`** : Schémas de validation (Zod, Yup)

### `/src/store/` - Gestion d'état globale
- Redux Toolkit, Zustand, ou autre solution de state management

### `/src/types/` - Types TypeScript
- Définitions de types organisées par domaine

### `/src/styles/` - Styles globaux
- CSS/SCSS globaux et par composant

## Bonnes pratiques

### Nommage
- **Composants** : PascalCase (`UserProfile.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useAuth.ts`)
- **Utilitaires** : camelCase (`formatDate.ts`)
- **Types** : PascalCase (`User`, `ApiResponse`)

### Organisation
- **Colocation** : Grouper les fichiers liés ensemble
- **Barrel exports** : Utiliser `index.ts` pour les exports
- **Séparation des responsabilités** : Un composant = une responsabilité

### Structure des composants
```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          className
        )}
        {...props}
      />
    )
  }
)
```

Cette structure garantit un projet professionnel, scalable et maintenable.