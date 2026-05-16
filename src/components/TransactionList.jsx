import { useState, useEffect, useRef } from 'react'
import { getCategoryLabel, getCategoryIcon } from '../utils/categories'
import styles from './TransactionList.module.css'

function fmt(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function fmtDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

export default function TransactionList({ transactions, onDelete, showFilters = true }) {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date-desc')
  const [pendingId, setPendingId] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  function handleDelete(id) {
    if (pendingId && timerRef.current) {
      clearTimeout(timerRef.current)
      onDelete(pendingId)
    }
    setPendingId(id)
    timerRef.current = setTimeout(() => {
      onDelete(id)
      setPendingId(null)
    }, 4500)
  }

  function handleUndo() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setPendingId(null)
  }

  const visible = transactions.filter(t => t.id !== pendingId)
  const filtered = visible.filter(t => filter === 'all' || t.type === filter)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'date-asc')     return a.date.localeCompare(b.date)
    if (sort === 'amount-desc')  return b.amount - a.amount
    if (sort === 'amount-asc')   return a.amount - b.amount
    return b.date.localeCompare(a.date)
  })

  return (
    <div className={styles.wrapper}>
      {showFilters && (
        <div className={styles.controls}>
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
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Trier par"
          >
            <option value="date-desc">Date (récent)</option>
            <option value="date-asc">Date (ancien)</option>
            <option value="amount-desc">Montant décroissant</option>
            <option value="amount-asc">Montant croissant</option>
          </select>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          <p>Aucune transaction à afficher.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {sorted.map(t => (
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
                  onClick={() => handleDelete(t.id)}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendingId && (
        <div className={styles.toast} role="status" aria-live="polite">
          <span>Transaction supprimée</span>
          <button className={styles.toastUndo} onClick={handleUndo}>
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
