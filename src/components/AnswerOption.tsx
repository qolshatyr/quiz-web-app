import type { Option } from '../types/quiz'
import QuestionTextRenderer from './QuestionTextRenderer'

interface AnswerOptionProps {
  option: Option
  optionIndex: number
  isSelected: boolean
  isCorrect: boolean
  isWrongSelection: boolean
  isAnswered: boolean
  onSelect: (optionId: string) => void
}

function AnswerOption({
  option,
  optionIndex,
  isSelected,
  isCorrect,
  isWrongSelection,
  isAnswered,
  onSelect,
}: AnswerOptionProps) {
  const optionLetter = String.fromCharCode(65 + optionIndex)
  const stateClasses = isAnswered
    ? isCorrect
      ? 'border-emerald-400 bg-emerald-500/24 text-emerald-50 shadow-[0_0_0_1px_rgba(74,222,128,0.32),0_0_24px_rgba(16,185,129,0.16)]'
      : isWrongSelection
        ? 'border-rose-400 bg-rose-500/24 text-rose-50 shadow-[0_0_0_1px_rgba(251,113,133,0.28),0_0_24px_rgba(244,63,94,0.14)]'
        : 'border-slate-700 bg-slate-950/82 text-slate-300'
    : isSelected
      ? 'border-cyan-400 bg-cyan-500/18 text-cyan-50 shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_0_22px_rgba(34,211,238,0.12)]'
      : 'border-slate-700 bg-slate-950/78 text-slate-100 hover:border-cyan-400/55 hover:bg-slate-900'

  const statusLabel = isAnswered ? (isCorrect ? 'Correct answer' : isWrongSelection ? 'Your answer' : '') : ''

  return (
    <button
      aria-pressed={isSelected}
      className={`w-full rounded-[1.35rem] border px-4 py-4 text-left text-sm font-medium leading-6 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-5 sm:text-base ${stateClasses}`}
      disabled={isAnswered}
      onClick={() => onSelect(option.id)}
      type="button"
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current/25 bg-white/6 text-xs font-bold">
          {optionLetter}
        </span>
        <div className="min-w-0 flex-1">
          <QuestionTextRenderer
            allowBlocks={false}
            className="space-y-2"
            paragraphClassName="text-sm leading-6 text-inherit sm:text-base"
            text={option.text}
          />
          {statusLabel ? (
            <span className="mt-3 inline-flex rounded-full border border-current/15 bg-black/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
              {statusLabel}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default AnswerOption
