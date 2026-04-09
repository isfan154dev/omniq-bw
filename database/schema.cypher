// ============================================================
// OMNIQ Decision Intelligence Platform — Neo4j Schema
// Run this file to establish constraints, indexes, and
// node labels before seeding data.
// ============================================================

// ── Drop existing constraints (idempotent re-run) ────────────
// Uncomment if you need to reset the schema:
// CALL apoc.schema.assert({}, {});

// ============================================================
// NODE CONSTRAINTS — Uniqueness + Existence
// ============================================================

// Organization
CREATE CONSTRAINT org_id_unique IF NOT EXISTS
  FOR (o:Organization) REQUIRE o.id IS UNIQUE;

CREATE CONSTRAINT org_name_exists IF NOT EXISTS
  FOR (o:Organization) REQUIRE o.name IS NOT NULL;

// Person
CREATE CONSTRAINT person_id_unique IF NOT EXISTS
  FOR (p:Person) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT person_name_exists IF NOT EXISTS
  FOR (p:Person) REQUIRE p.name IS NOT NULL;

// Entity (generic — used by ARGUS as a polymorphic label)
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS
  FOR (e:Entity) REQUIRE e.id IS UNIQUE;

// Country
CREATE CONSTRAINT country_code_unique IF NOT EXISTS
  FOR (c:Country) REQUIRE c.code IS UNIQUE;

CREATE CONSTRAINT country_name_unique IF NOT EXISTS
  FOR (c:Country) REQUIRE c.name IS UNIQUE;

// Region
CREATE CONSTRAINT region_name_unique IF NOT EXISTS
  FOR (r:Region) REQUIRE r.name IS UNIQUE;

// RiskEvent (NEXUS intelligence events)
CREATE CONSTRAINT risk_event_id_unique IF NOT EXISTS
  FOR (e:RiskEvent) REQUIRE e.id IS UNIQUE;

// IntelEvent
CREATE CONSTRAINT intel_event_id_unique IF NOT EXISTS
  FOR (e:IntelEvent) REQUIRE e.id IS UNIQUE;

// Decision (AURORA decision records)
CREATE CONSTRAINT decision_id_unique IF NOT EXISTS
  FOR (d:Decision) REQUIRE d.id IS UNIQUE;

// Asset
CREATE CONSTRAINT asset_id_unique IF NOT EXISTS
  FOR (a:Asset) REQUIRE a.id IS UNIQUE;

// Account
CREATE CONSTRAINT account_id_unique IF NOT EXISTS
  FOR (a:Account) REQUIRE a.id IS UNIQUE;

// ============================================================
// PROPERTY INDEXES — Performance optimization
// ============================================================

// Entity indexes
CREATE INDEX entity_type_idx IF NOT EXISTS
  FOR (e:Entity) ON (e.entity_type);

CREATE INDEX entity_risk_idx IF NOT EXISTS
  FOR (e:Entity) ON (e.risk_score);

CREATE INDEX entity_country_idx IF NOT EXISTS
  FOR (e:Entity) ON (e.country);

CREATE INDEX entity_created_idx IF NOT EXISTS
  FOR (e:Entity) ON (e.created_at);

// Organization indexes
CREATE INDEX org_country_idx IF NOT EXISTS
  FOR (o:Organization) ON (o.country);

CREATE INDEX org_sector_idx IF NOT EXISTS
  FOR (o:Organization) ON (o.sector);

CREATE INDEX org_risk_idx IF NOT EXISTS
  FOR (o:Organization) ON (o.risk_score);

// Person indexes
CREATE INDEX person_country_idx IF NOT EXISTS
  FOR (p:Person) ON (p.country);

CREATE INDEX person_risk_idx IF NOT EXISTS
  FOR (p:Person) ON (p.risk_score);

// Country indexes
CREATE INDEX country_region_idx IF NOT EXISTS
  FOR (c:Country) ON (c.region);

CREATE INDEX country_risk_idx IF NOT EXISTS
  FOR (c:Country) ON (c.risk_score);

// RiskEvent indexes
CREATE INDEX risk_event_type_idx IF NOT EXISTS
  FOR (e:RiskEvent) ON (e.event_type);

CREATE INDEX risk_event_severity_idx IF NOT EXISTS
  FOR (e:RiskEvent) ON (e.severity);

CREATE INDEX risk_event_timestamp_idx IF NOT EXISTS
  FOR (e:RiskEvent) ON (e.timestamp);

CREATE INDEX risk_event_country_idx IF NOT EXISTS
  FOR (e:RiskEvent) ON (e.country_code);

// IntelEvent indexes
CREATE INDEX intel_event_timestamp_idx IF NOT EXISTS
  FOR (e:IntelEvent) ON (e.timestamp);

CREATE INDEX intel_event_severity_idx IF NOT EXISTS
  FOR (e:IntelEvent) ON (e.severity);

CREATE INDEX intel_event_country_idx IF NOT EXISTS
  FOR (e:IntelEvent) ON (e.country_code);

// Decision indexes
CREATE INDEX decision_type_idx IF NOT EXISTS
  FOR (d:Decision) ON (d.decision_type);

CREATE INDEX decision_status_idx IF NOT EXISTS
  FOR (d:Decision) ON (d.status);

CREATE INDEX decision_created_idx IF NOT EXISTS
  FOR (d:Decision) ON (d.created_at);

// ============================================================
// FULL-TEXT SEARCH INDEXES
// ============================================================

CREATE FULLTEXT INDEX entity_name_fulltext IF NOT EXISTS
  FOR (e:Entity|Organization|Person) ON EACH [e.name, e.description];

CREATE FULLTEXT INDEX event_fulltext IF NOT EXISTS
  FOR (e:RiskEvent|IntelEvent) ON EACH [e.title, e.description];

// ============================================================
// RELATIONSHIP TYPES (documented for reference)
// Actual relationships are created in seed_data.cypher
// ============================================================

// CONNECTED_TO    — Generic connection between entities
// OWNS            — Ownership relationship (Organization/Person -> Asset/Organization)
// CONTROLS        — Control relationship without formal ownership
// OPERATES_IN     — Entity operates in a Country/Region
// RELATED_TO      — Soft relationship with optional weight
// AFFECTS         — Event/Decision affects a Country/Entity
// CAUSED_BY       — Event caused by another event or entity
// SUBSIDIARY_OF   — Organization is subsidiary of another
// EMPLOYED_BY     — Person employed by Organization
// DIRECTOR_OF     — Person is director/board member of Organization
// TRANSACTS_WITH  — Financial transaction relationship
// PARTNER_OF      — Business partnership

// ============================================================
// VERIFY SCHEMA
// ============================================================
// Run after applying schema to verify:
// CALL db.constraints() YIELD name, type RETURN name, type ORDER BY name;
// CALL db.indexes() YIELD name, type, labelsOrTypes RETURN name, type, labelsOrTypes ORDER BY name;
