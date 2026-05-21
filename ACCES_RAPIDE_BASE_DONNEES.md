# Accès Rapide à la Base de Données - STTIS

## Les 3 Façons d'Accéder à votre Base de Données

---

## 1️⃣ VIA L'INTERFACE WEB SUPABASE (Le Plus Facile)

### Pour voir les données:
```
1. Allez sur: https://supabase.com
2. Connectez-vous avec votre compte
3. Cliquez sur votre projet "STTIS-Database"
4. Menu gauche → "Table Editor"
5. Sélectionnez une table (ex: tea_products)
6. Vous voyez toutes les données
```

### Pour ajouter des données:
```
1. Table Editor → Sélectionnez une table
2. Cliquez sur "+ Insert row" (le bouton +)
3. Remplissez les colonnes
4. Cliquez sur "Save"
```

### Pour modifier des données:
```
1. Table Editor → Trouvez la ligne
2. Double-cliquez sur la cellule à modifier
3. Changez la valeur
4. Appuyez sur Entrée
```

### Pour supprimer des données:
```
1. Table Editor → Cliquez sur la ligne
2. Cliquez sur les 3 points ⋯
3. Sélectionnez "Delete row"
```

---

## 2️⃣ VIA L'ÉDITEUR SQL SUPABASE

### Pour exécuter des commandes SQL:
```
1. Supabase Dashboard → "SQL Editor"
2. Cliquez sur "+ New Query"
3. Écrivez votre commande SQL
4. Cliquez sur "Run" (flèche verte)
```

### Commandes SQL courantes:

**Voir tous les produits:**
```sql
SELECT * FROM tea_products;
```

**Voir les produits d'une origine spécifique:**
```sql
SELECT * FROM tea_products WHERE origin = 'China';
```

**Voir les utilisateurs:**
```sql
SELECT * FROM users;
```

**Ajouter un nouveau produit:**
```sql
INSERT INTO tea_products (
  name, 
  origin, 
  type, 
  quality_grade, 
  initial_quantity_kg, 
  current_quantity_kg, 
  unit_price_usd
) VALUES (
  'Premium Green Tea',
  'China',
  'Green',
  'A+',
  100,
  100,
  25
);
```

**Mettre à jour la quantité d'un produit:**
```sql
UPDATE tea_products 
SET current_quantity_kg = 85 
WHERE name = 'Premium Green Tea';
```

**Voir les mouvements de stock:**
```sql
SELECT * FROM stock_movements ORDER BY recorded_at DESC;
```

**Voir les lots de production:**
```sql
SELECT * FROM batches;
```

**Voir les alertes de stock non résolues:**
```sql
SELECT * FROM stock_alerts WHERE is_resolved = false;
```

---

## 3️⃣ VIA VOTRE CODE NEXT.JS

### Dans un composant React:

**Récupérer les données:**
```typescript
'use client'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function MesProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('tea_products')
        .select('*')
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Origin: {product.origin}</p>
          <p>Quantity: {product.current_quantity_kg} kg</p>
        </div>
      ))}
    </div>
  )
}
```

**Ajouter des données:**
```typescript
const addProduct = async () => {
  const { data, error } = await supabase
    .from('tea_products')
    .insert({
      name: 'New Tea',
      origin: 'Vietnam',
      type: 'White',
      quality_grade: 'A',
      initial_quantity_kg: 50,
      current_quantity_kg: 50,
      unit_price_usd: 30
    })
  
  if (error) console.error(error)
  else console.log('Produit ajouté:', data)
}
```

**Modifier des données:**
```typescript
const updateProduct = async (productId, newQuantity) => {
  const { error } = await supabase
    .from('tea_products')
    .update({ current_quantity_kg: newQuantity })
    .eq('id', productId)
  
  if (error) console.error(error)
  else console.log('Produit mis à jour')
}
```

**Supprimer des données:**
```typescript
const deleteProduct = async (productId) => {
  const { error } = await supabase
    .from('tea_products')
    .delete()
    .eq('id', productId)
  
  if (error) console.error(error)
  else console.log('Produit supprimé')
}
```

**Filtrer les données:**
```typescript
// Produits avec faible stock
const { data: lowStockProducts } = await supabase
  .from('tea_products')
  .select('*')
  .lt('current_quantity_kg', 10)

// Produits d'une certaine origine
const { data: chinaProducts } = await supabase
  .from('tea_products')
  .select('*')
  .eq('origin', 'China')

// Triés par prix (décroissant)
const { data: sortedProducts } = await supabase
  .from('tea_products')
  .select('*')
  .order('unit_price_usd', { ascending: false })
```

**Joindre plusieurs tables:**
```typescript
// Obtenir les lots avec les infos du produit
const { data: batchesWithProducts } = await supabase
  .from('batches')
  .select('*, tea_products(name, origin)')
```

---

## Configuration Minimale Requise

Avant d'utiliser votre base de données, assurez-vous:

```
✓ Compte Supabase créé
✓ Projet créé dans Supabase
✓ Fichier .env.local avec:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ DATABASE_SCHEMA.sql exécuté
✓ Application démarrée (npm run dev)
```

---

## Structure des Tables Principales

### users (Utilisateurs)
```
id (UUID) | email (TEXT) | full_name | role | created_at
```

### tea_products (Produits)
```
id | name | origin | type | quality_grade | 
initial_quantity_kg | current_quantity_kg | unit_price_usd
```

### batches (Lots)
```
id | batch_number | product_id | quantity_kg | 
status | quality_score | production_date | expiry_date
```

### stock_movements (Mouvements)
```
id | product_id | movement_type | quantity_kg | 
reason | recorded_by | recorded_at
```

### stock_alerts (Alertes)
```
id | product_id | alert_type | threshold_value | 
current_value | is_resolved | created_at
```

### quality_checks (Contrôle qualité)
```
id | batch_id | check_date | appearance_score | 
aroma_score | taste_score | color_score | overall_score | checked_by
```

### sales_orders (Commandes)
```
id | order_number | product_id | customer_name | 
quantity_kg | unit_price_usd | total_usd | order_date | delivery_date
```

### predictions (Prédictions IA)
```
id | product_id | prediction_type | prediction_date | 
period | predicted_value | confidence_score
```

### chat_messages (Messages)
```
id | user_id | message_text | response_text | 
intent | entities | created_at
```

### batch_history (Historique lots)
```
id | batch_id | event_type | details | 
recorded_by | recorded_at
```

### audit_logs (Logs d'audit)
```
id | user_id | action | table_name | record_id | 
old_values | new_values | created_at
```

---

## Exemples Pratiques Complets

### Exemple 1: Ajouter un produit avec API Supabase
```typescript
// Dans un formulaire
async function handleAddProduct(formData) {
  const { error } = await supabase
    .from('tea_products')
    .insert([{
      name: formData.name,
      origin: formData.origin,
      type: formData.type,
      quality_grade: 'A',
      initial_quantity_kg: 100,
      current_quantity_kg: 100,
      unit_price_usd: formData.price
    }])

  if (error) {
    alert('Erreur: ' + error.message)
  } else {
    alert('Produit ajouté avec succès!')
    // Rafraîchir la liste
    window.location.reload()
  }
}
```

### Exemple 2: Créer un lot (batch)
```typescript
async function createBatch(productId) {
  const { data: newBatch, error } = await supabase
    .from('batches')
    .insert([{
      batch_number: `BATCH-${Date.now()}`,
      product_id: productId,
      quantity_kg: 50,
      status: 'production',
      production_date: new Date().toISOString().split('T')[0]
    }])
    .select()

  if (!error) {
    console.log('Lot créé:', newBatch[0])
    return newBatch[0].id
  }
}
```

### Exemple 3: Enregistrer un mouvement de stock
```typescript
async function recordStockMovement(productId, quantity, type) {
  await supabase
    .from('stock_movements')
    .insert([{
      product_id: productId,
      movement_type: type, // 'in' ou 'out'
      quantity_kg: quantity,
      reason: 'Manual adjustment',
      recorded_by: currentUserId
    }])
}
```

### Exemple 4: Voir les données en temps réel (avec abonnement)
```typescript
// Écouter les changements en temps réel
const subscription = supabase
  .from('tea_products')
  .on('*', payload => {
    console.log('Changement détecté:', payload)
    // Rafraîchir l'interface
  })
  .subscribe()

// Arrêter l'écoute
subscription.unsubscribe()
```

---

## Questions Fréquentes

**Q: Où est stockée ma base de données?**
A: Sur les serveurs Supabase (cloud). Vous ne gérez pas les serveurs.

**Q: Ma base de données est-elle sécurisée?**
A: Oui. Supabase utilise PostgreSQL avec authentification JWT et RLS.

**Q: Combien ça coûte?**
A: Gratuit jusqu'à 500 MB de données. Ensuite, ~$25/mois.

**Q: Je peux accéder à la base sans mon app?**
A: Oui! Via l'interface web Supabase.

**Q: Comment faire une sauvegarde?**
A: Supabase fait des sauvegardes automatiques. Vous pouvez aussi exporter en SQL.

**Q: Les données sont supprimées si j'arrête l'app?**
A: Non! Les données restent dans Supabase même si l'app est arrêtée.

---

## Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| Voir tous les produits | Supabase → Table Editor → tea_products |
| Ajouter un produit | Table Editor → + Insert row |
| Exécuter du SQL | SQL Editor → + New Query → Run |
| Vérifier les erreurs | App logs ou navigateur console (F12) |
| Rafraîchir les données | F5 dans le navigateur |

---

## Prochaines Étapes

1. **Compléter votre guide:** `GUIDE_COMPLET_BASE_DONNEES.md`
2. **Ajouter des données test** via l'interface Supabase
3. **Tester votre app** avec `npm run dev`
4. **Créer vos premières pages** qui utilisent la base de données
5. **Déployer** quand vous êtes prêt

---

Besoin d'aide? Consultez:
- `GUIDE_COMPLET_BASE_DONNEES.md` (Guide détaillé)
- `DATABASE_SCHEMA.sql` (Structure des tables)
- Documentation Supabase: https://supabase.com/docs
