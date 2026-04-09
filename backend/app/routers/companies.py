"""
OMNIQ Companies Router — реальные данные из Neo4j
GET /api/companies/       — список всех компаний
GET /api/companies/graph  — граф связей для ARGUS
POST /api/companies/seed  — загрузить seed данные в Neo4j
"""
import os
from fastapi import APIRouter
from neo4j import GraphDatabase

router = APIRouter()

def get_driver():
    uri = os.getenv("NEO4J_URI", "neo4j+s://354d9336.databases.neo4j.io")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "")
    return GraphDatabase.driver(uri, auth=(user, password))

# ── Seed данные ───────────────────────────────────────────────────────────────
COMPANIES = [
  {"id":"C001","name":"Kapitalbank","sector":"Банки","type":"bank","city":"Toshkent","revenue":8500,"employees":3200,"risk":15,"founded":1994},
  {"id":"C002","name":"Uzpromstroybank","sector":"Банки","type":"bank","city":"Toshkent","revenue":6200,"employees":2800,"risk":18,"founded":1990},
  {"id":"C003","name":"Hamkorbank","sector":"Банки","type":"bank","city":"Andijon","revenue":4100,"employees":1900,"risk":22,"founded":1991},
  {"id":"C004","name":"Ipak Yoli Bank","sector":"Банки","type":"bank","city":"Toshkent","revenue":3800,"employees":1600,"risk":20,"founded":1995},
  {"id":"C005","name":"Infinbank","sector":"Банки","type":"bank","city":"Toshkent","revenue":2900,"employees":1200,"risk":25,"founded":1996},
  {"id":"C006","name":"Ucell","sector":"Телеком","type":"telco","city":"Toshkent","revenue":12000,"employees":4500,"risk":10,"founded":1996},
  {"id":"C007","name":"Beeline Uzbekistan","sector":"Телеком","type":"telco","city":"Toshkent","revenue":10500,"employees":3800,"risk":12,"founded":1996},
  {"id":"C008","name":"Uzmobile","sector":"Телеком","type":"telco","city":"Toshkent","revenue":5400,"employees":2100,"risk":15,"founded":1999},
  {"id":"C009","name":"Perfectum Mobile","sector":"Телеком","type":"telco","city":"Toshkent","revenue":1800,"employees":650,"risk":30,"founded":2007},
  {"id":"C010","name":"Uzbekenergo","sector":"Энергетика","type":"state","city":"Toshkent","revenue":45000,"employees":28000,"risk":8,"founded":1992},
  {"id":"C011","name":"Uztransgaz","sector":"Энергетика","type":"state","city":"Toshkent","revenue":38000,"employees":22000,"risk":9,"founded":1992},
  {"id":"C012","name":"Uzneftegazstroyservice","sector":"Энергетика","type":"company","city":"Toshkent","revenue":8900,"employees":5600,"risk":20,"founded":1998},
  {"id":"C013","name":"Surhan Gas Chemical","sector":"Энергетика","type":"company","city":"Termiz","revenue":6700,"employees":3200,"risk":18,"founded":2000},
  {"id":"C014","name":"EPAM Uzbekistan","sector":"IT","type":"company","city":"Toshkent","revenue":4500,"employees":1800,"risk":10,"founded":2018},
  {"id":"C015","name":"Invan Group","sector":"IT","type":"company","city":"Toshkent","revenue":2100,"employees":450,"risk":15,"founded":2012},
  {"id":"C016","name":"DataArt Uzbekistan","sector":"IT","type":"company","city":"Toshkent","revenue":1900,"employees":380,"risk":12,"founded":2019},
  {"id":"C017","name":"Humans","sector":"IT","type":"company","city":"Toshkent","revenue":3200,"employees":620,"risk":18,"founded":2018},
  {"id":"C018","name":"Click","sector":"IT","type":"fintech","city":"Toshkent","revenue":5800,"employees":890,"risk":14,"founded":2015},
  {"id":"C019","name":"Payme","sector":"IT","type":"fintech","city":"Toshkent","revenue":4900,"employees":720,"risk":16,"founded":2012},
  {"id":"C020","name":"Uzum","sector":"IT","type":"ecommerce","city":"Toshkent","revenue":8900,"employees":2400,"risk":22,"founded":2021},
  {"id":"C021","name":"Qurilish Invest","sector":"Строительство","type":"company","city":"Toshkent","revenue":12000,"employees":4200,"risk":25,"founded":2005},
  {"id":"C022","name":"UzStroyInvest","sector":"Строительство","type":"company","city":"Samarqand","revenue":7800,"employees":3100,"risk":28,"founded":2008},
  {"id":"C023","name":"Tashkent City Developer","sector":"Строительство","type":"company","city":"Toshkent","revenue":15000,"employees":5600,"risk":20,"founded":2016},
  {"id":"C024","name":"Murad Buildings","sector":"Строительство","type":"company","city":"Buxoro","revenue":4500,"employees":1800,"risk":30,"founded":2010},
  {"id":"C025","name":"Mega Park Construction","sector":"Строительство","type":"company","city":"Toshkent","revenue":9200,"employees":3400,"risk":22,"founded":2012},
  {"id":"C026","name":"Korzinka","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":18000,"employees":6800,"risk":12,"founded":2006},
  {"id":"C027","name":"Makro","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":14000,"employees":5200,"risk":14,"founded":2002},
  {"id":"C028","name":"Next","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":3200,"employees":1100,"risk":18,"founded":2010},
  {"id":"C029","name":"Artel Electronics","sector":"Ритейл","type":"manufacturing","city":"Toshkent","revenue":22000,"employees":8900,"risk":15,"founded":1998},
  {"id":"C030","name":"Texnomart","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":6700,"employees":2400,"risk":16,"founded":2008},
  {"id":"C031","name":"GM Uzbekistan","sector":"Производство","type":"manufacturing","city":"Asaka","revenue":85000,"employees":32000,"risk":8,"founded":1996},
  {"id":"C032","name":"Navoi Mining","sector":"Производство","type":"state","city":"Navoiy","revenue":120000,"employees":45000,"risk":7,"founded":1992},
  {"id":"C033","name":"Fergana Oil Refinery","sector":"Производство","type":"state","city":"Fargona","revenue":42000,"employees":18000,"risk":10,"founded":1959},
  {"id":"C034","name":"Maxam-Chirchiq","sector":"Производство","type":"company","city":"Chirchiq","revenue":8900,"employees":3200,"risk":18,"founded":1958},
  {"id":"C035","name":"Coca-Cola Uzbekistan","sector":"Производство","type":"company","city":"Toshkent","revenue":4500,"employees":1200,"risk":10,"founded":1995},
  {"id":"C036","name":"Uzbekistan Airways","sector":"Транспорт","type":"state","city":"Toshkent","revenue":35000,"employees":14000,"risk":15,"founded":1992},
  {"id":"C037","name":"Uzbekistan Railways","sector":"Транспорт","type":"state","city":"Toshkent","revenue":28000,"employees":65000,"risk":10,"founded":1994},
  {"id":"C038","name":"OSON Logistics","sector":"Транспорт","type":"company","city":"Toshkent","revenue":2100,"employees":780,"risk":25,"founded":2016},
  {"id":"C039","name":"Express Delivery UZ","sector":"Транспорт","type":"company","city":"Toshkent","revenue":1200,"employees":420,"risk":28,"founded":2018},
  {"id":"C040","name":"UzNews Agency","sector":"Медиа","type":"state","city":"Toshkent","revenue":890,"employees":320,"risk":5,"founded":1992},
  {"id":"C041","name":"Kun.uz","sector":"Медиа","type":"company","city":"Toshkent","revenue":450,"employees":85,"risk":12,"founded":2014},
  {"id":"C042","name":"Daryo.uz","sector":"Медиа","type":"company","city":"Toshkent","revenue":320,"employees":65,"risk":14,"founded":2013},
  {"id":"C043","name":"Uzagroeksport","sector":"Агро","type":"state","city":"Toshkent","revenue":12000,"employees":4500,"risk":12,"founded":1995},
  {"id":"C044","name":"Botirbek Agro Farm","sector":"Агро","type":"company","city":"Fargona","revenue":1800,"employees":320,"risk":30,"founded":2010},
  {"id":"C045","name":"Golden Fields Uzbekistan","sector":"Агро","type":"company","city":"Sirdaryo","revenue":2400,"employees":560,"risk":25,"founded":2012},
  {"id":"C046","name":"Akfa Medline","sector":"Медицина","type":"company","city":"Toshkent","revenue":3800,"employees":1200,"risk":15,"founded":2010},
  {"id":"C047","name":"Health Life Medical","sector":"Медицина","type":"company","city":"Toshkent","revenue":1200,"employees":380,"risk":20,"founded":2015},
  {"id":"C048","name":"Turin Polytechnic UZ","sector":"Образование","type":"state","city":"Toshkent","revenue":2100,"employees":450,"risk":5,"founded":2009},
  {"id":"C049","name":"Inha University","sector":"Образование","type":"state","city":"Toshkent","revenue":1800,"employees":380,"risk":5,"founded":2014},
  {"id":"C050","name":"Webster University Tashkent","sector":"Образование","type":"company","city":"Toshkent","revenue":1500,"employees":280,"risk":8,"founded":2016},
]

RELATIONSHIPS = [
  ("C001","C031","PROVIDES_CREDIT",{"amount":500000,"year":2023}),
  ("C001","C023","PROVIDES_CREDIT",{"amount":250000,"year":2023}),
  ("C002","C032","PROVIDES_CREDIT",{"amount":800000,"year":2022}),
  ("C002","C036","PROVIDES_CREDIT",{"amount":300000,"year":2023}),
  ("C003","C044","PROVIDES_CREDIT",{"amount":50000,"year":2023}),
  ("C004","C018","PROVIDES_CREDIT",{"amount":120000,"year":2022}),
  ("C005","C038","PROVIDES_CREDIT",{"amount":45000,"year":2023}),
  ("C006","C018","PARTNER",{"since":2020,"type":"payment"}),
  ("C007","C019","PARTNER",{"since":2019,"type":"payment"}),
  ("C018","C026","PARTNER",{"since":2021,"type":"payment"}),
  ("C019","C027","PARTNER",{"since":2020,"type":"payment"}),
  ("C020","C026","PARTNER",{"since":2022,"type":"ecommerce"}),
  ("C020","C027","PARTNER",{"since":2022,"type":"ecommerce"}),
  ("C029","C027","PARTNER",{"since":2018,"type":"supply"}),
  ("C029","C030","PARTNER",{"since":2015,"type":"distribution"}),
  ("C010","C031","SUPPLIES",{"product":"electricity","volume":12000}),
  ("C010","C033","SUPPLIES",{"product":"electricity","volume":8000}),
  ("C011","C033","SUPPLIES",{"product":"gas","volume":25000}),
  ("C011","C034","SUPPLIES",{"product":"gas","volume":8000}),
  ("C034","C031","SUPPLIES",{"product":"chemicals","volume":3000}),
  ("C037","C043","TRANSPORTS",{"volume":50000,"year":2023}),
  ("C037","C033","TRANSPORTS",{"volume":80000,"year":2023}),
  ("C036","C043","TRANSPORTS",{"volume":5000,"year":2023}),
  ("C038","C020","DELIVERS",{"parcels":150000,"year":2023}),
  ("C039","C020","DELIVERS",{"parcels":80000,"year":2023}),
  ("C006","C001","PROVIDES_SERVICE",{"type":"corporate_mobile"}),
  ("C007","C002","PROVIDES_SERVICE",{"type":"corporate_mobile"}),
  ("C001","C014","INVESTED_IN",{"amount":200000,"year":2021}),
  ("C002","C015","INVESTED_IN",{"amount":150000,"year":2020}),
  ("C004","C019","INVESTED_IN",{"amount":180000,"year":2019}),
]

# ── Endpoints ─────────────────────────────────────────────────────────────────
@router.get("/")
async def get_companies(sector: str = None, city: str = None, limit: int = 50):
    """Список компаний из Neo4j"""
    driver = get_driver()
    try:
        with driver.session() as session:
            where = []
            params = {"limit": limit}
            if sector:
                where.append("c.sector = $sector")
                params["sector"] = sector
            if city:
                where.append("c.city = $city")
                params["city"] = city
            where_str = "WHERE " + " AND ".join(where) if where else ""
            result = session.run(
                f"MATCH (c:Company) {where_str} RETURN c ORDER BY c.revenue DESC LIMIT $limit",
                **params
            )
            companies = [dict(record["c"]) for record in result]
            return {"companies": companies, "total": len(companies)}
    except Exception as e:
        return {"error": str(e), "companies": [], "total": 0}
    finally:
        driver.close()

@router.get("/graph")
async def get_companies_graph(limit: int = 50):
    """Граф связей компаний для ARGUS визуализации"""
    driver = get_driver()
    try:
        with driver.session() as session:
            # Получаем компании
            result = session.run(
                "MATCH (c:Company) RETURN c ORDER BY c.revenue DESC LIMIT $limit",
                limit=limit
            )
            companies = [dict(record["c"]) for record in result]

            # Получаем связи
            rel_result = session.run(
                "MATCH (a:Company)-[r]->(b:Company) RETURN a.id as src, b.id as dst, type(r) as rel_type, properties(r) as props LIMIT 100"
            )
            relationships = [
                {"source": r["src"], "target": r["dst"], "type": r["rel_type"], "props": dict(r["props"])}
                for r in rel_result
            ]

            # Статистика по секторам
            sector_result = session.run(
                "MATCH (c:Company) RETURN c.sector as sector, count(c) as count, avg(c.risk) as avg_risk ORDER BY count DESC"
            )
            sectors = [{"sector": r["sector"], "count": r["count"], "avg_risk": round(r["avg_risk"] or 0, 1)} for r in sector_result]

            return {
                "nodes": companies,
                "edges": relationships,
                "node_count": len(companies),
                "edge_count": len(relationships),
                "sectors": sectors,
            }
    except Exception as e:
        return {"error": str(e), "nodes": [], "edges": [], "node_count": 0, "edge_count": 0, "sectors": []}
    finally:
        driver.close()

@router.post("/seed")
async def seed_companies():
    """Загружает 50 узбекских компаний в Neo4j"""
    driver = get_driver()
    try:
        with driver.session() as session:
            # Очищаем старые Company ноды
            session.run("MATCH (c:Company) DETACH DELETE c")

            # Создаём компании
            for c in COMPANIES:
                session.run("""
                    CREATE (c:Company {
                        id: $id, name: $name, sector: $sector, type: $type,
                        city: $city, revenue: $revenue, employees: $employees,
                        risk: $risk, founded: $founded
                    })
                """, **c)

            # Создаём связи
            rel_count = 0
            for src, dst, rel_type, props in RELATIONSHIPS:
                query = f"""
                    MATCH (a:Company {{id: $src}}), (b:Company {{id: $dst}})
                    CREATE (a)-[r:{rel_type} $props]->(b)
                """
                session.run(query, src=src, dst=dst, props=props)
                rel_count += 1

            # Считаем
            count_result = session.run("MATCH (c:Company) RETURN count(c) as cnt")
            company_count = count_result.single()["cnt"]

        return {
            "success": True,
            "companies_created": company_count,
            "relationships_created": rel_count,
            "message": f"Successfully seeded {company_count} companies and {rel_count} relationships"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        driver.close()

@router.get("/stats")
async def get_companies_stats():
    """Статистика по компаниям"""
    driver = get_driver()
    try:
        with driver.session() as session:
            result = session.run("""
                MATCH (c:Company)
                RETURN
                    count(c) as total,
                    avg(c.revenue) as avg_revenue,
                    avg(c.risk) as avg_risk,
                    sum(c.employees) as total_employees,
                    count(CASE WHEN c.risk > 25 THEN 1 END) as high_risk_count
            """)
            row = result.single()
            rel_result = session.run("MATCH (:Company)-[r]->(:Company) RETURN count(r) as cnt")
            rel_count = rel_result.single()["cnt"]

            return {
                "total_companies": row["total"],
                "total_employees": row["total_employees"],
                "avg_revenue": round(row["avg_revenue"] or 0, 0),
                "avg_risk": round(row["avg_risk"] or 0, 1),
                "high_risk_count": row["high_risk_count"],
                "total_relationships": rel_count,
            }
    except Exception as e:
        return {"error": str(e)}
    finally:
        driver.close()
