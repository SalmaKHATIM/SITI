# Guide d'Utilisation du Script SQL STTIS

## 📄 Fichier: `DATABASE_SCHEMA.sql`

Ce fichier contient le schéma complet de la base de données STTIS avec toutes les tables, indexes et contraintes.

## 🗂️ Tables de Base de Données

### 1. **users**
- Stocke les profils utilisateurs
- Rôles: admin, quality_manager, stock_manager, viewer

### 2. **tea_products**
- Produits de thé disponibles
- Suivi du stock initial et actuel
- Prix unitaires

### 3. **batches**
- Lots de production
- Statut: production, packaging, storage, shipped, sold
- Score de qualité (0-100)
- Données de température et humidité

### 4. **batch_history**
- Historique complet de chaque lot
- Événements: changements de statut, alertes, vérifications

### 5. **stock_movements**
- Tous les mouvements de stock (entrée, sortie, ajustement)
- Raison et référence du mouvement

### 6. **stock_alerts**
- Alertes de stock bas, surstock, proche expiration
- Statut résolution

### 7. **quality_checks**
- Vérifications de qualité par lot
- Scores: apparence, aroma, goût, couleur, global

### 8. **sales_orders**
- Commandes de vente
- Client, quantité, prix, date
- Statut: pending, confirmed, shipped, delivered, cancelled

### 9. **predictions**
- Prédictions ML/AI
- Types: sales_forecast, stock_optimization, anomaly_detection
- Score de confiance

### 10. **chat_messages**
- Messages de chat NLP
- Intent et entités extraites

### 11. **audit_logs**
- Audit de tous les changements
- Old/new values JSON
- Utilisateur qui a effectué l'action

## 📊 Indexes pour Performance

- `idx_batches_product_id`
- `idx_batches_status`
- `idx_batches_created_at`
- `idx_batch_history_batch_id`
- `idx_stock_movements_product_id`
- `idx_sales_orders_product_id`
- `idx_sales_orders_order_date`
- `idx_predictions_product_id`
- `idx_chat_messages_user_id`
- `idx_audit_logs_user_id`
- `idx_audit_logs_created_at`

## 🚀 Comment Exécuter le Script

### Via Supabase Dashboard (Facile)

1. Allez dans Supabase Dashboard
2. Allez à **SQL Editor**
3. Créez une **New Query**
4. Copiez tout le contenu de `DATABASE_SCHEMA.sql`
5. Cliquez **Run** (ou Ctrl+Enter)

### Via CLI Supabase

```bash
supabase db push DATABASE_SCHEMA.sql
```

### Via psql

```bash
psql "your_postgresql_connection_string" < DATABASE_SCHEMA.sql
```

## ✅ Vérification Après Exécution

Pour vérifier que toutes les tables ont été créées:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir 11 tables.

## 📝 Notes

- Toutes les tables utilisent `gen_random_uuid()` pour les IDs
- Les timestamps sont en UTC (`TIMESTAMP WITH TIME ZONE`)
- Les constraints `CHECK` valident les scores de qualité (0-100)
- Les références étrangères ont `ON DELETE RESTRICT/CASCADE`
- Les indexes optimisent les recherches courantes
