'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ProductFormProps {
  formData: {
    name: string;
    type: string;
    description: string;
    origin: string;
    harvest_date: string;
    price_per_kg: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function ProductForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}: ProductFormProps) {
  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              placeholder="Product name"
              value={formData.name}
              onChange={(e) =>
                onFormDataChange({ ...formData, name: e.target.value })
              }
              required
              className="border-border"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Tea Type
            </label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.type}
              onChange={(e) =>
                onFormDataChange({ ...formData, type: e.target.value })
              }
            >
              <option value="green">Green Tea</option>
              <option value="black">Black Tea</option>
              <option value="oolong">Oolong Tea</option>
              <option value="white">White Tea</option>
              <option value="pu_erh">Pu&apos;erh Tea</option>
              <option value="herbal">Herbal Tea</option>
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Origin
            </label>
            <Input
              type="text"
              placeholder="e.g., Hangzhou, China"
              value={formData.origin}
              onChange={(e) =>
                onFormDataChange({ ...formData, origin: e.target.value })
              }
              className="border-border"
            />
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Harvest Date
            </label>
            <Input
              type="date"
              value={formData.harvest_date}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  harvest_date: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Price per Kg
            </label>
            <Input
              type="number"
              placeholder="0.00"
              step="0.01"
              value={formData.price_per_kg}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  price_per_kg: e.target.value,
                })
              }
              className="border-border"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              placeholder="Product description..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading || !formData.name}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-border"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
