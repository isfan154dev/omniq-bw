# OMNIQ Ontology Engine
## Схема знаний для узбекского рынка

**Версия:** 0.1  
**Статус:** Draft  
**Применение:** Neo4j граф-схема + AURORA промпты + риск-правила

---

## 1. СУЩНОСТИ (Entity Types)

### 1.1 Юридические лица

(:Company)
  - id: String (ИНН/ПИНФЛ)
  - name: String
  - legal_form: Enum [ООО, АО, ГП, ИП, НКО, ПАО]
  - status: Enum [Активна, Ликвидирована, Реорганизована, Банкрот]
  - registration_date: Date
  - registered_capital: Float (UZS)
  - actual_address: String
  - tax_regime: Enum [Общий, Упрощённый, НДС]
  - risk_score: Int (0-100)
  - data_sources: String[]  // Солиқ, Божхона, my.gov.uz

(:Person)
  - id: String (ПИНФЛ)
  - name: String
  - birth_date: Date
  - is_pep: Boolean  // политически значимое лицо
  - is_sanctioned: Boolean
  - risk_score: Int (0-100)

(:GovEntity)
  - id: String
  - name: String
  - type: Enum [Министерство, Агентство, Хокимият, Регулятор, ГП, Фонд]
  - budget_usd: Float
  - sector: String
  - risk_score: Int (0-100)

(:Contract)
  - id: String
  - type: Enum [Тендер, Прямая_закупка, Концессия, ГЧП]
  - amount_usd: Float
  - status: Enum [Активный, Завершён, Расторгнут, Спорный]
  - risk_score: Int (0-100)

---

## 2. ОТНОШЕНИЯ (Relationship Types)

### 2.1 Владение и контроль
(:Person)-[:ЯВЛЯЕТСЯ_УЧРЕДИТЕЛЕМ {share_pct, date_from}]->(:Company)
(:Person)-[:ЯВЛЯЕТСЯ_БЕНЕФИЦИАРОМ {share_pct >= 25}]->(:Company)
(:Company)-[:ВЛАДЕЕТ {share_pct}]->(:Company)
(:Person)-[:ИМЕЕТ_ДОВЕРЕННОСТЬ {valid_until}]->(:Company)
(:Person)-[:ЯВЛЯЕТСЯ_ДИРЕКТОРОМ {appointed, dismissed?}]->(:Company)

### 2.2 Аффилированность (СНГ-специфика)
(:Person)-[:ЯВЛЯЕТСЯ_СУПРУГОМ]->(:Person)
(:Person)-[:ЯВЛЯЕТСЯ_РОДСТВЕННИКОМ {degree: 1=дети/родители, 2=братья}]->(:Person)
(:Person)-[:ЯВЛЯЕТСЯ_ДЕЛОВЫМ_ПАРТНЁРОМ {since}]->(:Person)
(:Company)-[:АФФИЛИРОВАНА_С {reason}]->(:Company)

### 2.3 Государственные связи
(:Person)-[:ЗАНИМАЕТ_ДОЛЖНОСТЬ {title, since, until?}]->(:GovEntity)
(:Company)-[:ИМЕЕТ_ГОСКОНТРАКТ {amount}]->(:GovEntity)
(:Company)-[:ПОЛУЧИЛА_ЛИЦЕНЗИЮ {type, issued}]->(:GovEntity)
(:GovEntity)-[:ВЫДАЛА_ТЕНДЕР {amount}]->(:Contract)
(:Company)-[:ВЫИГРАЛА_ТЕНДЕР]->(:Contract)

### 2.4 Финансовые потоки
(:Company)-[:ПЕРЕВЕЛА {amount, date}]->(:Company)
(:Company)-[:ПОЛУЧИЛА_ЗАЙМ {amount, rate}]->(:Company)
(:BankAccount)-[:ПРИНАДЛЕЖИТ]->(:Company)
(:Transaction)-[:ОТ]->(:BankAccount)
(:Transaction)-[:К]->(:BankAccount)

### 2.5 Таможня и ВЭД (Божхона)
(:Company)-[:ИМПОРТИРОВАЛА {value_usd, goods, date}]->(:Company)
(:Company)-[:ЭКСПОРТИРОВАЛА {value_usd, goods, date}]->(:Company)

---

## 3. ПРАВИЛА ВЫВОДА (Inference Rules)

### 3.1 Конфликт интересов
MATCH (person:Person)-[:ЗАНИМАЕТ_ДОЛЖНОСТЬ]->(gov:GovEntity)
MATCH (person)-[:ЯВЛЯЕТСЯ_УЧРЕДИТЕЛЕМ]->(company:Company)
MATCH (company)-[:ВЫИГРАЛА_ТЕНДЕР]->(contract:Contract)
MATCH (gov)-[:ВЫДАЛА_ТЕНДЕР]->(contract)
=> risk_score +40, CREATE :КОНФЛИКТ_ИНТЕРЕСОВ

### 3.2 Круговые транзакции (отмывание)
MATCH path = (a:Company)-[:ПЕРЕВЕЛА*2..5]->(a)
WHERE length(path) >= 3
=> risk_score = 85, flag: КРУГОВАЯ_СХЕМА

### 3.3 Фиктивная компания
IF revenue > $1M AND employees < 10 AND age < 2 years
=> risk_score +50, flag: ВОЗМОЖНАЯ_ПОДСТАВНАЯ

### 3.4 Номинальный директор
IF person is director in 5+ companies
=> risk_score +30, flag: НОМИНАЛЬНЫЙ_ДИРЕКТОР

### 3.5 Аффилированный тендер
IF winner.owner IS_RELATIVE_OF contract.commission_member
=> contract.risk_score = 95, flag: АФФИЛИРОВАННЫЙ_ПОБЕДИТЕЛЬ

### 3.6 Массовый адрес
IF 10+ companies share same legal_address
=> risk_score +20, flag: МАССОВЫЙ_АДРЕС

---

## 4. ИСТОЧНИКИ ДАННЫХ

| Источник | Тип данных | Обновление |
|----------|-----------|------------|
| Солиқ (soliq.uz) | ИНН, налоги, выручка | Ежеквартально |
| Божхона (customs.uz) | Импорт/экспорт | Ежемесячно |
| my.gov.uz | Регистрация, учредители | При изменениях |
| ЦБ (cbu.uz) | Валютные операции | Ежедневно |
| Госзакупки (zakupki.uz) | Тендеры, контракты | Реальное время |
| Суды (sud.uz) | Арбитраж, банкротства | Еженедельно |

---

## 5. УРОВНИ РИСКА

0-19   НИЗКИЙ    Стандартный мониторинг
20-39  СРЕДНИЙ   Усиленный мониторинг
40-69  ВЫСОКИЙ   Требует проверки
70-100 КРИТИЧНЫЙ Немедленное расследование

### Факторы риска:
| Фактор | +Риск |
|--------|-------|
| Связь с ПЭП | +30 |
| Круговые транзакции | +40 |
| Конфликт интересов | +40 |
| Аффилированный тендер | +50 |
| Номинальный директор | +20 |
| Массовый адрес | +20 |
| Молодая компания + высокая выручка | +30 |
| Офшорный учредитель | +25 |
| Санкции | +60 |

---

## 6. ПЛАН РАЗРАБОТКИ

### Фаза 1 - MVP (текущая)
- [x] Neo4j с базовыми сущностями (50 компаний, 25 госструктур)
- [x] Базовые типы связей в ARGUS/NEXUS
- [x] Риск-скоринг по простым правилам

### Фаза 2 - Интеграция данных
- [ ] Парсер Солиқ (ИНН + статус + выручка)
- [ ] Парсер my.gov.uz (учредители + директора)
- [ ] Загрузка тендеров zakupki.uz
- [ ] Полная схема Neo4j по данной онтологии

### Фаза 3 - Inference Engine
- [ ] Реализация правил вывода на Cypher
- [ ] Автообновление риск-скоров
- [ ] Алерты при превышении порогов

### Фаза 4 - AURORA Integration
- [ ] Claude API с доступом к Neo4j через tool calling
- [ ] Голосовой интерфейс на RU/UZ
- [ ] Автогенерация отчётов PDF

---

*OMNIQ Ontology Engine v0.1 — Конфиденциально*
