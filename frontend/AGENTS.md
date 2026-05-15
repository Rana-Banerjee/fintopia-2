<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Fintopia Frontend Agent Context

## Project Status

### Completed Features

A personal finance dashboard with a settings modal containing 5 tabs:

- **Assets** - Track assets with name, type, sub-type (Liquid/Semi-Liquid/Fixed), annual appreciation %, appreciation frequency
- **Liabilities** - Track liabilities with same fields as assets
- **Incomes** - Track income sources with accrual frequency, annual appreciation %, start/end month-year, associated asset
- **Expenses** - Track expenses with same fields as incomes
- **Loans** - Track loans with interest rate, EMI start/end month-year, EMI value

Each tab includes:
- Form to add/edit entries
- Scrollable list below showing entries grouped by subtypes
- Drag-and-drop reordering functionality
- Edit and delete capabilities for each row

### Tech Stack
- Next.js 16.2.6
- React 19.2.4
- Tailwind CSS 4
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities for drag-and-drop
- uuid for generating unique IDs
- localStorage for data persistence (API integration pending)

### Created Files

| File | Purpose |
|------|---------|
| `app/types.ts` | TypeScript interfaces for AssetLiability, IncomeExpense, Loan |
| `app/hooks/useLocalStorage.ts` | localStorage persistence hook with lazy initializer pattern |
| `app/components/AssetLiabilityForm.tsx` | Form for Assets/Liabilities |
| `app/components/IncomeExpenseForm.tsx` | Form for Incomes/Expenses |
| `app/components/LoanForm.tsx` | Form for Loans |
| `app/components/SortableList.tsx` | Draggable grouped list for Assets/Liabilities |
| `app/components/SortableIncomeExpenseList.tsx` | Draggable list for Incomes/Expenses |
| `app/components/SortableLoanList.tsx` | Draggable list for Loans |
| `app/page.tsx` | Main page with settings modal integrating all components |

### Current State
- Build passes: `npm run build`
- Lint passes: `npm run lint`
- All TypeScript types resolved

### Next Steps
- Connect to backend API (FastAPI + SQLAlchemy + SQLite at port 8000)
- Add data validation
- Add unit/integration tests