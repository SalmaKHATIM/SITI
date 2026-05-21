# Exemples de Code - Utiliser les Données dans Votre App

## Table des Matières
1. [Récupérer les Données](#récupérer-les-données)
2. [Insérer les Données](#insérer-les-données)
3. [Mettre à Jour les Données](#mettre-à-jour-les-données)
4. [Supprimer les Données](#supprimer-les-données)
5. [Requêtes Complexes](#requêtes-complexes)
6. [Utiliser dans les Composants React](#utiliser-dans-les-composants-react)

---

## Récupérer les Données

### Exemple 1: Récupérer tous les produits

```typescript
import { supabase } from '@/lib/supabase';

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) console.error('[STTIS] Erreur:', error);
  return data || [];
}

// Utilisation
const products = await getAllProducts();
console.log(products); // 32 produits
```

### Exemple 2: Récupérer un produit spécifique

```typescript
export async function getProductById(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) console.error('[STTIS] Erreur:', error);
  return data;
}

// Utilisation
const product = await getProductById('product-uuid');
console.log(product.name); // "Dragon Well Premium"
```

### Exemple 3: Récupérer les produits avec stock faible

```typescript
export async function getLowStockProducts(minStock: number = 20) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lt('current_quantity_kg', minStock)
    .order('current_quantity_kg');

  if (error) console.error('[STTIS] Erreur:', error);
  return data || [];
}

// Utilisation
const lowStockProducts = await getLowStockProducts(20);
console.log(lowStockProducts.length); // Produits avec < 20 kg
```

### Exemple 4: Récupérer les commandes avec détails

```typescript
export async function getOrdersWithDetails() {
  const { data, error } = await supabase
    .from('sales_orders')
    .select(\`
      *,
      products (name, origin, type)
    \`)
    .eq('status', 'delivered')
    .order('order_date', { ascending: false });

  if (error) console.error('[STTIS] Erreur:', error);
  return data || [];
}

// Utilisation
const orders = await getOrdersWithDetails();
orders.forEach(order => {
  console.log(\`\${order.products.name} - \${order.quantity_kg} kg\`);
});
```

### Exemple 5: Récupérer les lots avec contrôles de qualité

```typescript
export async function getBatchesWithQuality() {
  const { data, error } = await supabase
    .from('batches')
    .select(\`
      *,
      quality_checks (overall_score, appearance_score, aroma_score, taste_score),
      products (name, type, origin)
    \`)
    .order('production_date', { ascending: false });

  if (error) console.error('[STTIS] Erreur:', error);
  return data || [];
}

// Utilisation
const batches = await getBatchesWithQuality();
batches.forEach(batch => {
  const qualityScore = batch.quality_checks[0]?.overall_score || 0;
  console.log(\`\${batch.batch_number}: Score \${qualityScore}/100\`);
});
```

### Exemple 6: Récupérer les alertes de stock actives

```typescript
export async function getActiveAlerts() {
  const { data, error } = await supabase
    .from('stock_alerts')
    .select(\`
      *,
      products (name, current_quantity_kg, minimum_stock_kg)
    \`)
    .eq('is_resolved', false)
    .order('created_at', { ascending: false });

  if (error) console.error('[STTIS] Erreur:', error);
  return data || [];
}

// Utilisation
const alerts = await getActiveAlerts();
alerts.forEach(alert => {
  console.log(\`⚠️ \${alert.products.name}: \${alert.alert_type}\`);
});
```

---

## Insérer les Données

### Exemple 1: Insérer un nouveau produit

```typescript
export async function createProduct(productData: {
  name: string;
  origin: string;
  type: string;
  initial_quantity_kg: number;
  unit_price_usd: number;
}) {
  const userId = 'your-user-id'; // À obtenir de l'authentification

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        ...productData,
        current_quantity_kg: productData.initial_quantity_kg,
        quality_grade: 'Grade A',
        minimum_stock_kg: 10,
        created_by: userId,
      },
    ])
    .select();

  if (error) console.error('[STTIS] Erreur:', error);
  return data ? data[0] : null;
}

// Utilisation
const newProduct = await createProduct({
  name: 'Premium Green Tea',
  origin: 'Hangzhou, China',
  type: 'Green',
  initial_quantity_kg: 100,
  unit_price_usd: 50,
});
console.log(newProduct?.id); // UUID du nouveau produit
```

### Exemple 2: Insérer une nouvelle commande

```typescript
export async function createOrder(orderData: {
  product_id: string;
  customer_name: string;
  quantity_kg: number;
  unit_price_usd: number;
}) {
  const { data, error } = await supabase
    .from('sales_orders')
    .insert([
      {
        order_number: \`ORD-\${Date.now()}\`,
        product_id: orderData.product_id,
        customer_name: orderData.customer_name,
        quantity_kg: orderData.quantity_kg,
        unit_price_usd: orderData.unit_price_usd,
        total_usd: orderData.quantity_kg * orderData.unit_price_usd,
        order_date: new Date().toISOString().split('T')[0],
        status: 'pending',
      },
    ])
    .select();

  if (error) console.error('[STTIS] Erreur:', error);
  return data ? data[0] : null;
}

// Utilisation
const order = await createOrder({
  product_id: 'product-uuid',
  customer_name: 'Premium Tea Café',
  quantity_kg: 10,
  unit_price_usd: 85,
});
console.log(order?.order_number); // "ORD-1234567890"
```

---

🎉 Vous avez maintenant tous les exemples pour utiliser votre base de données STTIS!

