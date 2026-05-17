import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ResultGamification from '../components/ResultGamification'
import ResultSummary from '../components/ResultSummary'
import WrongAnswerReview from '../components/WrongAnswerReview'
import type { PreparedQuestion, QuizData, QuizMode } from '../types/quiz'
import { createQuizSession, getAllQuestions, getQuestionsByTopic, limitQuestions } from '../utils/quiz'
import { getGamificationState, getLastResult, saveActiveQuizSession } from '../utils/storage'

interface ResultsProps {
  data: QuizData
}

function buildRestartQuestionPool(data: QuizData, mode: QuizMode): PreparedQuestion[] {
  if (mode.type === 'topic' && mode.topicId) {
    return getQuestionsByTopic(data, mode.topicId)
  }

  if (mode.type === 'mistakes') {
    return []
  }

  return limitQuestions(getAllQuestions(data), mode.requestedCount)
}

function Results({ data }: ResultsProps) {
  const navigate = useNavigate()
  const result = getLastResult()
  const gamification = getGamificationState()

  if (!result) {
    return (
      <Layout
        eyebrow="No saved results"
        subtitle="Complete a quiz to see your score breakdown, wrong-answer review, and restart options."
        title="Results Not Available"
      >
        <div className="surface-card rounded-[2rem] p-6">
          <Link
            className="rounded-[1.2rem] border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            to="/"
          >
            Go Home
          </Link>
        </div>
      </Layout>
    )
  }

  const handleRestartQuiz = () => {
    if (result.mode.type === 'mistakes') {
      navigate('/mistakes')
      return
    }

    const session = createQuizSession({
      mode: result.mode,
      questions: buildRestartQuestionPool(data, result.mode),
    })

    saveActiveQuizSession(session)
    navigate('/quiz')
  }

  return (
    <Layout
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-[1.2rem] border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            onClick={handleRestartQuiz}
            type="button"
          >
            Try Again
          </button>
          <Link
            className="rounded-[1.2rem] border border-violet-400/28 bg-violet-500/14 px-4 py-3 text-sm font-semibold text-violet-50 transition hover:border-violet-300 hover:bg-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            to="/"
          >
            Back Home
          </Link>
          <Link
            className="rounded-[1.2rem] border border-amber-300/45 bg-amber-400/18 px-4 py-3 text-sm font-semibold text-amber-50 transition hover:bg-amber-400/26 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            to="/mistakes"
          >
            Review Mistakes
          </Link>
        </div>
      }
      eyebrow="Results page"
      subtitle="Fast focus-mode quizzes roll straight into review, mastery tracking, and reward feedback after each attempt."
      title="Performance Review"
    >
      <ResultSummary result={result} />
      <ResultGamification gamification={gamification} result={result} />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Wrong Answers</h2>
          <p className="text-sm text-slate-300">{result.wrongAnswers.length} saved for review</p>
        </div>

        {result.wrongAnswers.length === 0 ? (
          <div className="surface-card rounded-[2rem] p-6 text-sm leading-7 text-slate-200">
            Perfect run. There are no wrong answers to review for this attempt.
          </div>
        ) : (
          result.wrongAnswers.map((wrongAnswer) => (
            <WrongAnswerReview key={wrongAnswer.questionId} wrongAnswer={wrongAnswer} />
          ))
        )}
      </section>
    </Layout>
  )
}

export default Results
