'use client'

import { useRouter } from 'next/navigation'
import quizzesData from '@/data/quizzes.json'
import styles from './home.module.css'

interface Quiz {
  id: string
  name: string
  title: string
  description: string
  questionCount: number
  difficulty: string
}

export default function Home() {
  const router = useRouter()
  const quizzes = quizzesData as Quiz[]

  const handleStartQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quiz App</h1>
          <p className={styles.subtitle}>Test your knowledge and challenge yourself!</p>
        </div>

        <div className={styles.quizzesGrid}>
          {quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className={`${styles.quizCard} ${quiz.id === 'random-100' ? styles.featuredCard : ''}`}
            >
              <div className={styles.quizHeader}>
                <h2 className={styles.quizTitle}>{quiz.name || quiz.title}</h2>
                <span className={styles.difficultyBadge}>{quiz.difficulty}</span>
              </div>
              <p className={styles.quizDescription}>{quiz.description}</p>
              <div className={styles.quizFooter}>
                <span className={styles.questionCount}>
                  {quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'}
                  {quiz.id === 'random-100' && ' (randomly selected)'}
                </span>
                <button
                  className={styles.startButton}
                  onClick={() => handleStartQuiz(quiz.id)}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className={styles.emptyState}>
            <p>No quizzes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
