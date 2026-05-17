import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import TopicCard from '../components/TopicCard'
import type { QuizData, QuizMode, Topic } from '../types/quiz'
import { createQuizSession, getQuestionsByTopic } from '../utils/quiz'
import { getBestScoreForKey, getGamificationState, saveActiveQuizSession } from '../utils/storage'

interface TopicSelectionProps {
  data: QuizData
}

function sortTopics(topics: Topic[]) {
  return [...topics].sort((left, right) => {
    if (typeof left.order === 'number' && typeof right.order === 'number') {
      return left.order - right.order
    }

    return left.title.localeCompare(right.title)
  })
}

function TopicSelection({ data }: TopicSelectionProps) {
  const navigate = useNavigate()
  const topics = useMemo(() => sortTopics(data.topics ?? []), [data])
  const gamification = getGamificationState()

  const handleStartTopic = (topicId: string) => {
    const topic = topics.find((entry) => entry.id === topicId)
    if (!topic) {
      return
    }

    const mode: QuizMode = {
      type: 'topic',
      label: topic.title,
      topicId: topic.id,
      topicTitle: topic.title,
    }

    const session = createQuizSession({
      mode,
      questions: getQuestionsByTopic(data, topicId),
    })

    saveActiveQuizSession(session)
    navigate('/quiz')
  }

  return (
    <Layout
      eyebrow="Topic mode"
      subtitle="Each topic quiz reshuffles its questions and answer options without mutating the source JSON, while best scores and mastery states are tracked independently."
      title="Choose a Topic"
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const questionCount = getQuestionsByTopic(data, topic.id).length
          const mastery = gamification.topicMastery[topic.id]

          return (
            <TopicCard
              key={topic.id}
              attempts={mastery?.attempts}
              bestScore={getBestScoreForKey(`topic:${topic.id}`)}
              masteryLabel={mastery?.masteryLabel}
              onStart={handleStartTopic}
              questionCount={questionCount}
              topic={topic}
            />
          )
        })}
      </section>
    </Layout>
  )
}

export default TopicSelection
