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

const LogoIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const OnboardingIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 10l3 3 3-3 3 3" />
  </svg>
)

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
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGrid} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>
              <LogoIcon />
            </div>
            <span className={styles.logoText}>
              Fin<span className={styles.logoAccent}>track</span>
            </span>
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
            <div className={styles.onboardingIconWrap}>
              <OnboardingIcon />
            </div>
            <h2 className={styles.onboardingTitle}>Bienvenue dans Fintrack</h2>
            <p className={styles.onboardingDesc}>
              Ajoutez votre première transaction pour visualiser vos finances en temps réel.
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
