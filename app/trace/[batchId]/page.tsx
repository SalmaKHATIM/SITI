'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Leaf,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
} from 'lucide-react';
import type { Batch, Product, Batch as BatchDetails } from '@/lib/supabase';

interface BatchWithDetails extends BatchDetails {
  product?: Product;
  batch_details?: any[];
  sales?: any[];
}

export default function BatchTraceabilityPage() {
  const params = useParams();
  const batchId = params.batchId as string;

  const [batch, setBatch] = useState<BatchWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBatchData = async () => {
      try {
        if (!batchId) {
          setError('Batch ID not found');
          setLoading(false);
          return;
        }

        // Load batch with product details
        const { data: batchData, error: batchError } = await supabase
          .from('batches')
          .select(`
            *,
            products(*)
          `)
          .eq('id', batchId)
          .single();

        if (batchError) {
          setError('Batch not found');
          setLoading(false);
          return;
        }

        // Load batch details (production metrics)
        const { data: detailsData } = await supabase
          .from('batch_details')
          .select('*')
          .eq('batch_id', batchId)
          .order('recorded_at', { ascending: true });

        // Load sales records
        const { data: salesData } = await supabase
          .from('sales')
          .select('*')
          .eq('batch_id', batchId)
          .order('sale_date', { ascending: false });

        setBatch({
          ...batchData,
          batch_details: detailsData || [],
          sales: salesData || [],
        });
      } catch (err) {
        setError('Failed to load batch data');
        console.error('[STTIS] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBatchData();
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 border border-destructive/20 bg-destructive/5 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Batch Not Found
          </h2>
          <p className="text-muted-foreground">
            {error || 'The requested batch could not be found in our system.'}
          </p>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_production':
        return <Clock className="w-6 h-6 text-blue-600" />;
      case 'quality_check':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-primary">STTIS</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Batch Traceability Information
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Batch Overview */}
        <Card className="p-8 border border-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {batch.batch_number}
              </h2>
              <p className="text-muted-foreground">
                {batch.product?.name || 'Unknown Product'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-center">
              {getStatusIcon(batch.status)}
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold capitalize text-foreground">
                  {batch.status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Quantity */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Total Quantity</p>
              <p className="text-2xl font-bold text-primary">{batch.quantity_kg}</p>
              <p className="text-xs text-muted-foreground">kg</p>
            </div>

            {/* Production Date */}
            {batch.production_date && (
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-accent" />
                  <p className="text-sm text-muted-foreground">Production Date</p>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(batch.production_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Quality Score */}
            {batch.quality_score && (
              <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <p className="text-sm text-muted-foreground mb-1">Quality Score</p>
                <p className="text-2xl font-bold text-secondary">
                  {batch.quality_score}/10
                </p>
              </div>
            )}

            {/* Product Origin */}
            {batch.product?.origin && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-muted-foreground">Origin</p>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {batch.product.origin}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Production Details Timeline */}
        {batch.batch_details && batch.batch_details.length > 0 && (
          <Card className="p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Production Timeline
            </h3>
            <div className="space-y-4">
              {batch.batch_details.map((detail, idx) => (
                <div key={detail.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    {idx < batch.batch_details.length - 1 && (
                      <div className="w-0.5 h-12 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(detail.recorded_at).toLocaleString()}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      {detail.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">
                            Temp: {detail.temperature}°C
                          </span>
                        </div>
                      )}
                      {detail.humidity && (
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            Humidity: {detail.humidity}%
                          </span>
                        </div>
                      )}
                      {detail.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{detail.location}</span>
                        </div>
                      )}
                    </div>
                    {detail.processing_notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Notes: {detail.processing_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Quality Notes */}
        {batch.quality_notes && (
          <Card className="p-8 border border-border bg-yellow-50/50 border-yellow-200">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Quality Assessment
            </h3>
            <p className="text-foreground">{batch.quality_notes}</p>
          </Card>
        )}

        {/* Sales Records */}
        {batch.sales && batch.sales.length > 0 && (
          <Card className="p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Sales Record
            </h3>
            <div className="space-y-4">
              {batch.sales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold text-foreground">
                        {sale.customer_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity Sold</p>
                      <p className="font-semibold text-foreground">
                        {sale.quantity_kg} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sale Date</p>
                      <p className="font-semibold text-foreground">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {sale.notes && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {sale.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty States */}
        {(!batch.batch_details || batch.batch_details.length === 0) && (
          <Card className="p-8 border border-border text-center bg-muted/20">
            <p className="text-muted-foreground">No production timeline recorded yet</p>
          </Card>
        )}

        {(!batch.sales || batch.sales.length === 0) && (
          <Card className="p-8 border border-border text-center bg-muted/20">
            <p className="text-muted-foreground">No sales recorded for this batch</p>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground border-t border-border">
          <p>STTIS - Smart Tea Traceability & Intelligence System</p>
          <p>Last Updated: {new Date(batch.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
