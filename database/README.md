# OMNIQ Platform — Database Setup

This directory contains Neo4j schema definitions and seed data for the OMNIQ Decision Intelligence Platform.

## Prerequisites

- **Neo4j 5.x** (Community Edition or Enterprise)
- **cypher-shell** installed and on PATH, or Neo4j Browser / Neo4j Desktop

### Install Neo4j (Windows)

1. Download from [neo4j.com/download](https://neo4j.com/download/)
2. Install Neo4j Desktop or extract the server distribution
3. Start the database:
   ```
   # Server distribution:
   bin\neo4j.bat start

   # Or use Neo4j Desktop — create a new project, add a local DBMS (5.x), start it
   ```
4. Default credentials: `neo4j` / `neo4j` (you will be prompted to change on first login)

### Install cypher-shell

cypher-shell is bundled with Neo4j server. If using Neo4j Desktop, find it at:
```
%USERPROFILE%\AppData\Local\Neo4j\Relate\Data\dbmss\<dbms-id>\bin\cypher-shell.bat
```

Or install standalone: [neo4j.com/download-center/#tools](https://neo4j.com/download-center/#tools)

---

## Setup Steps

### Step 1: Apply Schema

```bash
cypher-shell -u neo4j -p YOUR_PASSWORD -f database/schema.cypher
```

Or via Neo4j Browser:
1. Open `http://localhost:7474` in browser
2. Login with neo4j / your_password
3. Open the file `schema.cypher` and paste + run in the browser query pane

This creates:
- Node uniqueness constraints for all entity types
- Performance indexes on frequently queried properties
- Full-text search indexes for entity and event search

### Step 2: Load Seed Data

```bash
cypher-shell -u neo4j -p YOUR_PASSWORD -f database/seed_data.cypher
```

**Warning:** The seed data script begins with `MATCH (n) DETACH DELETE n;` which clears all existing data. Only run in development environments.

### Step 3: Verify

```cypher
// Check node counts
MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count ORDER BY count DESC;

// Check relationships
MATCH ()-[r]->() RETURN type(r) AS rel_type, count(r) AS count ORDER BY count DESC;

// Verify indexes
CALL db.indexes() YIELD name, type, labelsOrTypes RETURN name, type, labelsOrTypes ORDER BY name;
```

Expected output after seeding:

| Label | Count |
|-------|-------|
| Entity | 27 |
| Organization | 10 |
| Person | 10 |
| RiskEvent/IntelEvent | 10 |
| Country | 5 |
| Asset | 2 |
| Account | 1 |

---

## Schema Overview

### Node Labels

| Label | Description |
|-------|-------------|
| `Organization` | Companies, government entities, NGOs |
| `Person` | Individuals, directors, beneficial owners |
| `Entity` | Generic polymorphic label on all nodes |
| `Country` | Sovereign nation states |
| `Region` | Subnational or supranational regions |
| `Asset` | Physical or financial assets |
| `Account` | Financial accounts |
| `RiskEvent` / `IntelEvent` | NEXUS intelligence events |
| `Decision` | AURORA decision records |

### Relationship Types

| Type | Description |
|------|-------------|
| `CONNECTED_TO` | Generic connection, weight-scored |
| `OWNS` | Ownership with `ownership_pct` property |
| `CONTROLS` | Control without formal ownership |
| `SUBSIDIARY_OF` | Corporate hierarchy |
| `OPERATES_IN` | Entity operates in a Country/Region |
| `RELATED_TO` | Soft relationship with context |
| `AFFECTS` | Event/decision affects entity/country |
| `CAUSED_BY` | Causality chain |
| `DIRECTOR_OF` | Board/directorship |
| `EMPLOYED_BY` | Employment relationship |
| `PARTNER_OF` | Business partnership |
| `TRANSACTS_WITH` | Financial transaction link |

---

## Connecting the Backend

Update `backend/.env` with your Neo4j credentials:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_actual_password
```

The backend will automatically use the graph database when connected. It falls back to mock data gracefully when Neo4j is unavailable — useful for frontend development without a running database.

---

## Useful Cypher Queries

### Find all connections for an entity
```cypher
MATCH path = (e:Entity {name: 'KazInvest JSC'})-[*1..3]-(related)
RETURN path
LIMIT 50;
```

### High-risk entities
```cypher
MATCH (e:Entity)
WHERE e.risk_score >= 70
RETURN e.name, e.entity_type, e.risk_score, e.country
ORDER BY e.risk_score DESC;
```

### Ownership chain from person
```cypher
MATCH chain = (p:Person {name: 'Nikolai Petrov'})-[:OWNS|CONTROLS|DIRECTOR_OF*1..5]->(t)
RETURN chain;
```

### Recent high-severity events
```cypher
MATCH (e:RiskEvent)
WHERE e.severity = 'high'
RETURN e.title, e.country_code, e.timestamp, e.source
ORDER BY e.timestamp DESC
LIMIT 10;
```

### Graph density
```cypher
MATCH (n) WITH count(n) AS nodes
MATCH ()-[r]->() WITH nodes, count(r) AS rels
RETURN nodes, rels, toFloat(rels) / (nodes * (nodes - 1)) AS density;
```
