import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  const bgColors = {
    success: 'bg-emerald-500/20 border-emerald-400/30',
    error: 'bg-red-500/20 border-red-400/30',
    info: 'bg-blue-500/20 border-blue-400/30',
  }

  return (
    <div className={`glass rounded-xl p-4 shadow-2xl border ${bgColors[type]} animate-slide-up flex items-center gap-3 min-w-[300px] max-w-md`}>
      {icons[type]}
      <p className="flex-1 text-white font-medium text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast
