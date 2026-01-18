import { useState, useEffect, useRef } from 'react'
import { Activity, Plus, Hand, CheckCircle, AlertCircle, Clock, Sparkles } from 'lucide-react'

const ActivityItem = ({ activity, index }) => {
  const iconMap = {
    CREATED: <Plus className="w-4 h-4 text-blue-400" />,
    ACKNOWLEDGED: <Hand className="w-4 h-4 text-blue-400" />,
    RESOLVED: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    UPDATED: <Clock className="w-4 h-4 text-amber-400" />,
  }

  const colorMap = {
    CREATED: 'border-blue-400/30 bg-blue-500/10',
    ACKNOWLEDGED: 'border-blue-400/30 bg-blue-500/10',
    RESOLVED: 'border-emerald-400/30 bg-emerald-500/10',
    UPDATED: 'border-amber-400/30 bg-amber-500/10',
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)

    if (diffSecs < 60) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className={`glass rounded-xl p-4 border-l-4 ${colorMap[activity.type]} animate-slide-in-right transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="flex-shrink-0 p-2 rounded-lg glass border border-white/20 mt-0.5">
          {iconMap[activity.type] || <Activity className="w-4 h-4 text-white/70" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white mb-1 line-clamp-1">
            {activity.message}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span>{formatTime(activity.timestamp)}</span>
            {activity.incidentTitle && (
              <>
                <span>•</span>
                <span className="truncate">{activity.incidentTitle}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActivityFeed({ incidents, onNewActivity }) {
  const [activities, setActivities] = useState([])
  const [prevIncidentCount, setPrevIncidentCount] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    // Track new incidents
    if (incidents.length > prevIncidentCount && prevIncidentCount > 0) {
      const newIncidents = incidents.slice(prevIncidentCount)
      newIncidents.forEach(incident => {
        const activity = {
          id: `created-${incident.id}-${Date.now()}`,
          type: 'CREATED',
          message: `New incident "${incident.title}" created`,
          incidentTitle: incident.title,
          timestamp: new Date().toISOString(),
        }
        setActivities(prev => [activity, ...prev])
      })
    }
    setPrevIncidentCount(incidents.length)
  }, [incidents, prevIncidentCount])

  // Listen for new activities from parent
  useEffect(() => {
    if (onNewActivity) {
      const handleActivity = (activity) => {
        setActivities(prev => [activity, ...prev])
      }
      // Store callback for parent to call
      window.activityFeedCallback = handleActivity
    }
  }, [onNewActivity])

  // Auto-scroll to top when new activity arrives
  useEffect(() => {
    if (scrollRef.current && activities.length > 0) {
      scrollRef.current.scrollTop = 0
    }
  }, [activities])

  // Keep only last 50 activities
  useEffect(() => {
    if (activities.length > 50) {
      setActivities(prev => prev.slice(0, 50))
    }
  }, [activities])

  return (
    <div className="glass rounded-2xl p-6 shadow-xl relative overflow-hidden h-[400px] flex flex-col group">
      {/* Header glow effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
          <div className="p-2 rounded-lg gradient-accent">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white drop-shadow-lg flex items-center gap-2">
              Live Activity Feed
              {activities.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30">
                  <Sparkles className="w-3 h-3" />
                  Live
                </span>
              )}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">Real-time incident updates</p>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar"
        >
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="p-4 rounded-full glass border border-white/20 mb-4">
                <Activity className="w-8 h-8 text-white/50" />
              </div>
              <p className="text-white/80 font-medium mb-1">No activity yet</p>
              <p className="text-xs text-white/60">Updates will appear here in real-time</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
