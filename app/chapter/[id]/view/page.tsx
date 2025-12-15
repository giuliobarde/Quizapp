'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Question } from '@/types/quiz'
import chapter5Data from '@/data/chapter5.json'
import chapter6Data from '@/data/chapter6.json'
import chapter7Data from '@/data/chapter7.json'
import chapter8Data from '@/data/chapter8.json'
import chapter9Data from '@/data/chapter9.json'
import quizzesData from '@/data/quizzes.json'
import styles from './page.module.css'

export default function ChapterViewPage() {
  const router = useRouter()
  const params = useParams()
  const chapterId = params.id as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  // Get chapter data based on chapterId
  const getChapterData = (id: string): Question[] => {
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

  // Get chapter metadata
  const getChapterMetadata = (id: string) => {
    const quizzes = quizzesData as any[]
    return quizzes.find((q) => q.id === id) || null
  }

  useEffect(() => {
    const chapterData = getChapterData(chapterId)
    setQuestions(chapterData)
    // Expand all questions by default
    setExpandedQuestions(new Set(chapterData.map((q) => q.id)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId])

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    setExpandedQuestions(new Set(questions.map((q) => q.id)))
  }

  const collapseAll = () => {
    setExpandedQuestions(new Set())
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleStartQuiz = () => {
    router.push(`/quiz/${chapterId}`)
  }

  if (questions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>No questions available</h1>
        <p className={styles.errorText}>This chapter doesn't have any questions yet.</p>
        <button onClick={handleBackToHome} className={styles.errorButton}>
          Back to Home
        </button>
      </div>
    )
  }

  const chapterMetadata = getChapterMetadata(chapterId)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBackToHome} className={styles.backButton}>
          ← Back to Home
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {chapterMetadata?.name || `Chapter ${chapterId}`}
          </h1>
          <p className={styles.subtitle}>
            View all questions with explanations
          </p>
          <div className={styles.headerActions}>
            <button onClick={expandAll} className={styles.actionButton}>
              Expand All
            </button>
            <button onClick={collapseAll} className={styles.actionButton}>
              Collapse All
            </button>
            <button onClick={handleStartQuiz} className={styles.startQuizButton}>
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      <div className={styles.questionsList}>
        {questions.map((question, index) => {
          const isExpanded = expandedQuestions.has(question.id)
          const correctOption = question.options.find(
            (opt) => opt.id === question.correctAnswer
          )

          return (
            <div key={question.id} className={styles.questionCard}>
              <div
                className={styles.questionHeader}
                onClick={() => toggleQuestion(question.id)}
              >
                <div className={styles.questionNumber}>
                  <span className={styles.number}>{index + 1}</span>
                </div>
                <div className={styles.questionText}>
                  {question.question}
                </div>
                <div className={styles.expandIcon}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {isExpanded && (
                <div className={styles.questionContent}>
                  <div className={styles.options}>
                    {question.options.map((option) => {
                      const isCorrect = option.id === question.correctAnswer
                      return (
                        <div
                          key={option.id}
                          className={`${styles.option} ${
                            isCorrect ? styles.correctOption : ''
                          }`}
                        >
                          <span className={styles.optionLabel}>
                            {option.id.toUpperCase()}.
                          </span>
                          <span className={styles.optionText}>{option.text}</span>
                          {isCorrect && (
                            <span className={styles.correctBadge}>✓ Correct</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <div className={styles.explanation}>
                      <div className={styles.explanationHeader}>
                        <span className={styles.explanationIcon}>💡</span>
                        <span className={styles.explanationTitle}>Explanation</span>
                      </div>
                      <p className={styles.explanationText}>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
