'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, AlertTriangle, TrendingDown } from 'lucide-react';
import type { StockLevel, Product } from '@/lib/supabase';

export default function StockPage() {
  const [stocks, setStocks] = useState<(StockLevel & { product?: Product })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    warehouse_location: '',
    quantity_kg: '',
    min_threshold_kg: '',
    max_threshold_kg: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) {
        console.error('[STTIS] Error loading products:', productsError);
      }
      setProducts(productsData || []);

      // Load stock movements with product details
      const { data: stockData, error: stockError } = await supabase
        .from('stock_movements')
        .select('*, products(*)')
        .order('recorded_at', { ascending: false });

      if (stockError) {
        console.error('[STTIS] Error loading stock:', stockError);
      } else {
        setStocks(stockData || []);
      }
    } catch (error) {
      console.error('[STTIS] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([{
          product_id: formData.product_id,
          movement_type: 'in',
          quantity_kg: parseFloat(formData.quantity_kg),
          warehouse_location: formData.warehouse_location,
          min_threshold_kg: formData.min_threshold_kg
            ? parseFloat(formData.min_threshold_kg)
            : null,
          max_threshold_kg: formData.max_threshold_kg
            ? parseFloat(formData.max_threshold_kg)
            : null,
          reason: 'Initial stock entry',
          recorded_at: new Date().toISOString(),
        }])
        .select();

      if (error) {
        console.error('[STTIS] Error adding stock:', error);
        alert('Erreur: ' + error.message);
      } else if (data) {
        await loadData();
        setFormData({
          product_id: '',
          warehouse_location: '',
          quantity_kg: '',
          min_threshold_kg: '',
          max_threshold_kg: '',
        });
        setShowForm(false);
        alert('Stock ajouté avec succès!');
      }
    } catch (error) {
      console.error('[STTIS] Error adding stock:', error);
      alert('Erreur: ' + String(error));
    }
  };

  const isLowStock = (stock: StockLevel) => {
    if (stock.min_threshold_kg) {
      return stock.quantity_kg <= stock.min_threshold_kg;
    }
    return false;
  };

  const isHighStock = (stock: StockLevel) => {
    if (stock.max_threshold_kg) {
      return stock.quantity_kg >= stock.max_threshold_kg;
    }
    return false;
  };

  const lowStockCount = stocks.filter(isLowStock).length;
  const highStockCount = stocks.filter(isHighStock).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
          <p className="text-muted-foreground mt-1">Monitor inventory levels and thresholds</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Stock Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {lowStockCount > 0 && (
          <Card className="p-4 border border-yellow-200 bg-yellow-50/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">Low Stock Alert</p>
                <p className="text-sm text-yellow-800">{lowStockCount} items below minimum threshold</p>
              </div>
            </div>
          </Card>
        )}

        {highStockCount > 0 && (
          <Card className="p-4 border border-blue-200 bg-blue-50/50">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">High Stock Alert</p>
                <p className="text-sm text-blue-800">{highStockCount} items above maximum threshold</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Add Stock Form */}
      {showForm && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Add Stock Level</h3>
          <form onSubmit={handleAddStock} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product *</label>
                <select
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Warehouse Location *</label>
                <Input
                  type="text"
                  placeholder="e.g., Warehouse A, Zone 1"
                  value={formData.warehouse_location}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse_location: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Quantity (kg) *</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.quantity_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity_kg: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Min Threshold (kg)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.min_threshold_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, min_threshold_kg: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Threshold (kg)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.max_threshold_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, max_threshold_kg: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Add Stock Level
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stock Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading stock data...</p>
        </div>
      ) : stocks.length === 0 ? (
        <Card className="p-12 border border-border text-center">
          <p className="text-muted-foreground mb-4">No stock levels configured</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Stock
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {stocks.map((stock) => (
            <Card
              key={stock.id}
              className={`p-6 border ${
                isLowStock(stock)
                  ? 'border-yellow-200 bg-yellow-50/50'
                  : isHighStock(stock)
                  ? 'border-blue-200 bg-blue-50/50'
                  : 'border-border'
              } hover:border-primary/50 transition`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">
                    {(stock as any).products?.name || 'Unknown Product'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {(stock as any).movement_type || 'N/A'} | Location: {stock.warehouse_location}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-lg font-semibold text-primary">
                        {stock.quantity_kg} kg
                      </p>
                    </div>
                    {stock.min_threshold_kg && (
                      <div>
                        <p className="text-xs text-muted-foreground">Minimum</p>
                        <p className="text-lg font-semibold text-accent">
                          {stock.min_threshold_kg} kg
                        </p>
                      </div>
                    )}
                    {stock.max_threshold_kg && (
                      <div>
                        <p className="text-xs text-muted-foreground">Maximum</p>
                        <p className="text-lg font-semibold text-secondary">
                          {stock.max_threshold_kg} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {isLowStock(stock) && (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
