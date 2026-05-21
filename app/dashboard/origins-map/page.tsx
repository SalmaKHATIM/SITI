'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Coordonnées pour les origines de thé
const TEA_ORIGINS = {
  'Hangzhou, China': { lat: 30.2741, lng: 120.1551, type: 'green', count: 0 },
  'Darjeeling, India': { lat: 27.0360, lng: 88.2606, type: 'black', count: 0 },
  'Uji, Japan': { lat: 34.8873, lng: 135.8010, type: 'green', count: 0 },
  'Fujian, China': { lat: 26.0745, lng: 119.2965, type: 'oolong', count: 0 },
  'Yunnan, China': { lat: 24.8801, lng: 98.5885, type: 'black', count: 0 },
  'Assam, India': { lat: 26.1667, lng: 92.7500, type: 'black', count: 0 },
  'Taiwan': { lat: 23.6978, lng: 120.9605, type: 'oolong', count: 0 },
  'Sri Lanka': { lat: 6.9271, lng: 80.7789, type: 'black', count: 0 },
};

const MapComponent = dynamic(() => import('@/components/map/leaflet-map'), {
  ssr: false,
  loading: () => <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">Chargement de la carte...</div>,
});

export default function OriginsMapPage() {
  const [origins, setOrigins] = useState(TEA_ORIGINS);
  const [loading, setLoading] = useState(true);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  useEffect(() => {
    loadOrigins();
  }, []);

  const loadOrigins = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('origin');

      if (error) {
        console.error('[STTIS] Error loading origins:', error);
      } else {
        // Compter les produits par origine
        const newOrigins = { ...TEA_ORIGINS };
        products?.forEach((product: any) => {
          if (product.origin && newOrigins[product.origin as keyof typeof newOrigins]) {
            newOrigins[product.origin as keyof typeof newOrigins].count++;
          }
        });
        setOrigins(newOrigins);
      }
    } catch (error) {
      console.error('[STTIS] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'green':
        return '#10b981';
      case 'black':
        return '#8b5a3c';
      case 'oolong':
        return '#d97706';
      case 'white':
        return '#e5e7eb';
      default:
        return '#6b7280';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      green: 'Thé Vert',
      black: 'Thé Noir',
      oolong: 'Thé Oolong',
      white: 'Thé Blanc',
      herbal: 'Tisane',
      pu_erh: 'Pu-erh',
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-8 h-8" />
          Carte des Origines
        </h1>
        <p className="text-muted-foreground mt-1">Découvrez les régions de production de thé</p>
      </div>

      {/* Map */}
      {!loading && (
        <Card className="p-4 border border-border overflow-hidden">
          <div className="rounded-lg overflow-hidden">
            <MapComponent origins={origins} selectedOrigin={selectedOrigin} />
          </div>
        </Card>
      )}

      {/* Origins List */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Régions Principales</h3>
          <div className="space-y-3">
            {Object.entries(origins).map(([name, data]) => (
              <div
                key={name}
                onClick={() => setSelectedOrigin(selectedOrigin === name ? null : name)}
                className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getTypeColor(data.type) }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{getTypeLabel(data.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{data.count}</p>
                    <p className="text-xs text-muted-foreground">produits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Régions actives</p>
              <p className="text-2xl font-bold text-primary">
                {Object.values(origins).filter(o => o.count > 0).length}
              </p>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total de produits</p>
              <p className="text-2xl font-bold text-accent">
                {Object.values(origins).reduce((sum, o) => sum + o.count, 0)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Types de thé</p>
              <div className="space-y-1">
                {['green', 'black', 'oolong', 'white'].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTypeColor(type) }}
                    />
                    <span className="text-sm text-muted-foreground">{getTypeLabel(type)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
