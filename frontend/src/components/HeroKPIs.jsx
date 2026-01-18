import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react'

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(value * progress))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count}</span>
}

const KPICard = ({ icon: Icon, label, value, gradient, delay = 0 }) => {
  return (
    <div
      className="glass glass-hover rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up group relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`p-3 rounded-xl ${gradient} text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right flex-1">
          <p className="text-xs text-white/90 font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-black text-white mt-2 animate-counter drop-shadow-lg">
            <AnimatedCounter value={value} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HeroKPIs({ riskSummary, incidents }) {
  const resolvedCount = incidents ? incidents.filter(i => i.status === 'RESOLVED').length : 0
  const mediumRisk = riskSummary?.mediumRisk || 0
  const lowRisk = riskSummary?.lowRisk || 0

  return (
    <>
      <KPICard
        icon={AlertTriangle}
        label="Total Incidents"
        value={riskSummary?.total || 0}
        gradient="gradient-accent"
        delay={0}
      />
      <KPICard
        icon={Shield}
        label="High Risk"
        value={riskSummary?.highRisk || 0}
        gradient="gradient-high"
        delay={100}
      />
      <KPICard
        icon={Shield}
        label="Medium Risk"
        value={mediumRisk}
        gradient="gradient-medium"
        delay={200}
      />
      <KPICard
        icon={CheckCircle}
        label="Resolved"
        value={resolvedCount}
        gradient="gradient-low"
        delay={300}
      />
    </>
  )
}
