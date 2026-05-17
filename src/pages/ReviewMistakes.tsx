import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import WrongAnswerReview from '../components/WrongAnswerReview'
import type { QuizData, QuizMode } from '../types/quiz'
import { createQuizSession, getAllQuestions } from '../utils/quiz'
import { getMistakes, removeMistakes, saveActiveQuizSession } from '../utils/storage'

interface ReviewMistakesProps {
  data: QuizData
}

function ReviewMistakes({ data }: ReviewMistakesProps) {
  const navigate = useNavigate()
  const [, setMistakesVersion] = useState(0)
  const mistakes = getMistakes()
  const questionsById = useMemo(
    () => new Map(getAllQuestions(data).map((question) => [question.id, question])),
    [data],
  )

  const handleStartReview = () => {
    if (mistakes.length === 0) {
      return
    }

    const mode: QuizMode = {
      type: 'mistakes',
      label: 'Review Mistakes',
      requestedCount: mistakes.length,
    }

    const session = createQuizSession({
      mode,
      questions: mistakes
        .map((mistake) => questionsById.get(mistake.questionId))
        .filter((question) => question !== undefined),
    })

    saveActiveQuizSession(session)
    navigate('/quiz')
  }

  const handleClearMistakes = () => {
    removeMistakes(mistakes.map((mistake) => mistake.questionId))
    setMistakesVersion((current) => current + 1)
  }

  return (
    <Layout
      actions={
        mistakes.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-[1.2rem] border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              onClick={handleStartReview}
              type="button"
            >
              Retake Mistakes
            </button>
            <button
              className="rounded-[1.2rem] border border-rose-400/45 bg-rose-500/18 px-4 py-3 text-sm font-semibold text-rose-50 transition hover:bg-rose-500/26 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              onClick={handleClearMistakes}
              type="button"
            >
              Clear Mistakes
            </button>
          </div>
        ) : null
      }
      eyebrow="Mistake review"
      subtitle="This mode focuses on questions you previously missed. Correct answers will be removed from the mistake list after a review attempt."
      title="Review Saved Mistakes"
    >
      {mistakes.length === 0 ? (
        <div className="surface-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-bold text-white">No mistakes saved yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
            Finish a topic quiz or mixed exam first. Any incorrect or unanswered question will appear here.
          </p>
          <Link
            className="mt-5 inline-flex rounded-[1.2rem] border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            to="/"
          >
            Go Home
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          <div className="surface-card rounded-[2rem] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">Saved review set</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white">{mistakes.length} questions</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Each review attempt shuffles the mistake questions and reorders the available answer options.
            </p>
          </div>

          {mistakes.map((mistake) => (
            <WrongAnswerReview key={mistake.questionId} wrongAnswer={mistake} />
          ))}
        </section>
      )}
    </Layout>
  )
}

export default ReviewMistakes
