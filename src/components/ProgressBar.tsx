interface ProgressBarProps {
  current: number
  total: number
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const safeTotal = total || 1
  const percentage = Math.min(100, Math.max(0, (current / safeTotal) * 100))

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
        <span>Progress</span>
        <span>
          {current}/{total} answered
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-950/90 ring-1 ring-inset ring-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
