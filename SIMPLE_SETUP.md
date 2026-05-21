# STTIS - Configuration Finale et Fonctionnement

## Système d'Authentification Simplifié

Le système utilise maintenant un **fichier JSON** (`credentials.json`) pour stocker tous les identifiants. **Aucune base de données requise pour se connecter.**

## Identifiants de Test

Trois comptes sont disponibles dans `credentials.json`:

### 1. Administrateur
- **Email:** admin@sttis.local
- **Mot de passe:** Admin@123456
- **Permissions:** Accès complet

### 2. Responsable Qualité
- **Email:** qa@sttis.local
- **Mot de passe:** QA@123456
- **Permissions:** Gestion des lots et traçabilité

### 3. Responsable Stocks
- **Email:** stock@sttis.local
- **Mot de passe:** Stock@123456
- **Permissions:** Gestion des inventaires

## Comment Se Connecter

1. Allez à `http://localhost:3000/login`
2. Entrez l'**email** d'un compte (ex: `admin@sttis.local`)
3. Entrez le **mot de passe** (ex: `Admin@123456`)
4. Cliquez sur **"Se connecter"**

## Fonctionnement Technique

### Fichiers Modifiés

1. **`lib/json-auth.ts`** - Module d'authentification JSON
   - Fonction `authenticateUser()` - Valide email/mot de passe contre `credentials.json`
   - Sauvegarde le user dans `localStorage`
   - Crée un token d'authentification

2. **`lib/auth-provider.tsx`** - Context React pour l'authentification
   - Hook `useAuth()` - Accès à l'utilisateur courant
   - Protège les routes dashboard
   - Gère le logout

3. **`app/login/page.tsx`** - Page de connexion simplifiée
   - Utilise `authenticateUser()` du fichier JSON
   - Affiche les identifiants disponibles
   - Redirige vers `/dashboard` après succès

4. **`app/layout.tsx`** - Layout racine
   - Enveloppe l'app avec `AuthProvider`
   - Initialise le contexte d'authentification

5. **`app/dashboard/layout.tsx`** - Layout du dashboard
   - Utilise `useAuth()` pour vérifier l'authentification
   - Protège l'accès aux pages dashboard
   - Bouton de logout

## Fichiers de Credentials

Tous les identifiants sont aussi disponibles dans:
- `credentials.json` (Format JSON structuré)
- `CREDENTIALS.csv` (Format CSV)
- `CREDENTIALS.txt` (Format texte simple)

## À Noter

- **Pas de Supabase requis** pour l'authentification
- Les données utilisateur sont sauvegardées en `localStorage`
- Les comptes sont **statiques** dans le JSON
- Les routes `/dashboard/*` sont **protégées** par authentification

## Prochaines Étapes

Pour les fonctionnalités avancées (base de données, AI, etc.):
1. Initialiser les tables Supabase si nécessaire
2. Connecter les APIs FastAPI
3. Configurer les modèles ML/NLP

Mais la **connexion fonctionne immédiatement** avec les identifiants fournis!
