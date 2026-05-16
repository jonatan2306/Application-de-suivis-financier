import { useState } from 'react'
import styles from './BudgetProgress.module.css'

function fmt(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function BudgetProgress({ monthlyBudget, setMonthlyBudget, monthlyExpenses }) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const hasBudget = monthlyBudget !== null && monthlyBudget > 0
  const pct = hasBudget ? (monthlyExpenses / monthlyBudget) * 100 : 0
  const barPct = Math.min(pct, 100)
  const remaining = hasBudget ? monthlyBudget - monthlyExpenses : 0
  const isOver = remaining < 0
  const isWarning = pct >= 80 && pct < 100

  function getBarColor(p) {
    if (p >= 100) return '#ef4444'
    if (p >= 80)  return '#8b5cf6'
    if (p >= 60)  return '#ec4899'
    if (p >= 40)  return '#eab308'
    if (p >= 25)  return '#f97316'
    return '#10b981'
  }

  const barColor = getBarColor(pct)

  function handleSubmit(e) {
    e.preventDefault()
    const val = parseFloat(inputValue.replace(',', '.'))
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val)
      setEditing(false)
      setInputValue('')
    }
  }

  function startEdit() {
    setInputValue(monthlyBudget ? String(monthlyBudget) : '')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setInputValue('')
  }

  if (!hasBudget || editing) {
    return (
      <div className={styles.card}>
        <div className={styles.setupHeader}>
          <span className={styles.setupIcon}>🎯</span>
          <div>
            <p className={styles.setupTitle}>
              {editing ? 'Modifier le budget mensuel' : 'Définir un budget mensuel'}
            </p>
            <p className={styles.setupSubtitle}>
              Fixez un plafond pour suivre vos dépenses ce mois-ci
            </p>
          </div>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="number"
            className={styles.input}
            placeholder="Ex : 2000"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            min="1"
            step="0.01"
            autoFocus
          />
          <span className={styles.inputSuffix}>€</span>
          <button type="submit" className={styles.btnPrimary}>
            {editing ? 'Mettre à jour' : 'Définir'}
          </button>
          {editing && (
            <button type="button" className={styles.btnSecondary} onClick={cancelEdit}>
              Annuler
            </button>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Budget mensuel</span>
          {isOver && <span className={styles.badge}>Dépassé !</span>}
          {isWarning && <span className={`${styles.badge} ${styles.badgeWarn}`}>Attention</span>}
        </div>
        <button className={styles.editBtn} onClick={startEdit}>Modifier</button>
      </div>

      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${barPct}%`, background: barColor }}
        />
      </div>

      <div className={styles.pctLabel} style={{ color: barColor }}>
        {pct.toFixed(0)} % du budget utilisé
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Plafond</span>
          <span className={styles.statValue}>{fmt(monthlyBudget)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Dépensé ce mois</span>
          <span className={`${styles.statValue} ${styles.spent}`}>{fmt(monthlyExpenses)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{isOver ? 'Dépassement' : 'Restant'}</span>
          <span className={`${styles.statValue} ${isOver ? styles.over : styles.remaining}`}>
            {fmt(Math.abs(remaining))}
          </span>
        </div>
      </div>
    </div>
  )
}
