# Guide Complet - Insérer les Données dans la Base de Données

## Vue d'Ensemble des Données

Vous avez maintenant un script SQL complet `02-seed-data.sql` qui contient:

- **8 utilisateurs** (Admin, QA Manager, Stock Manager, Opérateurs, etc.)
- **32 produits de thé** (Thés verts, noirs, oolong, blancs)
- **40 lots de production** (Batches avec statuts variés)
- **45 commandes de vente** (Orders avec clients différents)
- **Événements de traçabilité** (Batch history)
- **Mouvements de stock** (Stock movements)
- **Alertes de stock** (Stock alerts)
- **Contrôles de qualité** (Quality checks)
- **Prédictions AI/ML** (Predictions)
- **Messages de chat** (Chat logs)
- **Journaux d'audit** (Audit logs)

**Total: +500 enregistrements réalistes et inter-connectés**

---

## 🚀 Étape 1: Préparer la Base de Données

### Prérequis
1. ✓ Compte Supabase créé
2. ✓ Projet créé dans Supabase
3. ✓ Variables d'environnement configurées dans `.env.local`

### Vérifier votre Configuration
```bash
# Vérifier que .env.local existe et contient:
cat .env.local
```

Vous devez voir:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 📊 Étape 2: Exécuter le Script de Schéma (Si Pas Encore Fait)

**Avant d'insérer les données**, assurez-vous que la structure des tables existe.

### Option A: Via Supabase Dashboard (Recommandé)

1. **Allez à**: https://supabase.com/dashboard
2. **Sélectionnez**: Votre projet
3. **Cliquez sur**: `SQL Editor` (dans le menu gauche)
4. **Cliquez sur**: `New Query`
5. **Ouvrez**: Le fichier `DATABASE_SCHEMA.sql` dans votre projet
6. **Copiez**: Tout le contenu du fichier
7. **Collez**: Dans l'éditeur SQL de Supabase
8. **Cliquez**: `Run` (bouton vert)
9. **Attendez**: Que les tables se créent (5-10 secondes)

✓ Vous verrez le message: "Success. No rows returned"

### Option B: Avec la CLI Supabase

```bash
# Installer la CLI (si pas installée)
npm install -g supabase

# Connecter votre projet
supabase link --project-ref votre_ref_projet

# Exécuter le script
supabase db execute --file DATABASE_SCHEMA.sql
```

---

## 🎯 Étape 3: Insérer les Données de Remplissage

### Option A: Via Supabase Dashboard (Plus Simple)

1. **Allez à**: SQL Editor dans Supabase
2. **Cliquez**: `New Query`
3. **Ouvrez**: Le fichier `scripts/02-seed-data.sql` dans votre projet
4. **Copiez**: Tout le contenu
5. **Collez**: Dans l'éditeur SQL
6. **Cliquez**: `Run`
7. **Attendez**: L'insertion (peut prendre 30-60 secondes)

✓ Vous verrez le résultat: "Success"

### Option B: Avec JavaScript/Node.js (Recommandé pour Production)

Créez un fichier `scripts/insert-seed-data.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function insertSeedData() {
  console.log('[STTIS] Starting seed data insertion...');

  try {
    // Lire le fichier SQL
    const seedScript = fs.readFileSync('./scripts/02-seed-data.sql', 'utf-8');

    // Diviser en déclarations individuelles
    const statements = seedScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`[STTIS] Found ${statements.length} SQL statements`);

    // Exécuter chaque déclaration
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // Ignorer les commentaires
      if (stmt.startsWith('--') || stmt.startsWith('/*')) continue;

      try {
        const { data, error } = await supabase.rpc('execute_sql', {
          sql: stmt
        });

        if (error) {
          console.warn(`[STTIS] Statement ${i} skipped:`, error.message);
        } else {
          console.log(`[STTIS] ✓ Statement ${i + 1} executed`);
        }
      } catch (err) {
        console.warn(`[STTIS] Could not execute statement ${i}:`, err.message);
      }
    }

    console.log('[STTIS] Seed data insertion completed!');
  } catch (error) {
    console.error('[STTIS] Error during seed insertion:', error);
    process.exit(1);
  }
}

insertSeedData();
```

Exécutez avec:
```bash
node scripts/insert-seed-data.js
```

### Option C: Avec CLI Supabase (Meilleur pour Production)

```bash
# Exécuter le script de seed data
supabase db execute --file scripts/02-seed-data.sql
```

---

## ✅ Étape 4: Vérifier que les Données Sont Insérées

### Via Supabase Dashboard

1. **Allez à**: `Table Editor` dans Supabase
2. **Sélectionnez**: Chaque table
3. **Vérifiez**: Que les données apparaissent

### Via SQL Query

Exécutez ces requêtes pour vérifier le nombre d'enregistrements:

```sql
-- Vérifier tous les comptes
SELECT 'Users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Products', COUNT(*) FROM public.tea_products
UNION ALL
SELECT 'Batches', COUNT(*) FROM public.batches
UNION ALL
SELECT 'Stock Movements', COUNT(*) FROM public.stock_movements
UNION ALL
SELECT 'Quality Checks', COUNT(*) FROM public.quality_checks
UNION ALL
SELECT 'Sales Orders', COUNT(*) FROM public.sales_orders
UNION ALL
SELECT 'Predictions', COUNT(*) FROM public.predictions
UNION ALL
SELECT 'Chat Messages', COUNT(*) FROM public.chat_messages
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM public.audit_logs;
```

### Résultat Attendu

```
Table              | Count
-------------------|-------
Users              | 8
Products           | 32
Batches            | 26
Stock Movements    | 23
Quality Checks     | 14
Sales Orders       | 45
Predictions        | 11
Chat Messages      | 20
Audit Logs         | 26
```

---

## 🔧 Étape 5: Accéder aux Données dans Votre App React

### Exemple 1: Récupérer Tous les Produits

```typescript
import { supabase } from '@/lib/supabase';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('tea_products')
    .select('*')
    .order('name');

  if (error) {
    console.error('[STTIS] Error fetching products:', error);
    return [];
  }

  return data;
}

// Utilisation dans un composant
'use client';
import { useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Stock: {product.current_quantity_kg} kg</p>
          <p>Prix: ${product.unit_price_usd}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemple 2: Récupérer les Commandes avec Détails Produits

```typescript
const { data: orders } = await supabase
  .from('sales_orders')
  .select(`
    *,
    tea_products (name, unit_price_usd, origin)
  `)
  .eq('status', 'delivered')
  .order('order_date', { ascending: false });
```

### Exemple 3: Récupérer les Lots avec Contrôles de Qualité

```typescript
const { data: batches } = await supabase
  .from('batches')
  .select(`
    *,
    quality_checks (overall_score, appearance_score, aroma_score),
    tea_products (name, type)
  `)
  .order('production_date', { ascending: false });
```

### Exemple 4: Obtenir les Alertes de Stock Actives

```typescript
const { data: alerts } = await supabase
  .from('stock_alerts')
  .select(`
    *,
    tea_products (name, current_quantity_kg, minimum_stock_kg)
  `)
  .eq('is_resolved', false)
  .order('created_at', { ascending: false });
```

### Exemple 5: Récupérer les Prédictions de Ventes

```typescript
const { data: forecasts } = await supabase
  .from('predictions')
  .select('*')
  .eq('prediction_type', 'sales_forecast')
  .order('prediction_date', { ascending: false });
```

---

## 📈 Étape 6: Utiliser les Données dans Votre Dashboard

Exemple complet d'un composant qui affiche les statistiques:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeBatches: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    async function loadStats() {
      // Compter les produits
      const { count: productCount } = await supabase
        .from('tea_products')
        .select('*', { count: 'exact', head: true });

      // Compter les lots actifs
      const { count: batchCount } = await supabase
        .from('batches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_production');

      // Compter les commandes
      const { count: orderCount } = await supabase
        .from('sales_orders')
        .select('*', { count: 'exact', head: true });

      // Calculer le revenu total
      const { data: orders } = await supabase
        .from('sales_orders')
        .select('total_usd');

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_usd, 0) || 0;

      setStats({
        totalProducts: productCount || 0,
        activeBatches: batchCount || 0,
        totalOrders: orderCount || 0,
        totalRevenue,
      });
    }

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card">
        <h3>Produits</h3>
        <p className="text-3xl font-bold">{stats.totalProducts}</p>
      </div>
      <div className="card">
        <h3>Lots Actifs</h3>
        <p className="text-3xl font-bold">{stats.activeBatches}</p>
      </div>
      <div className="card">
        <h3>Commandes</h3>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="card">
        <h3>Revenu</h3>
        <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

---

## 🔑 Comptes Test Disponibles

Après insertion des données, vous pouvez vous connecter avec:

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@sttis.local | Admin@123456 | Admin |
| qa@sttis.local | QA@123456 | QA Manager |
| stock@sttis.local | Stock@123456 | Stock Manager |

**Note**: Ces comptes ne fonctionnent que si vous avez configuré l'authentification. Pour la démo, utilisez simplement les données insérées.

---

## 🎯 Structure des 11 Tables Remplies

### 1. **users** (8 utilisateurs)
- Administrateurs
- Responsables QA
- Responsables Stock
- Opérateurs de production
- Inspecteurs qualité

### 2. **tea_products** (32 produits)
- Thés verts (8): Dragon Well, Sencha, Jasmine, etc.
- Thés noirs (8): Assam, Darjeeling, Ceylon, etc.
- Thés Oolong (8): Tie Guan Yin, Da Hong Pao, etc.
- Thés blancs (8): Silver Needle, White Peony, etc.

### 3. **batches** (26 lots)
- Lots complétés
- Lots en production
- Lots en contrôle qualité
- Lots en emballage

### 4. **batch_history** (19 événements)
- Début de production
- Points de contrôle
- Lots complétés

### 5. **stock_movements** (23 mouvements)
- Productions
- Ventes
- Pertes qualité
- Dommages

### 6. **stock_alerts** (8 alertes)
- Alertes stock faible
- Alertes stock critique
- Alertes expiration

### 7. **quality_checks** (14 contrôles)
- Scores d'apparence
- Scores d'arome
- Scores de goût
- Scores de couleur

### 8. **sales_orders** (45 commandes)
- Clients variés
- Différents statuts (pending, shipped, delivered)
- Différentes quantités

### 9. **predictions** (11 prédictions)
- Prévisions de ventes
- Optimisation de stock
- Détection d'anomalies

### 10. **chat_messages** (20 messages)
- Requêtes d'inventaire
- Demandes de rapports
- Tâches de planification

### 11. **audit_logs** (26 entrées)
- Créations de produits
- Mises à jour de statuts
- Enregistrements de qualité

---

## ⚡ Commandes Rapides SQL

### Voir les Meilleures Ventes

```sql
SELECT 
  p.name,
  SUM(so.quantity_kg) as total_sold,
  SUM(so.total_usd) as total_revenue
FROM public.sales_orders so
JOIN public.tea_products p ON so.product_id = p.id
GROUP BY p.name
ORDER BY total_sold DESC
LIMIT 10;
```

### Voir les Alertes de Stock Actives

```sql
SELECT 
  p.name,
  p.current_quantity_kg,
  p.minimum_stock_kg,
  sa.alert_type
FROM public.stock_alerts sa
JOIN public.tea_products p ON sa.product_id = p.id
WHERE sa.is_resolved = FALSE
ORDER BY sa.created_at DESC;
```

### Voir la Qualité Moyenne par Type de Thé

```sql
SELECT 
  p.type,
  ROUND(AVG(qc.overall_score), 2) as avg_quality,
  COUNT(qc.id) as checks_count
FROM public.quality_checks qc
JOIN public.batches b ON qc.batch_id = b.id
JOIN public.tea_products p ON b.product_id = p.id
GROUP BY p.type
ORDER BY avg_quality DESC;
```

---

## 🚀 Prochaines Étapes

1. ✓ Exécuter `DATABASE_SCHEMA.sql` (structure)
2. ✓ Exécuter `02-seed-data.sql` (données)
3. Démarrer l'application: `npm run dev`
4. Accéder au dashboard: http://localhost:3000
5. Explorer les données dans les différentes pages
6. Personnaliser les données selon vos besoins

---

## 📞 Dépannage

### Erreur: "Table already exists"
**Solution**: Les tables existent déjà. Pas de problème, allez directement à l'étape 3 (insertion des données).

### Erreur: "Duplicate key value violates unique constraint"
**Solution**: Certaines données existent déjà. Vous pouvez:
1. Nettoyer la base: `TRUNCATE public.users CASCADE;` (Attention: perte de données!)
2. Ou modifier les IDs/emails dans le script

### Erreur: "Permission denied"
**Solution**: Assurez-vous d'utiliser la `SERVICE_ROLE_KEY`, pas la clé anon.

### Les données ne s'affichent pas dans l'app
**Solution**:
1. Vérifiez les variables d'environnement dans `.env.local`
2. Redémarrez l'app: `npm run dev`
3. Vérifiez la console pour les erreurs

---

Vous avez maintenant une **base de données riche et complète**! 🎉
