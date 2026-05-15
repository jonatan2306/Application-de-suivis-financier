import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'budget_transactions'
const BUDGET_KEY = 'budget_monthly_limit'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadBudget() {
  try {
    const raw = localStorage.getItem(BUDGET_KEY)
    if (!raw) return null
    const val = parseFloat(raw)
    return isNaN(val) ? null : val
  } catch {
    return null
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(load)
  const [monthlyBudget, setMonthlyBudgetState] = useState(loadBudget)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [
      { ...transaction, id: crypto.randomUUID(), date: transaction.date || new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const setMonthlyBudget = useCallback((amount) => {
    if (amount === null) {
      localStorage.removeItem(BUDGET_KEY)
      setMonthlyBudgetState(null)
    } else {
      const val = parseFloat(amount)
      localStorage.setItem(BUDGET_KEY, String(val))
      setMonthlyBudgetState(val)
    }
  }, [])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const now = new Date()
  const monthlyExpenses = transactions
    .filter(t => {
      if (t.type !== 'expense') return false
      const d = new Date(t.date + 'T00:00:00')
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, t) => sum + t.amount, 0)

  return {
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
  }
}
