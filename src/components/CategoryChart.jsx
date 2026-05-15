import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { getCategoryLabel, CHART_COLORS } from '../utils/categories'
import styles from './CategoryChart.module.css'

function fmt(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipName}>{name}</span>
      <span className={styles.tooltipValue}>{fmt(value)}</span>
    </div>
  )
}

export default function CategoryChart({ expensesByCategory }) {
  const data = Object.entries(expensesByCategory).map(([id, value]) => ({
    name: getCategoryLabel(id, 'expense'),
    value,
  }))

  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Aucune dépense à afficher</span>
        <p>Ajoutez des dépenses pour voir la répartition par catégorie.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ fontSize: '13px', color: '#374151' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
