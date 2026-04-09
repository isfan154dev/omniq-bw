"""
ARGUS Router — Real Neo4j Graph Analytics
Работает с реальными данными Company из AuraDB
"""
from fastapi import APIRouter, HTTPException
from app.database import get_db, DatabaseManager
from fastapi import Depends

router = APIRouter()

# ── Вспомогательная функция цвета по риску ────────────────────────────────────
def risk_color(score: int) -> str:
    if score >= 70: return "#ff2d55"   # красный
    if score >= 40: return "#ff9500"   # оранжевый
    if score >= 20: return "#ffcc00"   # жёлтый
    return "#00d4ff"                    # синий (норма)

def risk_level(score: int) -> str:
    if score >= 70: return "КРИТИЧНЫЙ"
    if score >= 40: return "ВЫСОКИЙ"
    if score >= 20: return "СРЕДНИЙ"
    return "НИЗКИЙ"

# ── GET /api/argus/graph ──────────────────────────────────────────────────────
@router.get("/graph")
async def get_graph(db: DatabaseManager = Depends(get_db)):
    """Возвращает граф компаний из Neo4j для визуализации."""
    if not db.is_connected:
        raise HTTPException(status_code=503, detail="Neo4j not connected")
    
    try:
        # Получаем все компании
        companies = await db.run_query(
            "MATCH (c:Company) RETURN c ORDER BY c.risk DESC LIMIT 50"
        )
        
        # Получаем все связи
        relationships = await db.run_query(
            """MATCH (a:Company)-[r]->(b:Company) 
               RETURN a.id as source, b.id as target, type(r) as rel_type, 
                      properties(r) as props LIMIT 100"""
        )
        
        nodes = []
        for rec in companies:
            c = dict(rec["c"])
            nodes.append({
                "id": c.get("id", ""),
                "label": c.get("name", ""),
                "industry": c.get("industry", ""),
                "city": c.get("city", ""),
                "type": c.get("type", ""),
                "revenue": c.get("revenue", 0),
                "employees": c.get("employees", 0),
                "risk_score": c.get("risk", 0),
                "risk_level": risk_level(c.get("risk", 0)),
                "risk_color": risk_color(c.get("risk", 0)),
                "founded": c.get("founded", 0),
            })
        
        edges = []
        for rec in relationships:
            edges.append({
                "source": rec["source"],
                "target": rec["target"],
                "type": rec["rel_type"],
                "props": dict(rec["props"]) if rec["props"] else {},
            })
        
        # Статистика
        stats_data = await db.run_query("""
            MATCH (c:Company)
            RETURN 
                count(c) as total,
                avg(c.risk) as avg_risk,
                sum(CASE WHEN c.risk >= 70 THEN 1 ELSE 0 END) as critical,
                sum(CASE WHEN c.risk >= 40 AND c.risk < 70 THEN 1 ELSE 0 END) as high
        """)
        
        s = dict(stats_data[0]) if stats_data else {}
        
        return {
            "nodes": nodes,
            "edges": edges,
            "stats": {
                "total_companies": s.get("total", 0),
                "avg_risk_score": round(float(s.get("avg_risk", 0) or 0), 1),
                "critical_count": s.get("critical", 0),
                "high_risk_count": s.get("high", 0),
                "total_relationships": len(edges),
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Graph query failed: {str(e)}")


# ── GET /api/argus/companies ──────────────────────────────────────────────────
@router.get("/companies")
async def get_companies(
    industry: str = None,
    min_risk: int = 0,
    city: str = None,
    db: DatabaseManager = Depends(get_db)
):
    """Возвращает список компаний с фильтрацией."""
    if not db.is_connected:
        raise HTTPException(status_code=503, detail="Neo4j not connected")
    
    try:
        where = ["c.risk >= $min_risk"]
        params = {"min_risk": min_risk}
        
        if industry:
            where.append("c.industry = $industry")
            params["industry"] = industry
        if city:
            where.append("c.city = $city")
            params["city"] = city
        
        query = f"MATCH (c:Company) WHERE {' AND '.join(where)} RETURN c ORDER BY c.risk DESC"
        records = await db.run_query(query, params)
        
        companies = []
        for rec in records:
            c = dict(rec["c"])
            companies.append({
                **c,
                "risk_level": risk_level(c.get("risk", 0)),
                "risk_color": risk_color(c.get("risk", 0)),
            })
        
        return {"companies": companies, "total": len(companies)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/argus/company/{id} ───────────────────────────────────────────────
@router.get("/company/{company_id}")
async def get_company(company_id: str, db: DatabaseManager = Depends(get_db)):
    """Детальная информация о компании и её связях."""
    if not db.is_connected:
        raise HTTPException(status_code=503, detail="Neo4j not connected")
    
    try:
        records = await db.run_query(
            "MATCH (c:Company {id: $id}) RETURN c",
            {"id": company_id}
        )
        if not records:
            raise HTTPException(status_code=404, detail="Company not found")
        
        company = dict(records[0]["c"])
        
        # Связи компании
        rels = await db.run_query("""
            MATCH (c:Company {id: $id})-[r]-(other:Company)
            RETURN type(r) as rel_type, other.name as other_name, 
                   other.id as other_id, other.risk as other_risk,
                   properties(r) as props
        """, {"id": company_id})
        
        connections = []
        for rel in rels:
            connections.append({
                "type": rel["rel_type"],
                "company": rel["other_name"],
                "company_id": rel["other_id"],
                "risk_score": rel["other_risk"],
                "props": dict(rel["props"]) if rel["props"] else {},
            })
        
        return {
            **company,
            "risk_level": risk_level(company.get("risk", 0)),
            "risk_color": risk_color(company.get("risk", 0)),
            "connections": connections,
            "connection_count": len(connections),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/argus/stats ──────────────────────────────────────────────────────
@router.get("/stats")
async def get_stats(db: DatabaseManager = Depends(get_db)):
    """Статистика ARGUS платформы."""
    if not db.is_connected:
        raise HTTPException(status_code=503, detail="Neo4j not connected")
    
    try:
        result = await db.run_query("""
            MATCH (c:Company)
            RETURN 
                count(c) as total,
                avg(c.risk) as avg_risk,
                sum(CASE WHEN c.risk >= 70 THEN 1 ELSE 0 END) as critical,
                sum(CASE WHEN c.risk >= 40 THEN 1 ELSE 0 END) as high_risk
        """)
        
        rel_result = await db.run_query("MATCH ()-[r]->() RETURN count(r) as total")
        
        s = dict(result[0]) if result else {}
        r = dict(rel_result[0]) if rel_result else {}
        
        return {
            "total_companies": s.get("total", 0),
            "total_relationships": r.get("total", 0),
            "avg_risk_score": round(float(s.get("avg_risk", 0) or 0), 1),
            "critical_count": s.get("critical", 0),
            "high_risk_count": s.get("high_risk", 0),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/argus/anomalies ──────────────────────────────────────────────────
@router.get("/anomalies")
async def get_anomalies(db: DatabaseManager = Depends(get_db)):
    """Обнаружение аномалий — компании с высоким риском и подозрительные связи."""
    if not db.is_connected:
        raise HTTPException(status_code=503, detail="Neo4j not connected")
    
    try:
        # Компании с высоким риском
        high_risk = await db.run_query("""
            MATCH (c:Company) WHERE c.risk >= 70
            RETURN c ORDER BY c.risk DESC
        """)
        
        # Круговые транзакции (антифрод)
        circular = await db.run_query("""
            MATCH (a:Company)-[:ТРАНЗАКЦИЯ]->(b:Company)-[:ТРАНЗАКЦИЯ]->(a)
            RETURN a.name as company1, b.name as company2, a.risk as risk1
        """)
        
        anomalies = []
        for rec in high_risk:
            c = dict(rec["c"])
            anomalies.append({
                "type": "HIGH_RISK_COMPANY",
                "company": c.get("name"),
                "risk_score": c.get("risk"),
                "details": f"Риск-скоринг {c.get('risk')} — {risk_level(c.get('risk', 0))}",
                "alert_level": "КРИТИЧНЫЙ" if c.get("risk", 0) >= 80 else "ВЫСОКИЙ",
            })
        
        for rec in circular:
            anomalies.append({
                "type": "CIRCULAR_TRANSACTION",
                "company": rec["company1"],
                "risk_score": rec["risk1"],
                "details": f"Круговая транзакция: {rec['company1']} ↔ {rec['company2']}",
                "alert_level": "КРИТИЧНЫЙ",
            })
        
        return {"anomalies": anomalies, "total": len(anomalies)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
