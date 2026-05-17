import type { QuizResult } from '../types/quiz'
import { describeMode } from '../utils/quiz'

interface ResultSummaryProps {
  result: QuizResult
}

function ResultSummary({ result }: ResultSummaryProps) {
  const scorePercentage = `${result.percentage}%`
  const summaryCards = [
    { label: 'Score', value: `${result.score}/${result.totalQuestions}` },
    { label: 'Percentage', value: scorePercentage },
    { label: 'Correct', value: `${result.correctCount}` },
    { label: 'Wrong', value: `${result.wrongCount}` },
  ]

  return (
    <section className="surface-card rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/85">Latest Result</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{describeMode(result.mode)}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-200">
            Completed on {new Date(result.completedAt).toLocaleString()}
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-cyan-400/18 bg-slate-950/82 p-4 shadow-[0_0_24px_rgba(34,211,238,0.07)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">Score profile</p>
                <p className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">{scorePercentage}</p>
              </div>
              <div className="text-right text-sm text-slate-300">
                <div>{result.correctCount} correct</div>
                <div>{result.wrongCount} wrong</div>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-950 ring-1 ring-inset ring-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-[1.5rem] border border-slate-700 bg-slate-950/82 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResultSummary
