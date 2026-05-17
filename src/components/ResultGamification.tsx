import type { GamificationState, QuizResult } from '../types/quiz'

interface ResultGamificationProps {
  result: QuizResult
  gamification: GamificationState
}

function ResultGamification({ result, gamification }: ResultGamificationProps) {
  const summary = result.gamificationSummary
  if (!summary) {
    return null
  }

  return (
    <section className="surface-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">Gamification</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{summary.performanceLabel}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Earned {summary.xpEarned} XP this run. You are now level {summary.levelAfter} with a best streak of{' '}
            {summary.bestStreak}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-500/10 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/85">XP earned</p>
            <p className="mt-2 text-3xl font-bold text-white">+{summary.xpEarned}</p>
          </div>
          <div className="rounded-[1.4rem] border border-violet-400/20 bg-violet-500/10 p-4 shadow-[0_0_20px_rgba(139,92,246,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100/85">Current level</p>
            <p className="mt-2 text-3xl font-bold text-white">{summary.levelAfter}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.4rem] border border-amber-400/20 bg-amber-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/85">Streak peak</p>
          <p className="mt-2 text-2xl font-bold text-white">{summary.streakPeak}</p>
        </div>
        <div className="rounded-[1.4rem] border border-violet-400/20 bg-violet-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100/85">Daily streak</p>
          <p className="mt-2 text-2xl font-bold text-white">{summary.dailyStudyStreak}</p>
        </div>
        <div className="rounded-[1.4rem] border border-cyan-400/20 bg-cyan-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/85">Total XP</p>
          <p className="mt-2 text-2xl font-bold text-white">{gamification.totalXP}</p>
        </div>
        <div className="rounded-[1.4rem] border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/85">Fixed mistakes</p>
          <p className="mt-2 text-2xl font-bold text-white">{gamification.fixedMistakes}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {summary.newLevel ? (
          <span className="rounded-full border border-sky-300/25 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
            New level reached
          </span>
        ) : null}
        {summary.newBestStreak ? (
          <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
            New streak record
          </span>
        ) : null}
        {summary.fixedMistakesAwarded > 0 ? (
          <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
            {summary.fixedMistakesAwarded} mistake{summary.fixedMistakesAwarded === 1 ? '' : 's'} fixed
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {Object.entries(summary.masteryByTopic).map(([topicId, mastery]) => (
          <div key={topicId} className="rounded-[1.35rem] border border-slate-700 bg-slate-950/82 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Topic mastery</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div className="text-sm text-slate-200">{result.topicBreakdown[topicId]?.topicTitle ?? topicId}</div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{mastery.bestScore}%</div>
                <div className="text-xs uppercase tracking-[0.16em] text-violet-200/80">{mastery.masteryLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ResultGamification
