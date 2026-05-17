import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import type { QuizData, QuizMode } from '../types/quiz'
import { createQuizSession, getAllQuestions, limitQuestions } from '../utils/quiz'
import {
  getBestScoreForKey,
  getGamificationState,
  getLastResult,
  getMistakes,
  getQuizHistory,
  resetProgress,
  saveActiveQuizSession,
} from '../utils/storage'

interface HomeProps {
  data: QuizData
}

const allQuestionChoices: Array<number | 'all'> = [30, 50, 100, 'all']

function Home({ data }: HomeProps) {
  const navigate = useNavigate()
  const [isAllQuestionsOpen, setIsAllQuestionsOpen] = useState(false)
  const [, setProgressVersion] = useState(0)

  const allQuestions = useMemo(() => getAllQuestions(data), [data])
  const totalQuestions = data.metadata?.totalQuestions ?? allQuestions.length
  const totalTopics = data.metadata?.totalTopics ?? data.topics?.length ?? 0
  const lastResult = getLastResult()
  const historyCount = getQuizHistory().length
  const mistakeCount = getMistakes().length
  const bestAllScore = getBestScoreForKey('all')
  const gamification = getGamificationState()

  const startAllQuestionsQuiz = (requestedCount: number | 'all') => {
    const mode: QuizMode = {
      type: 'all',
      label: 'All Questions',
      requestedCount,
    }

    const preparedQuestions = limitQuestions(getAllQuestions(data), requestedCount)
    const session = createQuizSession({
      mode,
      questions: preparedQuestions,
    })

    saveActiveQuizSession(session)
    navigate('/quiz')
  }

  const handleResetProgress = () => {
    if (!window.confirm('Reset all saved scores, results, active sessions, mistake history, and XP progress?')) {
      return
    }

    resetProgress()
    setProgressVersion((current) => current + 1)
    setIsAllQuestionsOpen(false)
  }

  return (
    <Layout
      actions={
        <button
          className="rounded-[1.2rem] border border-rose-400/35 bg-rose-500/18 px-4 py-3 text-sm font-semibold text-rose-50 transition hover:bg-rose-500/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          onClick={handleResetProgress}
          type="button"
        >
          Reset Progress
        </button>
      }
      eyebrow="Frontend-only exam trainer"
      subtitle="Practice by topic, build mixed exams from the full question bank, and revisit mistakes with fast focus-mode runs and progress stored locally in your browser."
      title="Final Exam Quiz Trainer"
    >
      <section className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <div className="surface-card rounded-[2rem] p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Question bank</p>
              <p className="mt-3 text-4xl font-extrabold text-white">{totalQuestions}</p>
              <p className="mt-2 text-sm text-slate-300">Total questions available from the source JSON.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">Topics</p>
              <p className="mt-3 text-4xl font-extrabold text-white">{totalTopics}</p>
              <p className="mt-2 text-sm text-slate-300">Topic sets with independent best scores.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/80">Mistakes saved</p>
              <p className="mt-3 text-4xl font-extrabold text-white">{mistakeCount}</p>
              <p className="mt-2 text-sm text-slate-300">Questions you can revisit in focused review mode.</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/80">Attempts logged</p>
              <p className="mt-3 text-4xl font-extrabold text-white">{historyCount}</p>
              <p className="mt-2 text-sm text-slate-300">Recent completed quizzes saved in localStorage.</p>
            </div>
          </div>
        </div>

        <div className="surface-card rounded-[2rem] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Motivation snapshot</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white">Level {gamification.level}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-200">
            {gamification.totalXP} total XP earned with a best streak of {gamification.bestStreak}.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/80">Daily streak</p>
              <p className="mt-2 text-2xl font-bold text-white">{gamification.dailyStudyStreak}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">Total correct</p>
              <p className="mt-2 text-2xl font-bold text-white">{gamification.totalCorrectAnswers}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/80">Latest snapshot</p>
            {lastResult ? (
              <>
                <p className="mt-2 text-2xl font-bold text-white">
                  {lastResult.percentage}% in {lastResult.mode.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  {lastResult.gamificationSummary?.performanceLabel ?? 'Practice complete'} with{' '}
                  {lastResult.score}/{lastResult.totalQuestions} correct.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Start your first practice session and the app will keep your results locally.
              </p>
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-950/72 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Best mixed exam</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {bestAllScore ? `${bestAllScore.percentage}%` : 'No score yet'}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950 ring-1 ring-inset ring-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500"
                style={{ width: `${bestAllScore?.percentage ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Link
          className="surface-card rounded-[2rem] p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_26px_rgba(34,211,238,0.1)] sm:p-6"
          to="/topics"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Start by Topic</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Targeted practice</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Choose a topic, reshuffle the questions each time, and build mastery step by step.
          </p>
        </Link>

        <div className="surface-card rounded-[2rem] p-5 sm:p-6">
          <button
            className="w-full text-left focus-visible:outline-none"
            onClick={() => setIsAllQuestionsOpen((current) => !current)}
            type="button"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">All Questions Mode</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Mixed exam builder</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              Pull randomly from the full bank with fast auto-next runs, streaks, and XP on every attempt.
            </p>
          </button>

          {isAllQuestionsOpen ? (
            <div className="mt-5">
              <p className="text-sm text-slate-300">Total available: {allQuestions.length} questions</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {allQuestionChoices.map((choice) => {
                  const label = choice === 'all' ? 'All questions' : `${choice} questions`
                  const effectiveCount =
                    choice === 'all' || choice > allQuestions.length ? allQuestions.length : choice

                  return (
                    <button
                      key={choice}
                      className="rounded-[1.4rem] border border-violet-400/20 bg-slate-950/82 px-4 py-4 text-left text-sm font-semibold text-slate-50 transition hover:border-cyan-400/55 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      onClick={() => startAllQuestionsQuiz(choice)}
                      type="button"
                    >
                      <span className="block">{label}</span>
                      <span className="mt-2 block text-xs font-medium uppercase tracking-[0.18em] text-violet-200/70">
                        Starts with {effectiveCount} shuffled questions
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>

        <Link
          className="surface-card rounded-[2rem] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/45 hover:shadow-[0_0_26px_rgba(139,92,246,0.1)] sm:p-6"
          to="/mistakes"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/80">Review Mistakes</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Focused correction loop</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Retake only the questions you missed before, fix them, and turn mistakes into XP.
          </p>
        </Link>
      </section>
    </Layout>
  )
}

export default Home
