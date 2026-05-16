# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

There is no test runner or linter configured.

## Architecture

**Stack**: React 18 + Vite, Recharts for charting, CSS Modules for styling. No TypeScript, no router library.

**Navigation** is tab-based, managed entirely by a `tab` state string in `App.jsx` (`'dashboard'` | `'add'` | `'transactions'`). There is no URL routing.

**State** lives exclusively in `src/hooks/useTransactions.js`. This hook owns:
- The transaction list (persisted to `localStorage` under `budget_transactions`)
- The monthly budget limit (persisted under `budget_monthly_limit`)
- All derived values: `totalIncome`, `totalExpenses`, `balance`, `expensesByCategory`, `monthlyExpenses`

Components receive data and callbacks as props — they hold no domain state themselves (only local UI state like form values or filter selections).

**Categories** are static arrays defined in `src/utils/categories.js` (`INCOME_CATEGORIES`, `EXPENSE_CATEGORIES`, `CHART_COLORS`). Helper functions `getCategoryLabel` and `getCategoryIcon` look up display values by category id and type (`'income'` | `'expense'`). To add a category, edit those arrays.

**Undo-delete** in `TransactionList` works via a `pendingId` + `setTimeout` pattern: the item is hidden from the list immediately but only deleted from state after a 4.5-second delay, giving the user time to cancel via the toast.

**Currency and locale**: all monetary formatting uses `Intl.NumberFormat('fr-FR', { currency: 'EUR' })`. The UI language is French throughout.

**Styling**: each component has a co-located `.module.css` file. There is a global `src/index.css` for resets and CSS custom properties.
