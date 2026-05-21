"""
NLP Models for STTIS Chat Assistant
- Intent Classification
- Entity Extraction
- Query Understanding
- Response Generation
"""

from typing import Dict, List, Tuple
import re

class IntentClassifier:
    """Classify user query intents"""
    
    INTENTS = {
        "product_info": ["tell me about", "what is", "product", "tea type", "variety"],
        "batch_status": ["status of", "batch", "lot", "production", "where is"],
        "stock_check": ["stock level", "inventory", "available", "in stock", "quantity"],
        "quality": ["quality", "score", "assessment", "grade"],
        "sales": ["sales", "sold", "sold out", "sell", "customer"],
        "forecast": ["predict", "forecast", "expect", "coming", "future"],
        "anomaly": ["problem", "issue", "anomaly", "alert", "warning"],
        "general": ["hello", "hi", "help", "information"]
    }
    
    @classmethod
    def classify(cls, query: str) -> Tuple[str, float]:
        """
        Classify query intent
        
        Returns:
            intent, confidence_score
        """
        query_lower = query.lower()
        scores = {}
        
        for intent, keywords in cls.INTENTS.items():
            score = 0
            for keyword in keywords:
                if keyword in query_lower:
                    score += 1
            scores[intent] = score
        
        best_intent = max(scores, key=scores.get)
        confidence = min(0.95, 0.6 + (scores[best_intent] * 0.1))
        
        return best_intent, confidence

class EntityExtractor:
    """Extract entities from user queries"""
    
    # Product types
    PRODUCT_TYPES = ["green", "black", "oolong", "white", "pu'erh", "herbal"]
    
    # Warehouse locations
    WAREHOUSE_PATTERNS = r"warehouse\s+([A-Z])|zone\s+(\d+)|location\s+([A-Za-z0-9]+)"
    
    # Quantity patterns
    QUANTITY_PATTERNS = r"(\d+(?:\.\d+)?)\s*(kg|kilograms|units|tons)"
    
    # Date patterns
    DATE_PATTERNS = r"(today|tomorrow|yesterday|\d{1,2}/\d{1,2}/\d{2,4})"
    
    @classmethod
    def extract(cls, query: str) -> Dict[str, List]:
        """
        Extract entities from query
        
        Returns:
            entities dictionary with products, locations, quantities, dates
        """
        query_lower = query.lower()
        entities = {
            "products": [],
            "locations": [],
            "quantities": [],
            "dates": [],
            "batch_ids": []
        }
        
        # Extract products
        for product in cls.PRODUCT_TYPES:
            if product in query_lower:
                entities["products"].append(product)
        
        # Extract quantities
        quantity_matches = re.findall(cls.QUANTITY_PATTERNS, query_lower)
        for match in quantity_matches:
            entities["quantities"].append({
                "value": float(match[0]),
                "unit": match[1]
            })
        
        # Extract batch IDs (format: BATCH-*)
        batch_matches = re.findall(r"BATCH-([A-Z0-9]+)", query)
        entities["batch_ids"].extend(batch_matches)
        
        # Extract dates
        date_matches = re.findall(cls.DATE_PATTERNS, query_lower)
        entities["dates"].extend(date_matches)
        
        return entities

class QueryUnderstanding:
    """Understand and contextualize queries"""
    
    @staticmethod
    def get_context_filters(entities: Dict) -> Dict:
        """
        Convert entities to database query filters
        """
        filters = {}
        
        if entities.get("products"):
            filters["product_names"] = entities["products"]
        
        if entities.get("batch_ids"):
            filters["batch_numbers"] = entities["batch_ids"]
        
        if entities.get("quantities"):
            filters["quantity"] = entities["quantities"][0] if entities["quantities"] else None
        
        return filters

class ResponseGenerator:
    """Generate responses to user queries"""
    
    RESPONSE_TEMPLATES = {
        "product_info": "Based on our records, {product_name} is a {product_type} tea with origin {origin}. {details}",
        "batch_status": "Batch {batch_number} is currently {status}. Last updated: {timestamp}",
        "stock_check": "Current stock level for {product} is {quantity} kg in {location}. {alerts}",
        "quality": "The quality score for {batch_id} is {score}/10. {assessment}",
        "forecast": "We forecast {quantity} units for {period}. Confidence: {confidence}%",
        "default": "I found the following information: {content}"
    }
    
    @staticmethod
    def generate(intent: str, data: Dict = None) -> str:
        """
        Generate response based on intent and data
        """
        template = ResponseGenerator.RESPONSE_TEMPLATES.get(
            intent,
            ResponseGenerator.RESPONSE_TEMPLATES["default"]
        )
        
        if data is None:
            data = {}
        
        try:
            response = template.format(**data)
        except KeyError:
            response = "I understand your question, but I need more specific information."
        
        return response

# Model instances
intent_classifier = IntentClassifier()
entity_extractor = EntityExtractor()
query_understanding = QueryUnderstanding()
response_generator = ResponseGenerator()
