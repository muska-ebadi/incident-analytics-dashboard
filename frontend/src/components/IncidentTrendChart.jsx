import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function IncidentTrendChart({ incidents }) {
  // Group incidents by date
  const dateMap = new Map()
  
  incidents.forEach(incident => {
    const date = incident.date || new Date().toISOString().split('T')[0]
    if (!dateMap.has(date)) {
      dateMap.set(date, { date, count: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0 })
    }
    const entry = dateMap.get(date)
    entry.count++
    
    if (incident.riskScore >= 80) entry.highRisk++
    else if (incident.riskScore >= 40) entry.mediumRisk++
    else entry.lowRisk++
  })

  const chartData = Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-14) // Last 14 days

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-white/90 font-semibold text-sm">No data yet</p>
          <p className="text-xs text-white/70 mt-1">Add incidents to see trends</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass glass-hover rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-white drop-shadow-lg">📈 Incident Trends</h2>
          <p className="text-xs text-white/80">Last 14 days</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
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
            labelFormatter={formatDate}
            cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
          />
          <Legend 
            wrapperStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', marginTop: '8px' }}
            iconType="circle"
            iconSize={8}
            layout="horizontal"
            verticalAlign="bottom"
          />
          <Area 
            type="monotone" 
            dataKey="highRisk" 
            stackId="1"
            stroke="#EF4444" 
            fill="url(#colorHigh)" 
            name="High Risk"
          />
          <Area 
            type="monotone" 
            dataKey="mediumRisk" 
            stackId="1"
            stroke="#FBBF24" 
            fill="url(#colorMedium)" 
            name="Medium Risk"
          />
          <Area 
            type="monotone" 
            dataKey="lowRisk" 
            stackId="1"
            stroke="#10B981" 
            fill="url(#colorLow)" 
            name="Low Risk"
          />
          </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
