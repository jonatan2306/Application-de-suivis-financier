import styles from './Dashboard.module.css'

function fmt(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export default function Dashboard({ totalIncome, totalExpenses, balance }) {
  return (
    <div className={styles.grid}>
      <div className={`${styles.card} ${styles.income}`}>
        <div className={styles.icon}>↑</div>
        <div className={styles.info}>
          <span className={styles.label}>Revenus totaux</span>
          <span className={styles.amount}>{fmt(totalIncome)}</span>
        </div>
      </div>

      <div className={`${styles.card} ${styles.expense}`}>
        <div className={styles.icon}>↓</div>
        <div className={styles.info}>
          <span className={styles.label}>Dépenses totales</span>
          <span className={styles.amount}>{fmt(totalExpenses)}</span>
        </div>
      </div>

      <div className={`${styles.card} ${balance >= 0 ? styles.positive : styles.negative}`}>
        <div className={styles.icon}>{balance >= 0 ? '=' : '!'}</div>
        <div className={styles.info}>
          <span className={styles.label}>Solde restant</span>
          <span className={styles.amount}>{fmt(balance)}</span>
        </div>
      </div>
    </div>
  )
}
