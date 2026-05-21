/**
 * API Client for STTIS FastAPI Backend
 * Handles all communication with ML/AI services
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

/**
 * Sales Forecast Response
 */
export interface SalesForecast {
  product_id: string;
  predictions: Array<{
    month: number;
    predicted_quantity: number;
  }>;
  confidence_scores: number[];
  recommendations: string;
}

/**
 * Stock Optimization Response
 */
export interface StockOptimization {
  product_id: string;
  recommended_min: number;
  recommended_max: number;
  suggested_reorder_point: number;
  confidence: number;
}

/**
 * Anomaly Detection Response
 */
export interface AnomalyDetectionResult {
  anomalies_detected: number;
  details: Array<{
    batch_id: string;
    anomaly_type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

/**
 * NLP Query Response
 */
export interface NLPQueryResult {
  response: string;
  intent: string;
  entities: {
    products?: string[];
    batches?: string[];
    quantities?: Array<{ value: number; unit: string }>;
    dates?: string[];
  };
}

/**
 * Quality Assessment Response
 */
export interface QualityAssessment {
  quality_score: number;
  assessment: string;
  issues: string[];
}

/**
 * Recommendation Response
 */
export interface Recommendation {
  type: 'stock' | 'sales' | 'quality' | 'anomaly';
  priority: 'low' | 'medium' | 'high';
  message: string;
  actionable: boolean;
}

class STTISApiClient {
  private baseUrl: string;
  private timeout: number = 30000;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        return {
          status: 'error',
          error: `API error: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        status: 'success',
        data,
      };
    } catch (error) {
      console.error('[STTIS] API Error:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Generate sales forecast for a product
   */
  async forecastSales(
    productId: string,
    monthsAhead: number = 12
  ): Promise<SalesForecast | null> {
    const response = await this.fetch<SalesForecast>('/forecast/sales', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        months_ahead: monthsAhead,
      }),
    });

    return response.status === 'success' ? response.data || null : null;
  }

  /**
   * Forecast short-term demand
   */
  async forecastDemand(
    productId: string,
    daysAhead: number = 30
  ): Promise<any> {
    const response = await this.fetch('/forecast/demand', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        days_ahead: daysAhead,
      }),
    });

    return response.status === 'success' ? response.data : null;
  }

  /**
   * Get stock optimization recommendations
   */
  async optimizeStock(productId: string): Promise<StockOptimization | null> {
    const response = await this.fetch<StockOptimization>('/stock/optimize', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });

    return response.status === 'success' ? response.data || null : null;
  }

  /**
   * Get stock alerts
   */
  async getStockAlerts(): Promise<any[]> {
    const response = await this.fetch('/stock/alerts', {
      method: 'GET',
    });

    return response.status === 'success' && response.data?.alerts ? response.data.alerts : [];
  }

  /**
   * Detect anomalies in batch data
   */
  async detectAnomalies(
    batchId?: string,
    productId?: string
  ): Promise<AnomalyDetectionResult | null> {
    const response = await this.fetch<AnomalyDetectionResult>(
      '/anomalies/detect',
      {
        method: 'POST',
        body: JSON.stringify({
          batch_id: batchId,
          product_id: productId,
        }),
      }
    );

    return response.status === 'success' ? response.data || null : null;
  }

  /**
   * Get active anomalies
   */
  async getActiveAnomalies(limit: number = 20): Promise<any[]> {
    const response = await this.fetch('/anomalies/active', {
      method: 'GET',
    });

    return response.status === 'success' && response.data?.anomalies ? response.data.anomalies : [];
  }

  /**
   * Process natural language query
   */
  async processQuery(query: string, userId: string): Promise<NLPQueryResult | null> {
    const response = await this.fetch<NLPQueryResult>('/nlp/query', {
      method: 'POST',
      body: JSON.stringify({
        query,
        user_id: userId,
      }),
    });

    return response.status === 'success' ? response.data || null : null;
  }

  /**
   * Detect intent from query
   */
  async detectIntent(query: string): Promise<{ intent: string; confidence: number }> {
    const response = await this.fetch('/nlp/intent-detection', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    return response.status === 'success'
      ? response.data
      : { intent: 'unknown', confidence: 0 };
  }

  /**
   * Extract entities from query
   */
  async extractEntities(query: string): Promise<any> {
    const response = await this.fetch('/nlp/entity-extraction', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    return response.status === 'success' ? response.data : {};
  }

  /**
   * Assess batch quality
   */
  async assessQuality(batchId: string): Promise<QualityAssessment | null> {
    const response = await this.fetch<QualityAssessment>(
      '/quality/assess',
      {
        method: 'POST',
        body: JSON.stringify({ batch_id: batchId }),
      }
    );

    return response.status === 'success' ? response.data || null : null;
  }

  /**
   * Get batch traceability
   */
  async getBatchTraceability(batchId: string): Promise<any> {
    const response = await this.fetch(`/traceability/batch/${batchId}`, {
      method: 'GET',
    });

    return response.status === 'success' ? response.data : null;
  }

  /**
   * Get recommendations
   */
  async getRecommendations(
    userId: string,
    limit: number = 5
  ): Promise<Recommendation[]> {
    const response = await this.fetch<Recommendation[]>('/recommendations', {
      method: 'GET',
    });

    return response.status === 'success' && response.data ? response.data : [];
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    const response = await this.fetch('/health', {
      method: 'GET',
    });

    return response.status === 'success';
  }
}

// Export singleton instance
export const apiClient = new STTISApiClient();

/**
 * Hook-friendly async function for React components
 */
export async function fetchSalesForecast(productId: string): Promise<SalesForecast | null> {
  return apiClient.forecastSales(productId);
}

export async function fetchStockOptimization(productId: string): Promise<StockOptimization | null> {
  return apiClient.optimizeStock(productId);
}

export async function fetchAnomalies(): Promise<any[]> {
  return apiClient.getActiveAnomalies();
}

export async function sendNLPQuery(query: string, userId: string): Promise<NLPQueryResult | null> {
  return apiClient.processQuery(query, userId);
}
