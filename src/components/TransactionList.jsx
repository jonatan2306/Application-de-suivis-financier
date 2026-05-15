import { useState } from 'react'
import { getCategoryLabel, getCategoryIcon } from '../utils/categories'
import styles from './TransactionList.module.css'

function fmt(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function fmtDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

export default function TransactionList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        {['all', 'income', 'expense'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tout' : f === 'income' ? 'Revenus' : 'Dépenses'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucune transaction à afficher.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map(t => (
            <li key={t.id} className={styles.item}>
              <div className={`${styles.iconBadge} ${t.type === 'income' ? styles.incomeBadge : styles.expenseBadge}`}>
                {getCategoryIcon(t.category, t.type)}
              </div>
              <div className={styles.details}>
                <span className={styles.category}>
                  {getCategoryLabel(t.category, t.type)}
                </span>
                {t.description && (
                  <span className={styles.description}>{t.description}</span>
                )}
                <span className={styles.date}>{fmtDate(t.date)}</span>
              </div>
              <div className={styles.right}>
                <span className={`${styles.amount} ${t.type === 'income' ? styles.incomeAmount : styles.expenseAmount}`}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </span>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(t.id)}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
