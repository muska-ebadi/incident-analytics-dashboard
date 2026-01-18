import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const INCIDENT_TYPES = ['AUTO', 'HOME', 'CYBER', 'FRAUD', 'OUTAGE', 'OTHER']
const STATUSES = ['OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED']

export default function CreateIncidentModal({ isOpen, onClose, onSuccess }) {
  // Debug log
  if (isOpen) {
    console.log('Modal is open!')
  }

  const [formData, setFormData] = useState({
    title: '',
    type: 'OTHER',
    severity: 3,
    status: 'OPEN',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newIncident = await response.json()
        onSuccess(newIncident)
        // Reset form
        setFormData({
          title: '',
          type: 'OTHER',
          severity: 3,
          status: 'OPEN',
          date: new Date().toISOString().split('T')[0],
          description: ''
        })
        onClose()
      } else {
        alert('Failed to create incident')
      }
    } catch (error) {
      console.error('Error creating incident:', error)
      alert('Error creating incident. Make sure the backend is running!')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      ></div>

      {/* Modal */}
      <div className="glass rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[101] shadow-2xl border border-white/20" style={{ position: 'relative', zIndex: 101 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">➕ Create New Incident</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="e.g., Security Breach Detected"
            />
          </div>

          {/* Type and Severity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-transparent"
              >
                {INCIDENT_TYPES.map(type => (
                  <option key={type} value={type} className="bg-slate-800">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Severity * (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-transparent"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status} className="bg-slate-800">
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 rounded-xl glass border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
              placeholder="Describe the incident..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl glass border border-white/20 text-white font-semibold hover:scale-105 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Incident
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
