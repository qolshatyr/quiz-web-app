import type {
  BestScoreRecord,
  BestScoresMap,
  GamificationState,
  QuizResult,
  QuizSession,
  WrongAnswerRecord,
} from '../types/quiz'
import { createDefaultGamificationState, finalizeGamificationForResult } from './gamification'

const STORAGE_KEYS = {
  activeSession: 'quiz-app-active-session',
  bestScores: 'quiz-app-best-scores',
  history: 'quiz-app-history',
  lastResult: 'quiz-app-last-result',
  mistakes: 'quiz-app-mistakes',
  gamification: 'quiz-app-gamification',
} as const

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getBestScoreKey(mode: QuizResult['mode']): string {
  if (mode.type === 'topic' && mode.topicId) {
    return `topic:${mode.topicId}`
  }

  if (mode.type === 'mistakes') {
    return 'mistakes'
  }

  return 'all'
}

export function getBestScores(): BestScoresMap {
  return readStorage<BestScoresMap>(STORAGE_KEYS.bestScores, {})
}

export function getBestScoreForKey(key: string): BestScoreRecord | null {
  const bestScores = getBestScores()
  return bestScores[key] ?? null
}

function saveBestScore(result: QuizResult) {
  const bestScores = getBestScores()
  const key = getBestScoreKey(result.mode)
  const currentRecord = bestScores[key]

  const nextRecord: BestScoreRecord = {
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    completedAt: result.completedAt,
    label: result.mode.label,
  }

  if (
    !currentRecord ||
    nextRecord.percentage > currentRecord.percentage ||
    (nextRecord.percentage === currentRecord.percentage && nextRecord.score > currentRecord.score)
  ) {
    bestScores[key] = nextRecord
    writeStorage(STORAGE_KEYS.bestScores, bestScores)
  }
}

export function getQuizHistory(): QuizResult[] {
  return readStorage<QuizResult[]>(STORAGE_KEYS.history, [])
}

export function getLastResult(): QuizResult | null {
  return readStorage<QuizResult | null>(STORAGE_KEYS.lastResult, null)
}

export function getMistakes(): WrongAnswerRecord[] {
  return readStorage<WrongAnswerRecord[]>(STORAGE_KEYS.mistakes, [])
}

export function saveMistakes(wrongAnswers: WrongAnswerRecord[]) {
  const existingMistakes = getMistakes()
  const mistakesMap = new Map(existingMistakes.map((mistake) => [mistake.questionId, mistake]))

  for (const wrongAnswer of wrongAnswers) {
    mistakesMap.set(wrongAnswer.questionId, wrongAnswer)
  }

  writeStorage(STORAGE_KEYS.mistakes, [...mistakesMap.values()])
}

export function removeMistakes(questionIds: string[]) {
  if (questionIds.length === 0) {
    return
  }

  const remainingMistakes = getMistakes().filter((mistake) => !questionIds.includes(mistake.questionId))
  writeStorage(STORAGE_KEYS.mistakes, remainingMistakes)
}

export function getGamificationState(): GamificationState {
  const fallback = createDefaultGamificationState()
  const stored = readStorage<GamificationState>(STORAGE_KEYS.gamification, fallback)

  return {
    ...fallback,
    ...stored,
    topicMastery: stored.topicMastery ?? {},
    history: stored.history ?? [],
  }
}

export function saveGamificationState(state: GamificationState) {
  writeStorage(STORAGE_KEYS.gamification, state)
}

export function saveResult(result: QuizResult): QuizResult {
  const currentGamification = getGamificationState()
  const { state, summary } = finalizeGamificationForResult(result, currentGamification)
  const finalResult: QuizResult = {
    ...result,
    gamificationSummary: summary,
  }

  writeStorage(STORAGE_KEYS.lastResult, finalResult)

  const history = getQuizHistory()
  writeStorage(STORAGE_KEYS.history, [finalResult, ...history].slice(0, 50))

  saveBestScore(finalResult)
  saveMistakes(finalResult.wrongAnswers)

  if (finalResult.mode.type === 'mistakes') {
    removeMistakes(finalResult.resolvedMistakeQuestionIds)
  }

  saveGamificationState(state)
  clearActiveQuizSession()

  return finalResult
}

export function getActiveQuizSession(): QuizSession | null {
  return readStorage<QuizSession | null>(STORAGE_KEYS.activeSession, null)
}

export function saveActiveQuizSession(session: QuizSession) {
  writeStorage(STORAGE_KEYS.activeSession, session)
}

export function clearActiveQuizSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEYS.activeSession)
}

export function resetProgress() {
  if (typeof window === 'undefined') {
    return
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
}
