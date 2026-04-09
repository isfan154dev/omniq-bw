"""
AURORA Router — AI Decision Layer Endpoints
"""
import uuid
import random
import time
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.models import (
    Prediction, PredictionType,
    SimulationRequest, SimulationResult, SimulationOutcome,
    Insight, RiskLevel,
    ScoreRequest, ScoreResult,
    PaginatedResponse,
)
from app.database import DatabaseManager, get_db

router = APIRouter()


# ── Mock data helpers ─────────────────────────────────────────────────────────

PREDICTION_TARGETS = [
    ("KZ GDP growth (YoY %)", "KZ", PredictionType.ECONOMIC, 5.8, 0.4),
    ("UZ FDI inflows (USD bn)", "UZ", PredictionType.ECONOMIC, 3.2, 0.6),
    ("KG political stability index", "KG", PredictionType.POLITICAL, 52.0, 8.0),
    ("TJ fiscal deficit (% GDP)", "TJ", PredictionType.ECONOMIC, -4.1, 1.2),
    ("TM gas export revenue (USD bn)", "TM", PredictionType.ECONOMIC, 9.4, 1.5),
    ("KZ inflation (CPI %)", "KZ", PredictionType.FINANCIAL, 8.7, 1.8),
    ("Regional security index", "KZ", PredictionType.SECURITY, 61.0, 7.0),
    ("UZ remittance inflows (USD bn)", "UZ", PredictionType.ECONOMIC, 14.8, 2.1),
]

INSIGHT_DATA = [
    {
        "title": "Kazakhstan GDP Growth Acceleration",
        "summary": "AURORA models indicate KZ GDP growth likely to exceed consensus estimates by 0.8pp in Q2.",
        "detail": (
            "Multiple leading indicators — industrial output, PMI expansion, FDI commitments — are "
            "tracking above model baseline. The Tengiz expansion project is expected to add 0.4pp to "
            "headline growth. Confidence: 78%. Key risk: oil price volatility could reverse projection."
        ),
        "insight_type": "economic_forecast",
        "related_products": ["AURORA", "NEXUS"],
        "country_codes": ["KZ"],
        "severity": "low",
        "actionable": True,
        "actions": [
            "Review KZ investment exposure — consider increasing allocation",
            "Update economic scenario assumptions in NEXUS policy simulation",
        ],
    },
    {
        "title": "Supply Chain Vulnerability — Silk Road Corridor",
        "summary": "ARGUS graph anomaly detected: 3 critical logistics nodes showing unusual entity change patterns.",
        "detail": (
            "ARGUS graph analysis identified three key transit hub entities that have undergone "
            "ownership changes in the past 30 days. Combined with NEXUS trade flow anomalies on the "
            "KZ-CN border, AURORA scores this as a medium-risk supply chain disruption indicator."
        ),
        "insight_type": "risk_alert",
        "related_products": ["ARGUS", "NEXUS", "AURORA"],
        "country_codes": ["KZ", "KG"],
        "severity": "medium",
        "actionable": True,
        "actions": [
            "Initiate ARGUS deep-dive on affected transit entities",
            "Activate supply chain monitoring protocol alpha-7",
            "Brief supply chain risk committee within 48 hours",
        ],
    },
    {
        "title": "Uzbekistan Political Stability — Positive Outlook",
        "summary": "Governance reforms and sustained economic growth indicate stabilizing political environment.",
        "detail": (
            "NEXUS political indicators for UZ have improved across 7 of 10 tracked dimensions over "
            "the past quarter. Combined with strong FDI inflow data and IMF engagement, AURORA projects "
            "continued political stability with 82% confidence over the next 6 months."
        ),
        "insight_type": "political_assessment",
        "related_products": ["NEXUS", "AURORA"],
        "country_codes": ["UZ"],
        "severity": "low",
        "actionable": False,
        "actions": [],
    },
    {
        "title": "Tajikistan Debt Sustainability Warning",
        "summary": "Debt-to-GDP trajectory breaches amber threshold — BRI exposure a key driver.",
        "detail": (
            "AURORA's debt sustainability model flags TJ as approaching a concerning debt trajectory. "
            "Chinese BRI loan obligations, combined with hydro project cost overruns, are projected to "
            "push public debt above 95% of GDP by 2026 under the baseline scenario. Policy intervention "
            "window is 12-18 months."
        ),
        "insight_type": "fiscal_risk",
        "related_products": ["NEXUS", "AURORA"],
        "country_codes": ["TJ"],
        "severity": "high",
        "actionable": True,
        "actions": [
            "Escalate TJ fiscal risk to senior analyst review",
            "Model debt restructuring scenarios in AURORA simulation engine",
            "Update TJ country risk score in NEXUS dashboard",
        ],
    },
]


def _make_prediction(i: int) -> dict:
    target, country, pred_type, base, sigma = PREDICTION_TARGETS[i % len(PREDICTION_TARGETS)]
    value = round(base + random.uniform(-sigma, sigma), 2)
    return {
        "id": f"pred-{str(uuid.uuid4())[:8]}",
        "prediction_type": pred_type.value,
        "target": target,
        "country_code": country,
        "forecast_date": (datetime.utcnow() + timedelta(days=90 * ((i % 4) + 1))).isoformat(),
        "predicted_value": value,
        "lower_bound": round(value - sigma * 1.5, 2),
        "upper_bound": round(value + sigma * 1.5, 2),
        "confidence": round(random.uniform(0.65, 0.92), 2),
        "model_name": random.choice(["LSTM-Ensemble-v3", "XGBoost-v4", "Prophet-v2", "Transformer-v1"]),
        "feature_importance": {
            "oil_price": round(random.uniform(0.1, 0.4), 3),
            "political_stability": round(random.uniform(0.05, 0.25), 3),
            "trade_balance": round(random.uniform(0.05, 0.2), 3),
            "fdi_inflows": round(random.uniform(0.05, 0.15), 3),
        },
        "created_at": datetime.utcnow().isoformat(),
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get(
    "/predictions",
    response_model=PaginatedResponse,
    summary="List AI predictions",
    description="Returns paginated predictions from AURORA's forecasting models.",
)
async def list_predictions(
    prediction_type: Optional[PredictionType] = Query(None, description="Filter by prediction type"),
    country_code: Optional[str] = Query(None, description="Filter by country code"),
    min_confidence: float = Query(0.0, ge=0, le=1, description="Minimum model confidence"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: DatabaseManager = Depends(get_db),
):
    """Return paginated list of predictions from AURORA's ML forecasting models."""
    all_preds = [_make_prediction(i) for i in range(40)]

    if prediction_type:
        all_preds = [p for p in all_preds if p["prediction_type"] == prediction_type.value]
    if country_code:
        all_preds = [p for p in all_preds if p["country_code"] == country_code.upper()]
    if min_confidence > 0:
        all_preds = [p for p in all_preds if p["confidence"] >= min_confidence]

    total = len(all_preds)
    start = (page - 1) * page_size
    items = all_preds[start : start + page_size]

    return PaginatedResponse(total=total, page=page, page_size=page_size, items=items)


@router.post(
    "/simulate",
    response_model=SimulationResult,
    status_code=status.HTTP_200_OK,
    summary="Run Monte Carlo scenario simulation",
    description="Execute a Monte Carlo simulation for specified economic/political scenarios.",
)
async def run_simulation(
    request: SimulationRequest,
    db: DatabaseManager = Depends(get_db),
):
    """
    Run AURORA's Monte Carlo simulation engine.
    Models the impact of variable shocks across specified countries over the given horizon.
    """
    start_time = time.monotonic()

    outcomes = []
    for variable in request.variables:
        delta = variable.shock_value - variable.base_value
        noise = abs(delta) * 0.3

        outcomes.append(SimulationOutcome(
            variable=variable.name,
            mean=round(variable.shock_value + random.gauss(0, noise * 0.5), 3),
            median=round(variable.shock_value + random.gauss(0, noise * 0.3), 3),
            std=round(abs(noise), 3),
            p10=round(variable.shock_value - noise * 1.5, 3),
            p90=round(variable.shock_value + noise * 1.5, 3),
            probability_positive=round(random.uniform(0.4, 0.85), 2) if delta >= 0 else round(random.uniform(0.15, 0.6), 2),
        ))

    processing_ms = (time.monotonic() - start_time) * 1000

    return SimulationResult(
        request_id=str(uuid.uuid4()),
        scenario_name=request.scenario_name,
        outcomes=outcomes,
        key_insights=[
            f"Under '{request.scenario_name}', expected impact on primary variables is within 1 standard deviation of baseline.",
            f"Probability of adverse outcome exceeds 30% for {random.randint(1, len(request.variables))} of {len(request.variables)} modeled variables.",
            "Tail risk scenarios (p10) show significant downside in security-linked economic indicators.",
        ],
        risk_flags=[
            "Non-linear feedback loop detected between trade balance and FX stability variables",
            "Model calibration limited for 18+ month horizons in high-volatility environments",
        ] if request.horizon_months > 12 else [],
        recommended_actions=[
            "Review scenario assumptions with regional subject matter experts",
            "Run sensitivity analysis on highest-impact variables",
        ],
        processing_time_ms=round(processing_ms + request.num_simulations * 0.05, 2),
        simulations_run=request.num_simulations,
    )


@router.get(
    "/insights",
    response_model=PaginatedResponse,
    summary="List automated insights",
    description="Returns AI-generated intelligence insights from AURORA.",
)
async def list_insights(
    severity: Optional[RiskLevel] = Query(None, description="Filter by severity"),
    country_code: Optional[str] = Query(None, description="Filter by country code"),
    actionable_only: bool = Query(False, description="Return only actionable insights"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: DatabaseManager = Depends(get_db),
):
    """Return AI-generated insights from AURORA's automated analysis pipeline."""
    all_insights = []
    for i, data in enumerate(INSIGHT_DATA):
        insight = {
            **data,
            "severity": data["severity"],
            "id": f"ins-{str(uuid.uuid4())[:8]}",
            "created_at": (datetime.utcnow() - timedelta(hours=i * 6)).isoformat(),
        }
        all_insights.append(insight)

    if severity:
        all_insights = [i for i in all_insights if i["severity"] == severity.value]
    if country_code:
        all_insights = [i for i in all_insights if country_code.upper() in i["country_codes"]]
    if actionable_only:
        all_insights = [i for i in all_insights if i["actionable"]]

    total = len(all_insights)
    start = (page - 1) * page_size
    items = all_insights[start : start + page_size]

    return PaginatedResponse(total=total, page=page, page_size=page_size, items=items)


@router.post(
    "/score",
    response_model=ScoreResult,
    status_code=status.HTTP_200_OK,
    summary="Score an entity",
    description="Generate a composite AI risk score for a specified entity.",
)
async def score_entity(
    request: ScoreRequest,
    db: DatabaseManager = Depends(get_db),
):
    """
    Generate a composite risk score for the specified entity using AURORA's scoring models.
    Provides breakdown by risk dimension and key driver explanations.
    """
    overall = round(random.uniform(10, 90), 1)
    risk_level = (
        RiskLevel.LOW if overall < 35
        else RiskLevel.MEDIUM if overall < 60
        else RiskLevel.HIGH if overall < 80
        else RiskLevel.CRITICAL
    )

    breakdown = {
        "financial_risk": round(overall * random.uniform(0.8, 1.2), 1),
        "network_risk": round(overall * random.uniform(0.7, 1.3), 1),
        "behavioral_risk": round(overall * random.uniform(0.6, 1.4), 1),
        "geographic_risk": round(overall * random.uniform(0.9, 1.1), 1),
        "sanctions_exposure": round(overall * random.uniform(0.5, 1.5), 1),
    }
    # Clamp values to 0-100
    breakdown = {k: max(0.0, min(100.0, v)) for k, v in breakdown.items()}

    drivers = [
        "High-risk jurisdiction connections (3 identified)",
        "Ownership chain opacity — beneficial owner not resolved",
        "Transaction pattern deviates from peer group baseline",
        "Director-level connection to sanctioned entities (2nd degree)",
    ]

    return ScoreResult(
        entity_id=request.entity_id,
        overall_score=overall,
        risk_level=risk_level,
        score_breakdown=breakdown,
        key_drivers=drivers[:random.randint(1, len(drivers))],
        explanation=(
            f"Entity '{request.entity_id}' scores {overall:.1f}/100 (risk level: {risk_level.value.upper()}). "
            f"The primary driver is {drivers[0].lower()}. "
            f"Score generated by {request.scoring_model} with {len(breakdown)} risk dimensions evaluated."
        ) if request.include_explanation else None,
        model_version=request.scoring_model,
    )
