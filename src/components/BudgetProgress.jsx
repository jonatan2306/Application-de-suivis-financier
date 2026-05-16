import { useState } from 'react'
import styles from './BudgetProgress.module.css'

const fmt = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getGaugeColor(pct) {
  if (pct >= 100) return '#ff4d6d'
  if (pct >= 80)  return '#fbbf24'
  if (pct >= 55)  return '#818cf8'
  return '#00e5a0'
}

function CircleGauge({ pct, color }) {
  const clamped = Math.min(pct, 100)
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <svg className={styles.gauge} viewBox="0 0 120 120" aria-hidden="true">
      <circle
        cx="60" cy="60" r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.055)"
        strokeWidth="9"
      />
      <circle
        cx="60" cy="60" r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.85s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
      />
      <text
        x="60" y="56"
        textAnchor="middle"
        fill={color}
        fontSize="19"
        fontWeight="700"
        fontFamily="'JetBrains Mono', monospace"
      >
        {Math.round(clamped)}%
      </text>
      <text
        x="60" y="72"
        textAnchor="middle"
        fill="rgba(226,232,248,0.3)"
        fontSize="8.5"
        fontFamily="'Manrope', sans-serif"
        fontWeight="700"
        letterSpacing="1.2"
      >
        UTILISÉ
      </text>
    </svg>
  )
}

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export default function BudgetProgress({ monthlyBudget, setMonthlyBudget, monthlyExpenses }) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const hasBudget = monthlyBudget !== null && monthlyBudget > 0
  const pct = hasBudget ? (monthlyExpenses / monthlyBudget) * 100 : 0
  const remaining = hasBudget ? monthlyBudget - monthlyExpenses : 0
  const isOver = remaining < 0
  const isWarning = pct >= 80 && pct < 100
  const color = getGaugeColor(pct)

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
        <div className={styles.setupContent}>
          <div className={styles.setupIconWrap}>
            <ClockIcon />
          </div>
          <div>
            <p className={styles.setupTitle}>
              {editing ? 'Modifier le budget mensuel' : 'Définir un budget mensuel'}
            </p>
            <p className={styles.setupSub}>Fixez un plafond pour piloter vos dépenses</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <input
              type="number"
              className={styles.input}
              placeholder="2 000"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              min="1"
              step="0.01"
              autoFocus
            />
            <span className={styles.inputUnit}>EUR</span>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              {editing ? 'Mettre à jour' : 'Définir'}
            </button>
            {editing && (
              <button type="button" className={styles.btnSecondary} onClick={cancelEdit}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.gaugeWrap}>
          <CircleGauge pct={pct} color={color} />
        </div>

        <div className={styles.details}>
          <div className={styles.titleRow}>
            <span className={styles.cardTitle}>Budget mensuel</span>
            {isOver && <span className={styles.badgeOver}>Dépassé</span>}
            {isWarning && <span className={styles.badgeWarn}>Attention</span>}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Plafond</span>
              <span className={styles.statValue}>{fmt(monthlyBudget)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Dépensé</span>
              <span className={`${styles.statValue} ${styles.spent}`}>{fmt(monthlyExpenses)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>{isOver ? 'Dépassement' : 'Restant'}</span>
              <span className={`${styles.statValue} ${isOver ? styles.over : styles.remaining}`}>
                {fmt(Math.abs(remaining))}
              </span>
            </div>
          </div>

          <button className={styles.editBtn} onClick={startEdit}>
            <EditIcon />
            Modifier le budget
          </button>
        </div>
      </div>
    </div>
  )
}
