import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function StatusBreakdownChart({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-white/90 font-semibold text-sm">No data yet</p>
          <p className="text-xs text-white/70 mt-1">Add incidents to see breakdown</p>
        </div>
      </div>
    )
  }

  const statusCount = {}
  
  incidents.forEach(incident => {
    const status = incident.status || 'OPEN'
    statusCount[status] = (statusCount[status] || 0) + 1
  })

  const chartData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value)

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED': return '#10b981' // emerald
      case 'IN_PROGRESS': return '#f59e0b' // amber
      case 'ACKNOWLEDGED': return '#3b82f6' // blue
      case 'OPEN': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }


  return (
    <div className="glass glass-hover rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-white drop-shadow-lg">📊 Status Breakdown</h2>
          <p className="text-xs text-white/80">Incident status distribution</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              type="number" 
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }} 
              stroke="rgba(255,255,255,0.3)"
              domain={[0, 'dataMax + 0.5']}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} 
              stroke="rgba(255,255,255,0.3)"
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
              labelStyle={{ marginBottom: '4px', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ fontSize: '11px', padding: '2px 0' }}
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
