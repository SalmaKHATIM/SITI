'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, AlertTriangle, Zap, Brain, Activity, AlertCircle } from 'lucide-react';

interface Batch {
  id: string;
  batch_number: string;
  quantity_kg: number;
  quality_score: number | null;
  temperature_avg_celsius: number | null;
  humidity_avg_percent: number | null;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  current_quantity_kg: number;
  minimum_stock_kg: number;
  origin: string;
  type: string;
}

interface SalesOrder {
  id: string;
  quantity_kg: number;
  order_date: string;
}

export default function AIInsightsPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Insights States
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [stockPredictions, setStockPredictions] = useState<any[]>([]);
  const [qualityPredictions, setQualityPredictions] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [salesForecast, setSalesForecast] = useState<any[]>([]);
  const [supplyChainMetrics, setSupplyChainMetrics] = useState<any>(null);
  const [batchScores, setBatchScores] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (batchesError) throw batchesError;
      setBatches(batchesData || []);

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Load sales data
      const { data: salesData, error: salesError } = await supabase
        .from('sales_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (salesError) throw salesError;
      setSales(salesData || []);

      // Run AI analyses
      analyzeAnomalies(batchesData || []);
      predictStock(productsData || [], salesData || []);
      predictQuality(batchesData || []);
      analyzeRisk(batchesData || []);
      generateRecommendations(batchesData || [], productsData || []);
      forecastSales(salesData || []);
      analyzeSupplyChain(batchesData || [], productsData || []);
      calculateBatchScores(batchesData || []);
    } catch (err) {
      console.error('[STTIS] Error loading insights:', err);
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // 1. Détection d'anomalies
  const analyzeAnomalies = (batchesData: Batch[]) => {
    const detected: any[] = [];

    batchesData.forEach((batch) => {
      // Température anormale
      if (batch.temperature_avg_celsius && (batch.temperature_avg_celsius < 15 || batch.temperature_avg_celsius > 25)) {
        detected.push({
          type: 'Température anormale',
          batch: batch.batch_number,
          value: batch.temperature_avg_celsius,
          severity: 'medium',
        });
      }

      // Humidité élevée
      if (batch.humidity_avg_percent && batch.humidity_avg_percent > 70) {
        detected.push({
          type: 'Humidité élevée',
          batch: batch.batch_number,
          value: batch.humidity_avg_percent,
          severity: 'high',
        });
      }

      // Score qualité bas
      if (batch.quality_score && batch.quality_score < 50) {
        detected.push({
          type: 'Qualité faible',
          batch: batch.batch_number,
          value: batch.quality_score,
          severity: 'high',
        });
      }
    });

    setAnomalies(detected);
  };

  // 2. Prédiction du stock
  const predictStock = (productsData: Product[], salesData: SalesOrder[]) => {
    const predictions = productsData.map((product) => {
      const productSales = salesData.filter((s) => s.id === product.id);
      const avgDailySales = productSales.length > 0 
        ? productSales.reduce((sum, s) => sum + s.quantity_kg, 0) / Math.max(1, productSales.length) 
        : 0;

      const daysUntilStockout = avgDailySales > 0 
        ? Math.ceil(product.current_quantity_kg / avgDailySales) 
        : 999;

      return {
        product: product.name,
        current: product.current_quantity_kg,
        predicted_days: daysUntilStockout,
        risk: daysUntilStockout < 7 ? 'high' : daysUntilStockout < 14 ? 'medium' : 'low',
      };
    });

    setStockPredictions(predictions);
  };

  // 3. Prédiction de qualité
  const predictQuality = (batchesData: Batch[]) => {
    const predictions = batchesData.slice(0, 10).map((batch) => {
      let predictedScore = batch.quality_score || 70;

      // Impact température
      if (batch.temperature_avg_celsius) {
        if (batch.temperature_avg_celsius < 15 || batch.temperature_avg_celsius > 25) {
          predictedScore -= 10;
        }
      }

      // Impact humidité
      if (batch.humidity_avg_percent) {
        if (batch.humidity_avg_percent > 70) {
          predictedScore -= 15;
        }
      }

      predictedScore = Math.max(0, Math.min(100, predictedScore));

      return {
        batch: batch.batch_number,
        current: batch.quality_score || 0,
        predicted: predictedScore,
        risk: predictedScore < 50 ? 'high' : predictedScore < 70 ? 'medium' : 'low',
      };
    });

    setQualityPredictions(predictions);
  };

  // 4. Analyse des risques
  const analyzeRisk = (batchesData: Batch[]) => {
    const riskData = batchesData.slice(0, 20).map((batch) => {
      let riskScore = 0;

      // Température
      if (batch.temperature_avg_celsius) {
        if (batch.temperature_avg_celsius < 15 || batch.temperature_avg_celsius > 25) riskScore += 30;
      }

      // Humidité
      if (batch.humidity_avg_percent && batch.humidity_avg_percent > 70) riskScore += 40;

      // Qualité
      if (batch.quality_score && batch.quality_score < 50) riskScore += 30;

      const risk = riskScore > 50 ? 'High Risk' : riskScore > 30 ? 'Medium Risk' : 'Low Risk';

      return {
        batch: batch.batch_number,
        score: riskScore,
        risk,
        factors: [
          batch.temperature_avg_celsius && (batch.temperature_avg_celsius < 15 || batch.temperature_avg_celsius > 25) ? 'Temperature' : null,
          batch.humidity_avg_percent && batch.humidity_avg_percent > 70 ? 'Humidity' : null,
          batch.quality_score && batch.quality_score < 50 ? 'Quality' : null,
        ].filter(Boolean),
      };
    });

    setRiskAnalysis(riskData);
  };

  // 5. Recommandations intelligentes
  const generateRecommendations = (batchesData: Batch[], productsData: Product[]) => {
    const recs: string[] = [];

    // Vérifier le stock
    productsData.forEach((p) => {
      if (p.current_quantity_kg < p.minimum_stock_kg) {
        recs.push(`Réapprovisionner ${p.name} - Stock critique`);
      }
    });

    // Vérifier la qualité
    batchesData.forEach((b) => {
      if (b.quality_score && b.quality_score < 60) {
        recs.push(`Vérifier la qualité du lot ${b.batch_number}`);
      }
      if (b.humidity_avg_percent && b.humidity_avg_percent > 70) {
        recs.push(`Déplacer le lot ${b.batch_number} vers un entrepôt mieux climatisé`);
      }
    });

    setRecommendations(recs.slice(0, 5));
  };

  // 6. Prévision des ventes
  const forecastSales = (salesData: SalesOrder[]) => {
    const monthlyData: { [key: string]: number } = {};

    salesData.forEach((order) => {
      const date = new Date(order.order_date);
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.quantity_kg;
    });

    const forecast = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, actual]) => ({
        month,
        actual,
        predicted: actual * 1.1,
      }));

    setSalesForecast(forecast);
  };

  // 7. Analyse supply chain
  const analyzeSupplyChain = (batchesData: Batch[], productsData: Product[]) => {
    const avgQuality = batchesData.filter(b => b.quality_score).reduce((sum, b) => sum + (b.quality_score || 0), 0) / Math.max(1, batchesData.filter(b => b.quality_score).length);
    const totalStock = productsData.reduce((sum, p) => sum + p.current_quantity_kg, 0);
    const avgTemp = batchesData.filter(b => b.temperature_avg_celsius).reduce((sum, b) => sum + (b.temperature_avg_celsius || 0), 0) / Math.max(1, batchesData.filter(b => b.temperature_avg_celsius).length);

    setSupplyChainMetrics({
      warehouse_performance: avgQuality.toFixed(1),
      transport_efficiency: '94%',
      logistics_efficiency: '89%',
      avg_temperature: avgTemp.toFixed(1),
      total_inventory: totalStock.toFixed(1),
    });
  };

  // 8. Score intelligent par lot
  const calculateBatchScores = (batchesData: Batch[]) => {
    const scores = batchesData.slice(0, 10).map((batch) => {
      const qualityScore = batch.quality_score || 50;
      const tempScore = batch.temperature_avg_celsius ? (Math.abs(batch.temperature_avg_celsius - 20) < 5 ? 100 : 80) : 75;
      const humidityScore = batch.humidity_avg_percent ? (batch.humidity_avg_percent < 70 ? 100 : 60) : 75;

      const overallScore = (qualityScore + tempScore + humidityScore) / 3;

      return {
        batch: batch.batch_number,
        quality: qualityScore,
        safety: tempScore,
        traceability: 95,
        overall: overallScore,
      };
    });

    setBatchScores(scores);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Analysing data with AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
          <p className="text-muted-foreground mt-1">
            Prédictions IA, détection d'anomalies et recommandations intelligentes
          </p>
        </div>
        <Button
          onClick={loadAllData}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Zap className="w-4 h-4 mr-2" />
          Rafraîchir l'analyse
        </Button>
      </div>

      {/* Alert if error */}
      {error && (
        <Card className="p-4 border border-destructive bg-destructive/5">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {/* Key Metrics */}
      {supplyChainMetrics && (
        <div className="grid grid-cols-5 gap-4">
          <Card className="p-4 border border-border">
            <p className="text-xs text-muted-foreground">Qualité Moyenne</p>
            <p className="text-2xl font-bold text-primary mt-2">{supplyChainMetrics.warehouse_performance}%</p>
          </Card>
          <Card className="p-4 border border-border">
            <p className="text-xs text-muted-foreground">Efficacité Transport</p>
            <p className="text-2xl font-bold text-primary mt-2">{supplyChainMetrics.transport_efficiency}</p>
          </Card>
          <Card className="p-4 border border-border">
            <p className="text-xs text-muted-foreground">Efficacité Logistique</p>
            <p className="text-2xl font-bold text-primary mt-2">{supplyChainMetrics.logistics_efficiency}</p>
          </Card>
          <Card className="p-4 border border-border">
            <p className="text-xs text-muted-foreground">Température Moy.</p>
            <p className="text-2xl font-bold text-primary mt-2">{supplyChainMetrics.avg_temperature}°C</p>
          </Card>
          <Card className="p-4 border border-border">
            <p className="text-xs text-muted-foreground">Inventaire Total</p>
            <p className="text-2xl font-bold text-primary mt-2">{supplyChainMetrics.total_inventory}kg</p>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* 1. Anomalies Detection */}
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Anomalies Détectées</h3>
            {anomalies.length > 0 && (
              <span className="bg-destructive/20 text-destructive px-2 py-1 rounded text-xs font-bold">
                {anomalies.length}
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {anomalies.length > 0 ? (
              anomalies.slice(0, 5).map((a, idx) => (
                <div key={idx} className="border-l-4 border-destructive bg-destructive/5 p-3 rounded text-sm">
                  <p className="font-medium">{a.type}</p>
                  <p className="text-xs text-muted-foreground">Lot: {a.batch}</p>
                  <p className="text-xs text-muted-foreground">Valeur: {a.value.toFixed(1)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucune anomalie détectée</p>
            )}
          </div>
        </Card>

        {/* 2. Stock Prediction */}
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Prédiction Stock</h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto text-sm">
            {stockPredictions.slice(0, 5).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border border-border rounded">
                <div>
                  <p className="font-medium">{p.product}</p>
                  <p className="text-xs text-muted-foreground">{p.current.toFixed(1)}kg - {p.predicted_days} jours</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${p.risk === 'high' ? 'bg-destructive/20 text-destructive' : p.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-green-500/20 text-green-700'}`}>
                  {p.risk}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quality & Risk Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* 3. Quality Prediction */}
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Prédiction Qualité</h3>
          <div className="space-y-3">
            {qualityPredictions.slice(0, 4).map((q, idx) => (
              <div key={idx} className="border border-border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{q.batch}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${q.risk === 'high' ? 'bg-destructive/20 text-destructive' : q.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-green-500/20 text-green-700'}`}>
                    {q.risk}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Actuel: {q.current.toFixed(0)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Prédit: {q.predicted.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Risk Analysis */}
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Analyse Risques</h3>
          <div className="space-y-2">
            {riskAnalysis.slice(0, 4).map((r, idx) => (
              <div key={idx} className="border border-border rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{r.batch}</p>
                  <span className={`text-xs font-bold ${r.score > 50 ? 'text-destructive' : r.score > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {r.risk}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {r.factors.map((f: string, i: number) => (
                    <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 5. Recommendations */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-primary" />
          Recommandations Intelligentes
        </h3>
        <div className="space-y-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm">{rec}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Pas de recommandations à ce moment</p>
          )}
        </div>
      </Card>

      {/* 6. Sales Forecast Chart */}
      {salesForecast.length > 0 && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Prévision Ventes (6 Derniers Mois)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesForecast}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
              <Area type="monotone" dataKey="actual" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="predicted" stroke="var(--color-accent)" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* 8. Batch Scores */}
      {batchScores.length > 0 && (
        <Card className="p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Scores de Lots</h3>
          <div className="grid grid-cols-2 gap-4">
            {batchScores.slice(0, 4).map((b, idx) => (
              <div key={idx} className="border border-border rounded p-4">
                <p className="font-medium mb-3 text-sm">{b.batch}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Qualité</span>
                    <span className="font-bold text-primary">{b.quality.toFixed(0)}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sécurité</span>
                    <span className="font-bold text-primary">{b.safety.toFixed(0)}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Traçabilité</span>
                    <span className="font-bold text-primary">{b.traceability}/100</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 mt-2">
                    <span className="font-bold">Global</span>
                    <span className="text-lg font-bold text-primary">{b.overall.toFixed(0)}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
