import type {
  Option,
  PreparedQuestion,
  Question,
  QuizData,
  QuizMode,
  QuizResult,
  QuizSession,
  Topic,
  TopicPerformance,
  UserAnswer,
  WrongAnswerRecord,
} from '../types/quiz'

const FALLBACK_TOPIC_ID = 'general'
const FALLBACK_TOPIC_TITLE = 'General'

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())

export function shuffleArray<T>(array: T[]): T[] {
  const cloned = [...array]

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]]
  }

  return cloned
}

const buildTopicsMap = (topics: Topic[]) =>
  topics.reduce<Record<string, Topic>>((accumulator, topic) => {
    accumulator[topic.id] = topic
    return accumulator
  }, {})

const buildTopicLabel = (topicId?: string, topicsMap?: Record<string, Topic>) => {
  if (topicId && topicsMap?.[topicId]?.title) {
    return topicsMap[topicId].title
  }

  if (!topicId) {
    return FALLBACK_TOPIC_TITLE
  }

  return toTitleCase(topicId)
}

const determineCorrectOption = (question: Question): Option | undefined => {
  if (question.correctOptionId) {
    return question.options.find((option) => option.id === question.correctOptionId)
  }

  const flaggedOption = question.options.find((option) => option.isCorrect)
  if (flaggedOption) {
    return flaggedOption
  }

  if (typeof question.correctOptionIndex === 'number' && question.options[question.correctOptionIndex]) {
    return question.options[question.correctOptionIndex]
  }

  const answerText = question.correctAnswer ?? question.answer
  if (!answerText) {
    return undefined
  }

  return question.options.find((option) => option.text.trim() === answerText.trim())
}

const normalizeQuestion = (
  question: Question,
  topicsMap?: Record<string, Topic>,
  fallbackTopicId?: string,
): PreparedQuestion => {
  const topicId = question.topicId ?? fallbackTopicId ?? FALLBACK_TOPIC_ID
  const topicTitle = buildTopicLabel(topicId, topicsMap)
  const correctOption = determineCorrectOption(question) ?? question.options[0]
  const correctOptionId = correctOption?.id ?? `${question.id}_correct`
  const correctAnswerText = correctOption?.text ?? question.correctAnswer ?? question.answer ?? ''

  return {
    ...question,
    topicId,
    topicTitle,
    explanation: question.explanation ?? 'No explanation provided for this question.',
    correctOptionId,
    correctAnswerText,
    options: question.options.map((option) => ({
      ...option,
      isCorrect: option.id === correctOptionId,
    })),
  }
}

export function getAllQuestions(data: QuizData): PreparedQuestion[] {
  const topics = data.topics ?? []
  const topicsMap = buildTopicsMap(topics)
  const dedupedQuestions = new Map<string, PreparedQuestion>()

  for (const topic of topics) {
    for (const question of topic.questions ?? []) {
      dedupedQuestions.set(question.id, normalizeQuestion(question, topicsMap, topic.id))
    }
  }

  for (const question of data.questions ?? []) {
    if (!dedupedQuestions.has(question.id)) {
      dedupedQuestions.set(question.id, normalizeQuestion(question, topicsMap))
    }
  }

  return [...dedupedQuestions.values()]
}

export function getQuestionsByTopic(data: QuizData, topicId: string): PreparedQuestion[] {
  return getAllQuestions(data).filter((question) => question.topicId === topicId)
}

export function prepareQuizQuestions(questions: PreparedQuestion[]): PreparedQuestion[] {
  return shuffleArray(questions).map((question) => ({
    ...question,
    options: shuffleArray(question.options.map((option) => ({ ...option }))),
  }))
}

export function limitQuestions(
  questions: PreparedQuestion[],
  requestedCount?: number | 'all',
): PreparedQuestion[] {
  if (!requestedCount || requestedCount === 'all' || requestedCount >= questions.length) {
    return [...questions]
  }

  return questions.slice(0, requestedCount)
}

export function createQuizSession(params: {
  mode: QuizMode
  questions: PreparedQuestion[]
}): QuizSession {
  return {
    id: crypto.randomUUID(),
    mode: params.mode,
    questions: prepareQuizQuestions(params.questions),
    answers: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    currentStreak: 0,
    bestStreak: 0,
    earnedXP: 0,
  }
}

function buildTopicBreakdown(
  questions: PreparedQuestion[],
  answers: Record<string, UserAnswer>,
): Record<string, TopicPerformance> {
  const topicMap: Record<string, TopicPerformance> = {}

  for (const question of questions) {
    const current = topicMap[question.topicId] ?? {
      topicId: question.topicId,
      topicTitle: question.topicTitle,
      correctCount: 0,
      totalQuestions: 0,
      percentage: 0,
    }

    current.totalQuestions += 1
    if (answers[question.id]?.isCorrect) {
      current.correctCount += 1
    }

    current.percentage =
      current.totalQuestions === 0 ? 0 : Math.round((current.correctCount / current.totalQuestions) * 100)

    topicMap[question.topicId] = current
  }

  return topicMap
}

export function calculateScore(
  questions: PreparedQuestion[],
  answers: Record<string, UserAnswer>,
): Omit<QuizResult, 'id' | 'sessionId' | 'mode'> {
  const answerList = questions.map((question) => {
    const answer = answers[question.id]

    return (
      answer ?? {
        questionId: question.id,
        selectedOptionId: null,
        isCorrect: false,
        correctOptionId: question.correctOptionId,
        answeredAt: new Date().toISOString(),
      }
    )
  })

  const wrongAnswers: WrongAnswerRecord[] = []
  let correctCount = 0

  for (const question of questions) {
    const answer = answerList.find((entry) => entry.questionId === question.id)

    if (answer?.isCorrect) {
      correctCount += 1
      continue
    }

    const selectedOption = question.options.find((option) => option.id === answer?.selectedOptionId)
    const correctOption = question.options.find((option) => option.id === question.correctOptionId)

    wrongAnswers.push({
      questionId: question.id,
      questionText: question.prompt,
      topicId: question.topicId,
      topicTitle: question.topicTitle,
      selectedOptionId: answer?.selectedOptionId ?? null,
      selectedOptionText: selectedOption?.text ?? 'Not answered',
      correctOptionId: question.correctOptionId,
      correctOptionText: correctOption?.text ?? question.correctAnswerText,
      explanation: question.explanation ?? 'No explanation provided for this question.',
      updatedAt: new Date().toISOString(),
    })
  }

  const totalQuestions = questions.length
  const wrongCount = totalQuestions - correctCount
  const percentage = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)

  return {
    score: correctCount,
    percentage,
    totalQuestions,
    correctCount,
    wrongCount,
    completedAt: new Date().toISOString(),
    questionIds: questions.map((question) => question.id),
    answers: answerList,
    wrongAnswers,
    resolvedMistakeQuestionIds: questions
      .filter((question) => answers[question.id]?.isCorrect)
      .map((question) => question.id),
    topicBreakdown: buildTopicBreakdown(questions, answers),
  }
}

export function buildQuizResult(session: QuizSession): QuizResult {
  return {
    id: crypto.randomUUID(),
    sessionId: session.id,
    mode: session.mode,
    ...calculateScore(session.questions, session.answers),
  }
}

export function describeMode(mode: QuizMode): string {
  if (mode.type === 'topic') {
    return mode.topicTitle ?? mode.label
  }

  return mode.label
}
