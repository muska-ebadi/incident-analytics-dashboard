import { TrendingUp, AlertCircle, Info } from 'lucide-react'

const CircularProgress = ({ percentage, color, label, count, total }) => {
  const radius = 65
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="glass glass-hover rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
      {/* Animated background glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${color.replace('text-', 'bg-')} blur-3xl`}></div>
      
      <div className="flex flex-col items-center justify-center gap-1 py-6 relative z-10">
        <div className="text-lg font-semibold leading-tight text-white drop-shadow-md">{label}</div>
        <div className="text-2xl font-bold leading-tight text-white drop-shadow-lg">{count} of {total}</div>
        <div className="text-sm opacity-80 leading-tight text-white/90">
          {total === 0 ? 0 : Math.round((count / total) * 100)}%
        </div>
      </div>
    </div>
  )
}

export default function RiskSummaryCards({ riskSummary }) {
  if (!riskSummary) return null

  const total = riskSummary.total || 0
  const highRisk = riskSummary.highRisk || 0
  const mediumRisk = riskSummary.mediumRisk || 0
  const lowRisk = riskSummary.lowRisk || 0

  // Calculate percentages - use 1 as denominator to avoid division by zero for display
  const highPercentage = total > 0 ? (highRisk / total) * 100 : 0
  const mediumPercentage = total > 0 ? (mediumRisk / total) * 100 : 0
  const lowPercentage = total > 0 ? (lowRisk / total) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <CircularProgress
        percentage={highPercentage}
        color="text-red-500"
        label="High Risk"
        count={highRisk}
        total={total}
      />
      <CircularProgress
        percentage={mediumPercentage}
        color="text-amber-500"
        label="Medium Risk"
        count={mediumRisk}
        total={total}
      />
      <CircularProgress
        percentage={lowPercentage}
        color="text-emerald-500"
        label="Low Risk"
        count={lowRisk}
        total={total}
      />
    </div>
  )
}
