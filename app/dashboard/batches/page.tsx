'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, QrCode, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';
import { generateBatchQRCode, downloadQRCode, printQRCodeLabel } from '@/lib/qr-generator';
import type { Batch, Product } from '@/lib/supabase';

export default function BatchesPage() {
  const [batches, setBatches] = useState<(Batch & { product?: Product })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [qrModal, setQrModal] = useState<{ show: boolean; batchId: string; batchNumber: string; qrCode: string | null }>({
    show: false,
    batchId: '',
    batchNumber: '',
    qrCode: null,
  });
  const [formData, setFormData] = useState({
    batch_number: '',
    product_id: '',
    quantity_kg: '',
    production_date: '',
    quality_score: '',
    quality_notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('name');

      setProducts(productsData || []);

      // Load batches with product details
      const { data: batchesData, error } = await supabase
        .from('batches')
        .select('*, products(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[STTIS] Error loading batches:', error);
      } else {
        setBatches(batchesData || []);
      }
    } catch (error) {
      console.error('[STTIS] Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Generate unique batch number if not provided
      const batchNumber = formData.batch_number || `BATCH-${Date.now()}`;

      const { data, error } = await supabase
        .from('batches')
        .insert([{
          batch_number: batchNumber,
          product_id: formData.product_id,
          quantity_kg: parseFloat(formData.quantity_kg),
          production_date: formData.production_date || null,
          status: 'pending',
        }])
        .select();

      if (error) {
        console.error('[STTIS] Error adding batch:', error);
        alert('Erreur: ' + error.message);
      } else if (data) {
        // Reload batches
        await loadData();
        setFormData({
          batch_number: '',
          product_id: '',
          quantity_kg: '',
          production_date: '',
          quality_score: '',
          quality_notes: '',
        });
        setShowForm(false);
        alert('Lot créé avec succès!');
      }
    } catch (error) {
      console.error('[STTIS] Error adding batch:', error);
      alert('Erreur: ' + String(error));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_production':
        return 'text-blue-600';
      case 'quality_check':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_production':
        return 'bg-blue-50 border-blue-200';
      case 'quality_check':
        return 'bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_production':
        return 'bg-blue-100 text-blue-800';
      case 'quality_check':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'packaging':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBatches = selectedStatus === 'all' 
    ? batches 
    : batches.filter((batch) => batch.status === selectedStatus);

  const statusOptions = [
    { value: 'all', label: 'All Batches' },
    { value: 'in_production', label: 'In Production' },
    { value: 'completed', label: 'Completed' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'quality_check', label: 'Quality Check' },
  ];

  const handleGenerateQR = async (batchId: string, batchNumber: string) => {
    try {
      const qrCode = await generateBatchQRCode(batchId, batchNumber);
      setQrModal({
        show: true,
        batchId,
        batchNumber,
        qrCode,
      });
    } catch (error) {
      console.error('[STTIS] Error generating QR:', error);
    }
  };

  const handleDownloadQR = async (batchId: string, batchNumber: string) => {
    try {
      await downloadQRCode(batchId, batchNumber);
    } catch (error) {
      console.error('[STTIS] Error downloading QR:', error);
    }
  };

  const handlePrintQR = (qrCode: string, batchNumber: string) => {
    printQRCodeLabel(qrCode, batchNumber);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batches</h1>
          <p className="text-muted-foreground mt-1">Track and manage tea batches</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* Add Batch Form */}
      {showForm && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Create New Batch</h3>
          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Batch Number (optional)</label>
                <Input
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={formData.batch_number}
                  onChange={(e) =>
                    setFormData({ ...formData, batch_number: e.target.value })
                  }
                />
              </div>

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
                <label className="block text-sm font-medium mb-1">Quantity (kg) *</label>
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
                <label className="block text-sm font-medium mb-1">Production Date</label>
                <Input
                  type="date"
                  value={formData.production_date}
                  onChange={(e) =>
                    setFormData({ ...formData, production_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quality Score</label>
                <Input
                  type="number"
                  placeholder="0.0 - 100.0"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.quality_score}
                  onChange={(e) =>
                    setFormData({ ...formData, quality_score: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Quality Notes</label>
                <textarea
                  placeholder="Quality assessment notes..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  rows={3}
                  value={formData.quality_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, quality_notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create Batch
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

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Filter by Status</h3>
          <span className="text-xs text-muted-foreground">
            {filteredBatches.length} {filteredBatches.length === 1 ? 'batch' : 'batches'}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {statusOptions.map((option) => {
            const count = option.value === 'all' 
              ? batches.length 
              : batches.filter((b) => b.status === option.value).length;
            
            return (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedStatus === option.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                }`}
              >
                {option.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  selectedStatus === option.value
                    ? 'bg-primary-foreground/20'
                    : 'bg-background'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batches Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading batches...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <Card className="p-12 border border-border text-center">
          <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {selectedStatus === 'all' ? 'No batches created yet' : `No batches with status "${statusOptions.find(s => s.value === selectedStatus)?.label}"`}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Batch
          </Button>
        </Card>
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Batch Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity (kg)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quality Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch, index) => (
                <tr
                  key={batch.id}
                  className={`border-b border-border hover:bg-muted/50 transition ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {batch.batch_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {(batch as any).products?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {batch.quantity_kg} kg
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeColor(batch.status)}`}>
                      {batch.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {batch.quality_score ? `${batch.quality_score}/100` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border h-8 px-3"
                        onClick={() => handleGenerateQR(batch.id, batch.batch_number)}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border h-8 px-3"
                        onClick={() => window.open(`/trace/${batch.id}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal.show && qrModal.qrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-8 border border-border max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              QR Code - {qrModal.batchNumber}
            </h3>
            <div className="flex justify-center mb-6">
              <img
                src={qrModal.qrCode}
                alt="Batch QR Code"
                className="w-64 h-64 border border-border p-2 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handleDownloadQR(qrModal.batchId, qrModal.batchNumber)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => handlePrintQR(qrModal.qrCode, qrModal.batchNumber)}
                variant="outline"
                className="w-full border-border"
              >
                Print Label
              </Button>
              <Button
                onClick={() => setQrModal({ show: false, batchId: '', batchNumber: '', qrCode: null })}
                variant="outline"
                className="w-full border-border"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
