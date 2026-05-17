import type { PreparedQuestion, UserAnswer } from '../types/quiz'
import AnswerOption from './AnswerOption'
import ProgressBar from './ProgressBar'
import QuestionTextRenderer from './QuestionTextRenderer'

interface QuizCardProps {
  question: PreparedQuestion
  currentQuestionNumber: number
  totalQuestions: number
  answer?: UserAnswer
  onSelectAnswer: (optionId: string) => void
  onNext: () => void
  onPrevious: () => void
  onFinish: () => void
}

function QuizCard({
  question,
  currentQuestionNumber,
  totalQuestions,
  answer,
  onSelectAnswer,
  onNext,
  onPrevious,
  onFinish,
}: QuizCardProps) {
  const isAnswered = Boolean(answer)

  return (
    <section className="surface-card rounded-[2rem] p-5 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-slate-700 bg-slate-950/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                {question.topicTitle}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-950/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {question.category ?? 'Exam question'}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Question {currentQuestionNumber} of {totalQuestions}
              </p>
              <div className="mt-3">
                <QuestionTextRenderer
                  codeLabel="Question code"
                  paragraphClassName="text-lg font-semibold leading-8 text-white sm:text-[1.35rem]"
                  text={question.prompt}
                />
              </div>
            </div>
          </div>

          <div className="min-w-[8.5rem] rounded-[1.4rem] border border-slate-800 bg-slate-950/75 px-4 py-3 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Progress</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {Math.round((currentQuestionNumber / totalQuestions) * 100)}%
            </p>
          </div>
        </div>

        <ProgressBar current={currentQuestionNumber} total={totalQuestions} />

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

        {isAnswered ? (
          <div
            className={`rounded-[1.5rem] border px-4 py-4 sm:px-5 ${
              answer?.isCorrect ? 'border-emerald-400/25 bg-emerald-500/8' : 'border-amber-300/25 bg-amber-500/8'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                {answer?.isCorrect ? 'Correct answer' : 'Reviewed answer'}
              </span>
              {!answer?.isCorrect ? (
                <span className="rounded-full border border-amber-200/15 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-50">
                  Explanation
                </span>
              ) : null}
            </div>
            <QuestionTextRenderer
              className="mt-3"
              codeLabel="Explanation code"
              paragraphClassName="text-sm leading-7 text-slate-200 sm:text-base"
              text={question.explanation ?? ''}
            />
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-950/55 px-4 py-4 text-sm leading-7 text-slate-400">
            Select one answer to reveal the explanation and lock this question for the current attempt.
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="rounded-[1.25rem] border border-slate-700 bg-slate-950/78 px-4 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45"
            disabled={currentQuestionNumber === 1}
            onClick={onPrevious}
            type="button"
          >
            Previous
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-[1.25rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-500/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              onClick={onFinish}
              type="button"
            >
              Finish Quiz
            </button>
            <button
              className="rounded-[1.25rem] border border-sky-400/30 bg-sky-500/10 px-4 py-3.5 text-sm font-semibold text-sky-50 transition hover:bg-sky-500/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={currentQuestionNumber === totalQuestions}
              onClick={onNext}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizCard
