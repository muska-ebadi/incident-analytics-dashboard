import { useState, useEffect } from 'react'
import { Moon, Sun, Plus } from 'lucide-react'
import HeroKPIs from './components/HeroKPIs'
import RiskSummaryCards from './components/RiskSummaryCards'
import IncidentTrendChart from './components/IncidentTrendChart'
import IncidentTypeChart from './components/IncidentTypeChart'
import StatusBreakdownChart from './components/StatusBreakdownChart'
import SeverityBreakdownChart from './components/SeverityBreakdownChart'
import IncidentTable from './components/IncidentTable'
import IncidentCards from './components/IncidentCards'
import CreateIncidentModal from './components/CreateIncidentModal'
import ToastContainer from './components/ToastContainer'
import ActivityFeed from './components/ActivityFeed'

const API_BASE = 'http://localhost:8080/api'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [riskSummary, setRiskSummary] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [summaryRes, incidentsRes] = await Promise.all([
        fetch(`${API_BASE}/insights/risk-summary`),
        fetch(`${API_BASE}/incidents`)
      ])
      
      const summary = await summaryRes.json()
      const incidentsData = await incidentsRes.json()
      
      setRiskSummary(summary)
      setIncidents(incidentsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleIncidentCreated = () => {
    fetchData() // Refresh data after creating incident
    addToast('Incident created successfully!', 'success')
  }

  const handleStatusUpdate = async (incidentId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Find incident for activity feed
        const incident = incidents.find(i => i.id === incidentId)
        
        // Add activity to feed
        if (window.activityFeedCallback && incident) {
          const activityType = newStatus === 'ACKNOWLEDGED' ? 'ACKNOWLEDGED' : 'RESOLVED'
          window.activityFeedCallback({
            id: `status-${incidentId}-${Date.now()}`,
            type: activityType,
            message: `Incident "${incident.title}" was ${activityType.toLowerCase()}`,
            incidentTitle: incident.title,
            timestamp: new Date().toISOString(),
          })
        }

        await fetchData() // Refresh data
        const statusLabel = newStatus === 'ACKNOWLEDGED' ? 'acknowledged' : 'resolved'
        addToast(`Incident ${statusLabel} successfully!`, 'success')
      } else {
        addToast('Failed to update incident status', 'error')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      addToast('Error updating incident status. Make sure the backend is running!', 'error')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                ⚡ Incident Analytics
              </h1>
              <p className="text-sm text-white/80 dark:text-slate-300 mt-1.5 font-medium">
                Real-time risk monitoring dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  console.log('Opening modal...')
                  setIsModalOpen(true)
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:scale-110 transition-transform shadow-lg flex items-center gap-2 cursor-pointer"
                type="button"
              >
                <Plus className="w-5 h-5" />
                New Incident
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl glass hover:scale-110 transition-all duration-300 hover:rotate-12"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-amber-400" />
                ) : (
                  <Moon className="w-6 h-6 text-purple-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-400/50"></div>
            </div>
            <p className="mt-6 text-white/80 font-semibold">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'glass text-white/80 hover:scale-105 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('incidents')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'incidents'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                    : 'glass text-white/80 hover:scale-105 hover:text-white'
                }`}
              >
                Incidents
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Row 1: 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <HeroKPIs riskSummary={riskSummary} incidents={incidents} />
                </div>

                {/* Row 2: Risk Summary + Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <RiskSummaryCards riskSummary={riskSummary} />
                  </div>
                  <div className="lg:col-span-1">
                    <ActivityFeed incidents={incidents} onNewActivity={true} />
                  </div>
                </div>

                {/* Row 3: 2 Charts Side-by-Side (Trends + Status) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <IncidentTrendChart incidents={incidents} />
                  <StatusBreakdownChart incidents={incidents} />
                </div>

                {/* Row 4: 2 Charts Side-by-Side (Severity + Type Donuts) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <SeverityBreakdownChart incidents={incidents} />
                  <IncidentTypeChart incidents={incidents} />
                </div>
              </div>
            )}

            {/* Incidents Tab */}
            {activeTab === 'incidents' && (
              <div className="space-y-6">
                <IncidentTable incidents={incidents} />
                <IncidentCards incidents={incidents} onStatusUpdate={handleStatusUpdate} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleIncidentCreated}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default App
