# STTIS - Guide de Connexion à Supabase

## 📋 Vue d'Ensemble

STTIS utilise Supabase comme base de données principale. Voici comment connecter votre application.

## 🔑 Où Trouver vos Clés Supabase

### Étape 1: Aller sur Supabase
1. Allez à https://supabase.com
2. Connectez-vous à votre compte
3. Sélectionnez votre projet STTIS

### Étape 2: Obtenir les Clés
1. Cliquez sur **"Settings"** (engrenage)
2. Allez à **"API"** dans le menu de gauche
3. Vous verrez:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`

## 📝 Où Coller les Clés

### Créer le fichier `.env.local`

1. À la racine du projet, créez un fichier appelé `.env.local`
2. Collez ces lignes:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Remplacez:
   - `https://your-project.supabase.co` par votre **Project URL**
   - `your-anon-key-here` par votre **Anon Key**
   - `your-service-role-key-here` par votre **Service Role Key**

## ✅ Exemple Complet

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🗄️ Initialiser la Base de Données

### Étape 1: Préparer le SQL

1. Allez au dossier `/vercel/share/v0-project`
2. Ouvrez le fichier `DATABASE_SCHEMA.sql`

### Étape 2: Exécuter le Script SQL

**Option A: Depuis Supabase Dashboard**

1. Allez à votre projet Supabase
2. Cliquez sur **"SQL Editor"**
3. Cliquez **"New Query"**
4. Copiez tout le contenu de `DATABASE_SCHEMA.sql`
5. Collez-le dans l'éditeur
6. Cliquez **"Run"**

**Option B: Depuis la ligne de commande (psql)**

```bash
# Connectez-vous à Supabase
psql "postgresql://postgres:PASSWORD@host.supabase.co:5432/postgres"

# Puis exécutez le script
\i DATABASE_SCHEMA.sql
```

## 🔄 Connexion Automatique

Une fois les variables d'environnement configurées, l'application se connectera automatiquement à Supabase.

### Fichier: `lib/supabase.ts`

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

L'app charge ces variables et crée une instance Supabase automatiquement.

## 📊 Vérifier la Connexion

### Dans Supabase Dashboard
1. Allez à **"SQL Editor"**
2. Exécutez:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

Si vous voyez les 11 tables (users, products, batches, etc.), la BD est bien configurée!

### Dans l'Application
1. Allez à `/login`
2. Si la page charge sans erreurs, la connexion fonctionne

## 🚨 Dépannage

### Erreur: "Missing Supabase environment variables"
- Vérifiez que `.env.local` existe à la racine
- Vérifiez que les valeurs ne sont pas vides
- Redémarrez le serveur: `npm run dev`

### Erreur: "Cannot read table 'users'"
- Les tables n'ont pas été créées
- Exécutez `DATABASE_SCHEMA.sql` depuis Supabase Dashboard

### Erreur: "Anon key is invalid"
- Vérifiez que vous avez copié la bonne clé
- La clé ne doit pas contenir d'espaces
- Essayez de régénérer la clé depuis Supabase Settings

## 📁 Fichiers Importants

- `.env.local` - Variables d'environnement (ne pas partager!)
- `lib/supabase.ts` - Client Supabase
- `DATABASE_SCHEMA.sql` - Script de création des tables

## ✅ Checklist de Configuration

- [ ] Créer `.env.local` à la racine
- [ ] Copier URL Supabase
- [ ] Copier Anon Key
- [ ] Copier Service Role Key
- [ ] Exécuter `DATABASE_SCHEMA.sql`
- [ ] Redémarrer l'application (`npm run dev`)
- [ ] Tester la connexion via `/login`

Vous êtes prêt! L'application est maintenant connectée à Supabase.
