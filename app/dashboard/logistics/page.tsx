'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package,
  Truck,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
  Filter,
  Download,
  Plane,
  Ship,
  Train,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';

// Types de transport avec icônes lucide
const TRANSPORT_TYPES = {
  air: { label: 'Avion', icon: Plane, color: 'bg-blue-100 text-blue-800' },
  sea: { label: 'Bateau', icon: Ship, color: 'bg-cyan-100 text-cyan-800' },
  truck: { label: 'Camion', icon: Truck, color: 'bg-amber-100 text-amber-800' },
  train: { label: 'Train', icon: Train, color: 'bg-purple-100 text-purple-800' },
};

// Statuts logistiques avec icônes lucide
const LOGISTICS_STATUS = {
  pending: { label: 'Préparation', color: 'bg-gray-100 text-gray-800', icon: ClipboardList },
  packed: { label: 'Emballée', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  in_transit: { label: 'En transit', color: 'bg-blue-100 text-blue-800', icon: Truck },
  customs: { label: 'Douane', color: 'bg-orange-100 text-orange-800', icon: ClipboardList },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  delayed: { label: 'Retardée', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

// Coordonnées des pays principaux
const COUNTRY_COORDS: { [key: string]: { lat: number; lng: number } } = {
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'UK': { lat: 55.3781, lng: -3.436 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'China': { lat: 35.8617, lng: 104.1954 },
};

interface Shipment {
  id: string;
  order_number: string;
  customer_name: string;
  origin_country: string;
  destination_country: string;
  current_location: string;
  status: keyof typeof LOGISTICS_STATUS;
  transport_type: keyof typeof TRANSPORT_TYPES;
  quantity_kg: number;
  product_name: string;
  departure_date: string;
  eta: string;
  current_temperature: number | null;
  current_humidity: number | null;
  tracking_history: Array<{
    date: string;
    location: string;
    event: string;
    temperature?: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  quality_score: number;
}

interface KPI {
  in_transit: number;
  delivered: number;
  countries: number;
  delayed: number;
  average_delivery_days: number;
  quality_maintained: number;
  total_revenue: number;
}

const LogisticsMap = dynamic(() => import('@/components/map/logistics-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
      Chargement de la carte logistique...
    </div>
  ),
});

export default function LogisticsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [kpis, setKpis] = useState<KPI>({
    in_transit: 0,
    delivered: 0,
    countries: 0,
    delayed: 0,
    average_delivery_days: 0,
    quality_maintained: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    country: '',
    transport: '',
  });

  useEffect(() => {
    loadShipments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, shipments]);

  const loadShipments = async () => {
    try {
      // Charger les commandes de vente
      const { data: orders, error } = await supabase
        .from('sales_orders')
        .select('*, products(name)')
        .order('order_date', { ascending: false });

      if (error) {
        console.error('[STTIS] Error loading orders:', error);
      } else {
        // Créer des expéditions à partir des commandes
        const newShipments = (orders || []).map((order: any, index: number) => {
          // Simuler les données logistiques basées sur les données réelles
          const countries = Object.keys(COUNTRY_COORDS);
          const originCountry = 'Morocco'; // Toujours partir du Maroc
          const destCountry = countries[Math.floor(Math.random() * (countries.length - 1)) + 1];

          const statuses: Array<keyof typeof LOGISTICS_STATUS> = [
            'pending',
            'packed',
            'in_transit',
            'customs',
            'delivered',
            'delayed',
          ];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          const transports: Array<keyof typeof TRANSPORT_TYPES> = [
            'air',
            'sea',
            'truck',
            'train',
          ];
          const transport = transports[Math.floor(Math.random() * transports.length)];

          // ETA basée sur le type de transport
          const today = new Date(order.order_date);
          const etaDays =
            transport === 'air' ? 3 : transport === 'truck' ? 5 : transport === 'train' ? 7 : 14;
          const eta = new Date(today);
          eta.setDate(eta.getDate() + etaDays);

          // Historique du trajet
          const history = [
            {
              date: order.order_date,
              location: 'Casablanca, Maroc',
              event: 'Commande reçue',
              temperature: 22,
            },
            {
              date: new Date(new Date(order.order_date).getTime() + 86400000).toISOString().split('T')[0],
              location: 'Port de Tanger Med',
              event: 'Emballée et expédiée',
              temperature: 24,
            },
          ];

          if (status !== 'pending') {
            history.push({
              date: new Date(new Date(order.order_date).getTime() + 172800000)
                .toISOString()
                .split('T')[0],
              location: destCountry,
              event: 'En transit',
              temperature: 20,
            });
          }

          // Alertes
          const alerts: Shipment['alerts'] = [];
          if (Math.random() > 0.8) {
            alerts.push({
              type: 'temperature',
              message: 'Température anormale détectée',
              severity: 'high',
            });
          }
          if (Math.random() > 0.9) {
            alerts.push({
              type: 'delay',
              message: 'Retard estimé de 2 jours',
              severity: 'medium',
            });
          }

          return {
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            origin_country: originCountry,
            destination_country: destCountry,
            current_location:
              status === 'delivered'
                ? destCountry
                : status === 'in_transit'
                ? `En transit vers ${destCountry}`
                : 'Port de Tanger Med',
            status,
            transport_type: transport,
            quantity_kg: order.quantity_kg,
            product_name: order.products?.name || 'Produit inconnu',
            departure_date: order.order_date,
            eta: eta.toISOString().split('T')[0],
            current_temperature: 21 + Math.random() * 4,
            current_humidity: 55 + Math.random() * 20,
            tracking_history: history,
            alerts,
            quality_score: 85 + Math.random() * 15,
          };
        });

        setShipments(newShipments);
        calculateKPIs(newShipments);
      }
    } catch (error) {
      console.error('[STTIS] Error loading logistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = (data: Shipment[]) => {
    const in_transit = data.filter((s) => s.status === 'in_transit').length;
    const delivered = data.filter((s) => s.status === 'delivered').length;
    const delayed = data.filter((s) => s.status === 'delayed').length;
    const countries = new Set(data.map((s) => s.destination_country)).size + 1; // +1 pour l'origine

    const total_revenue = data.reduce((sum, s) => {
      // Simuler le prix - en production ce serait dans les données
      return sum + s.quantity_kg * 50;
    }, 0);

    const quality_maintained = Math.round(
      data.reduce((sum, s) => sum + s.quality_score, 0) / data.length
    );

    // Calculer les jours moyens de livraison
    const delivered_shipments = data.filter((s) => s.status === 'delivered');
    const average_delivery_days =
      delivered_shipments.length > 0
        ? Math.round(
            delivered_shipments.reduce((sum, s) => {
              const [depY, depM, depD] = s.departure_date.split('-').map(Number);
              const [etaY, etaM, etaD] = s.eta.split('-').map(Number);
              const depDate = new Date(depY, depM - 1, depD);
              const etaDate = new Date(etaY, etaM - 1, etaD);
              return sum + (etaDate.getTime() - depDate.getTime()) / (1000 * 60 * 60 * 24);
            }, 0) / delivered_shipments.length
          )
        : 0;

    setKpis({
      in_transit,
      delivered,
      countries,
      delayed,
      average_delivery_days,
      quality_maintained,
      total_revenue,
    });
  };

  const applyFilters = () => {
    let filtered = shipments;

    if (filters.search) {
      filtered = filtered.filter(
        (s) =>
          s.order_number.toLowerCase().includes(filters.search.toLowerCase()) ||
          s.customer_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters.country) {
      filtered = filtered.filter(
        (s) =>
          s.origin_country === filters.country ||
          s.destination_country === filters.country
      );
    }

    if (filters.transport) {
      filtered = filtered.filter((s) => s.transport_type === filters.transport);
    }

    setFilteredShipments(filtered);
  };

  const exportAnalytics = () => {
    const data = {
      date: new Date().toISOString(),
      kpis,
      shipments: filteredShipments.map((s) => ({
        order: s.order_number,
        customer: s.customer_name,
        route: `${s.origin_country} → ${s.destination_country}`,
        status: s.status,
        quality: s.quality_score,
        temperature: s.current_temperature,
        humidity: s.current_humidity,
      })),
    };

    const csv = [
      ['Commande', 'Client', 'Route', 'Statut', 'Qualité', 'Température', 'Humidité'],
      ...filteredShipments.map((s) => [
        s.order_number,
        s.customer_name,
        `${s.origin_country} → ${s.destination_country}`,
        LOGISTICS_STATUS[s.status].label,
        s.quality_score.toFixed(1),
        s.current_temperature?.toFixed(1) || 'N/A',
        s.current_humidity?.toFixed(1) || 'N/A',
      ]),
    ];

    const csvContent = csv.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logistics-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-8 h-8" />
          Logistique & Tracking
        </h1>
        <p className="text-muted-foreground mt-1">
          Suivi en temps réel des expéditions mondiales
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En transit</p>
              <p className="text-2xl font-bold text-primary">{kpis.in_transit}</p>
            </div>
            <Truck className="w-8 h-8 text-primary opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Livrées</p>
              <p className="text-2xl font-bold text-green-600">{kpis.delivered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pays desservis</p>
              <p className="text-2xl font-bold text-accent">{kpis.countries}</p>
            </div>
            <MapPin className="w-8 h-8 text-accent opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Retards</p>
              <p className="text-2xl font-bold text-red-600">{kpis.delayed}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Map */}
      {!loading && (
        <Card className="p-4 border border-border overflow-hidden">
          <div className="rounded-lg overflow-hidden">
            <LogisticsMap shipments={filteredShipments} selectedShipmentId={selectedShipment} />
          </div>
        </Card>
      )}

      {/* Filtres */}
      <Card className="p-4 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rechercher</label>
            <Input
              placeholder="Commande ou client..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Statut</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tous</option>
              {Object.entries(LOGISTICS_STATUS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transport</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              value={filters.transport}
              onChange={(e) => setFilters({ ...filters, transport: e.target.value })}
            >
              <option value="">Tous</option>
              {Object.entries(TRANSPORT_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pays</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            >
              <option value="">Tous</option>
              {Object.keys(COUNTRY_COORDS).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button onClick={exportAnalytics} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipments Table */}
      <Card className="p-4 border border-border">
        <h3 className="text-lg font-semibold mb-4">Expéditions ({filteredShipments.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 font-semibold">Commande</th>
                <th className="text-left py-2 px-4 font-semibold">Client</th>
                <th className="text-left py-2 px-4 font-semibold">Route</th>
                <th className="text-left py-2 px-4 font-semibold">Statut</th>
                <th className="text-left py-2 px-4 font-semibold">Transport</th>
                <th className="text-left py-2 px-4 font-semibold">Qualité</th>
                <th className="text-left py-2 px-4 font-semibold">Temp/Hum</th>
                <th className="text-left py-2 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.slice(0, 10).map((shipment) => (
                <tr key={shipment.id} className="border-b border-border hover:bg-accent/5">
                  <td className="py-3 px-4 font-medium">{shipment.order_number}</td>
                  <td className="py-3 px-4">{shipment.customer_name}</td>
                  <td className="py-3 px-4">
                    {shipment.origin_country} → {shipment.destination_country}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${LOGISTICS_STATUS[shipment.status].color}`}>
                      {
                        (() => {
                          const StatusIcon = LOGISTICS_STATUS[shipment.status].icon;
                          return <StatusIcon className="w-3 h-3" />;
                        })()
                      }
                      {LOGISTICS_STATUS[shipment.status].label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit ${TRANSPORT_TYPES[shipment.transport_type].color}`}>
                      {
                        (() => {
                          const TransportIcon = TRANSPORT_TYPES[shipment.transport_type].icon;
                          return <TransportIcon className="w-3 h-3" />;
                        })()
                      }
                      {TRANSPORT_TYPES[shipment.transport_type].label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${shipment.quality_score}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {shipment.quality_score.toFixed(1)}%
                    </p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <p>{shipment.current_temperature?.toFixed(1)}°C</p>
                    <p>{shipment.current_humidity?.toFixed(1)}%</p>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedShipment(selectedShipment === shipment.id ? null : shipment.id)}
                    >
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shipment Details */}
      {selectedShipment && (
        <Card className="p-6 border border-border">
          {(() => {
            const shipment = shipments.find((s) => s.id === selectedShipment);
            if (!shipment) return null;

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {shipment.order_number} - {shipment.customer_name}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedShipment(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <p className="font-semibold">{LOGISTICS_STATUS[shipment.status].label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transport</p>
                    <p className="font-semibold">{TRANSPORT_TYPES[shipment.transport_type].label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantité</p>
                    <p className="font-semibold">{shipment.quantity_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-semibold">{shipment.eta}</p>
                  </div>
                </div>

                {/* Historique du trajet */}
                <div>
                  <h4 className="font-semibold mb-2">Historique du trajet</h4>
                  <div className="space-y-2">
                    {shipment.tracking_history.map((entry, idx) => (
                      <div key={idx} className="flex gap-4 p-3 bg-accent/5 rounded">
                        <div className="text-sm font-medium text-muted-foreground min-w-20">
                          {entry.date}
                        </div>
                        <div>
                          <p className="font-semibold">{entry.location}</p>
                          <p className="text-sm text-muted-foreground">{entry.event}</p>
                          {entry.temperature && (
                            <p className="text-xs text-muted-foreground">
                              Température: {entry.temperature}°C
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alertes */}
                {shipment.alerts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Alertes</h4>
                    <div className="space-y-2">
                      {shipment.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded border ${
                            alert.severity === 'high'
                              ? 'bg-red-50 border-red-200 text-red-900'
                              : alert.severity === 'medium'
                              ? 'bg-orange-50 border-orange-200 text-orange-900'
                              : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                          }`}
                        >
                          <p className="font-semibold">{alert.message}</p>
                          <p className="text-sm">{alert.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
}
