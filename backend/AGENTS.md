# Fintopia Backend

## Stack
- FastAPI + SQLAlchemy + SQLite
- Port: 8000

## Commands
```bash
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## Database
- SQLite at `backend/db.sqlite`
- 6 tables: assets_liabilities, income_expenses, loan_details, month_values, events, events_impact

## API Endpoints
All CRUD endpoints at `/api/{table_name}`:
- `/api/assets-liabilities` - Assets/Liabilities CRUD
- `/api/income-expenses` - Income/Expenses CRUD
- `/api/loan-details` - Loans CRUD
- `/api/month-values` - Monthly values (supports ?month=&year=&item_type= filters)
- `/api/events` - Events CRUD
- `/api/events-impact` - Event impacts CRUD

## Notes
- Monetary fields stored as Integer (rounded values)
- All tables have created_at and updated_at timestamps
- SQLAlchemy 2.0+ used