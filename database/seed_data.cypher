// ============================================================
// OMNIQ Decision Intelligence Platform — Seed Data
// Central Asia sample dataset for development and demo.
// Run AFTER schema.cypher has been applied.
//
// Contents:
//   - 5 Countries
//   - 10 Organizations
//   - 15 Persons/Entities
//   - 20+ Relationships
//   - 10 Risk Events
// ============================================================

// ── CLEAR EXISTING DATA (DEV ONLY) ───────────────────────────
// CAUTION: Only run this in development environments.
MATCH (n) DETACH DELETE n;

// ============================================================
// COUNTRIES
// ============================================================

CREATE (:Country {
  id: 'ctry-kz',
  code: 'KZ',
  name: 'Kazakhstan',
  region: 'Central Asia',
  capital: 'Astana',
  population: 19327000,
  gdp_usd_billions: 261.4,
  risk_score: 42.0,
  political_stability: 48.0,
  economic_risk: 38.0,
  security_risk: 40.0,
  governance_score: 52.0,
  currency: 'KZT',
  created_at: datetime()
});

CREATE (:Country {
  id: 'ctry-uz',
  code: 'UZ',
  name: 'Uzbekistan',
  region: 'Central Asia',
  capital: 'Tashkent',
  population: 35890000,
  gdp_usd_billions: 90.9,
  risk_score: 55.0,
  political_stability: 58.0,
  economic_risk: 52.0,
  security_risk: 55.0,
  governance_score: 44.0,
  currency: 'UZS',
  created_at: datetime()
});

CREATE (:Country {
  id: 'ctry-kg',
  code: 'KG',
  name: 'Kyrgyzstan',
  region: 'Central Asia',
  capital: 'Bishkek',
  population: 6900000,
  gdp_usd_billions: 10.8,
  risk_score: 63.0,
  political_stability: 68.0,
  economic_risk: 60.0,
  security_risk: 61.0,
  governance_score: 36.0,
  currency: 'KGS',
  created_at: datetime()
});

CREATE (:Country {
  id: 'ctry-tj',
  code: 'TJ',
  name: 'Tajikistan',
  region: 'Central Asia',
  capital: 'Dushanbe',
  population: 10135000,
  gdp_usd_billions: 10.5,
  risk_score: 71.0,
  political_stability: 73.0,
  economic_risk: 70.0,
  security_risk: 70.0,
  governance_score: 28.0,
  currency: 'TJS',
  created_at: datetime()
});

CREATE (:Country {
  id: 'ctry-tm',
  code: 'TM',
  name: 'Turkmenistan',
  region: 'Central Asia',
  capital: 'Ashgabat',
  population: 6053000,
  gdp_usd_billions: 59.8,
  risk_score: 67.0,
  political_stability: 70.0,
  economic_risk: 62.0,
  security_risk: 65.0,
  governance_score: 22.0,
  currency: 'TMT',
  created_at: datetime()
});

// ============================================================
// ORGANIZATIONS
// ============================================================

CREATE (:Organization:Entity {
  id: 'org-001',
  name: 'KazInvest JSC',
  entity_type: 'organization',
  sector: 'finance',
  country: 'KZ',
  city: 'Almaty',
  founded_year: 2003,
  employees: 1840,
  revenue_usd_millions: 420.0,
  risk_score: 28.0,
  description: 'State-affiliated investment holding company with diversified portfolio across energy, mining, and real estate.',
  is_state_owned: true,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-002',
  name: 'NurGaz LLC',
  entity_type: 'organization',
  sector: 'energy',
  country: 'KZ',
  city: 'Astana',
  founded_year: 2010,
  employees: 3200,
  revenue_usd_millions: 890.0,
  risk_score: 45.0,
  description: 'Mid-size natural gas distribution and trading company. Significant cross-border pipeline exposure.',
  is_state_owned: false,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-003',
  name: 'OilTrans KZ',
  entity_type: 'organization',
  sector: 'logistics',
  country: 'KZ',
  city: 'Atyrau',
  founded_year: 1998,
  employees: 5600,
  revenue_usd_millions: 1240.0,
  risk_score: 52.0,
  description: 'Petroleum pipeline transport operator. Operates 3,400 km of active pipeline infrastructure.',
  is_state_owned: true,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-004',
  name: 'FinHub Cyprus Ltd',
  entity_type: 'organization',
  sector: 'finance',
  country: 'CY',
  city: 'Limassol',
  founded_year: 2016,
  employees: 12,
  revenue_usd_millions: 0.0,
  risk_score: 78.0,
  description: 'Cyprus-registered holding vehicle. Beneficial ownership not publicly disclosed. Used for Central Asian investment routing.',
  is_state_owned: false,
  listed: false,
  shell_company: true,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-005',
  name: 'TradeCo UZ LLC',
  entity_type: 'organization',
  sector: 'trade',
  country: 'UZ',
  city: 'Tashkent',
  founded_year: 2008,
  employees: 890,
  revenue_usd_millions: 320.0,
  risk_score: 38.0,
  description: 'Diversified trading company operating across Uzbek and regional markets. FMCG, textiles, and agriculture.',
  is_state_owned: false,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-006',
  name: 'SilkRoute Capital SA',
  entity_type: 'organization',
  sector: 'finance',
  country: 'CH',
  city: 'Geneva',
  founded_year: 2019,
  employees: 28,
  revenue_usd_millions: 0.0,
  risk_score: 65.0,
  description: 'Swiss-registered private equity vehicle focused on Central Asian infrastructure and resource investments.',
  is_state_owned: false,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-007',
  name: 'AgroHolding Uzbekistan',
  entity_type: 'organization',
  sector: 'agriculture',
  country: 'UZ',
  city: 'Samarkand',
  founded_year: 2005,
  employees: 12400,
  revenue_usd_millions: 760.0,
  risk_score: 24.0,
  description: 'Largest privately-owned agricultural holding in Uzbekistan. Cotton, grain, and vegetable oil processing.',
  is_state_owned: false,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-008',
  name: 'MiningCo Bishkek',
  entity_type: 'organization',
  sector: 'mining',
  country: 'KG',
  city: 'Bishkek',
  founded_year: 1994,
  employees: 4200,
  revenue_usd_millions: 540.0,
  risk_score: 60.0,
  description: 'Gold and rare earth mining operator. Operates Kumtor-adjacent concessions. Environmental compliance concerns logged.',
  is_state_owned: false,
  listed: true,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-009',
  name: 'GovCorp Turkmenistan',
  entity_type: 'organization',
  sector: 'energy',
  country: 'TM',
  city: 'Ashgabat',
  founded_year: 1993,
  employees: 24000,
  revenue_usd_millions: 8200.0,
  risk_score: 55.0,
  description: 'State-owned natural gas production and export monopoly. Controls 90% of Turkmenistan gas exports.',
  is_state_owned: true,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Organization:Entity {
  id: 'org-010',
  name: 'LogisticsPro Dushanbe',
  entity_type: 'organization',
  sector: 'logistics',
  country: 'TJ',
  city: 'Dushanbe',
  founded_year: 2012,
  employees: 340,
  revenue_usd_millions: 45.0,
  risk_score: 72.0,
  description: 'Cross-border freight and logistics operator. Transit corridors: TJ-AF, TJ-KG, TJ-CN. Flagged for irregular cargo manifests.',
  is_state_owned: false,
  listed: false,
  created_at: datetime(),
  updated_at: datetime()
});

// ============================================================
// PERSONS / ENTITIES
// ============================================================

CREATE (:Person:Entity {
  id: 'per-001',
  name: 'Aibek Bekmuratov',
  entity_type: 'person',
  nationality: 'KZ',
  country: 'KZ',
  city: 'Almaty',
  date_of_birth: date('1968-04-15'),
  risk_score: 61.0,
  pep: true,
  description: 'Former Deputy Minister of Energy (2012–2018). Currently Chairman of Board at KazInvest JSC.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-002',
  name: 'Dinara Seitkali',
  entity_type: 'person',
  nationality: 'KZ',
  country: 'KZ',
  city: 'Astana',
  date_of_birth: date('1982-11-30'),
  risk_score: 24.0,
  pep: false,
  description: 'CEO of NurGaz LLC. MBA (Moscow). Prior positions at Gazprom International and KazMunayGas.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-003',
  name: 'Bobur Tashkentov',
  entity_type: 'person',
  nationality: 'UZ',
  country: 'UZ',
  city: 'Tashkent',
  date_of_birth: date('1975-07-22'),
  risk_score: 42.0,
  pep: false,
  description: 'Founder and controlling shareholder of TradeCo UZ. Known for close government connections.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-004',
  name: 'Nikolai Petrov',
  entity_type: 'person',
  nationality: 'RU',
  country: 'CY',
  city: 'Limassol',
  date_of_birth: date('1965-02-08'),
  risk_score: 84.0,
  pep: false,
  sanctions_exposure: true,
  description: 'Director of FinHub Cyprus Ltd. Russian national, Cypriot residency. Connected to 3 other shell structures in BVI and Cayman Islands.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-005',
  name: 'Gulnara Mirzaeva',
  entity_type: 'person',
  nationality: 'UZ',
  country: 'UZ',
  city: 'Samarkand',
  date_of_birth: date('1980-09-14'),
  risk_score: 18.0,
  pep: false,
  description: 'CEO AgroHolding Uzbekistan. Forbes Central Asia 50 (2022, 2023). Vocal advocate for agricultural sector modernization.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-006',
  name: 'Marat Aliyev',
  entity_type: 'person',
  nationality: 'KG',
  country: 'KG',
  city: 'Bishkek',
  date_of_birth: date('1970-03-19'),
  risk_score: 58.0,
  pep: true,
  description: 'Member of Kyrgyz Parliament (Jogorku Kenesh). Sits on natural resources committee. Beneficial owner claim on MiningCo disputed.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-007',
  name: 'Aziz Rahimov',
  entity_type: 'person',
  nationality: 'TJ',
  country: 'TJ',
  city: 'Dushanbe',
  date_of_birth: date('1978-12-01'),
  risk_score: 76.0,
  pep: false,
  description: 'Owner of LogisticsPro Dushanbe. Flagged by NEXUS for connection to irregular transit cargo manifest patterns on TJ-AF corridor.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-008',
  name: 'Svetlana Karova',
  entity_type: 'person',
  nationality: 'KZ',
  country: 'KZ',
  city: 'Atyrau',
  date_of_birth: date('1985-06-28'),
  risk_score: 22.0,
  pep: false,
  description: 'CFO OilTrans KZ. CPA (ACCA). Previously at Ernst & Young Almaty.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-009',
  name: 'Jean-Pierre Morel',
  entity_type: 'person',
  nationality: 'CH',
  country: 'CH',
  city: 'Geneva',
  date_of_birth: date('1960-08-11'),
  risk_score: 55.0,
  pep: false,
  description: 'Managing Partner at SilkRoute Capital SA. Manages Central Asian PE fund (USD 340M AUM).',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Person:Entity {
  id: 'per-010',
  name: 'Serdar Muradov',
  entity_type: 'person',
  nationality: 'TM',
  country: 'TM',
  city: 'Ashgabat',
  date_of_birth: date('1972-01-30'),
  risk_score: 48.0,
  pep: true,
  description: 'Deputy Director General of GovCorp Turkmenistan. Nephew of former Deputy Prime Minister.',
  created_at: datetime(),
  updated_at: datetime()
});

// ── Additional entities ───────────────────────────────────────

CREATE (:Asset:Entity {
  id: 'asset-001',
  name: 'Tengiz Field Pipeline Interest (12%)',
  entity_type: 'asset',
  asset_type: 'financial_interest',
  country: 'KZ',
  valuation_usd_millions: 840.0,
  risk_score: 30.0,
  description: 'Minority stake in Tengiz oil field pipeline infrastructure held through KazInvest JSC.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Asset:Entity {
  id: 'asset-002',
  name: 'Samarkand Textile Complex',
  entity_type: 'asset',
  asset_type: 'real_estate',
  country: 'UZ',
  valuation_usd_millions: 120.0,
  risk_score: 20.0,
  description: 'Industrial textile processing and manufacturing complex, 45,000 sqm.',
  created_at: datetime(),
  updated_at: datetime()
});

CREATE (:Account:Entity {
  id: 'acct-001',
  name: 'FinHub Cyprus — ABLV Account',
  entity_type: 'account',
  account_type: 'correspondent',
  institution: 'ABLV Bank (Latvian)',
  country: 'LV',
  risk_score: 88.0,
  flagged: true,
  description: 'Correspondent banking account. ABLV closed 2018 following AML findings. Transaction history under review.',
  created_at: datetime(),
  updated_at: datetime()
});

// ============================================================
// RELATIONSHIPS
// ============================================================

// Bekmuratov chairs KazInvest
MATCH (p:Person {id: 'per-001'}), (o:Organization {id: 'org-001'})
CREATE (p)-[:DIRECTOR_OF {
  role: 'Chairman of Board',
  start_date: date('2019-03-01'),
  is_current: true,
  created_at: datetime()
}]->(o);

// KazInvest owns NurGaz (60%)
MATCH (a:Organization {id: 'org-001'}), (b:Organization {id: 'org-002'})
CREATE (a)-[:OWNS {
  ownership_pct: 60.0,
  acquisition_date: date('2015-07-12'),
  vehicle: 'direct',
  created_at: datetime()
}]->(b);

// KazInvest connected to FinHub Cyprus
MATCH (a:Organization {id: 'org-001'}), (b:Organization {id: 'org-004'})
CREATE (a)-[:CONNECTED_TO {
  connection_type: 'investment_flow',
  confidence: 0.72,
  source: 'ARGUS_graph_analysis',
  created_at: datetime()
}]->(b);

// Petrov directs FinHub Cyprus
MATCH (p:Person {id: 'per-004'}), (o:Organization {id: 'org-004'})
CREATE (p)-[:DIRECTOR_OF {
  role: 'Director',
  start_date: date('2016-01-15'),
  is_current: true,
  created_at: datetime()
}]->(o);

// FinHub Cyprus funds TradeCo UZ
MATCH (a:Organization {id: 'org-004'}), (b:Organization {id: 'org-005'})
CREATE (a)-[:OWNS {
  ownership_pct: 35.0,
  acquisition_date: date('2018-04-22'),
  vehicle: 'indirect',
  created_at: datetime()
}]->(b);

// Tashkentov owns TradeCo UZ (65%)
MATCH (p:Person {id: 'per-003'}), (o:Organization {id: 'org-005'})
CREATE (p)-[:OWNS {
  ownership_pct: 65.0,
  acquisition_date: date('2008-01-01'),
  vehicle: 'direct',
  created_at: datetime()
}]->(o);

// Seitkali is CEO of NurGaz
MATCH (p:Person {id: 'per-002'}), (o:Organization {id: 'org-002'})
CREATE (p)-[:EMPLOYED_BY {
  role: 'CEO',
  start_date: date('2020-06-01'),
  is_current: true,
  created_at: datetime()
}]->(o);

// OilTrans KZ connected to NurGaz
MATCH (a:Organization {id: 'org-003'}), (b:Organization {id: 'org-002'})
CREATE (a)-[:PARTNER_OF {
  partnership_type: 'pipeline_transport_agreement',
  start_date: date('2016-01-01'),
  contract_value_usd_millions: 240.0,
  is_current: true,
  created_at: datetime()
}]->(b);

// Karova is CFO of OilTrans
MATCH (p:Person {id: 'per-008'}), (o:Organization {id: 'org-003'})
CREATE (p)-[:EMPLOYED_BY {
  role: 'CFO',
  start_date: date('2021-09-01'),
  is_current: true,
  created_at: datetime()
}]->(o);

// SilkRoute Capital invested in MiningCo Bishkek
MATCH (a:Organization {id: 'org-006'}), (b:Organization {id: 'org-008'})
CREATE (a)-[:OWNS {
  ownership_pct: 28.0,
  acquisition_date: date('2021-11-15'),
  vehicle: 'pe_fund',
  created_at: datetime()
}]->(b);

// Morel manages SilkRoute Capital
MATCH (p:Person {id: 'per-009'}), (o:Organization {id: 'org-006'})
CREATE (p)-[:EMPLOYED_BY {
  role: 'Managing Partner',
  start_date: date('2019-03-01'),
  is_current: true,
  created_at: datetime()
}]->(o);

// Aliyev is director of MiningCo (disputed)
MATCH (p:Person {id: 'per-006'}), (o:Organization {id: 'org-008'})
CREATE (p)-[:DIRECTOR_OF {
  role: 'Non-executive Director',
  start_date: date('2022-01-01'),
  is_current: true,
  ownership_claimed: true,
  ownership_disputed: true,
  created_at: datetime()
}]->(o);

// Mirzaeva owns AgroHolding
MATCH (p:Person {id: 'per-005'}), (o:Organization {id: 'org-007'})
CREATE (p)-[:OWNS {
  ownership_pct: 80.0,
  acquisition_date: date('2005-01-01'),
  vehicle: 'direct',
  created_at: datetime()
}]->(o);

// Rahimov owns LogisticsPro
MATCH (p:Person {id: 'per-007'}), (o:Organization {id: 'org-010'})
CREATE (p)-[:OWNS {
  ownership_pct: 100.0,
  acquisition_date: date('2012-01-01'),
  vehicle: 'direct',
  created_at: datetime()
}]->(o);

// Muradov works at GovCorp TM
MATCH (p:Person {id: 'per-010'}), (o:Organization {id: 'org-009'})
CREATE (p)-[:EMPLOYED_BY {
  role: 'Deputy Director General',
  start_date: date('2015-03-01'),
  is_current: true,
  pep_role: true,
  created_at: datetime()
}]->(o);

// FinHub Cyprus account flagged
MATCH (o:Organization {id: 'org-004'}), (a:Account {id: 'acct-001'})
CREATE (o)-[:OWNS {
  account_control: true,
  created_at: datetime()
}]->(a);

// KazInvest holds Tengiz asset
MATCH (o:Organization {id: 'org-001'}), (a:Asset {id: 'asset-001'})
CREATE (o)-[:OWNS {
  ownership_pct: 100.0,
  via_vehicle: 'direct_subsidiary',
  created_at: datetime()
}]->(a);

// AgroHolding owns Samarkand complex
MATCH (o:Organization {id: 'org-007'}), (a:Asset {id: 'asset-002'})
CREATE (o)-[:OWNS {
  ownership_pct: 100.0,
  created_at: datetime()
}]->(a);

// Organizations operate in countries
MATCH (o:Organization {id: 'org-001'}), (c:Country {code: 'KZ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-002'}), (c:Country {code: 'KZ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-003'}), (c:Country {code: 'KZ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-005'}), (c:Country {code: 'UZ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-007'}), (c:Country {code: 'UZ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-008'}), (c:Country {code: 'KG'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-009'}), (c:Country {code: 'TM'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

MATCH (o:Organization {id: 'org-010'}), (c:Country {code: 'TJ'})
CREATE (o)-[:OPERATES_IN {primary: true, created_at: datetime()}]->(c);

// ============================================================
// RISK EVENTS (NEXUS Intelligence Events)
// ============================================================

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-001',
  title: 'Unusual capital outflow detected — Almaty financial district',
  description: 'NEXUS transaction monitoring flagged a coordinated outflow of USD 47M through 3 intermediary entities over 72 hours. Pattern consistent with layering phase of money laundering.',
  event_type: 'economic',
  severity: 'high',
  confidence: 0.84,
  country_code: 'KZ',
  timestamp: datetime() - duration('P1D'),
  source: 'NBK Transaction Feed',
  tags: ['AML', 'capital_flight', 'layering'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-002',
  title: 'Parliamentary session outcome diverges from forecast model',
  description: 'Three critical energy sector bills failed to pass despite predicted 72% approval probability. Indicates elevated political uncertainty in KZ legislative environment.',
  event_type: 'political',
  severity: 'medium',
  confidence: 0.91,
  country_code: 'KZ',
  timestamp: datetime() - duration('P3D'),
  source: 'NEXUS Political Monitor',
  tags: ['legislative', 'energy_policy', 'forecast_deviation'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-003',
  title: 'New bilateral trade agreement — UZ-CN hydrocarbons sector',
  description: 'Uzbekistan and China signed a bilateral gas supply agreement covering 15 BCM/year at a fixed price arrangement. Expected to reduce UZ dependence on Russian transit infrastructure.',
  event_type: 'trade',
  severity: 'low',
  confidence: 0.96,
  country_code: 'UZ',
  timestamp: datetime() - duration('P5D'),
  source: 'Customs API / Ministry Press Release',
  tags: ['trade', 'hydrocarbons', 'bilateral', 'China'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-004',
  title: 'Anomalous border crossing pattern — KG southern checkpoint',
  description: 'NEXUS sensor network detected 340% increase in cargo vehicle crossings at the Irkeshtam checkpoint over 5-day period. Cargo manifests show inconsistencies with declared goods categories.',
  event_type: 'security',
  severity: 'high',
  confidence: 0.78,
  country_code: 'KG',
  timestamp: datetime() - duration('P2D'),
  source: 'NEXUS Border Sensor',
  tags: ['border', 'smuggling_indicator', 'cargo_anomaly'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-005',
  title: 'Infrastructure investment surge — TJ hydropower',
  description: 'Three new Chinese SOE contracts worth USD 1.8B signed for Rogun Dam infrastructure works. Tajikistan public debt trajectory updated to reflect increased BRI exposure.',
  event_type: 'economic',
  severity: 'medium',
  confidence: 0.88,
  country_code: 'TJ',
  timestamp: datetime() - duration('P7D'),
  source: 'Procurement Database',
  tags: ['BRI', 'debt', 'infrastructure', 'China'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-006',
  title: 'TM gas export revenue decline — Q2',
  description: 'GovCorp Turkmenistan Q2 export revenues fell 18% below forecast due to TAPI pipeline delays and reduced Chinese purchase volumes. Fiscal pressure indicator elevated.',
  event_type: 'economic',
  severity: 'medium',
  confidence: 0.83,
  country_code: 'TM',
  timestamp: datetime() - duration('P10D'),
  source: 'GovCorp Liaison / IMF Data',
  tags: ['revenue', 'fiscal_risk', 'gas_exports'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-007',
  title: 'Water sharing dispute escalation — UZ-KG border',
  description: 'Armed standoff at Sokh Valley water resource point. 2 casualties reported. NEXUS conflict proximity index for this corridor elevated from MEDIUM to HIGH.',
  event_type: 'security',
  severity: 'high',
  confidence: 0.92,
  country_code: 'KG',
  timestamp: datetime() - duration('P14D'),
  source: 'OSINT + Partner Agency',
  tags: ['border_conflict', 'water_rights', 'security_incident'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-008',
  title: 'KZ inflation exceeds central bank target for 4th consecutive month',
  description: 'CPI reached 9.2% YoY in reported month. National Bank of Kazakhstan emergency rate decision convened. AURORA risk model probability of stagflation scenario increased to 28%.',
  event_type: 'economic',
  severity: 'medium',
  confidence: 0.97,
  country_code: 'KZ',
  timestamp: datetime() - duration('P4D'),
  source: 'NBK Official Data',
  tags: ['inflation', 'monetary_policy', 'stagflation_risk'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-009',
  title: 'UZ governance reform package — parliament approval',
  description: 'Uzbekistan parliament passed comprehensive anti-corruption package with 89% approval. Includes asset declaration requirements for PEPs and beneficial ownership registry.',
  event_type: 'political',
  severity: 'low',
  confidence: 0.95,
  country_code: 'UZ',
  timestamp: datetime() - duration('P6D'),
  source: 'Uzbek Parliament Press Service',
  tags: ['governance', 'anti_corruption', 'reform', 'PEP'],
  created_at: datetime()
});

CREATE (:RiskEvent:IntelEvent {
  id: 'evt-010',
  title: 'LogisticsPro TJ — irregular cargo manifest pattern confirmed',
  description: 'ARGUS entity resolution confirmed LogisticsPro Dushanbe declared cargo mismatch across 12 of 34 reviewed border crossings. NEXUS cross-references with 3 known narcotics transit routes.',
  event_type: 'security',
  severity: 'high',
  confidence: 0.76,
  country_code: 'TJ',
  timestamp: datetime() - duration('P1D'),
  source: 'NEXUS Sensor + ARGUS Cross-reference',
  tags: ['narcotics_transit', 'cargo_fraud', 'logistics', 'ARGUS_link'],
  created_at: datetime()
});

// Link risk events to entities and countries
MATCH (e:RiskEvent {id: 'evt-001'}), (c:Country {code: 'KZ'})
CREATE (e)-[:AFFECTS {impact_type: 'economic', created_at: datetime()}]->(c);

MATCH (e:RiskEvent {id: 'evt-004'}), (c:Country {code: 'KG'})
CREATE (e)-[:AFFECTS {impact_type: 'security', created_at: datetime()}]->(c);

MATCH (e:RiskEvent {id: 'evt-010'}), (o:Organization {id: 'org-010'})
CREATE (e)-[:RELATED_TO {relationship: 'subject', created_at: datetime()}]->(o);

MATCH (e:RiskEvent {id: 'evt-010'}), (p:Person {id: 'per-007'})
CREATE (e)-[:RELATED_TO {relationship: 'associated_person', created_at: datetime()}]->(p);

MATCH (e:RiskEvent {id: 'evt-001'}), (o:Organization {id: 'org-004'})
CREATE (e)-[:RELATED_TO {relationship: 'financial_flow_entity', created_at: datetime()}]->(o);

// ============================================================
// VERIFY SEED DATA
// ============================================================
// Run these queries to confirm data loaded correctly:
//
// MATCH (n) RETURN labels(n)[0] AS label, count(n) AS count ORDER BY count DESC;
// MATCH ()-[r]->() RETURN type(r) AS rel_type, count(r) AS count ORDER BY count DESC;
// MATCH (o:Organization)-[r:OWNS]->(t) RETURN o.name, r.ownership_pct, t.name;
