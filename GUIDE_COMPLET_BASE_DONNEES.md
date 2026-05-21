# Guide Complet - Créer et Accéder à votre Base de Données STTIS

## Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Étape 1: Créer un compte Supabase](#étape-1-créer-un-compte-supabase)
3. [Étape 2: Créer un projet Supabase](#étape-2-créer-un-projet-supabase)
4. [Étape 3: Obtenir vos clés d'accès](#étape-3-obtenir-vos-clés-daccès)
5. [Étape 4: Configurer votre application](#étape-4-configurer-votre-application)
6. [Étape 5: Créer les tables de la base de données](#étape-5-créer-les-tables-de-la-base-de-données)
7. [Étape 6: Accéder à votre base de données](#étape-6-accéder-à-votre-base-de-données)
8. [Dépannage](#dépannage)

---

## Vue d'ensemble

Votre application STTIS utilise **Supabase**, qui est:
- Une plateforme PostgreSQL gérée dans le cloud
- Gratuite pour commencer (avec limite de données)
- Avec une interface visuelle pour gérer les données
- Intégrée directement à votre application Next.js

**Voici ce qui se passe:**
```
Votre Application → Supabase Client → Base de Données PostgreSQL
      (Next.js)        (@supabase)          (dans le cloud)
```

---

## Étape 1: Créer un compte Supabase

### A. Allez sur le site Supabase
1. Ouvrez votre navigateur
2. Accédez à: **https://supabase.com**
3. Cliquez sur le bouton **"Sign Up"** (en haut à droite)

### B. Créez votre compte
Choisissez l'une de ces options:
- **Email + Mot de passe** (recommandé)
- **GitHub** (plus rapide)
- **Google**

Pour cet exemple, utilisons Email:
1. Entrez votre adresse email
2. Créez un mot de passe fort
3. Confirmez votre email (vérifiez votre boîte mail)

**Félicitations!** Vous avez un compte Supabase! ✓

---

## Étape 2: Créer un projet Supabase

### A. Accédez au dashboard
1. Une fois connecté, vous êtes sur le **Dashboard Supabase**
2. Vous devriez voir un bouton **"New Project"** ou **"Create a new project"**

### B. Remplissez les informations du projet

| Champ | Valeur | Explication |
|-------|--------|-------------|
| **Project name** | STTIS-Database | Nom de votre projet |
| **Database Password** | Créez un mot de passe fort | Sécurité de la base de données |
| **Region** | Choisissez la plus proche de vous | Performances optimales |

Exemple:
```
Project name:     STTIS-Database
Database Password: MySecurePassword123!@#
Region:           Europe (si vous êtes en Europe)
```

### C. Créez le projet
1. Cliquez sur **"Create new project"**
2. **Attendez 2-3 minutes** - Supabase initialise votre base de données
3. Une fois terminé, vous recevrez une notification "Project is ready!"

**Félicitations!** Votre base de données est créée! ✓

---

## Étape 3: Obtenir vos clés d'accès

Ces clés permettent à votre application de communiquer avec la base de données.

### A. Accédez aux paramètres d'API

1. Dans le dashboard Supabase, cliquez sur votre projet
2. Allez à: **Settings** (en bas du menu gauche)
3. Cliquez sur **API**

### B. Trouvez vos clés

Vous verrez 3 clés importantes:

```
Project URL:           https://xxxxxxxxxxxx.supabase.co
Anon Key:              eyJhbGc...........................
Service Role Key:      eyJhbGc...........................
```

**Important:**
- **Project URL** = L'adresse de votre base de données
- **Anon Key** = Clé publique (sûre pour le frontend)
- **Service Role Key** = Clé privée (à garder secrète!)

### C. Copiez vos clés

Ouvrez un éditeur de texte (Notepad, VS Code) et notez:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**⚠️ SÉCURITÉ:** Ne partagez JAMAIS votre Service Role Key!

---

## Étape 4: Configurer votre application

Maintenant, dites à votre application où est la base de données.

### A. Trouvez le fichier `.env.local`

Dans votre dossier de projet:
```
/vercel/share/v0-project/
├── .env.local          ← CE FICHIER
├── app/
├── public/
└── ...
```

### B. Si le fichier n'existe pas, créez-le

1. Ouvrez votre éditeur (VS Code, etc.)
2. Créez un nouveau fichier
3. Nommez-le `.env.local` (attention: le point au début!)
4. Sauvegardez-le à la racine du projet

### C. Ajoutez vos clés Supabase

Ouvrez `.env.local` et copiez-collez:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
```

**Remplacez** les valeurs par celles que vous avez copiées à l'Étape 3.

Exemple complet:
```env
NEXT_PUBLIC_SUPABASE_URL=https://aaabbbcccdddeee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_long_string
```

### D. Sauvegardez le fichier

Appuyez sur **Ctrl+S** (ou Cmd+S sur Mac)

**Félicitations!** Votre application est maintenant configurée! ✓

---

## Étape 5: Créer les tables de la base de données

C'est ici qu'on crée la "structure" de la base de données (les tableaux pour stocker les données).

### A. Trouvez le fichier SQL

Dans votre projet:
```
/vercel/share/v0-project/
└── DATABASE_SCHEMA.sql    ← CE FICHIER
```

### B. Ouvrez le SQL Editor de Supabase

1. Allez sur le **Dashboard Supabase**
2. Sélectionnez votre projet
3. Dans le menu gauche, cliquez sur **SQL Editor**
4. Cliquez sur **New Query** (bouton bleu)

### C. Copiez le contenu du fichier SQL

1. Ouvrez `DATABASE_SCHEMA.sql` dans votre éditeur
2. **Sélectionnez tout** (Ctrl+A ou Cmd+A)
3. **Copiez** (Ctrl+C ou Cmd+C)

### D. Collez dans Supabase

1. Dans l'éditeur SQL de Supabase, **collez** le contenu (Ctrl+V)
2. Vous verrez du code SQL qui commence par:
   ```sql
   -- STTIS: Smart Tea Traceability & Intelligence System
   -- Complete Database Schema Script
   ```

### E. Exécutez le script

1. Cliquez sur le bouton **Run** (ou la flèche verte ▶)
2. **Attendez 5-10 secondes** pendant que les tables se créent
3. Vous devriez voir: **"X queries executed successfully"**

### F. Vérifiez que tout est créé

1. Dans le menu gauche, cliquez sur **Table Editor**
2. Vous devriez voir 11 tableaux:
   - users
   - tea_products
   - batches
   - batch_history
   - stock_movements
   - stock_alerts
   - quality_checks
   - sales_orders
   - predictions
   - chat_messages
   - audit_logs

**Félicitations!** Votre base de données est configurée! ✓

---

## Étape 6: Accéder à votre base de données

Maintenant, vous pouvez voir et modifier vos données.

### A. Depuis Supabase (Interface Web)

#### Voir les données:
1. Allez sur **Table Editor** (menu gauche)
2. Cliquez sur une table (ex: `tea_products`)
3. Vous verrez tous les enregistrements

#### Ajouter des données manuellement:
1. Cliquez sur **Insert row** (bouton +)
2. Remplissez les champs
3. Cliquez sur **Save**

Exemple - Ajouter un produit de thé:
```
Name:           Premium Green Tea
Origin:         China
Type:           Green
Quality Grade:  A+
Initial Quantity: 100 kg
Unit Price:     $25
```

### B. Depuis votre Application (Code)

Votre application utilise déjà le client Supabase. Voici comment ça marche:

#### Fichier: `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export { supabase }
```

#### Exemple - Récupérer les produits:
```typescript
import { supabase } from '@/lib/supabase'

// Dans un composant React:
const { data: products } = await supabase
  .from('tea_products')
  .select('*')

console.log(products) // Affiche tous les produits
```

#### Exemple - Ajouter un produit:
```typescript
await supabase
  .from('tea_products')
  .insert({
    name: 'Premium Green Tea',
    origin: 'China',
    type: 'Green',
    quality_grade: 'A+',
    initial_quantity_kg: 100,
    current_quantity_kg: 100,
    unit_price_usd: 25
  })
```

#### Exemple - Modifier un produit:
```typescript
await supabase
  .from('tea_products')
  .update({ current_quantity_kg: 85 })
  .eq('name', 'Premium Green Tea')
```

#### Exemple - Supprimer un produit:
```typescript
await supabase
  .from('tea_products')
  .delete()
  .eq('id', 'uuid-du-produit')
```

---

## Structure de votre Base de Données

### Tableau 1: **users** (Utilisateurs)
```
Columns:
- id (UUID) - Identifiant unique
- email (TEXT) - Adresse email
- full_name (TEXT) - Nom complet
- role (TEXT) - admin, qa_manager, stock_manager
- created_at (TIMESTAMP) - Date de création
```

Exemple:
```
id        | email                    | full_name      | role
----------|--------------------------|----------------|-------------------
uuid-1    | admin@sttis.local       | Admin User     | admin
uuid-2    | qa@sttis.local          | QA Manager     | qa_manager
uuid-3    | stock@sttis.local       | Stock Manager  | stock_manager
```

### Tableau 2: **tea_products** (Produits)
```
Columns:
- id (UUID) - Identifiant unique
- name (TEXT) - Nom du produit
- origin (TEXT) - Provenance
- type (TEXT) - Type de thé
- quality_grade (TEXT) - Grade de qualité
- initial_quantity_kg (NUMERIC) - Quantité initiale
- current_quantity_kg (NUMERIC) - Quantité actuelle
```

Exemple:
```
name              | origin | type    | quality_grade | current_quantity_kg
------------------|--------|---------|---------------|-------------------
Premium Green Tea | China  | Green   | A+            | 100
Black Tea Organic | India  | Black   | A             | 50
White Tea Deluxe  | Vietnam| White   | A+            | 75
```

### Tableau 3: **batches** (Lots/Batches)
```
Columns:
- id (UUID)
- batch_number (TEXT) - Numéro unique du lot
- product_id (UUID) - Référence au produit
- quantity_kg (NUMERIC)
- status (TEXT) - production, quality_check, stored, shipped
- quality_score (NUMERIC) - 0 à 100
- production_date (DATE)
```

### Tableau 4: **stock_movements** (Mouvements de Stock)
```
Columns:
- id (UUID)
- product_id (UUID)
- movement_type (TEXT) - in, out, damage, adjustment
- quantity_kg (NUMERIC)
- reason (TEXT)
- recorded_at (TIMESTAMP)
```

### Tableau 5: **stock_alerts** (Alertes de Stock)
```
Columns:
- id (UUID)
- product_id (UUID)
- alert_type (TEXT) - low_stock, expiry_warning
- threshold_value (NUMERIC)
- is_resolved (BOOLEAN)
```

**Et 6 autres tableaux pour:**
- batch_history
- quality_checks
- sales_orders
- predictions
- chat_messages
- audit_logs

---

## Commandes SQL Utiles

Vous pouvez exécuter ces commandes dans le **SQL Editor** de Supabase:

### Voir tous les utilisateurs:
```sql
SELECT * FROM users;
```

### Voir tous les produits:
```sql
SELECT * FROM tea_products;
```

### Voir tous les lots:
```sql
SELECT * FROM batches;
```

### Ajouter un utilisateur:
```sql
INSERT INTO users (email, full_name, role)
VALUES ('nouveau@email.com', 'Nouveau User', 'admin');
```

### Voir les stocks bas:
```sql
SELECT * FROM tea_products
WHERE current_quantity_kg < minimum_stock_kg;
```

### Compter les produits:
```sql
SELECT COUNT(*) as total_products FROM tea_products;
```

---

## Comment la Base de Données Communique avec votre Application

### 1. L'Application envoie une requête:
```
App: "Donne-moi tous les produits de thé"
```

### 2. Supabase reçoit et traite:
```
Supabase: "Je vais chercher dans la table tea_products"
```

### 3. La Base de Données répond:
```
BD: "Voici 50 produits avec tous leurs détails"
```

### 4. L'Application affiche les données:
```
App: "J'affiche les produits dans le Dashboard"
→ Voir 50 produits à l'écran
```

---

## Checklist de Vérification

Une fois configuré, vérifiez que tout fonctionne:

- [ ] Compte Supabase créé et confirmé
- [ ] Projet créé dans Supabase
- [ ] Clés API copiées (URL, Anon Key, Service Key)
- [ ] Fichier `.env.local` créé dans le projet
- [ ] Clés ajoutées dans `.env.local`
- [ ] Fichier `DATABASE_SCHEMA.sql` exécuté dans Supabase
- [ ] 11 tableaux visibles dans "Table Editor"
- [ ] Vous pouvez ajouter des données manuellement dans Supabase
- [ ] Application démarre sans erreur (`npm run dev`)
- [ ] Vous pouvez vous connecter avec `admin@sttis.local`

---

## Dépannage

### Problème: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution:** Vérifiez que `.env.local` existe et contient la clé correcte.

### Problème: "Invalid API key"
**Solution:** Assurez-vous que vous avez copié la bonne clé dans `.env.local`.

### Problème: "Connection refused"
**Solution:** 
1. Vérifiez que votre projet Supabase est actif
2. Vérifiez votre connection internet
3. Attendez quelques secondes - Supabase peut être lent

### Problème: "Table does not exist"
**Solution:** 
1. Vérifiez que `DATABASE_SCHEMA.sql` a été exécuté
2. Allez dans "Table Editor" pour voir les tableaux
3. Si vides, réexécutez le SQL script

### Problème: Erreurs lors de l'exécution du SQL
**Solution:**
1. Vérifiez que le fichier SQL est complet
2. Copiez-le entièrement (pas juste une partie)
3. Assurez-vous qu'il n'y a pas d'erreurs de syntaxe

### Problème: Les données ajoutées n'apparaissent pas
**Solution:**
1. Rafraîchissez le navigateur (F5)
2. Vérifiez que vous avez cliqué sur "Save"
3. Attendez quelques secondes (latence réseau)

---

## Ressources Utiles

- **Supabase Docs:** https://supabase.com/docs
- **Supabase CLI:** https://supabase.com/docs/guides/cli
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## Résumé en Étapes Rapides

```
1. Créer compte Supabase
   → https://supabase.com → Sign Up

2. Créer projet
   → Dashboard → New Project → Nommer & Créer

3. Obtenir clés
   → Settings → API → Copier les clés

4. Configurer app
   → Créer .env.local → Ajouter les clés

5. Créer tables
   → SQL Editor → New Query → Coller DATABASE_SCHEMA.sql → Run

6. Accéder aux données
   → Table Editor (web) OU Code (app)
```

---

**Vous êtes prêt!** Votre base de données STTIS est maintenant fonctionnelle. 🚀

Besoin d'aide? Consultez les fichiers documentation du projet:
- `SETUP_COMPLETE.md` - Setup détaillé
- `DATABASE_SCRIPT_USAGE.md` - Utilisation du script
- `SUPABASE_SETUP.md` - Configuration Supabase
