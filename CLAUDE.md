# CLAUDE.md — OMNIQ Decision Intelligence Platform

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

---

## Project Overview

**OMNIQ** is a Palantir-class Decision Intelligence Platform for Central Asia with three products:
- **ARGUS** — Enterprise graph analytics (Neo4j-backed, entity resolution, network analysis)
- **NEXUS** — Government intelligence layer (geopolitical risk, cross-border intel, policy simulation)
- **AURORA** — AI decision layer (predictive analytics, scenario modeling, automated insights)

---

## Repository Structure

```
omniq-platform/
├── frontend/        React 18 + Vite + TypeScript (cyberpunk theme)
├── backend/         FastAPI + Pydantic v2 + Neo4j
├── database/        Neo4j schema + seed data (Cypher)
├── README.md
└── CLAUDE.md        (this file)
```

---

## Commands

### Frontend

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build (tsc + vite build)
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env

# Run development server
uvicorn main:app --reload --port 8000

# API docs at: http://localhost:8000/docs
# Health check: http://localhost:8000/health
```

### Database (Neo4j)

```bash
# Apply schema (run first):
cypher-shell -u neo4j -p YOUR_PASSWORD -f database/schema.cypher

# Load seed data (dev only — clears existing data!):
cypher-shell -u neo4j -p YOUR_PASSWORD -f database/seed_data.cypher
```

---

## Architecture

### Frontend (`frontend/`)

| Path | Description |
|------|-------------|
| `src/index.css` | Cyberpunk theme — all CSS custom properties, animations, utilities |
| `src/App.tsx` | Router with 4 routes: `/`, `/argus`, `/nexus`, `/aurora` |
| `src/components/Navbar.tsx` | Fixed navbar with glass morphism, mobile hamburger |
| `src/components/Footer.tsx` | Footer with product links and status indicator |
| `src/components/HeroSection.tsx` | Animated particle canvas hero, stats row |
| `src/components/ProductCard.tsx` | Reusable glowing product card with scan-line hover |
| `src/components/GlobeVisualization.tsx` | SVG Central Asia intelligence network map |
| `src/components/MetricCard.tsx` | Count-up animated metric with IntersectionObserver |
| `src/pages/Home.tsx` | Landing page — hero, products, globe, metrics, CTA |
| `src/pages/Argus.tsx` | ARGUS page — interactive SVG entity graph, features, use cases |
| `src/pages/Nexus.tsx` | NEXUS page — live intel feed, country risk bars, features |
| `src/pages/Aurora.tsx` | AURORA page — Recharts forecast chart, features, use cases |

**Key design decisions:**
- Inline styles are used throughout components for portability (no CSS Modules / Tailwind)
- Global utility classes (`.glass-card`, `.btn-primary`, `.badge-*`) are defined in `index.css`
- Fonts: Orbitron (headings), Share Tech Mono (labels/mono), Inter (body)
- All colors reference CSS custom properties from `:root` in `index.css`

### Backend (`backend/`)

| Path | Description |
|------|-------------|
| `main.py` | FastAPI app, CORS middleware, router registration, lifespan events |
| `app/config.py` | Pydantic-settings configuration (reads `.env`) |
| `app/database.py` | Neo4j async driver manager + FastAPI `get_db` dependency |
| `app/models.py` | All Pydantic request/response models |
| `app/routers/argus.py` | `/api/argus/*` — entities, graph, analyze, stats |
| `app/routers/nexus.py` | `/api/nexus/*` — events, risks, assess, countries |
| `app/routers/aurora.py` | `/api/aurora/*` — predictions, simulate, insights, score |
| `app/routers/auth.py` | `/api/auth/*` — login, refresh, me |

**Backend conventions:**
- All routers gracefully fall back to mock data if Neo4j is not connected
- Mock data helpers are prefixed with `_make_mock_*`
- JWT: access tokens (30 min), refresh tokens (7 days)
- Demo users: `admin/omniq_admin_2024`, `analyst/analyst_2024`, `gov_user/govuser_2024`

### Database (`database/`)

- `schema.cypher` — Constraints + indexes (run first, idempotent with `IF NOT EXISTS`)
- `seed_data.cypher` — Sample data for 5 countries, 10 orgs, 15 persons, 10 events, 20+ relationships
- `README.md` — Full setup instructions and useful Cypher queries

---

## Key Design Patterns

### Adding a new API endpoint

1. Add Pydantic model to `backend/app/models.py`
2. Add route to the appropriate router (`argus.py`, `nexus.py`, `aurora.py`)
3. Implement mock fallback for when `db.is_connected` is False
4. Register nothing — routers are already included in `main.py`

### Adding a new frontend page

1. Create `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add nav link in `frontend/src/components/Navbar.tsx` `NAV_LINKS` array

### CSS / Theming

All CSS variables are in `frontend/src/index.css` under `:root`. Color conventions:
- Cyan (`#00d4ff`) = NEXUS, primary accent
- Purple (`#7b2fff`) = ARGUS
- Green (`#00ff88`) = AURORA
- Orange (`#ff6b35`) = warnings
- Red (`#ff2d55`) = critical/errors

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEO4J_URI` | `bolt://localhost:7687` | Neo4j connection URI |
| `NEO4J_USER` | `neo4j` | Neo4j username |
| `NEO4J_PASSWORD` | `omniq_secure_2024` | Neo4j password |
| `SECRET_KEY` | (must set) | JWT signing secret |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token TTL |
| `ENVIRONMENT` | `development` | `development` or `production` |

---

## Development Notes

- The backend runs without Neo4j — all endpoints return realistic mock data when DB is disconnected. This allows frontend development to proceed independently.
- The frontend dev server (`npm run dev`) proxies `/api/*` requests to `http://localhost:8000` via Vite config.
- TypeScript strict mode is enabled — no `any` types without explicit justification.
- The `recharts` library is used only in `Aurora.tsx` for the forecast chart.
- `framer-motion` and `lucide-react` are in `package.json` but not yet heavily used — available for future animations/icons.
