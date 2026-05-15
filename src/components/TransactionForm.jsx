import { useState } from 'react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories'
import styles from './TransactionForm.module.css'

const defaultForm = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function set(key, value) {
    setForm(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'type' ? { category: '' } : {}),
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Le montant doit être supérieur à 0.')
      return
    }
    if (!form.category) {
      setError('Veuillez choisir une catégorie.')
      return
    }
    setError('')
    onAdd({ ...form, amount: parseFloat(form.amount) })
    setForm(defaultForm)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={`${styles.typeBtn} ${form.type === 'expense' ? styles.expenseActive : ''}`}
          onClick={() => set('type', 'expense')}
        >
          ↓ Dépense
        </button>
        <button
          type="button"
          className={`${styles.typeBtn} ${form.type === 'income' ? styles.incomeActive : ''}`}
          onClick={() => set('type', 'income')}
        >
          ↑ Revenu
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Montant (€)</label>
        <input
          className={styles.input}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Catégorie</label>
        <select
          className={styles.input}
          value={form.category}
          onChange={e => set('category', e.target.value)}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Date</label>
        <input
          className={styles.input}
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={`${styles.submit} ${form.type === 'income' ? styles.submitIncome : styles.submitExpense}`} type="submit">
        Ajouter {form.type === 'income' ? 'le revenu' : 'la dépense'}
      </button>
    </form>
  )
}
