import type { BestScoreRecord, Topic } from '../types/quiz'

interface TopicCardProps {
  topic: Topic
  questionCount: number
  bestScore: BestScoreRecord | null
  masteryLabel?: string
  attempts?: number
  onStart: (topicId: string) => void
}

function TopicCard({ topic, questionCount, bestScore, masteryLabel, attempts, onStart }: TopicCardProps) {
  const progressPercentage = bestScore?.percentage ?? 0

  return (
    <article className="surface-card flex h-full flex-col rounded-[2rem] p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/45 hover:shadow-[0_0_28px_rgba(34,211,238,0.12)] sm:p-6">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Topic</p>
            <h2 className="mt-2 text-xl font-bold text-white">{topic.title}</h2>
          </div>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/12 px-3 py-1 text-xs font-semibold text-violet-100">
            {questionCount} questions
          </span>
        </div>

        <p className="text-sm leading-7 text-slate-200">
          {topic.description ?? 'Targeted practice for this topic.'}
        </p>

        <div className="rounded-[1.5rem] border border-cyan-400/15 bg-slate-950/82 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Best score</p>
              {bestScore ? (
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-extrabold text-white">{bestScore.percentage}%</span>
                  <span className="pb-1 text-sm text-slate-300">
                    {bestScore.score}/{bestScore.totalQuestions}
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-300">No attempts saved yet.</p>
              )}
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-violet-200/80">Progress</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950 ring-1 ring-inset ring-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-amber-400/30 bg-amber-400/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
              {masteryLabel ?? 'Beginner'}
            </span>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-300">
              {attempts ? `${attempts} attempt${attempts === 1 ? '' : 's'}` : 'No attempts'}
            </span>
          </div>
        </div>
      </div>

      <button
        className="mt-6 rounded-[1.25rem] border border-cyan-300 bg-cyan-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/90 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        onClick={() => onStart(topic.id)}
        type="button"
      >
        Start Topic Quiz
      </button>
    </article>
  )
}

export default TopicCard
