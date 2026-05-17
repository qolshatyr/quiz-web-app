interface LevelBadgeProps {
  level: number
}

function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <div className="rounded-full border border-violet-400/42 bg-violet-500/16 px-3 py-1.5 text-xs font-semibold text-violet-100 shadow-[0_0_20px_rgba(139,92,246,0.12)]">
      <span className="uppercase tracking-[0.18em]">Level {level}</span>
    </div>
  )
}

export default LevelBadge
