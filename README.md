# BudgetTracker

Application de suivi financier personnel construite avec React + Vite.

## Fonctionnalités

- **Tableau de bord** — résumé des revenus, dépenses et solde
- **Budget mensuel** — plafond configurable avec barre de progression colorée
- **Graphique** — répartition des dépenses par catégorie (donut chart)
- **Transactions** — ajout, filtrage et suppression des revenus/dépenses
- **Persistance** — données sauvegardées dans le `localStorage`
- **Responsive** — adapté mobile et desktop

## Stack technique

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Recharts 2](https://recharts.org/)
- CSS Modules

## Installation

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Build

```bash
npm run build
```

## Structure du projet

```
src/
├── components/
│   ├── BudgetProgress   # Barre de progression du budget mensuel
│   ├── CategoryChart    # Graphique donut des dépenses
│   ├── Dashboard        # Cartes de résumé financier
│   ├── TransactionForm  # Formulaire d'ajout de transaction
│   └── TransactionList  # Liste et filtrage des transactions
├── hooks/
│   └── useTransactions  # Logique centrale et calculs
└── utils/
    └── categories       # Définitions des catégories
```
