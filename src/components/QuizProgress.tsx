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
    <div className="mx-auto w-full max-w-5xl px-1 pt-2 sm:px-2">
      <div className="rounded-[1.7rem] border border-slate-700/80 bg-slate-950/78 px-4 py-4 shadow-[0_20px_40px_rgba(2,6,23,0.3),0_0_0_1px_rgba(34,211,238,0.06)] backdrop-blur-xl sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Question
            </p>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {current}
              </p>
              <p className="pb-1 text-sm font-semibold text-slate-300">/ {total}</p>
            </div>
          </div>

          <button
            className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-rose-300/45 hover:bg-rose-500/16 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            onClick={onExit}
            type="button"
          >
            Exit
          </button>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900/95 ring-1 ring-inset ring-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 via-55% to-violet-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
            {current} / {total}
          </div>
          <StreakBadge milestoneLabel={milestoneLabel} streak={streak} />
          <XPBadge pulse={Boolean(lastGainXP && lastGainXP > 0)} xp={earnedXP} />
          <LevelBadge level={level} />
        </div>
      </div>
    </div>
  )
}

export default QuizProgress
