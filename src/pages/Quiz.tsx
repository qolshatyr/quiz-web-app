import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FocusQuizCard from '../components/FocusQuizCard'
import QuizProgress from '../components/QuizProgress'
import Layout from '../components/Layout'
import type { QuizSession, UserAnswer } from '../types/quiz'
import { getAnswerReward, getLevelFromXp } from '../utils/gamification'
import { buildQuizResult } from '../utils/quiz'
import {
  clearActiveQuizSession,
  getActiveQuizSession,
  getGamificationState,
  saveActiveQuizSession,
  saveResult,
} from '../utils/storage'

const AUTO_ADVANCE_DELAY_MS = 750

function Quiz() {
  const navigate = useNavigate()
  const [session, setSession] = useState<QuizSession | null>(() => getActiveQuizSession())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [feedbackTone, setFeedbackTone] = useState<'correct' | 'wrong' | null>(null)
  const [feedbackLabel, setFeedbackLabel] = useState<string | null>(null)
  const [milestoneLabel, setMilestoneLabel] = useState<string | null>(null)
  const [lastGainXP, setLastGainXP] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  const gamification = getGamificationState()
  const liveLevel = getLevelFromXp(gamification.totalXP + (session?.earnedXP ?? 0))

  useEffect(() => {
    if (!session) {
      return
    }

    saveActiveQuizSession(session)
  }, [session])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!session) {
    return (
      <Layout
        eyebrow="No active session"
        subtitle="Start a topic quiz, mixed exam, or mistake review to create a fresh attempt."
        title="Quiz Not Found"
      >
        <div className="surface-card rounded-[2rem] p-6">
          <button
            className="rounded-2xl border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            onClick={() => navigate('/')}
            type="button"
          >
            Go Home
          </button>
        </div>
      </Layout>
    )
  }

  const currentQuestion = session.questions[session.currentIndex]
  const currentAnswer = session.answers[currentQuestion.id]

  const updateSession = (nextSession: QuizSession) => {
    setSession(nextSession)
  }

  const resetTransientFeedback = () => {
    setIsTransitioning(false)
    setFeedbackTone(null)
    setFeedbackLabel(null)
    setMilestoneLabel(null)
    setLastGainXP(0)
  }

  const handleFinish = (nextSession: QuizSession) => {
    const result = buildQuizResult(nextSession)
    saveResult(result)
    navigate('/results')
  }

  const handleSelectAnswer = (optionId: string) => {
    if (currentAnswer || isTransitioning) {
      return
    }

    const isCorrect = optionId === currentQuestion.correctOptionId
    const reward = getAnswerReward(isCorrect, session.currentStreak)

    const selectedAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      correctOptionId: currentQuestion.correctOptionId,
      answeredAt: new Date().toISOString(),
    }

    const nextSession: QuizSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: selectedAnswer,
      },
      currentStreak: reward.nextStreak,
      bestStreak: Math.max(session.bestStreak, reward.nextStreak),
      earnedXP: session.earnedXP + reward.xpEarned,
    }

    updateSession(nextSession)
    setIsTransitioning(true)
    setFeedbackTone(isCorrect ? 'correct' : 'wrong')
    setFeedbackLabel(
      isCorrect
        ? reward.milestoneLabel
          ? `Correct. +${reward.xpEarned} XP. ${reward.milestoneLabel}`
          : `Correct. +${reward.xpEarned} XP`
        : 'Incorrect. Streak reset.'
    )
    setMilestoneLabel(reward.milestoneLabel)
    setLastGainXP(reward.xpEarned)

    timeoutRef.current = window.setTimeout(() => {
      if (nextSession.currentIndex >= nextSession.questions.length - 1) {
        handleFinish(nextSession)
        return
      }

      updateSession({
        ...nextSession,
        currentIndex: nextSession.currentIndex + 1,
      })
      resetTransientFeedback()
    }, AUTO_ADVANCE_DELAY_MS)
  }

  const handleExit = () => {
    const hasProgress = Object.keys(session.answers).length > 0
    const shouldExit = window.confirm(
      hasProgress
        ? 'Exit this quiz? Your current attempt will be discarded.'
        : 'Exit this quiz and return home?',
    )

    if (!shouldExit) {
      return
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    clearActiveQuizSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-transparent pb-10">
      <QuizProgress
        current={session.currentIndex + 1}
        earnedXP={session.earnedXP}
        lastGainXP={lastGainXP}
        level={liveLevel}
        milestoneLabel={milestoneLabel}
        onExit={handleExit}
        streak={session.currentStreak}
        total={session.questions.length}
      />

      <div className="px-4 pb-6 pt-5 sm:px-6">
        <FocusQuizCard
          answer={currentAnswer}
          feedbackLabel={feedbackLabel}
          feedbackTone={feedbackTone}
          onSelectAnswer={handleSelectAnswer}
          question={currentQuestion}
        />
      </div>
    </div>
  )
}

export default Quiz
