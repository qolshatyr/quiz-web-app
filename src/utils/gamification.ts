import type {
  GamificationState,
  QuizGamificationSummary,
  QuizHistoryItem,
  QuizResult,
  TopicMasteryRecord,
} from '../types/quiz'

const XP_PER_CORRECT = 10
const QUIZ_COMPLETION_BONUS = 25
const PERFECT_QUIZ_BONUS = 50

const STREAK_BONUSES: Record<number, { xp: number; label: string }> = {
  3: { xp: 5, label: 'Nice!' },
  5: { xp: 10, label: 'Streak x5' },
  10: { xp: 25, label: 'Perfect so far!' },
}

export function getLevelFromXp(totalXP: number) {
  return Math.floor(totalXP / 100) + 1
}

export function getMasteryLabel(score: number) {
  if (score >= 90) {
    return 'Mastered'
  }

  if (score >= 70) {
    return 'Strong'
  }

  if (score >= 40) {
    return 'Learning'
  }

  return 'Beginner'
}

export function getPerformanceLabel(percentage: number) {
  if (percentage === 100) {
    return 'Perfect run'
  }

  if (percentage >= 80) {
    return 'Strong result'
  }

  if (percentage >= 50) {
    return 'Good practice'
  }

  return 'Needs review'
}

export function getStreakReward(nextStreak: number) {
  const bonus = STREAK_BONUSES[nextStreak]

  return {
    xp: bonus?.xp ?? 0,
    label: bonus?.label ?? null,
  }
}

export function getAnswerReward(isCorrect: boolean, currentStreak: number) {
  if (!isCorrect) {
    return {
      xpEarned: 0,
      nextStreak: 0,
      milestoneLabel: null,
      milestoneBonus: 0,
    }
  }

  const nextStreak = currentStreak + 1
  const streakReward = getStreakReward(nextStreak)

  return {
    xpEarned: XP_PER_CORRECT + streakReward.xp,
    nextStreak,
    milestoneLabel: streakReward.label,
    milestoneBonus: streakReward.xp,
  }
}

export function createDefaultGamificationState(): GamificationState {
  return {
    totalXP: 0,
    level: 1,
    bestStreak: 0,
    totalCorrectAnswers: 0,
    totalCompletedQuizzes: 0,
    fixedMistakes: 0,
    dailyStudyStreak: 0,
    lastStudyDate: null,
    topicMastery: {},
    history: [],
  }
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getPreviousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return getLocalDateKey(date)
}

function getQuizXp(result: QuizResult) {
  let xpEarned = 0
  let currentStreak = 0
  let streakPeak = 0
  let milestoneBonus = 0

  for (const answer of result.answers) {
    if (answer.isCorrect) {
      currentStreak += 1
      const reward = getStreakReward(currentStreak)
      xpEarned += XP_PER_CORRECT + reward.xp
      milestoneBonus += reward.xp
      streakPeak = Math.max(streakPeak, currentStreak)
      continue
    }

    currentStreak = 0
  }

  const completionBonus = result.totalQuestions > 0 ? QUIZ_COMPLETION_BONUS : 0
  const perfectBonus = result.percentage === 100 ? PERFECT_QUIZ_BONUS : 0

  return {
    xpEarned: xpEarned + completionBonus + perfectBonus,
    streakPeak,
    completionBonus,
    perfectBonus,
    milestoneBonus,
  }
}

function buildHistoryItem(result: QuizResult, xpEarned: number): QuizHistoryItem {
  return {
    resultId: result.id,
    completedAt: result.completedAt,
    modeLabel: result.mode.label,
    percentage: result.percentage,
    score: result.score,
    totalQuestions: result.totalQuestions,
    xpEarned,
  }
}

export function finalizeGamificationForResult(
  result: QuizResult,
  currentState: GamificationState,
): { state: GamificationState; summary: QuizGamificationSummary } {
  const {
    xpEarned,
    streakPeak,
    completionBonus,
    perfectBonus,
    milestoneBonus,
  } = getQuizXp(result)

  const levelBefore = currentState.level
  const totalXP = currentState.totalXP + xpEarned
  const levelAfter = getLevelFromXp(totalXP)
  const bestStreak = Math.max(currentState.bestStreak, streakPeak)
  const fixedMistakesAwarded = result.mode.type === 'mistakes' ? result.resolvedMistakeQuestionIds.length : 0

  const todayKey = getLocalDateKey()
  const dailyStudyStreak =
    currentState.lastStudyDate === todayKey
      ? Math.max(1, currentState.dailyStudyStreak)
      : currentState.lastStudyDate === getPreviousDateKey(todayKey)
        ? currentState.dailyStudyStreak + 1
        : 1

  const topicMastery = { ...currentState.topicMastery }
  const masteryByTopic: Record<string, TopicMasteryRecord> = {}

  for (const topicPerformance of Object.values(result.topicBreakdown)) {
    const previous = topicMastery[topicPerformance.topicId]
    const bestScore = Math.max(previous?.bestScore ?? 0, topicPerformance.percentage)
    const record: TopicMasteryRecord = {
      bestScore,
      attempts: (previous?.attempts ?? 0) + 1,
      masteryLabel: getMasteryLabel(bestScore),
    }

    topicMastery[topicPerformance.topicId] = record
    masteryByTopic[topicPerformance.topicId] = record
  }

  const summary: QuizGamificationSummary = {
    xpEarned,
    levelBefore,
    levelAfter,
    streakPeak,
    bestStreak,
    completionBonus,
    perfectBonus,
    milestoneBonus,
    fixedMistakesAwarded,
    totalXP,
    dailyStudyStreak,
    newLevel: levelAfter > levelBefore,
    newBestStreak: bestStreak > currentState.bestStreak,
    performanceLabel: getPerformanceLabel(result.percentage),
    masteryByTopic,
  }

  return {
    state: {
      totalXP,
      level: levelAfter,
      bestStreak,
      totalCorrectAnswers: currentState.totalCorrectAnswers + result.correctCount,
      totalCompletedQuizzes: currentState.totalCompletedQuizzes + 1,
      fixedMistakes: currentState.fixedMistakes + fixedMistakesAwarded,
      dailyStudyStreak,
      lastStudyDate: todayKey,
      topicMastery,
      history: [buildHistoryItem(result, xpEarned), ...currentState.history].slice(0, 50),
    },
    summary,
  }
}
