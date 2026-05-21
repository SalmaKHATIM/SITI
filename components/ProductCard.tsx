'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/supabase';

const teaTypeImages: Record<string, string> = {
  green: '/images/green-tea.jpg',
  black: '/images/black-tea.jpg',
  oolong: '/images/oolong-tea.jpg',
  white: '/images/white-tea.jpg',
  pu_erh: '/images/pu-erh-tea.jpg',
  herbal: '/images/herbal-tea.jpg',
};

const teaTypeColors: Record<string, { bg: string; text: string; badge: string }> = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100' },
  black: { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100' },
  oolong: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100' },
  white: { bg: 'bg-zinc-50', text: 'text-zinc-700', badge: 'bg-zinc-100' },
  pu_erh: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' },
  herbal: { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100' },
};

const teaTypeLabels: Record<string, string> = {
  green: 'Green Tea',
  black: 'Black Tea',
  oolong: 'Oolong Tea',
  white: 'White Tea',
  pu_erh: "Pu erh Tea",
  herbal: 'Herbal Tea',
};

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const colors = teaTypeColors[product.type] || teaTypeColors.herbal;
  const imageUrl = teaTypeImages[product.type] || teaTypeImages.herbal;
  const label = teaTypeLabels[product.type] || 'Tea';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image Container */}
      <div className={`relative h-48 w-full ${colors.bg} overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
        {/* Type Badge */}
        <div className="flex gap-2">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge} ${colors.text}`}>
            {label}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Origin & Harvest Info */}
        <div className="space-y-1 text-sm text-muted-foreground">
          {product.origin && (
            <p className="flex items-center gap-1">
              <span className="font-medium"></span>
              {product.origin}
            </p>
          )}
          {product.harvest_date && (
            <p className="flex items-center gap-1">
              <span className="font-medium"></span>
              {new Date(product.harvest_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Price */}
        {product.price_per_kg && (
          <div className="pt-2 border-t border-border">
            <p className="text-lg font-bold text-foreground">
              ${product.price_per_kg.toFixed(2)}/kg
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-border hover:bg-background"
            onClick={() => onEdit(product)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
