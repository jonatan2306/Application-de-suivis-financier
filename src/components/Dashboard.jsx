import { useState, useEffect, useRef } from 'react'
import styles from './Dashboard.module.css'

const fmt = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

function useCountUp(target, duration = 1300) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const startTime = performance.now()
    setValue(0)

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(target * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

const CARD_CONFIG = {
  income: {
    color: '#00e5a0',
    glow: 'rgba(0, 229, 160, 0.22)',
    bg: 'rgba(0, 229, 160, 0.09)',
    border: 'rgba(0, 229, 160, 0.28)',
  },
  expense: {
    color: '#ff4d6d',
    glow: 'rgba(255, 77, 109, 0.22)',
    bg: 'rgba(255, 77, 109, 0.09)',
    border: 'rgba(255, 77, 109, 0.28)',
  },
  positive: {
    color: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.22)',
    bg: 'rgba(129, 140, 248, 0.09)',
    border: 'rgba(129, 140, 248, 0.28)',
  },
  negative: {
    color: '#ff4d6d',
    glow: 'rgba(255, 77, 109, 0.22)',
    bg: 'rgba(255, 77, 109, 0.09)',
    border: 'rgba(255, 77, 109, 0.28)',
  },
}

function WaveDecoration({ color }) {
  return (
    <svg className={styles.wave} viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,28 C40,6 90,50 140,28 C185,8 220,44 260,24 L260,56 L0,56 Z"
        fill={color}
        opacity="0.07"
      />
      <path
        d="M0,38 C55,16 110,52 170,34 C205,24 235,42 260,32 L260,56 L0,56 Z"
        fill={color}
        opacity="0.04"
      />
    </svg>
  )
}

function KPICard({ label, amount, type, icon, delay }) {
  const animated = useCountUp(amount, 1300)
  const cfg = CARD_CONFIG[type]

  return (
    <div
      className={styles.card}
      style={{
        '--c': cfg.color,
        '--glow': cfg.glow,
        '--bg': cfg.bg,
        '--bd': cfg.border,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className={styles.topLine} />
      <div className={styles.cardBody}>
        <div className={styles.iconWrap}>{icon}</div>
        <div className={styles.info}>
          <span className={styles.label}>{label}</span>
          <span className={styles.amount}>{fmt(animated)}</span>
        </div>
      </div>
      <WaveDecoration color={cfg.color} />
    </div>
  )
}

const IncomeIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

const ExpenseIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
)

const BalanceIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

export default function Dashboard({ totalIncome, totalExpenses, balance }) {
  return (
    <div className={styles.grid}>
      <KPICard
        label="Revenus totaux"
        amount={totalIncome}
        type="income"
        icon={<IncomeIcon />}
        delay={0}
      />
      <KPICard
        label="Dépenses totales"
        amount={totalExpenses}
        type="expense"
        icon={<ExpenseIcon />}
        delay={110}
      />
      <KPICard
        label="Solde restant"
        amount={balance}
        type={balance >= 0 ? 'positive' : 'negative'}
        icon={<BalanceIcon />}
        delay={220}
      />
    </div>
  )
}
