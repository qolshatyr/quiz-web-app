import type { WrongAnswerRecord } from '../types/quiz'
import QuestionTextRenderer from './QuestionTextRenderer'

interface WrongAnswerReviewProps {
  wrongAnswer: WrongAnswerRecord
}

function WrongAnswerReview({ wrongAnswer }: WrongAnswerReviewProps) {
  return (
    <article className="surface-card rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
          {wrongAnswer.topicTitle}
        </span>
        <span className="rounded-full border border-violet-400/25 bg-violet-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-100">
          Review item
        </span>
      </div>

      <div className="mt-4">
        <QuestionTextRenderer
          className="space-y-3"
          codeLabel="Question code"
          paragraphClassName="text-base font-semibold leading-8 text-white sm:text-lg"
          text={wrongAnswer.questionText}
        />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-400/45 bg-rose-500/18 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">Your answer</p>
          <QuestionTextRenderer
            allowBlocks={false}
            className="mt-2 space-y-2"
            paragraphClassName="text-sm leading-7 text-rose-50"
            text={wrongAnswer.selectedOptionText}
          />
        </div>
        <div className="rounded-2xl border border-emerald-400/45 bg-emerald-500/18 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Correct answer</p>
          <QuestionTextRenderer
            allowBlocks={false}
            className="mt-2 space-y-2"
            paragraphClassName="text-sm leading-7 text-emerald-50"
            text={wrongAnswer.correctOptionText}
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/82 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Explanation</p>
        <QuestionTextRenderer
          className="mt-3"
          codeLabel="Explanation code"
          paragraphClassName="text-sm leading-7 text-slate-200 sm:text-base"
          text={wrongAnswer.explanation}
        />
      </div>
    </article>
  )
}

export default WrongAnswerReview
