import { Calendar, AlertCircle, Clock, CheckCircle, Hand, Check } from 'lucide-react'

const getStatusIcon = (status) => {
  switch (status) {
    case 'RESOLVED':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />
    case 'IN_PROGRESS':
      return <Clock className="w-4 h-4 text-amber-500" />
    case 'ACKNOWLEDGED':
      return <Hand className="w-4 h-4 text-blue-500" />
    default:
      return <AlertCircle className="w-4 h-4 text-red-500" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'RESOLVED':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
    case 'IN_PROGRESS':
      return 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
    case 'ACKNOWLEDGED':
      return 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
    default:
      return 'bg-red-500/20 text-red-300 border border-red-400/30'
  }
}

const getRiskBadgeColor = (riskScore) => {
  if (riskScore >= 80) return 'bg-red-500 text-white'
  if (riskScore >= 40) return 'bg-amber-500 text-white'
  return 'bg-emerald-500 text-white'
}

const getRiskBadgeAnimation = (riskScore) => {
  if (riskScore >= 80) return 'animate-pulse-subtle'
  if (riskScore >= 40) return 'hover:glow-amber'
  return '' // Low risk stays calm
}

const IncidentCard = ({ incident, onStatusUpdate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleAcknowledge = async () => {
    if (onStatusUpdate) {
      await onStatusUpdate(incident.id, 'ACKNOWLEDGED')
    }
  }

  const handleResolve = async () => {
    if (onStatusUpdate) {
      await onStatusUpdate(incident.id, 'RESOLVED')
    }
  }

  const canAcknowledge = incident.status === 'OPEN'
  const canResolve = incident.status !== 'RESOLVED'

  return (
    <div className="glass glass-hover rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-l-4 border-purple-400 group relative overflow-hidden">
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
              {incident.title || 'Untitled Incident'}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2">
              {incident.description || 'No description provided'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg ${getRiskBadgeColor(incident.riskScore || 0)} ${getRiskBadgeAnimation(incident.riskScore || 0)}`}>
            {incident.riskScore || 0}
          </div>
        </div>

        <div className="space-y-3 mt-5">
          {/* Status and Type Row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-white/90 glass px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formatDate(incident.date)}</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold ${getStatusColor(incident.status)}`}>
                {getStatusIcon(incident.status)}
                <span className="text-xs">{incident.status || 'OPEN'}</span>
              </div>
            </div>
            <div className="px-4 py-1.5 rounded-lg glass text-xs font-bold text-white/90">
              {incident.type || 'OTHER'}
            </div>
          </div>

          {/* Action Buttons Row */}
          {(canAcknowledge || canResolve) && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              {canAcknowledge && (
                <button
                  onClick={handleAcknowledge}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-blue-400/30 text-blue-300 hover:bg-blue-500/20 transition-all duration-300 hover:scale-105 font-semibold text-sm"
                >
                  <Hand className="w-4 h-4" />
                  Acknowledge
                </button>
              )}
              {canResolve && (
                <button
                  onClick={handleResolve}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300 hover:scale-105 font-semibold text-sm"
                >
                  <Check className="w-4 h-4" />
                  Resolve
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function IncidentCards({ incidents, onStatusUpdate }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <div className="relative z-10">
          <div className="text-8xl mb-6">📋</div>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">No incidents yet</h3>
          <p className="text-white/80">Start tracking incidents to see them here</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white drop-shadow-lg mb-1">🔥 Recent Incidents</h2>
        <p className="text-xs text-white/80">
          {incidents.length} {incidents.length === 1 ? 'incident' : 'incidents'} total
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {incidents.slice().reverse().map((incident) => (
          <IncidentCard key={incident.id} incident={incident} onStatusUpdate={onStatusUpdate} />
        ))}
      </div>
    </div>
  )
}
