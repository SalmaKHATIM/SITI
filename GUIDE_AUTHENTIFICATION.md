# STTIS - Guide Complet d'Authentification

## 🔐 Où Sont Les Mots de Passe?

Les mots de passe des comptes de test sont stockés dans **2 fichiers**:

### 1. **credentials.json** (Fichier Principal)
```
Emplacement: /credentials.json (à la racine du projet)
```

Ce fichier contient les 3 comptes de test avec leurs mots de passe:

```json
{
  "accounts": [
    {
      "email": "admin@sttis.local",
      "password": "Admin@123456",
      "role": "Administrator"
    },
    {
      "email": "qa@sttis.local",
      "password": "QA@123456",
      "role": "Quality Manager"
    },
    {
      "email": "stock@sttis.local",
      "password": "Stock@123456",
      "role": "Stock Manager"
    }
  ]
}
```

### 2. **lib/json-auth.ts** (Logique d'Authentification)
```
Emplacement: /lib/json-auth.ts
```

Ce fichier contient la fonction d'authentification qui:
- Lit le fichier `credentials.json`
- Compare l'email et le mot de passe entrés
- Sauvegarde l'utilisateur connecté dans `localStorage`
- Gère la déconnexion

---

## 📋 Les 3 Comptes de Test Disponibles

| Email | Mot de Passe | Rôle | Accès |
|-------|-------------|------|-------|
| **admin@sttis.local** | **Admin@123456** | Administrator | Accès complet |
| **qa@sttis.local** | **QA@123456** | Quality Manager | Contrôle qualité |
| **stock@sttis.local** | **Stock@123456** | Stock Manager | Gestion stocks |

---

## 🚀 Comment Se Connecter?

### Étape 1: Ouvrir la Page de Connexion
```
URL: http://localhost:3000/login
```

### Étape 2: Entrer les Identifiants
```
Email: admin@sttis.local
Mot de passe: Admin@123456
```

### Étape 3: Cliquer sur "Se connecter"
Vous serez redirigé vers le dashboard

### Étape 4: Vous Êtes Connecté! ✓
- Vous verrez votre nom dans l'en-tête
- Vous pouvez accéder à toutes les pages du dashboard
- Vous pouvez voir vos permissions

---

## 🔧 Comment Fonctionne L'Authentification?

### Architecture
```
credentials.json
     ↓
lib/json-auth.ts (authenticateUser)
     ↓
localStorage (sttis_user, sttis_auth_token)
     ↓
lib/auth-provider.tsx (useAuth)
     ↓
Votre Application
```

### Flux de Connexion

1. **L'utilisateur entre ses identifiants**
```typescript
email: "admin@sttis.local"
password: "Admin@123456"
```

2. **Le système vérifie dans credentials.json**
```typescript
const account = credentials.accounts.find(
  (acc) => acc.email === email && acc.password === password
);
```

3. **Si trouvé, l'utilisateur est sauvegardé**
```typescript
localStorage.setItem('sttis_user', JSON.stringify(user));
localStorage.setItem('sttis_auth_token', `token_${id}_${timestamp}`);
```

4. **L'utilisateur peut accéder aux pages protégées**
```typescript
// Vérifié automatiquement par auth-provider.tsx
if (!currentUser && pathname.startsWith('/dashboard')) {
  router.push('/login');
}
```

---

## 💾 Fichiers Clés

### 1. credentials.json
- **Contient**: Les 3 comptes de test avec mots de passe
- **Endroit**: Racine du projet
- **Modification**: Éditez ce fichier pour ajouter/modifier des comptes
- **Ne pas publier**: Ne mettez pas ce fichier en production!

### 2. lib/json-auth.ts
- **Contient**: Logique d'authentification (30 lignes)
- **Fonctions**:
  - `authenticateUser()` - Vérifie les identifiants
  - `logoutUser()` - Déconnecte l'utilisateur
  - `getCurrentUser()` - Récupère l'utilisateur courant
  - `isAuthenticated()` - Vérifie si connecté

### 3. lib/auth-provider.tsx
- **Contient**: Context React pour l'authentification
- **Fonctions**: 
  - Fournit `useAuth()` hook
  - Protège les routes du dashboard
  - Gère la redirection après login/logout

### 4. app/login/page.tsx
- **Contient**: Formulaire de connexion
- **Utilise**: `authenticateUser()` de json-auth.ts
- **Redirige**: Vers /dashboard si succès

---

## 🔑 Comment Ajouter Un Nouveau Compte?

### Option 1: Modifier credentials.json Directement

1. Ouvrez `/credentials.json`
2. Ajoutez un nouvel objet dans la liste `accounts`:

```json
{
  "id": 4,
  "role": "Sales Manager",
  "role_fr": "Responsable Ventes",
  "email": "sales@sttis.local",
  "password": "Sales@123456",
  "permissions": [
    "sales_view",
    "sales_edit",
    "order_management",
    "customer_management",
    "sales_reports"
  ]
}
```

3. Sauvegardez le fichier
4. Vous pouvez maintenant vous connecter avec:
   - Email: `sales@sttis.local`
   - Mot de passe: `Sales@123456`

### Option 2: Créer une Fonction TypeScript

```typescript
// lib/auth.ts
export function addNewAccount(newAccount: Account) {
  // Lire le fichier
  const credentials = require('@/credentials.json');
  
  // Ajouter le nouvel utilisateur
  const newId = Math.max(...credentials.accounts.map(a => a.id)) + 1;
  credentials.accounts.push({
    id: newId,
    ...newAccount
  });
  
  // Sauvegarder (nécessite un endpoint API)
  // fetch('/api/auth/add-account', {
  //   method: 'POST',
  //   body: JSON.stringify(credentials.accounts)
  // });
}
```

---

## 🛡️ Sécurité - Recommandations Importantes

### ⚠️ ATTENTION EN PRODUCTION

**Ne mettez PAS ce système en production!**

Ce système d'authentification JSON est conçu pour:
- ✓ Développement local
- ✓ Tests et démonstration
- ✓ Prototypage rapide

### Pour la Production, Utilisez:

#### Option 1: Supabase Auth (Recommandé)
```typescript
import { supabase } from '@/lib/supabase';

export async function loginWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { success: !error, user: data.user };
}
```

#### Option 2: Auth0
```typescript
import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Login</button>;
}
```

#### Option 3: NextAuth.js
```typescript
import { signIn } from "next-auth/react";

export async function handleLogin(email: string, password: string) {
  const result = await signIn("credentials", { email, password });
  return result;
}
```

---

## 🔄 Cycle de Vie de la Connexion

```
1. UTILISATEUR ACCÈDE À /login
   ↓
2. UTILISATEUR ENTRE EMAIL & MOT DE PASSE
   ↓
3. FORMULAIRE APPELLE authenticateUser()
   ↓
4. authenticateUser() VÉRIFIE DANS credentials.json
   ↓
5. SI OK → Sauve dans localStorage
   SI KO → Affiche erreur
   ↓
6. SI OK → REDIRIGE VERS /dashboard
   ↓
7. auth-provider.tsx DÉTECTE L'UTILISATEUR CONNECTÉ
   ↓
8. useAuth() RETOURNE L'UTILISATEUR ACTIF
   ↓
9. COMPOSANTS PEUVENT ACCÉDER À user VIA useAuth()
   ↓
10. UTILISATEUR CLIQUE "SE DÉCONNECTER"
    ↓
11. logoutUser() SUPPRIME localStorage
    ↓
12. REDIRIGE VERS /login
```

---

## 📱 Utiliser L'Authentification Dans Votre App

### Vérifier Si L'Utilisateur Est Connecté

```typescript
'use client';

import { useAuth } from '@/lib/auth-provider';

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  
  if (!user) return <div>Non connecté</div>;
  
  return (
    <div>
      <p>Bienvenue {user.email}!</p>
      <p>Rôle: {user.role_fr}</p>
    </div>
  );
}
```

### Afficher Des Éléments Selon Le Rôle

```typescript
'use client';

import { useAuth } from '@/lib/auth-provider';

export function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== 'Administrator') {
    return <div>Accès refusé</div>;
  }

  return (
    <div>
      <h1>Panel Admin</h1>
      <p>Seuls les administrateurs voient ceci</p>
    </div>
  );
}
```

### Afficher Le Bouton De Déconnexion

```typescript
'use client';

import { useAuth } from '@/lib/auth-provider';

export function LogoutButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
      Se déconnecter
    </button>
  );
}
```

---

## ❓ Questions Fréquentes

### Q: Où se trouvent les mots de passe?
**R**: Dans `/credentials.json` à la racine du projet.

### Q: Puis-je modifier les mots de passe?
**R**: Oui, éditez directement `/credentials.json` et redémarrez l'app.

### Q: Les mots de passe sont-ils chiffrés?
**R**: Non, ce système n'est que pour le développement. En production, utilisez Supabase Auth ou Auth0.

### Q: Que se passe-t-il si je me trompe de mot de passe?
**R**: Vous recevrez le message "Email ou mot de passe invalide".

### Q: Comment savoir si je suis connecté?
**R**: Utilisez `const { user } = useAuth();` dans vos composants.

### Q: Les données de connexion restent-elles après fermeture du navigateur?
**R**: Oui, elles sont stockées dans `localStorage` et persistent.

### Q: Comment me déconnecter?
**R**: Le bouton de déconnexion supprime les données de `localStorage`.

### Q: Puis-je ajouter plus de 3 comptes?
**R**: Oui, ajoutez des objets dans la liste `accounts` de `credentials.json`.

---

## 📚 Fichiers À Consulter

1. **credentials.json** - Les mots de passe
2. **lib/json-auth.ts** - La logique d'authentification
3. **lib/auth-provider.tsx** - Le context React
4. **app/login/page.tsx** - Le formulaire de connexion

---

**Tout est prêt! Vous pouvez vous connecter maintenant.** 🎉

