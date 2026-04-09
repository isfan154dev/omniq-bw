"""
OMNIQ Platform — Pydantic Data Models
All request/response schemas for ARGUS, NEXUS, AURORA, and Auth.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, EmailStr


# ═════════════════════════════════════════════════════════════════════════════
# SHARED / BASE
# ═════════════════════════════════════════════════════════════════════════════

class EntityType(str, Enum):
    ORGANIZATION = "organization"
    PERSON = "person"
    ASSET = "asset"
    ACCOUNT = "account"
    VESSEL = "vessel"
    PROPERTY = "property"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TrendDirection(str, Enum):
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


class PaginatedResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[Any]


# ═════════════════════════════════════════════════════════════════════════════
# ARGUS — GRAPH ANALYTICS MODELS
# ═════════════════════════════════════════════════════════════════════════════

class EntityBase(BaseModel):
    name: str = Field(..., description="Entity display name", min_length=1, max_length=512)
    entity_type: EntityType
    country: Optional[str] = Field(None, description="ISO-3166-1 alpha-2 country code")
    labels: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EntityCreate(EntityBase):
    pass


class Entity(EntityBase):
    id: str = Field(..., description="Unique entity identifier")
    risk_score: float = Field(0.0, ge=0.0, le=100.0, description="Composite risk score 0-100")
    connection_count: int = Field(0, ge=0)
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GraphNode(BaseModel):
    id: str
    label: str
    entity_type: EntityType
    risk_score: float = Field(0.0, ge=0.0, le=100.0)
    x: Optional[float] = None
    y: Optional[float] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    id: str
    source: str = Field(..., description="Source node ID")
    target: str = Field(..., description="Target node ID")
    relationship_type: str
    weight: float = Field(1.0, ge=0.0)
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    node_count: int
    edge_count: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class AnalysisRequest(BaseModel):
    entity_ids: List[str] = Field(..., min_length=1, max_length=100)
    depth: int = Field(2, ge=1, le=10, description="Relationship traversal depth")
    include_risk_scoring: bool = True
    include_centrality: bool = False
    filters: Dict[str, Any] = Field(default_factory=dict)


class AnalysisResult(BaseModel):
    request_id: str
    entity_count: int
    relationship_count: int
    clusters_detected: int
    high_risk_entities: List[str]
    centrality_scores: Optional[Dict[str, float]] = None
    graph: GraphResponse
    processing_time_ms: float
    completed_at: datetime = Field(default_factory=datetime.utcnow)


class ArgusStats(BaseModel):
    total_entities: int
    total_relationships: int
    entity_type_breakdown: Dict[str, int]
    avg_risk_score: float
    high_risk_count: int
    recent_anomalies: int
    graph_density: float
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ═════════════════════════════════════════════════════════════════════════════
# NEXUS — GOVERNMENT INTELLIGENCE MODELS
# ═════════════════════════════════════════════════════════════════════════════

class IntelEventType(str, Enum):
    POLITICAL = "political"
    ECONOMIC = "economic"
    SECURITY = "security"
    TRADE = "trade"
    ENVIRONMENTAL = "environmental"
    SOCIAL = "social"
    TECHNOLOGICAL = "technological"


class IntelEvent(BaseModel):
    id: str
    timestamp: datetime
    country_code: str = Field(..., description="ISO-3166-1 alpha-2")
    event_type: IntelEventType
    severity: RiskLevel
    title: str
    description: str
    source: str
    confidence: float = Field(..., ge=0.0, le=1.0, description="Source confidence 0.0-1.0")
    tags: List[str] = Field(default_factory=list)
    related_entities: List[str] = Field(default_factory=list)


class CountryRisk(BaseModel):
    country_code: str
    country_name: str
    overall_risk: float = Field(..., ge=0.0, le=100.0)
    political_stability: float = Field(..., ge=0.0, le=100.0)
    economic_risk: float = Field(..., ge=0.0, le=100.0)
    security_risk: float = Field(..., ge=0.0, le=100.0)
    governance_score: float = Field(..., ge=0.0, le=100.0)
    trend: TrendDirection
    trend_change: float = Field(0.0, description="Risk change vs previous period")
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class AssessmentRequest(BaseModel):
    country_codes: List[str] = Field(..., min_length=1, max_length=10)
    assessment_type: str = Field("comprehensive", description="comprehensive|political|economic|security")
    time_horizon_days: int = Field(90, ge=7, le=730)
    include_scenarios: bool = False


class AssessmentResult(BaseModel):
    request_id: str
    country_assessments: List[CountryRisk]
    regional_risk_index: float = Field(..., ge=0.0, le=100.0)
    key_risk_factors: List[str]
    recommended_actions: List[str]
    confidence: float = Field(..., ge=0.0, le=1.0)
    valid_until: datetime
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class Country(BaseModel):
    code: str = Field(..., description="ISO-3166-1 alpha-2")
    name: str
    region: str
    capital: str
    population: int
    gdp_usd_billions: float
    risk_score: float = Field(..., ge=0.0, le=100.0)
    active_events_count: int = 0


# ═════════════════════════════════════════════════════════════════════════════
# AURORA — AI DECISION MODELS
# ═════════════════════════════════════════════════════════════════════════════

class PredictionType(str, Enum):
    ECONOMIC = "economic"
    POLITICAL = "political"
    SECURITY = "security"
    FINANCIAL = "financial"
    DEMOGRAPHIC = "demographic"


class Prediction(BaseModel):
    id: str
    prediction_type: PredictionType
    target: str = Field(..., description="What is being predicted")
    country_code: str
    forecast_date: datetime
    predicted_value: float
    lower_bound: float
    upper_bound: float
    confidence: float = Field(..., ge=0.0, le=1.0)
    model_name: str
    feature_importance: Dict[str, float] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SimulationVariable(BaseModel):
    name: str
    base_value: float
    shock_value: float
    unit: str = ""


class SimulationRequest(BaseModel):
    scenario_name: str = Field(..., min_length=3, max_length=200)
    country_codes: List[str] = Field(..., min_length=1, max_length=5)
    variables: List[SimulationVariable] = Field(..., min_length=1, max_length=20)
    horizon_months: int = Field(12, ge=1, le=60)
    num_simulations: int = Field(1000, ge=100, le=10000)


class SimulationOutcome(BaseModel):
    variable: str
    mean: float
    median: float
    std: float
    p10: float
    p90: float
    probability_positive: float = Field(..., ge=0.0, le=1.0)


class SimulationResult(BaseModel):
    request_id: str
    scenario_name: str
    outcomes: List[SimulationOutcome]
    key_insights: List[str]
    risk_flags: List[str]
    recommended_actions: List[str]
    processing_time_ms: float
    simulations_run: int
    completed_at: datetime = Field(default_factory=datetime.utcnow)


class Insight(BaseModel):
    id: str
    title: str
    summary: str
    detail: str
    insight_type: str
    related_products: List[str]
    country_codes: List[str]
    severity: RiskLevel
    actionable: bool
    actions: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScoreRequest(BaseModel):
    entity_id: str
    scoring_model: str = Field("composite_v3", description="Model identifier")
    include_explanation: bool = True
    include_breakdown: bool = True


class ScoreResult(BaseModel):
    entity_id: str
    overall_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: RiskLevel
    score_breakdown: Dict[str, float]
    key_drivers: List[str]
    explanation: Optional[str] = None
    model_version: str
    scored_at: datetime = Field(default_factory=datetime.utcnow)


# ═════════════════════════════════════════════════════════════════════════════
# AUTH MODELS
# ═════════════════════════════════════════════════════════════════════════════

class UserRole(str, Enum):
    ANALYST = "analyst"
    MANAGER = "manager"
    ADMIN = "admin"
    GOV_USER = "gov_user"
    API_CLIENT = "api_client"


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Seconds until access token expiry")


class RefreshRequest(BaseModel):
    refresh_token: str


class UserProfile(BaseModel):
    id: str
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: UserRole
    organization: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    product_access: List[str] = Field(default_factory=list, description="List of accessible products: argus, nexus, aurora")
    last_login: Optional[datetime] = None
    created_at: datetime
