import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const SEVERITY_COLORS = {
  5: '#ef4444', // red - Critical
  4: '#f97316', // orange - High
  3: '#fbbf24', // amber - Medium
  2: '#84cc16', // lime - Low
  1: '#10b981', // emerald - Very Low
}

const SEVERITY_LABELS = {
  5: 'Critical',
  4: 'High',
  3: 'Medium',
  2: 'Low',
  1: 'Very Low',
}

export default function SeverityBreakdownChart({ incidents }) {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="glass rounded-2xl p-4 shadow-xl relative overflow-hidden h-[320px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-white/90 font-semibold text-sm">No data yet</p>
          <p className="text-xs text-white/70 mt-1">Add incidents to see breakdown</p>
        </div>
      </div>
    )
  }

  const severityCount = {}
  
  incidents.forEach(incident => {
    const severity = incident.severity || 1
    severityCount[severity] = (severityCount[severity] || 0) + 1
  })

  const chartData = Object.entries(severityCount)
    .map(([severity, value]) => ({
      name: `Severity ${severity} (${SEVERITY_LABELS[severity]})`,
      value,
      severity: parseInt(severity),
    }))
    .sort((a, b) => b.severity - a.severity)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 rounded-lg shadow-xl border border-white/20">
          <p className="font-bold text-white text-xs mb-1">{payload[0].name.split(' (')[0]}</p>
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
          <h2 className="text-lg font-bold text-white drop-shadow-lg">⚡ Severity Breakdown</h2>
          <p className="text-xs text-white/80">Incident severity distribution</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ percent, severity }) => percent > 0.15 ? `${(percent * 100).toFixed(0)}%` : ''}
              outerRadius={85}
              innerRadius={35}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity] || SEVERITY_COLORS[1]} />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend 
              wrapperStyle={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', marginTop: '8px' }}
              formatter={(value) => value.split(' (')[0]}
              iconType="circle"
              iconSize={8}
              layout="horizontal"
              verticalAlign="bottom"
            />
          </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
