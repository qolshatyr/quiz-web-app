import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { QuizData } from './types/quiz'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import ReviewMistakes from './pages/ReviewMistakes'
import TopicSelection from './pages/TopicSelection'

function App() {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [hasLoadError, setHasLoadError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadQuizData = async () => {
      try {
        const module = await import('./data/quiz-data.json')
        if (isMounted) {
          setQuizData(module.default as unknown as QuizData)
        }
      } catch {
        if (isMounted) {
          setHasLoadError(true)
        }
      }
    }

    void loadQuizData()

    return () => {
      isMounted = false
    }
  }, [])

  if (hasLoadError) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-xl rounded-[2rem] p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">Data load error</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Quiz data could not be loaded</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Check that [src/data/quiz-data.json] exists and is valid JSON, then reload the page.
          </p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="surface-card w-full max-w-xl rounded-[2rem] p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">Preparing quiz data</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Loading local question bank</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The app is loading the bundled JSON file so the quiz can run fully on the client.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Home data={quizData} />} />
      <Route path="/topics" element={<TopicSelection data={quizData} />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/results" element={<Results data={quizData} />} />
      <Route path="/mistakes" element={<ReviewMistakes data={quizData} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
