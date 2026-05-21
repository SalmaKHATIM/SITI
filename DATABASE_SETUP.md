# 🗄️ Configuration de la Base de Données STTIS

Ce guide explique comment initialiser et configurer la base de données Supabase pour STTIS.

## ✅ Prérequis

- Supabase intégré et connecté
- Variables d'environnement configurées:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `POSTGRES_URL`

## 🚀 Initialisation Automatique

### Option 1: Script Node.js (Recommandé)

```bash
# Exécutez le script d'initialisation
npm run init-db
```

Ou manuellement:

```bash
node -r ts-node/register scripts/init-supabase.ts
```

Le script va:
- ✅ Créer toutes les tables
- ✅ Activer Row Level Security (RLS)
- ✅ Créer 3 comptes de test
- ✅ Afficher les identifiants

### Option 2: Interface Supabase

Si vous préférez faire manuellement:

1. Allez à https://app.supabase.com
2. Sélectionnez votre projet
3. Allez à l'onglet "SQL Editor"
4. Copiez-collez le contenu du fichier `scripts/01-init-schema.sql`
5. Exécutez la requête

## 📊 Structure de la Base de Données

### Tables Créées

1. **users** - Profils utilisateurs
2. **products** - Produits de thé
3. **batches** - Lots de production
4. **stock_levels** - Niveaux d'inventaire
5. **stock_movements** - Mouvements de stock
6. **ai_predictions** - Prédictions IA
7. **anomalies** - Anomalies détectées
8. **chat_messages** - Messages de chat
9. **audit_logs** - Logs d'audit

### Relations

```
users
├── products (created_by)
├── batches (created_by)
├── stock_movements (created_by)
├── chat_messages (user_id)
└── audit_logs (user_id)

products
├── batches
├── stock_levels
└── ai_predictions

batches
├── stock_movements
└── anomalies
```

## 🔐 Sécurité (Row Level Security)

Tous les RLS sont activés et configurés:

- **users**: Chaque utilisateur ne voit que son profil
- **products**: Basé sur le rôle
- **batches**: Basé sur le rôle et le département
- **stock_levels**: Accessible selon le rôle
- **chat_messages**: L'utilisateur ne voit que ses messages
- **audit_logs**: Admin seulement

## 👤 Comptes de Test Créés

Après initialisation, vous aurez 3 comptes:

| Compte | Email | Password | Rôle |
|--------|-------|----------|------|
| Admin | admin@sttis.tea | Admin@12345 | admin |
| QA Manager | qa@sttis.tea | QA@12345 | quality_manager |
| Stock Manager | stock@sttis.tea | Stock@12345 | stock_manager |

## 🔄 Réinitialiser la Base de Données

Si vous voulez repartir de zéro:

### Option 1: Via Supabase UI
1. Allez à SQL Editor
2. Exécutez:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
```
3. Réexécutez le script d'initialisation

### Option 2: Via Node.js
```bash
npm run reset-db
npm run init-db
```

## 📋 Vérifier que Tout Fonctionne

### Test 1: Vérifier les Tables
```bash
# Dans la console Supabase SQL
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
```

### Test 2: Vérifier les Utilisateurs
```bash
# Dans la console Supabase SQL
SELECT id, email, raw_user_meta_data FROM auth.users;
```

### Test 3: Test de Connexion
1. Allez à http://localhost:3000/demo
2. Copiez les identifiants
3. Allez à http://localhost:3000/login
4. Connectez-vous

## 🆘 Dépannage

### "Tables not found"
**Solution:** Les tables n'ont pas été créées
```bash
npm run init-db
```

### "Auth error / Unauthorized"
**Solutions:**
1. Vérifiez les variables d'environnement
2. Vérifiez que Supabase Auth est activé
3. Vérifiez que les RLS sont configurés

### "Users don't exist"
**Solution:** Les comptes de test n'ont pas été créés
```bash
npm run init-db
```

### "Les utilisateurs ne peuvent pas se connecter"
**Solutions:**
1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correctement configuré
2. Vérifiez que les utilisateurs existent dans Auth
3. Vérifiez les logs Supabase pour les erreurs

### "Les données ne s'affichent pas après connexion"
**Solutions:**
1. Vérifiez que les RLS sont activés
2. Vérifiez que l'utilisateur a les bonnes permissions
3. Videz le cache du navigateur

## 🎯 Commandes Utiles

```bash
# Initialiser la BD
npm run init-db

# Réinitialiser complètement
npm run reset-db

# Voir les logs
npm run logs:db

# Exporter les données
npm run export:db

# Importer des données
npm run import:db
```

## 📚 Pour en Savoir Plus

- Documentation Supabase: https://supabase.com/docs
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- SQL Editor: https://supabase.com/docs/guides/database/query-editor

## ✨ Prochaines Étapes

1. ✅ Initialiser la base de données
2. ✅ Vérifier que les comptes de test existent
3. ✅ Tester la connexion
4. ✅ Commencer à utiliser STTIS!

---

**Besoin d'aide?** Consultez le `/help` ou `/QUICK_START.md`
