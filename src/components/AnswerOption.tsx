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
  const optionPalette = [
    'border-cyan-400/42 bg-cyan-500/18 text-cyan-50 hover:border-cyan-300 hover:bg-cyan-400/28 hover:shadow-[0_18px_36px_rgba(34,211,238,0.16)]',
    'border-violet-400/42 bg-violet-500/18 text-violet-50 hover:border-violet-300 hover:bg-violet-400/28 hover:shadow-[0_18px_36px_rgba(139,92,246,0.16)]',
    'border-amber-400/42 bg-amber-500/18 text-amber-50 hover:border-amber-300 hover:bg-amber-400/28 hover:shadow-[0_18px_36px_rgba(251,191,36,0.16)]',
    'border-emerald-400/42 bg-emerald-500/18 text-emerald-50 hover:border-emerald-300 hover:bg-emerald-400/28 hover:shadow-[0_18px_36px_rgba(52,211,153,0.16)]',
    'border-rose-400/42 bg-rose-500/18 text-rose-50 hover:border-rose-300 hover:bg-rose-400/28 hover:shadow-[0_18px_36px_rgba(251,113,133,0.16)]',
  ]
  const basePalette = optionPalette[optionIndex % optionPalette.length]
  const stateClasses = isAnswered
    ? isCorrect
      ? 'border-emerald-300 bg-emerald-500/34 text-emerald-50 shadow-[0_0_0_1px_rgba(74,222,128,0.4),0_0_30px_rgba(16,185,129,0.22)]'
      : isWrongSelection
        ? 'border-rose-300 bg-rose-500/34 text-rose-50 shadow-[0_0_0_1px_rgba(251,113,133,0.34),0_0_30px_rgba(244,63,94,0.2)]'
        : 'border-slate-700/70 bg-slate-900/92 text-slate-400 opacity-78'
    : isSelected
      ? 'border-white/85 bg-white/16 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_24px_rgba(255,255,255,0.08)]'
      : basePalette

  const statusLabel = isAnswered ? (isCorrect ? 'Correct answer' : isWrongSelection ? 'Your answer' : '') : ''
  const statusIcon = isAnswered ? (isCorrect ? '✓' : isWrongSelection ? '✕' : '') : ''
  const feedbackMotionClass = isAnswered ? (isCorrect ? 'answer-correct-pop' : isWrongSelection ? 'answer-wrong-shake' : '') : ''

  return (
    <button
      aria-pressed={isSelected}
      className={`group relative w-full overflow-hidden rounded-[1.6rem] border px-4 py-4 text-left text-sm font-medium leading-6 transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.985] sm:min-h-[10.5rem] sm:px-5 sm:py-5 sm:text-base ${stateClasses} ${feedbackMotionClass}`}
      disabled={isAnswered}
      onClick={() => onSelect(option.id)}
      type="button"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-white/12" />
      <div className="flex items-start gap-4">
        <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-current/25 bg-black/10 text-sm font-extrabold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          {optionLetter}
        </span>
        <div className="min-w-0 flex-1">
          <QuestionTextRenderer
            allowBlocks={false}
            className="space-y-2"
            paragraphClassName="text-sm font-semibold leading-6 text-inherit sm:text-base sm:leading-7"
            text={option.text}
          />
        </div>
        {statusIcon ? (
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/25 bg-black/12 text-lg font-black">
            {statusIcon}
          </span>
        ) : (
          <span className="mt-1 text-xs font-bold uppercase tracking-[0.24em] text-current/75 transition group-hover:text-current">
            Tap
          </span>
        )}
      </div>

      {statusLabel ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-current/20 bg-black/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
            {statusLabel}
          </span>
        </div>
      ) : null}
    </button>
  )
}

export default AnswerOption
