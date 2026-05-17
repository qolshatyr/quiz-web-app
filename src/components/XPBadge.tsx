interface XPBadgeProps {
  xp: number
  pulse?: boolean
}

function XPBadge({ xp, pulse = false }: XPBadgeProps) {
  return (
    <div className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${pulse ? 'border-cyan-300 bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.24)]' : 'border-cyan-400/35 bg-cyan-500/12 text-cyan-100'}`}>
      <span className="uppercase tracking-[0.18em]">+{xp} XP</span>
    </div>
  )
}

export default XPBadge
