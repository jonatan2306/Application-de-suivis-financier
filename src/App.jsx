import { useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import Dashboard from './components/Dashboard'
import BudgetProgress from './components/BudgetProgress'
import CategoryChart from './components/CategoryChart'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import styles from './App.module.css'

const TABS = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'add', label: 'Ajouter' },
  { id: 'transactions', label: 'Transactions' },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory,
    monthlyBudget,
    setMonthlyBudget,
    monthlyExpenses,
  } = useTransactions()

  function handleAdd(transaction) {
    addTransaction(transaction)
    setTab('transactions')
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💰</span>
            <span className={styles.logoText}>BudgetTracker</span>
          </div>
          <nav className={styles.nav}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.navBtn} ${tab === t.id ? styles.navActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {tab === 'dashboard' && transactions.length === 0 && (
          <div className={styles.onboarding}>
            <div className={styles.onboardingIcon}>📊</div>
            <h2 className={styles.onboardingTitle}>Bienvenue dans BudgetTracker</h2>
            <p className={styles.onboardingDesc}>
              Commencez par ajouter votre première transaction pour visualiser vos finances.
            </p>
            <button className={styles.onboardingBtn} onClick={() => setTab('add')}>
              Ajouter ma première transaction
            </button>
          </div>
        )}

        {tab === 'dashboard' && transactions.length > 0 && (
          <div className={styles.dashboardLayout}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Résumé financier</h2>
              <Dashboard
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                balance={balance}
              />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Budget du mois</h2>
              <BudgetProgress
                monthlyBudget={monthlyBudget}
                setMonthlyBudget={setMonthlyBudget}
                monthlyExpenses={monthlyExpenses}
              />
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dépenses par catégorie</h2>
              <div className={styles.card}>
                <CategoryChart expensesByCategory={expensesByCategory} />
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Transactions récentes</h2>
                {transactions.length > 5 && (
                  <button className={styles.link} onClick={() => setTab('transactions')}>
                    Voir tout →
                  </button>
                )}
              </div>
              <div className={styles.card}>
                <TransactionList
                  transactions={transactions.slice(0, 5)}
                  onDelete={deleteTransaction}
                  showFilters={false}
                />
              </div>
            </section>
          </div>
        )}

        {tab === 'add' && (
          <div className={styles.centeredLayout}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Nouvelle transaction</h2>
              <div className={styles.formCard}>
                <TransactionForm onAdd={handleAdd} />
              </div>
            </section>
          </div>
        )}

        {tab === 'transactions' && (
          <div className={styles.dashboardLayout}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Toutes les transactions</h2>
              <div className={styles.card}>
                <TransactionList
                  transactions={transactions}
                  onDelete={deleteTransaction}
                />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
