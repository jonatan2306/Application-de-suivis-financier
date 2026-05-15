export const INCOME_CATEGORIES = [
  { id: 'salaire', label: 'Salaire', icon: '💼' },
  { id: 'freelance', label: 'Freelance', icon: '💻' },
  { id: 'investissements', label: 'Investissements', icon: '📈' },
  { id: 'autre-revenu', label: 'Autre revenu', icon: '💰' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'alimentation', label: 'Alimentation', icon: '🛒' },
  { id: 'loyer', label: 'Loyer', icon: '🏠' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'divertissements', label: 'Divertissements', icon: '🎬' },
  { id: 'sante', label: 'Santé', icon: '❤️' },
  { id: 'vetements', label: 'Vêtements', icon: '👔' },
  { id: 'education', label: 'Éducation', icon: '📚' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'abonnements', label: 'Abonnements', icon: '📱' },
  { id: 'autre-depense', label: 'Autre dépense', icon: '📦' },
]

export const CHART_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16',
]

export function getCategoryLabel(id, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return list.find(c => c.id === id)?.label ?? id
}

export function getCategoryIcon(id, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  return list.find(c => c.id === id)?.icon ?? '💳'
}
