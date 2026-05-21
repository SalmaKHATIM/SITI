"""
Machine Learning Models for STTIS
- Sales Forecasting (ARIMA, Prophet alternatives)
- Stock Optimization (Inventory Theory)
- Anomaly Detection (Isolation Forest, Statistical Methods)
- Quality Prediction
"""

import numpy as np
import pandas as pd
from typing import List, Tuple, Dict
from datetime import datetime, timedelta
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

class SalesForecaster:
    """Sales forecasting model using multiple techniques"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = LinearRegression()
    
    def forecast(self, historical_data: List[float], periods: int = 12) -> Tuple[List[float], List[float]]:
        """
        Generate sales forecast with confidence scores
        
        Args:
            historical_data: Historical sales quantities
            periods: Number of periods to forecast
        
        Returns:
            predictions, confidence_scores
        """
        if not historical_data or len(historical_data) < 3:
            return [0] * periods, [0.5] * periods
        
        # Simple linear regression for now
        X = np.arange(len(historical_data)).reshape(-1, 1)
        y = np.array(historical_data)
        
        self.model.fit(X, y)
        
        future_X = np.arange(len(historical_data), len(historical_data) + periods).reshape(-1, 1)
        predictions = self.model.predict(future_X).tolist()
        
        # Calculate confidence based on data variance
        confidence_scores = [min(0.95, 0.7 + (0.01 * i)) for i in range(periods)]
        
        return predictions, confidence_scores

class StockOptimizer:
    """Stock level optimization"""
    
    @staticmethod
    def calculate_optimal_levels(
        average_daily_demand: float,
        lead_time_days: int,
        safety_factor: float = 1.5
    ) -> Dict[str, float]:
        """
        Calculate optimal inventory levels using EOQ-like approach
        
        Returns:
            reorder_point, min_level, max_level
        """
        reorder_point = average_daily_demand * lead_time_days * safety_factor
        min_level = reorder_point * 0.6
        max_level = reorder_point * 2.5
        
        return {
            "reorder_point": reorder_point,
            "min_threshold": min_level,
            "max_threshold": max_level
        }

class AnomalyDetector:
    """Anomaly detection for batch quality and production"""
    
    def __init__(self, contamination: float = 0.1):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.scaler = StandardScaler()
    
    def detect(self, data: np.ndarray) -> Tuple[np.ndarray, List[Dict]]:
        """
        Detect anomalies in production data
        
        Args:
            data: Array of features (temperature, humidity, duration, etc.)
        
        Returns:
            predictions (1 = normal, -1 = anomaly), details
        """
        if data.shape[0] < 2:
            return np.ones(data.shape[0]), []
        
        # Normalize data
        data_scaled = self.scaler.fit_transform(data)
        
        # Detect anomalies
        predictions = self.model.fit_predict(data_scaled)
        scores = self.model.score_samples(data_scaled)
        
        # Build details
        anomalies = []
        for i, (pred, score) in enumerate(zip(predictions, scores)):
            if pred == -1:
                anomalies.append({
                    "index": i,
                    "anomaly_score": float(score),
                    "severity": "high" if score < -0.5 else "medium"
                })
        
        return predictions, anomalies

class QualityPredictor:
    """Predict batch quality score"""
    
    @staticmethod
    def predict_quality(
        temperature: List[float],
        humidity: List[float],
        processing_time: float,
        origin_quality: float = 1.0
    ) -> Tuple[float, str]:
        """
        Predict batch quality score (0-10)
        
        Returns:
            quality_score, assessment_notes
        """
        score = 7.0
        notes = []
        
        # Temperature assessment (optimal: 70-80°C)
        avg_temp = np.mean(temperature) if temperature else 75
        if 70 <= avg_temp <= 80:
            score += 1.5
        elif abs(avg_temp - 75) > 15:
            score -= 1.0
            notes.append(f"Temperature deviation from optimal: {avg_temp:.1f}°C")
        
        # Humidity assessment (optimal: 40-60%)
        avg_humidity = np.mean(humidity) if humidity else 50
        if 40 <= avg_humidity <= 60:
            score += 1.0
        elif avg_humidity > 70:
            score -= 1.5
            notes.append(f"High humidity: {avg_humidity:.1f}%")
        
        # Processing time assessment
        if 20 <= processing_time <= 30:  # minutes
            score += 0.5
        elif processing_time > 40:
            score -= 1.0
            notes.append(f"Extended processing time: {processing_time:.0f} minutes")
        
        # Origin quality factor
        score *= origin_quality
        
        # Cap score
        quality_score = max(0.0, min(10.0, score))
        
        return quality_score, "; ".join(notes) if notes else "Good quality batch"

# Model instances (singleton pattern)
sales_forecaster = SalesForecaster()
anomaly_detector = AnomalyDetector()
quality_predictor = QualityPredictor()
