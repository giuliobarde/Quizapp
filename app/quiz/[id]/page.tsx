'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import QuizComponent from '@/components/QuizComponent'
import ResultsComponent from '@/components/ResultsComponent'
import { Question, Answer, Quiz } from '@/types/quiz'
import chapter5Data from '@/data/chapter5.json'
import chapter6Data from '@/data/chapter6.json'
import chapter7Data from '@/data/chapter7.json'
import chapter8Data from '@/data/chapter8.json'
import chapter9Data from '@/data/chapter9.json'
import quizzesData from '@/data/quizzes.json'
import styles from './page.module.css'

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
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

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

  // Get quiz metadata
  const getQuizMetadata = (id: string): Quiz | null => {
    const quizzes = quizzesData as Quiz[]
    return quizzes.find((q) => q.id === id) || null
  }

  // Initialize and shuffle questions on mount
  useEffect(() => {
    const quizData = getQuizData(quizId)
    if (quizData.length > 0) {
      const shuffledQuestions = shuffleArray(quizData)
      setQuestions(shuffledQuestions)

      // Initialize timer if quiz has time limit
      const quizMetadata = getQuizMetadata(quizId)
      if (quizMetadata?.timeLimit) {
        setTimeRemaining(quizMetadata.timeLimit)
        setStartTime(Date.now())
      } else {
        setTimeRemaining(null)
        setStartTime(Date.now())
      }
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

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isQuizComplete) {
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setTimedOut(true)
          setIsQuizComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isQuizComplete])

  // Track time spent
  useEffect(() => {
    if (isQuizComplete && startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setTimeSpent(elapsed)
    }
  }, [isQuizComplete, startTime])

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
        setTimedOut(false)

        // Reset timer
        const quizMetadata = getQuizMetadata(quizId)
        if (quizMetadata?.timeLimit) {
          setTimeRemaining(quizMetadata.timeLimit)
        }
        setStartTime(Date.now())
      }
    } else {
      const quizData = getQuizData(quizId)
      if (quizData.length > 0) {
        const shuffledQuestions = shuffleArray(quizData)
        setQuestions(shuffledQuestions)
        setCurrentQuestionIndex(0)
        setIsQuizComplete(false)
        setTimedOut(false)

        // Reset timer
        const quizMetadata = getQuizMetadata(quizId)
        if (quizMetadata?.timeLimit) {
          setTimeRemaining(quizMetadata.timeLimit)
        }
        setStartTime(Date.now())
      }
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (isQuizComplete) {
    return (
      <ResultsComponent
        answers={answers}
        questions={questions}
        onRestart={handleRestart}
        onBackToHome={handleBackToHome}
        timeSpent={timeSpent}
        timedOut={timedOut}
      />
    )
  }

  if (questions.length === 0) {
    const quizData = getQuizData(quizId)
    if (quizData.length === 0) {
      return (
        <div className={styles.errorContainer}>
          <h1 className={styles.errorTitle}>No questions available</h1>
          <p className={styles.errorText}>This quiz doesn't have any questions yet.</p>
          <button
            onClick={handleBackToHome}
            className={styles.errorButton}
          >
            Back to Home
          </button>
        </div>
      )
    }
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.loadingText}>Loading quiz...</h1>
      </div>
    )
  }

  const currentAnswer = answers[currentQuestionIndex]
  
  return (
    <div className={styles.quizWrapper}>
      <button
        onClick={handleBackToHome}
        className={styles.backButton}
      >
        ← Back
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
        timeRemaining={timeRemaining}
      />
    </div>
  )
}

