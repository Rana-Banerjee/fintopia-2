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
- **API**: `GET/POST /api/items`
- **CORS**: Not configured — both services must run on localhost

## Critical Notes

- **Next.js 16 is bleeding edge** — APIs differ from v14/v15. Read `node_modules/next/dist/docs/` before writing code. See `frontend/AGENTS.md` for more.
- **Tailwind v4** — different config format (CSS-based, not JS). Uses `@tailwindcss/postcss`.
- **SQLAlchemy 2.0+** — deprecated warnings can be ignored but watch for API changes
- Run backend before frontend — frontend fetches `/api/items` on load