import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, AlertCircle } from 'lucide-react'

const getRiskBadgeColor = (riskScore) => {
  if (riskScore >= 80) return 'bg-red-500 text-white'
  if (riskScore >= 40) return 'bg-amber-500 text-white'
  return 'bg-emerald-500 text-white'
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

export default function IncidentTable({ incidents }) {
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredIncidents = incidents
    .filter(incident => {
      if (filterType !== 'ALL' && incident.type !== filterType) return false
      if (filterStatus !== 'ALL' && incident.status !== filterStatus) return false
      return true
    })
    .sort((a, b) => {
      let aVal, bVal
      switch (sortField) {
        case 'title':
          aVal = a.title || ''
          bVal = b.title || ''
          break
        case 'type':
          aVal = a.type || ''
          bVal = b.type || ''
          break
        case 'severity':
          aVal = a.severity || 0
          bVal = b.severity || 0
          break
        case 'riskScore':
          aVal = a.riskScore || 0
          bVal = b.riskScore || 0
          break
        case 'status':
          aVal = a.status || ''
          bVal = b.status || ''
          break
        case 'date':
        default:
          aVal = new Date(a.date || 0)
          bVal = new Date(b.date || 0)
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const uniqueTypes = [...new Set(incidents.map(i => i.type).filter(Boolean))]
  const uniqueStatuses = [...new Set(incidents.map(i => i.status).filter(Boolean))]

  if (!incidents || incidents.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
        <div className="relative z-10">
          <div className="text-8xl mb-6">📋</div>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">No incidents yet</h3>
          <p className="text-white/80">Create your first incident to see it in the table</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-4 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
      <div className="relative z-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white drop-shadow-lg mb-1">📋 Incident Details</h2>
          <p className="text-xs text-white/80">
            {filteredIncidents.length} of {incidents.length} incidents
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl glass border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
          >
            <option value="ALL" className="bg-slate-800">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type} className="bg-slate-800">{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl glass border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 bg-transparent"
          >
            <option value="ALL" className="bg-slate-800">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status} className="bg-slate-800">{status}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-2">
                    Title
                    {sortField === 'title' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-2">
                    Type
                    {sortField === 'type' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('severity')}
                >
                  <div className="flex items-center gap-2">
                    Severity
                    {sortField === 'severity' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center gap-2">
                    Risk Score
                    {sortField === 'riskScore' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-white/90 font-bold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date
                    {sortField === 'date' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{incident.title || 'Untitled'}</div>
                    {incident.description && (
                      <div className="text-sm text-white/60 mt-1 line-clamp-1">
                        {incident.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-lg glass text-sm font-medium text-white/90">
                      {incident.type || 'OTHER'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-bold text-lg">{incident.severity || 0}/5</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getRiskBadgeColor(incident.riskScore || 0)}`}>
                      {incident.riskScore || 0}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(incident.status)}`}>
                      {incident.status || 'OPEN'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(incident.date)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
