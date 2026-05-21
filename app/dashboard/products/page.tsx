'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductForm } from '@/components/ProductForm';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/supabase';


const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: 'green',
    description: '',
    origin: '',
    harvest_date: '',
    price_per_kg: '',
  });

  const uniqueTypes = [
  ...new Set(products.map((product) => product.type).filter(Boolean))
  ];
  

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter((product) => product.type === selectedType);
    }

    // Sorting
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => (a.price_per_kg || 0) - (b.price_per_kg || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price_per_kg || 0) - (a.price_per_kg || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, searchQuery, selectedType, sortBy]);

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      setProducts(data || []);
    } catch (error) {
      console.error('[v0] Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          origin: formData.origin,
          harvest_date: formData.harvest_date || null,
          price_per_kg: formData.price_per_kg
            ? parseFloat(formData.price_per_kg)
            : null,
          created_by: user?.id,
        })
        .select();

      if (!error) {
        setProducts([...(data || []), ...products]);
        setFormData({
          name: '',
          type: 'green',
          description: '',
          origin: '',
          harvest_date: '',
          price_per_kg: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('[v0] Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('[v0] Error deleting product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log('[v0] Edit product:', product);
    // TODO: Implement edit functionality
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tea Products</h1>
              <p className="text-muted-foreground mt-1">
                Explore our collection of premium teas
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Plus className="w-4 h-4" />
              New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add Product Form */}
        {showForm && (
          <ProductForm
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleAddProduct}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Filters Sidebar + Products Grid Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilters
                searchQuery={searchQuery}
                selectedType={selectedType}
                sortBy={sortBy}
                onSearchChange={setSearchQuery}
                onTypeChange={setSelectedType}
                onSortChange={setSortBy}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground mt-4">Loading products...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <Card className="p-12 border border-border text-center">
                <p className="text-muted-foreground mb-4">
                  {products.length === 0
                    ? 'No products yet'
                    : 'No products match your filters'}
                </p>
                {products.length === 0 ? (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Product
                  </Button>
                ) : (
                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="border-border"
                  >
                    Reset Filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8 border-t border-border">
                    <Button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-border"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <Button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          variant={
                            currentPage === i + 1 ? 'default' : 'outline'
                          }
                          size="sm"
                          className={
                            currentPage === i + 1
                              ? 'bg-primary text-primary-foreground'
                              : 'border-border'
                          }
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>

                    <Button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-border"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {/* Results Count */}
                <div className="text-center text-sm text-muted-foreground pt-4">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}{' '}
                  of {filteredProducts.length} products
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
