export interface QuizMetadata {
  title?: string
  description?: string
  sourceFile?: string
  totalQuestions?: number
  totalTopics?: number
  version?: string
  language?: string
  schema?: string | Record<string, string>
  structure?: string
  formatVersion?: string
}

export interface Option {
  id: string
  text: string
  isCorrect?: boolean
}

export interface Question {
  id: string
  prompt: string
  options: Option[]
  explanation?: string
  topicId?: string
  category?: string
  type?: string
  difficulty?: string
  correctOptionId?: string
  answer?: string
  correctAnswer?: string
  correctOptionIndex?: number
}

export interface Topic {
  id: string
  title: string
  description?: string
  order?: number
  questionCount?: number
  questionIds?: string[]
  questions?: Question[]
  studyTips?: string[]
}

export interface TopicIndexEntry {
  id: string
  title: string
  description?: string
  questionCount?: number
}

export interface QuizSet {
  id?: string
  title?: string
  description?: string
  topicIds?: string[]
  questionIds?: string[]
  size?: number
}

export interface QuizData {
  metadata?: QuizMetadata
  topicIndex?: TopicIndexEntry[]
  topics?: Topic[]
  questions?: Question[]
  quizSets?: QuizSet[]
}

export type QuizModeType = 'topic' | 'all' | 'mistakes'

export interface QuizMode {
  type: QuizModeType
  label: string
  topicId?: string
  topicTitle?: string
  requestedCount?: number | 'all'
}

export interface PreparedQuestion extends Question {
  topicId: string
  topicTitle: string
  correctOptionId: string
  correctAnswerText: string
  options: Option[]
}

export interface UserAnswer {
  questionId: string
  selectedOptionId: string | null
  isCorrect: boolean
  correctOptionId: string
  answeredAt: string
}

export interface WrongAnswerRecord {
  questionId: string
  questionText: string
  topicId: string
  topicTitle: string
  selectedOptionId: string | null
  selectedOptionText: string
  correctOptionId: string
  correctOptionText: string
  explanation: string
  updatedAt: string
}

export interface TopicPerformance {
  topicId: string
  topicTitle: string
  correctCount: number
  totalQuestions: number
  percentage: number
}

export interface TopicMasteryRecord {
  bestScore: number
  attempts: number
  masteryLabel: string
}

export interface QuizHistoryItem {
  resultId: string
  completedAt: string
  modeLabel: string
  percentage: number
  score: number
  totalQuestions: number
  xpEarned: number
}

export interface QuizGamificationSummary {
  xpEarned: number
  levelBefore: number
  levelAfter: number
  streakPeak: number
  bestStreak: number
  completionBonus: number
  perfectBonus: number
  milestoneBonus: number
  fixedMistakesAwarded: number
  totalXP: number
  dailyStudyStreak: number
  newLevel: boolean
  newBestStreak: boolean
  performanceLabel: string
  masteryByTopic: Record<string, TopicMasteryRecord>
}

export interface GamificationState {
  totalXP: number
  level: number
  bestStreak: number
  totalCorrectAnswers: number
  totalCompletedQuizzes: number
  fixedMistakes: number
  dailyStudyStreak: number
  lastStudyDate: string | null
  topicMastery: Record<string, TopicMasteryRecord>
  history: QuizHistoryItem[]
}

export interface QuizSession {
  id: string
  mode: QuizMode
  questions: PreparedQuestion[]
  answers: Record<string, UserAnswer>
  currentIndex: number
  startedAt: string
  currentStreak: number
  bestStreak: number
  earnedXP: number
}

export interface QuizResult {
  id: string
  sessionId: string
  mode: QuizMode
  score: number
  percentage: number
  totalQuestions: number
  correctCount: number
  wrongCount: number
  completedAt: string
  questionIds: string[]
  answers: UserAnswer[]
  wrongAnswers: WrongAnswerRecord[]
  resolvedMistakeQuestionIds: string[]
  topicBreakdown: Record<string, TopicPerformance>
  gamificationSummary?: QuizGamificationSummary
}

export interface BestScoreRecord {
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  label: string
}

export type BestScoresMap = Record<string, BestScoreRecord>
