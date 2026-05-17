interface StreakBadgeProps {
  streak: number
  milestoneLabel?: string | null
}

function StreakBadge({ streak, milestoneLabel }: StreakBadgeProps) {
  return (
    <div className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${milestoneLabel ? 'streak-pop border-amber-300 bg-amber-400 text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.24)]' : 'border-amber-400/35 bg-amber-400/12 text-amber-100'}`}>
      <span className="uppercase tracking-[0.18em]">🔥 {streak}</span>
      {milestoneLabel ? <span className="ml-2 text-[11px] tracking-[0.12em] text-slate-950/85">{milestoneLabel}</span> : null}
    </div>
  )
}

export default StreakBadge
