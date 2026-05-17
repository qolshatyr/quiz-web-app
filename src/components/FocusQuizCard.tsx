import type { PreparedQuestion, UserAnswer } from '../types/quiz'
import AnswerOption from './AnswerOption'
import QuestionTextRenderer from './QuestionTextRenderer'

interface FocusQuizCardProps {
  question: PreparedQuestion
  answer?: UserAnswer
  onSelectAnswer: (optionId: string) => void
  feedbackTone?: 'correct' | 'wrong' | null
  feedbackLabel?: string | null
}

function FocusQuizCard({
  question,
  answer,
  onSelectAnswer,
  feedbackTone = null,
  feedbackLabel = null,
}: FocusQuizCardProps) {
  const isAnswered = Boolean(answer)
  const toneClass =
    feedbackTone === 'correct'
      ? 'feedback-correct border-emerald-400/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
      : feedbackTone === 'wrong'
        ? 'feedback-wrong border-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.12)]'
        : 'border-slate-700'

  return (
    <section className={`surface-card question-enter mx-auto w-full max-w-3xl rounded-[2rem] border p-5 sm:p-6 lg:p-7 ${toneClass}`}>
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              {question.topicTitle}
            </span>
            {question.category ? (
              <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-100">
                {question.category}
              </span>
            ) : null}
          </div>

          <QuestionTextRenderer
            codeLabel="Question code"
            paragraphClassName="text-lg font-semibold leading-8 text-white sm:text-[1.32rem]"
            text={question.prompt}
          />
        </div>

        {feedbackLabel ? (
          <div
            className={`rounded-[1.25rem] border px-3 py-2 text-sm font-semibold ${
              feedbackTone === 'correct'
                ? 'border-emerald-400/45 bg-emerald-500/18 text-emerald-50'
                : 'border-rose-400/45 bg-rose-500/18 text-rose-50'
            }`}
          >
            {feedbackLabel}
          </div>
        ) : null}

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = answer?.selectedOptionId === option.id
            const isCorrect = option.id === question.correctOptionId
            const isWrongSelection = Boolean(isSelected && !answer?.isCorrect)

            return (
              <AnswerOption
                key={option.id}
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                isSelected={isSelected}
                isWrongSelection={isWrongSelection}
                onSelect={onSelectAnswer}
                option={option}
                optionIndex={index}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FocusQuizCard
