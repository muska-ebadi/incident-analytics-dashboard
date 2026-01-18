import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = {
  AUTO: '#8B5CF6',
  HOME: '#3B82F6',
  CYBER: '#EF4444',
  FRAUD: '#F59E0B',
  OUTAGE: '#10B981',
  OTHER: '#6B7280',
}

export default function IncidentTypeChart({ incidents }) {
  const typeCount = {}
  
  incidents.forEach(incident => {
    const type = incident.type || 'OTHER'
    typeCount[type] = (typeCount[type] || 0) + 1
  })

  const chartData = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 rounded-lg shadow-xl border border-white/20">
          <p className="font-bold text-white text-xs mb-1">{payload[0].name}</p>
          <p className="text-xs text-white/80 font-semibold">
            {payload[0].value} {payload[0].value === 1 ? 'incident' : 'incidents'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass glass-hover rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-white drop-shadow-lg">🎯 By Type</h2>
          <p className="text-xs text-white/80">Incident distribution</p>
        </div>
        {chartData.length > 0 ? (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ percent }) => percent > 0.15 ? `${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={85}
                innerRadius={35}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.OTHER} />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                wrapperStyle={{ outline: 'none' }}
              />
              <Legend 
                wrapperStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', marginTop: '8px' }}
                iconType="circle"
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
              />
            </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🥧</div>
              <p className="text-white/90 font-semibold text-sm">No data yet</p>
              <p className="text-xs text-white/70 mt-1">Add incidents to see distribution</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
