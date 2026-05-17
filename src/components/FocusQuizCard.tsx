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
      ? 'feedback-correct border-emerald-300/70 shadow-[0_0_46px_rgba(16,185,129,0.18)]'
      : feedbackTone === 'wrong'
        ? 'feedback-wrong border-rose-300/70 shadow-[0_0_46px_rgba(244,63,94,0.18)]'
        : 'border-slate-700/80'

  const optionCount = question.options.length

  return (
    <section
      className={`surface-card question-enter mx-auto w-full max-w-5xl rounded-[2rem] border p-4 sm:rounded-[2.4rem] sm:p-6 lg:p-8 ${toneClass}`}
    >
      <div className="space-y-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-full border border-cyan-300/30 bg-cyan-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {question.topicTitle}
            </span>
            {question.category ? (
              <span className="rounded-full border border-violet-300/28 bg-violet-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100">
                {question.category}
              </span>
            ) : null}
          </div>

          <QuestionTextRenderer
            codeLabel="Question code"
            paragraphClassName="text-xl font-extrabold leading-9 text-white sm:text-[1.7rem] sm:leading-[2.7rem]"
            text={question.prompt}
          />
        </div>

        {feedbackLabel ? (
          <div
            className={`mx-auto max-w-2xl rounded-[1.25rem] border px-4 py-3 text-center text-sm font-semibold sm:text-base ${
              feedbackTone === 'correct'
                ? 'border-emerald-300/65 bg-emerald-500/22 text-emerald-50'
                : 'border-rose-300/65 bg-rose-500/22 text-rose-50'
            }`}
          >
            {feedbackLabel}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {question.options.map((option, index) => {
            const isSelected = answer?.selectedOptionId === option.id
            const isCorrect = option.id === question.correctOptionId
            const isWrongSelection = Boolean(isSelected && !answer?.isCorrect)
            const isOddLastCard = optionCount % 2 === 1 && index === optionCount - 1

            return (
              <div key={option.id} className={isOddLastCard ? 'md:col-span-2' : ''}>
                <AnswerOption
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  isSelected={isSelected}
                  isWrongSelection={isWrongSelection}
                  onSelect={onSelectAnswer}
                  option={option}
                  optionIndex={index}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FocusQuizCard
