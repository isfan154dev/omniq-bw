# OMNIQ — Decision Intelligence Platform

> Intelligence that decides. Built for Central Asia.

OMNIQ is a Palantir-class Decision Intelligence Platform engineered for the governments, enterprises, and intelligence agencies of Central Asia. It transforms raw data — structured, unstructured, geospatial, financial — into actionable decisions at machine speed.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        OMNIQ PLATFORM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│   │    ARGUS     │  │    NEXUS     │  │       AURORA         │ │
│   │  Enterprise  │  │  Government  │  │    AI Decision       │ │
│   │   Graph      │  │Intelligence  │  │      Layer           │ │
│   │  Analytics   │  │              │  │                      │ │
│   └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
│          │                 │                      │             │
│          └─────────────────┼──────────────────────┘             │
│                            │                                    │
│                   ┌────────▼────────┐                           │
│                   │  OMNIQ CORE API │                           │
│                   │   (FastAPI)     │                           │
│                   └────────┬────────┘                           │
│                            │                                    │
│          ┌─────────────────┼──────────────────────┐             │
│          │                 │                      │             │
│   ┌──────▼───────┐  ┌──────▼───────┐  ┌──────────▼───────────┐ │
│   │    Neo4j     │  │  PostgreSQL  │  │   Object Storage     │ │
│   │  Graph DB    │  │  Relational  │  │   (MinIO/S3)         │ │
│   └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Frontend: React 18 + Vite + TypeScript
         Cyberpunk dark theme
         ┌──────────────────────────────┐
         │  / (Home/Landing)            │
         │  /argus  (Graph Analytics)   │
         │  /nexus  (Gov Intelligence)  │
         │  /aurora (AI Decisions)      │
         └──────────────────────────────┘
```

---

## Products

### ARGUS — Enterprise Graph Analytics
Expose every hidden connection in your data. ARGUS maps complex networks of organizations, persons, and assets using a property graph engine (Neo4j). Built for financial crime detection, corporate intelligence, and supply chain mapping.

- **Entity Resolution**: Deduplicate and merge identity records across data silos
- **Relationship Mapping**: Visualize multi-hop ownership and influence networks
- **Network Analysis**: Centrality scoring, community detection, anomaly flagging
- **Anomaly Detection**: Real-time deviation alerts on graph topology changes
- **Real-time Graph**: Live streaming graph updates via WebSocket
- **Export & API**: Full REST API + graph export (GraphML, JSON, CSV)

### NEXUS — Government Intelligence Layer
From data chaos to policy clarity. NEXUS aggregates cross-border data streams, models geopolitical risk, and simulates policy outcomes for Central Asian governments.

- **Geopolitical Risk**: Country-level and regional risk scoring (0-100)
- **Cross-border Intelligence**: Trade flow, migration, and incident correlation
- **Policy Simulation**: Monte Carlo scenario modeling for policy decisions
- **Threat Assessment**: Multi-source threat fusion and confidence scoring
- **Citizen Data Integration**: GDPR-compliant anonymized population analytics
- **Compliance Engine**: Regulatory compliance tracking and alerting

### AURORA — AI Decision Layer
Predictions that move governments and enterprises. AURORA sits on top of ARGUS and NEXUS to deliver automated insights, risk scores, and decision recommendations powered by ML.

- **Predictive Analytics**: Time-series forecasting with uncertainty bounds
- **Scenario Modeling**: What-if analysis across economic and political variables
- **Automated Insights**: NLP-generated natural language summaries of data changes
- **Decision Trees**: Explainable AI decision path visualization
- **Risk Scoring**: Composite risk model across 200+ input features
- **NLP Analysis**: Multilingual text analytics (Russian, Kazakh, Uzbek, English)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Framer Motion, Recharts |
| Styling | CSS Custom Properties, Glass Morphism, Cyberpunk Theme |
| Backend | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| Graph DB | Neo4j 5.x (Community or Enterprise) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| HTTP Client | HTTPX (async) |
| Dev Tools | ESLint, TypeScript strict mode |

---

## Project Structure

```
omniq-platform/
├── README.md
├── CLAUDE.md
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── HeroSection.tsx
│       │   ├── ProductCard.tsx
│       │   ├── GlobeVisualization.tsx
│       │   └── MetricCard.tsx
│       └── pages/
│           ├── Home.tsx
│           ├── Argus.tsx
│           ├── Nexus.tsx
│           └── Aurora.tsx
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── main.py
│   └── app/
│       ├── __init__.py
│       ├── config.py
│       ├── database.py
│       ├── models.py
│       └── routers/
│           ├── __init__.py
│           ├── argus.py
│           ├── nexus.py
│           ├── aurora.py
│           └── auth.py
└── database/
    ├── schema.cypher
    ├── seed_data.cypher
    └── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Neo4j 5.x (Community Edition)

### 1. Clone and navigate

```bash
cd C:\omniq-platform
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings

uvicorn main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### 4. Database

```bash
# Start Neo4j (adjust path as needed)
# Then run schema + seed:
cypher-shell -u neo4j -p your_password < database/schema.cypher
cypher-shell -u neo4j -p your_password < database/seed_data.cypher
```

### 5. Open the platform

Navigate to `http://localhost:3000` for the OMNIQ platform.
API documentation available at `http://localhost:8000/docs`.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEO4J_URI` | Neo4j connection URI | `bolt://localhost:7687` |
| `NEO4J_USER` | Neo4j username | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j password | — |
| `SECRET_KEY` | JWT signing secret | — |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL | `30` |
| `ENVIRONMENT` | `development` or `production` | `development` |

---

## License

Proprietary — OMNIQ Technologies. All rights reserved.

---

*Built for the intelligence needs of Central Asia. Powered by graph, AI, and real-time data fusion.*
