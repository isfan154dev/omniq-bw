"""
OMNIQ Neo4j Seed Script
Загружает 50 узбекских компаний с реальными связями в Neo4j AuraDB
Запуск: python seed_neo4j.py
"""
import os
from neo4j import GraphDatabase

# ── Подключение ───────────────────────────────────────────────────────────────
NEO4J_URI      = os.getenv("NEO4J_URI")
NEO4J_USER     = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")

if not all([NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD]):
    raise Exception("Missing env vars")

# ── Данные компаний ───────────────────────────────────────────────────────────
COMPANIES = [
  # Банки
  {"id":"C001","name":"Kapitalbank","sector":"Банки","type":"bank","city":"Toshkent","revenue":8500,"employees":3200,"risk":15,"founded":1994},
  {"id":"C002","name":"Uzpromstroybank","sector":"Банки","type":"bank","city":"Toshkent","revenue":6200,"employees":2800,"risk":18,"founded":1990},
  {"id":"C003","name":"Hamkorbank","sector":"Банки","type":"bank","city":"Andijon","revenue":4100,"employees":1900,"risk":22,"founded":1991},
  {"id":"C004","name":"Ipak Yoli Bank","sector":"Банки","type":"bank","city":"Toshkent","revenue":3800,"employees":1600,"risk":20,"founded":1995},
  {"id":"C005","name":"Infinbank","sector":"Банки","type":"bank","city":"Toshkent","revenue":2900,"employees":1200,"risk":25,"founded":1996},
  # Телеком
  {"id":"C006","name":"Ucell","sector":"Телеком","type":"telco","city":"Toshkent","revenue":12000,"employees":4500,"risk":10,"founded":1996},
  {"id":"C007","name":"Beeline Uzbekistan","sector":"Телеком","type":"telco","city":"Toshkent","revenue":10500,"employees":3800,"risk":12,"founded":1996},
  {"id":"C008","name":"Uzmobile","sector":"Телеком","type":"telco","city":"Toshkent","revenue":5400,"employees":2100,"risk":15,"founded":1999},
  {"id":"C009","name":"Perfectum Mobile","sector":"Телеком","type":"telco","city":"Toshkent","revenue":1800,"employees":650,"risk":30,"founded":2007},
  # Энергетика
  {"id":"C010","name":"Uzbekenergo","sector":"Энергетика","type":"state","city":"Toshkent","revenue":45000,"employees":28000,"risk":8,"founded":1992},
  {"id":"C011","name":"Uztransgaz","sector":"Энергетика","type":"state","city":"Toshkent","revenue":38000,"employees":22000,"risk":9,"founded":1992},
  {"id":"C012","name":"Uzneftegazstroyservice","sector":"Энергетика","type":"company","city":"Toshkent","revenue":8900,"employees":5600,"risk":20,"founded":1998},
  {"id":"C013","name":"Surhan Gas Chemical","sector":"Энергетика","type":"company","city":"Termiz","revenue":6700,"employees":3200,"risk":18,"founded":2000},
  # IT
  {"id":"C014","name":"EPAM Uzbekistan","sector":"IT","type":"company","city":"Toshkent","revenue":4500,"employees":1800,"risk":10,"founded":2018},
  {"id":"C015","name":"Invan Group","sector":"IT","type":"company","city":"Toshkent","revenue":2100,"employees":450,"risk":15,"founded":2012},
  {"id":"C016","name":"DataArt Uzbekistan","sector":"IT","type":"company","city":"Toshkent","revenue":1900,"employees":380,"risk":12,"founded":2019},
  {"id":"C017","name":"Humans","sector":"IT","type":"company","city":"Toshkent","revenue":3200,"employees":620,"risk":18,"founded":2018},
  {"id":"C018","name":"Click","sector":"IT","type":"fintech","city":"Toshkent","revenue":5800,"employees":890,"risk":14,"founded":2015},
  {"id":"C019","name":"Payme","sector":"IT","type":"fintech","city":"Toshkent","revenue":4900,"employees":720,"risk":16,"founded":2012},
  {"id":"C020","name":"Uzum","sector":"IT","type":"ecommerce","city":"Toshkent","revenue":8900,"employees":2400,"risk":22,"founded":2021},
  # Строительство
  {"id":"C021","name":"Qurilish Invest","sector":"Строительство","type":"company","city":"Toshkent","revenue":12000,"employees":4200,"risk":25,"founded":2005},
  {"id":"C022","name":"UzStroyInvest","sector":"Строительство","type":"company","city":"Samarqand","revenue":7800,"employees":3100,"risk":28,"founded":2008},
  {"id":"C023","name":"Tashkent City Developer","sector":"Строительство","type":"company","city":"Toshkent","revenue":15000,"employees":5600,"risk":20,"founded":2016},
  {"id":"C024","name":"Murad Buildings","sector":"Строительство","type":"company","city":"Buxoro","revenue":4500,"employees":1800,"risk":30,"founded":2010},
  {"id":"C025","name":"Mega Park Construction","sector":"Строительство","type":"company","city":"Toshkent","revenue":9200,"employees":3400,"risk":22,"founded":2012},
  # Ритейл
  {"id":"C026","name":"Korzinka","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":18000,"employees":6800,"risk":12,"founded":2006},
  {"id":"C027","name":"Makro","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":14000,"employees":5200,"risk":14,"founded":2002},
  {"id":"C028","name":"Next","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":3200,"employees":1100,"risk":18,"founded":2010},
  {"id":"C029","name":"Artel Electronics","sector":"Ритейл","type":"manufacturing","city":"Toshkent","revenue":22000,"employees":8900,"risk":15,"founded":1998},
  {"id":"C030","name":"Texnomart","sector":"Ритейл","type":"retail","city":"Toshkent","revenue":6700,"employees":2400,"risk":16,"founded":2008},
  # Производство
  {"id":"C031","name":"GM Uzbekistan","sector":"Производство","type":"manufacturing","city":"Asaka","revenue":85000,"employees":32000,"risk":8,"founded":1996},
  {"id":"C032","name":"Navoi Mining","sector":"Производство","type":"state","city":"Navoiy","revenue":120000,"employees":45000,"risk":7,"founded":1992},
  {"id":"C033","name":"Fergana Oil Refinery","sector":"Производство","type":"state","city":"Fargona","revenue":42000,"employees":18000,"risk":10,"founded":1959},
  {"id":"C034","name":"Maxam-Chirchiq","sector":"Производство","type":"company","city":"Chirchiq","revenue":8900,"employees":3200,"risk":18,"founded":1958},
  {"id":"C035","name":"Coca-Cola Uzbekistan","sector":"Производство","type":"company","city":"Toshkent","revenue":4500,"employees":1200,"risk":10,"founded":1995},
  # Транспорт
  {"id":"C036","name":"Uzbekistan Airways","sector":"Транспорт","type":"state","city":"Toshkent","revenue":35000,"employees":14000,"risk":15,"founded":1992},
  {"id":"C037","name":"Uzbekistan Railways","sector":"Транспорт","type":"state","city":"Toshkent","revenue":28000,"employees":65000,"risk":10,"founded":1994},
  {"id":"C038","name":"OSON Logistics","sector":"Транспорт","type":"company","city":"Toshkent","revenue":2100,"employees":780,"risk":25,"founded":2016},
  {"id":"C039","name":"Express Delivery UZ","sector":"Транспорт","type":"company","city":"Toshkent","revenue":1200,"employees":420,"risk":28,"founded":2018},
  # Медиа
  {"id":"C040","name":"Uzbekistan National News Agency","sector":"Медиа","type":"state","city":"Toshkent","revenue":890,"employees":320,"risk":5,"founded":1992},
  {"id":"C041","name":"Kun.uz","sector":"Медиа","type":"company","city":"Toshkent","revenue":450,"employees":85,"risk":12,"founded":2014},
  {"id":"C042","name":"Daryo.uz","sector":"Медиа","type":"company","city":"Toshkent","revenue":320,"employees":65,"risk":14,"founded":2013},
  # Агро
  {"id":"C043","name":"Uzagroeksport","sector":"Агро","type":"state","city":"Toshkent","revenue":12000,"employees":4500,"risk":12,"founded":1995},
  {"id":"C044","name":"Botirbek Agro Farm","sector":"Агро","type":"company","city":"Fargona","revenue":1800,"employees":320,"risk":30,"founded":2010},
  {"id":"C045","name":"Golden Fields Uzbekistan","sector":"Агро","type":"company","city":"Sirdaryo","revenue":2400,"employees":560,"risk":25,"founded":2012},
  # Медицина
  {"id":"C046","name":"Akfa Medline","sector":"Медицина","type":"company","city":"Toshkent","revenue":3800,"employees":1200,"risk":15,"founded":2010},
  {"id":"C047","name":"Health Life Medical","sector":"Медицина","type":"company","city":"Toshkent","revenue":1200,"employees":380,"risk":20,"founded":2015},
  # Образование
  {"id":"C048","name":"Turin Polytechnic University","sector":"Образование","type":"state","city":"Toshkent","revenue":2100,"employees":450,"risk":5,"founded":2009},
  {"id":"C049","name":"Inha University","sector":"Образование","type":"state","city":"Toshkent","revenue":1800,"employees":380,"risk":5,"founded":2014},
  {"id":"C050","name":"Webster University Tashkent","sector":"Образование","type":"company","city":"Toshkent","revenue":1500,"employees":280,"risk":8,"founded":2016},
]

# ── Связи между компаниями ────────────────────────────────────────────────────
RELATIONSHIPS = [
  # Банки кредитуют компании
  ("C001","C031","PROVIDES_CREDIT",{"amount":500000,"year":2023}),
  ("C001","C023","PROVIDES_CREDIT",{"amount":250000,"year":2023}),
  ("C002","C032","PROVIDES_CREDIT",{"amount":800000,"year":2022}),
  ("C002","C036","PROVIDES_CREDIT",{"amount":300000,"year":2023}),
  ("C003","C044","PROVIDES_CREDIT",{"amount":50000,"year":2023}),
  ("C004","C018","PROVIDES_CREDIT",{"amount":120000,"year":2022}),
  ("C005","C038","PROVIDES_CREDIT",{"amount":45000,"year":2023}),
  # Партнёрства
  ("C006","C018","PARTNER",{"since":2020,"type":"payment"}),
  ("C007","C019","PARTNER",{"since":2019,"type":"payment"}),
  ("C018","C026","PARTNER",{"since":2021,"type":"payment"}),
  ("C019","C027","PARTNER",{"since":2020,"type":"payment"}),
  ("C020","C026","PARTNER",{"since":2022,"type":"ecommerce"}),
  ("C020","C027","PARTNER",{"since":2022,"type":"ecommerce"}),
  ("C029","C027","PARTNER",{"since":2018,"type":"supply"}),
  ("C029","C030","PARTNER",{"since":2015,"type":"distribution"}),
  # Поставщики
  ("C010","C031","SUPPLIES",{"product":"electricity","volume":12000}),
  ("C010","C033","SUPPLIES",{"product":"electricity","volume":8000}),
  ("C011","C033","SUPPLIES",{"product":"gas","volume":25000}),
  ("C011","C034","SUPPLIES",{"product":"gas","volume":8000}),
  ("C034","C031","SUPPLIES",{"product":"chemicals","volume":3000}),
  # Логистика
  ("C037","C043","TRANSPORTS",{"volume":50000,"year":2023}),
  ("C037","C033","TRANSPORTS",{"volume":80000,"year":2023}),
  ("C036","C043","TRANSPORTS",{"volume":5000,"year":2023}),
  ("C038","C020","DELIVERS",{"parcels":150000,"year":2023}),
  ("C039","C020","DELIVERS",{"parcels":80000,"year":2023}),
  # Телеком услуги
  ("C006","C001","PROVIDES_SERVICE",{"type":"corporate_mobile","year":2022}),
  ("C007","C002","PROVIDES_SERVICE",{"type":"corporate_mobile","year":2021}),
  ("C008","C037","PROVIDES_SERVICE",{"type":"corporate_mobile","year":2020}),
  # Инвестиции
  ("C001","C014","INVESTED_IN",{"amount":200000,"year":2021}),
  ("C002","C015","INVESTED_IN",{"amount":150000,"year":2020}),
  ("C004","C019","INVESTED_IN",{"amount":180000,"year":2019}),
  # Реклама
  ("C031","C040","ADVERTISES_IN",{"budget":500,"year":2023}),
  ("C026","C041","ADVERTISES_IN",{"budget":120,"year":2023}),
  ("C029","C042","ADVERTISES_IN",{"budget":80,"year":2023}),
]

def seed_database():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    
    with driver.session() as session:
        print("[OMNIQ] Clearing old data...")
        session.run("MATCH (n) DETACH DELETE n")
        
        print(f"[OMNIQ] Creating {len(COMPANIES)} companies...")
        for c in COMPANIES:
            session.run("""
                CREATE (c:Company {
                    id: $id, name: $name, sector: $sector, type: $type,
                    city: $city, revenue: $revenue, employees: $employees,
                    risk: $risk, founded: $founded
                })
            """, **c)
        
        print(f"[OMNIQ] Creating {len(RELATIONSHIPS)} relationships...")
        for src, dst, rel_type, props in RELATIONSHIPS:
            query = f"""
                MATCH (a:Company {{id: $src}}), (b:Company {{id: $dst}})
                CREATE (a)-[r:{rel_type} $props]->(b)
            """
            session.run(query, src=src, dst=dst, props=props)
        
        # Проверяем
        result = session.run("MATCH (n:Company) RETURN count(n) as cnt")
        count = result.single()["cnt"]
        print(f"[OMNIQ] Done! {count} companies in Neo4j")
        
        result2 = session.run("MATCH ()-[r]->() RETURN count(r) as cnt")
        rel_count = result2.single()["cnt"]
        print(f"[OMNIQ] Done! {rel_count} relationships in Neo4j")
    
    driver.close()

if __name__ == "__main__":
    print("[OMNIQ] Starting Neo4j seed...")
    seed_database()
    print("[OMNIQ] Seed complete!")
