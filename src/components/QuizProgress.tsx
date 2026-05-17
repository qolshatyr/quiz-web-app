import LevelBadge from './LevelBadge'
import StreakBadge from './StreakBadge'
import XPBadge from './XPBadge'

interface QuizProgressProps {
  current: number
  total: number
  streak: number
  milestoneLabel?: string | null
  earnedXP: number
  level: number
  lastGainXP?: number
  onExit: () => void
}

function QuizProgress({
  current,
  total,
  streak,
  milestoneLabel,
  earnedXP,
  level,
  lastGainXP,
  onExit,
}: QuizProgressProps) {
  const percentage = Math.round((current / Math.max(total, 1)) * 100)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            {current} / {total}
          </p>
          <div className="mt-2 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-slate-950 ring-1 ring-inset ring-slate-700 sm:w-56">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <button
          className="rounded-full border border-violet-400/30 bg-violet-500/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100 transition hover:border-violet-300 hover:bg-violet-500/18 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={onExit}
          type="button"
        >
          Exit quiz
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <StreakBadge milestoneLabel={milestoneLabel} streak={streak} />
        <XPBadge pulse={Boolean(lastGainXP && lastGainXP > 0)} xp={earnedXP} />
        <LevelBadge level={level} />
      </div>
    </div>
  )
}

export default QuizProgress
