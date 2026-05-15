# Fintopia

## Stack
- **Frontend**: Next.js 16.2.6 + React 19.2.4 + Tailwind CSS 4
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Ports**: Frontend :3000, Backend :8000

## Commands

```bash
# Backend (start first)
cd backend && pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm run dev
```

## Architecture
- **DB**: SQLite at `backend/db.sqlite`
- **API**: RESTful endpoints at `/api/{table_name}`
- **CORS**: Not configured — both services must run on localhost

## Critical Notes
- **Next.js 16 is bleeding edge** — APIs differ from v14/v15. Read `node_modules/next/dist/docs/` before writing code. See `frontend/AGENTS.md` for more.
- **Tailwind v4** — different config format (CSS-based, not JS). Uses `@tailwindcss/postcss`.
- **SQLAlchemy 2.0+** — deprecated warnings can be ignored but watch for API changes
- Run backend before frontend — frontend fetches `/api/items` on load

---

## Backend Status (Complete)

### Database Tables
All 6 tables created in `backend/db.sqlite`:

1. **assets_liabilities** - Stores assets and liabilities
   - Fields: id, name, type (asset/liability), description, created_at, updated_at

2. **income_expenses** - Stores income and expense categories
   - Fields: id, name, type (income/expense), description, created_at, updated_at

3. **loan_details** - Stores loan information
   - Fields: id, name, loan_type, principal, interest_rate, term_months, start_date, created_at, updated_at

4. **month_values** - Stores monthly values for assets/liabilities and income/expenses
   - Fields: id, month, year, value, item_type (asset_liability/income_expense), asset_liability_id (nullable), income_expense_id (nullable), created_at, updated_at
   - Supports filtering by month, year, and item_type

5. **events** - Stores financial events
   - Fields: id, name, event_type, start_month, start_year, no_occurrences, interval (gap between occurrences), applied (boolean), created_at, updated_at

6. **events_impact** - Stores impact of events on specific items
   - Fields: id, event_id, asset_liability_id (nullable), income_expense_id (nullable), change_type (add/subtract/replace), change_value, created_at, updated_at

### API Endpoints (Complete)
All CRUD endpoints implemented in `backend/main.py`:

| Endpoint | Description |
|----------|-------------|
| GET /api/assets-liabilities | List all assets/liabilities |
| POST /api/assets-liabilities | Create new |
| PUT /api/assets-liabilities/{id} | Update existing |
| DELETE /api/assets-liabilities/{id} | Delete |
| GET /api/income-expenses | List all income/expenses |
| POST /api/income-expenses | Create new |
| PUT /api/income-expenses/{id} | Update existing |
| DELETE /api/income-expenses/{id} | Delete |
| GET /api/loan-details | List all loans |
| POST /api/loan-details | Create new |
| PUT /api/loan-details/{id} | Update existing |
| DELETE /api/loan-details/{id} | Delete |
| GET /api/month-values | List (supports ?month=&year=&item_type= filters) |
| POST /api/month-values | Create new |
| PUT /api/month-values/{id} | Update existing |
| DELETE /api/month-values/{id} | Delete |
| GET /api/events | List all events |
| POST /api/events | Create new |
| PUT /api/events/{id} | Update existing |
| DELETE /api/events/{id} | Delete |
| GET /api/events-impact | List all event impacts |
| POST /api/events-impact | Create new |
| PUT /api/events-impact/{id} | Update existing |
| DELETE /api/events-impact/{id} | Delete |

### Dependencies
- fastapi
- uvicorn
- sqlalchemy

### Notes
- Monetary fields stored as Integer (values rounded)
- All tables include created_at and updated_at timestamps
- "applied" in Events indicates whether event is applied to respective months
- "no_occurrences" = total occurrences, "interval" = gap between occurrences