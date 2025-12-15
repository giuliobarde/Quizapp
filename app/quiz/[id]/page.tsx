'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import QuizComponent from '@/components/QuizComponent'
import ResultsComponent from '@/components/ResultsComponent'
import { Question, Answer } from '@/types/quiz'
import chapter5Data from '@/data/chapter5.json'
import chapter6Data from '@/data/chapter6.json'
import chapter7Data from '@/data/chapter7.json'
import chapter8Data from '@/data/chapter8.json'
import chapter9Data from '@/data/chapter9.json'

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])

  // Get all questions from all chapters
  const getAllQuestions = (): Question[] => {
    const allQuestions: Question[] = [
      ...(chapter5Data as Question[]),
      ...(chapter6Data as Question[]),
      ...(chapter7Data as Question[]),
      ...(chapter8Data as Question[]),
      ...(chapter9Data as Question[]),
    ]
    return allQuestions
  }

  // Load quiz data based on quizId
  const getQuizData = (id: string): Question[] => {
    if (id === 'random-100') {
      // For random 100, combine all questions and select 100 randomly
      const allQuestions = getAllQuestions()
      if (allQuestions.length === 0) {
        return []
      }
      // Shuffle and take up to 100 questions
      const shuffled = shuffleArray(allQuestions)
      return shuffled.slice(0, Math.min(100, shuffled.length))
    }

    switch (id) {
      case 'chapter5':
        return chapter5Data as Question[]
      case 'chapter6':
        return chapter6Data as Question[]
      case 'chapter7':
        return chapter7Data as Question[]
      case 'chapter8':
        return chapter8Data as Question[]
      case 'chapter9':
        return chapter9Data as Question[]
      default:
        return []
    }
  }

  // Initialize and shuffle questions on mount
  useEffect(() => {
    const quizData = getQuizData(quizId)
    if (quizData.length > 0) {
      const shuffledQuestions = shuffleArray(quizData)
      setQuestions(shuffledQuestions)
    } else {
      setQuestions([])
    }
  }, [quizId])

  useEffect(() => {
    // Initialize answers array when questions change
    if (questions.length > 0) {
      const initialAnswers: Answer[] = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: null,
        isCorrect: null,
        isSkipped: false,
      }))
      setAnswers(initialAnswers)
    }
  }, [questions])

  const handleAnswerSelect = (answerId: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answerId === currentQuestion.correctAnswer

    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedAnswer: answerId,
      isCorrect,
      isSkipped: false,
    }
    setAnswers(updatedAnswers)
  }

  const handleSkip = () => {
    const updatedAnswers = [...answers]
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      isSkipped: true,
      selectedAnswer: null,
      isCorrect: null,
    }
    setAnswers(updatedAnswers)
    handleNext()
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsQuizComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestart = () => {
    // Shuffle questions again on restart
    // For random-100, we need to regenerate the random selection
    if (quizId === 'random-100') {
      const allQuestions = getAllQuestions()
      if (allQuestions.length > 0) {
        const shuffled = shuffleArray(allQuestions)
        const selectedQuestions = shuffled.slice(0, Math.min(100, shuffled.length))
        setQuestions(selectedQuestions)
        setCurrentQuestionIndex(0)
        setIsQuizComplete(false)
      }
    } else {
      const quizData = getQuizData(quizId)
      if (quizData.length > 0) {
        const shuffledQuestions = shuffleArray(quizData)
        setQuestions(shuffledQuestions)
        setCurrentQuestionIndex(0)
        setIsQuizComplete(false)
      }
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (isQuizComplete) {
    return <ResultsComponent answers={answers} questions={questions} onRestart={handleRestart} onBackToHome={handleBackToHome} />
  }

  if (questions.length === 0) {
    const quizData = getQuizData(quizId)
    if (quizData.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
          <h1>No questions available</h1>
          <p>This quiz doesn't have any questions yet.</p>
          <button
            onClick={handleBackToHome}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Back to Home
          </button>
        </div>
      )
    }
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
        <h1>Loading quiz...</h1>
      </div>
    )
  }

  const currentAnswer = answers[currentQuestionIndex]
  
  return (
    <>
      <button
        onClick={handleBackToHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
      >
        ← Back to Home
      </button>
      <QuizComponent
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={currentAnswer?.selectedAnswer || null}
        isCorrect={currentAnswer?.isCorrect}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        canGoPrevious={currentQuestionIndex > 0}
        canGoNext={currentQuestionIndex < questions.length - 1}
      />
    </>
  )
}

