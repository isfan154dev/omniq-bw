"""
NEXUS Router — Government Intelligence Layer Endpoints
"""
import uuid
import random
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.models import (
    IntelEvent, IntelEventType, CountryRisk, RiskLevel, TrendDirection,
    AssessmentRequest, AssessmentResult,
    Country, PaginatedResponse,
)
from app.database import DatabaseManager, get_db

router = APIRouter()


# ── Static reference data ─────────────────────────────────────────────────────

CENTRAL_ASIA_COUNTRIES = [
    Country(
        code="KZ",
        name="Kazakhstan",
        region="Central Asia",
        capital="Astana",
        population=19_327_000,
        gdp_usd_billions=261.4,
        risk_score=42.0,
        active_events_count=8,
    ),
    Country(
        code="UZ",
        name="Uzbekistan",
        region="Central Asia",
        capital="Tashkent",
        population=35_890_000,
        gdp_usd_billions=90.9,
        risk_score=55.0,
        active_events_count=12,
    ),
    Country(
        code="KG",
        name="Kyrgyzstan",
        region="Central Asia",
        capital="Bishkek",
        population=6_900_000,
        gdp_usd_billions=10.8,
        risk_score=63.0,
        active_events_count=6,
    ),
    Country(
        code="TJ",
        name="Tajikistan",
        region="Central Asia",
        capital="Dushanbe",
        population=10_135_000,
        gdp_usd_billions=10.5,
        risk_score=71.0,
        active_events_count=9,
    ),
    Country(
        code="TM",
        name="Turkmenistan",
        region="Central Asia",
        capital="Ashgabat",
        population=6_053_000,
        gdp_usd_billions=59.8,
        risk_score=67.0,
        active_events_count=4,
    ),
]

COUNTRY_MAP = {c.code: c for c in CENTRAL_ASIA_COUNTRIES}


def _make_mock_events(count: int = 20) -> List[dict]:
    titles = [
        "Unusual capital outflow detected in banking sector",
        "Parliamentary session outcome diverges from forecast model",
        "New bilateral trade agreement signed — hydrocarbons sector",
        "Anomalous border crossing pattern detected",
        "Infrastructure investment surge — foreign SOE contracts",
        "Energy price shock propagation detected across region",
        "Protest activity escalation in eastern provinces",
        "Cyber incident targeting government infrastructure",
        "Sanctions circumvention pattern identified in trade flows",
        "Central bank intervention in FX markets",
        "Militant activity near southern border crossings",
        "COVID-variant outbreak — regional travel restrictions",
        "Major SOE privatization announcement",
        "IMF mission visit — balance-of-payments assessment",
        "Regional SCO summit — unexpected agenda additions",
    ]
    types = list(IntelEventType)
    severities = [RiskLevel.LOW, RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.MEDIUM, RiskLevel.HIGH]
    countries = list(COUNTRY_MAP.keys())
    sources = ["OSINT", "NBK Feed", "Customs API", "NEXUS Sensor", "MOD Liaison", "Procurement DB", "Partner Agency"]

    events = []
    for i in range(count):
        events.append({
            "id": f"evt-{str(uuid.uuid4())[:8]}",
            "timestamp": (datetime.utcnow() - timedelta(minutes=i * 12)).isoformat(),
            "country_code": countries[i % len(countries)],
            "event_type": types[i % len(types)].value,
            "severity": severities[i % len(severities)].value,
            "title": titles[i % len(titles)],
            "description": f"Automated NEXUS event — {titles[i % len(titles)].lower()}. Confidence level: {random.randint(60, 95)}%. Cross-referenced with {random.randint(2, 8)} independent sources.",
            "source": sources[i % len(sources)],
            "confidence": round(random.uniform(0.6, 0.97), 2),
            "tags": ["auto-generated", types[i % len(types)].value],
            "related_entities": [f"ent-{random.randint(1, 9999):04d}" for _ in range(random.randint(0, 3))],
        })
    return events


def _country_risk(code: str) -> dict:
    country = COUNTRY_MAP.get(code.upper())
    if not country:
        return {}
    risk = country.risk_score
    return {
        "country_code": country.code,
        "country_name": country.name,
        "overall_risk": risk,
        "political_stability": round(risk * random.uniform(0.85, 1.15), 1),
        "economic_risk": round(risk * random.uniform(0.80, 1.20), 1),
        "security_risk": round(risk * random.uniform(0.90, 1.10), 1),
        "governance_score": round(100 - risk + random.uniform(-10, 10), 1),
        "trend": random.choice([TrendDirection.UP, TrendDirection.DOWN, TrendDirection.STABLE]).value,
        "trend_change": round(random.uniform(-5, 5), 1),
        "last_updated": datetime.utcnow().isoformat(),
    }


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get(
    "/events",
    response_model=PaginatedResponse,
    summary="List intelligence events",
    description="Returns paginated intelligence events with optional filtering.",
)
async def list_events(
    country_code: Optional[str] = Query(None, description="Filter by country code"),
    event_type: Optional[IntelEventType] = Query(None, description="Filter by event type"),
    severity: Optional[RiskLevel] = Query(None, description="Filter by severity"),
    since_hours: int = Query(48, ge=1, le=8760, description="Events from last N hours"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: DatabaseManager = Depends(get_db),
):
    """
    Return paginated intelligence events from NEXUS.
    Falls back to mock data when Neo4j is not connected.
    """
    if db.is_connected:
        try:
            since_dt = datetime.utcnow() - timedelta(hours=since_hours)
            params: dict = {
                "since": since_dt.isoformat(),
                "skip": (page - 1) * page_size,
                "limit": page_size,
            }
            where = ["e.timestamp >= $since"]
            if country_code:
                where.append("e.country_code = $country_code")
                params["country_code"] = country_code.upper()
            if event_type:
                where.append("e.event_type = $event_type")
                params["event_type"] = event_type.value
            if severity:
                where.append("e.severity = $severity")
                params["severity"] = severity.value

            where_str = " AND ".join(where)
            cypher = f"MATCH (e:IntelEvent) WHERE {where_str} RETURN e ORDER BY e.timestamp DESC SKIP $skip LIMIT $limit"
            count_cypher = f"MATCH (e:IntelEvent) WHERE {where_str} RETURN count(e) AS total"

            records = await db.run_query(cypher, params)
            count_records = await db.run_query(count_cypher, params)
            total = count_records[0]["total"] if count_records else 0
            items = [r["e"] for r in records]
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc
    else:
        all_events = _make_mock_events(40)
        if country_code:
            all_events = [e for e in all_events if e["country_code"] == country_code.upper()]
        if event_type:
            all_events = [e for e in all_events if e["event_type"] == event_type.value]
        if severity:
            all_events = [e for e in all_events if e["severity"] == severity.value]
        total = len(all_events)
        start = (page - 1) * page_size
        items = all_events[start : start + page_size]

    return PaginatedResponse(total=total, page=page, page_size=page_size, items=items)


@router.get(
    "/risks",
    response_model=List[CountryRisk],
    summary="Get country risk scores",
    description="Returns current risk assessments for all Central Asian countries.",
)
async def get_risks(
    country_codes: Optional[str] = Query(None, description="Comma-separated country codes to filter"),
    db: DatabaseManager = Depends(get_db),
):
    """Return risk assessment scores for Central Asian countries."""
    codes = COUNTRY_MAP.keys()
    if country_codes:
        codes = [c.strip().upper() for c in country_codes.split(",") if c.strip().upper() in COUNTRY_MAP]

    results = []
    for code in codes:
        risk_data = _country_risk(code)
        if risk_data:
            results.append(CountryRisk(**risk_data))

    if not results:
        raise HTTPException(status_code=404, detail="No matching countries found.")

    return results


@router.post(
    "/assess",
    response_model=AssessmentResult,
    status_code=status.HTTP_200_OK,
    summary="Run intelligence assessment",
    description="Execute a comprehensive intelligence assessment for specified countries.",
)
async def run_assessment(
    request: AssessmentRequest,
    db: DatabaseManager = Depends(get_db),
):
    """
    Run a full intelligence assessment for the specified countries and time horizon.
    Produces country-level risk scores, key risk factors, and recommended actions.
    """
    valid_codes = [c.upper() for c in request.country_codes if c.upper() in COUNTRY_MAP]
    if not valid_codes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No valid country codes provided. Supported: {list(COUNTRY_MAP.keys())}",
        )

    assessments = [CountryRisk(**_country_risk(code)) for code in valid_codes]
    regional_risk = round(sum(a.overall_risk for a in assessments) / len(assessments), 1)

    return AssessmentResult(
        request_id=str(uuid.uuid4()),
        country_assessments=assessments,
        regional_risk_index=regional_risk,
        key_risk_factors=[
            "Elevated political transition risk in Kyrgyzstan and Tajikistan",
            "Hydrocarbon price sensitivity across Kazakhstan and Turkmenistan",
            "Chinese BRI debt exposure creating balance-of-payments pressure in Tajikistan",
            "Water resource competition intensifying between Uzbekistan and Kyrgyzstan",
            "Cross-border narcotics flows correlating with security incidents",
        ][:3],
        recommended_actions=[
            "Increase monitoring cadence on KG and TJ political indicators to weekly",
            "Activate supply chain contingency protocols for hydrocarbons-dependent operations",
            "Review cross-border compliance frameworks for trade operations in UZ",
        ],
        confidence=round(random.uniform(0.72, 0.91), 2),
        valid_until=datetime.utcnow() + timedelta(days=request.time_horizon_days),
    )


@router.get(
    "/countries",
    response_model=List[Country],
    summary="List covered countries",
    description="Returns the list of countries covered by the NEXUS intelligence layer.",
)
async def list_countries(
    db: DatabaseManager = Depends(get_db),
):
    """Return all countries in the NEXUS coverage area."""
    return CENTRAL_ASIA_COUNTRIES
