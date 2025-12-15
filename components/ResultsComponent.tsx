'use client'

import { Question, Answer } from '@/types/quiz'
import styles from './ResultsComponent.module.css'

interface ResultsComponentProps {
  answers: Answer[]
  questions: Question[]
  onRestart: () => void
  onBackToHome?: () => void
}

export default function ResultsComponent({
  answers,
  questions,
  onRestart,
  onBackToHome,
}: ResultsComponentProps) {
  const correctAnswers = answers.filter(
    (answer) => answer.isCorrect === true
  ).length
  const skippedAnswers = answers.filter((answer) => answer.isSkipped).length
  const incorrectAnswers = answers.filter(
    (answer) => answer.isCorrect === false
  ).length
  const totalQuestions = questions.length
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

  const getScoreColor = () => {
    if (scorePercentage >= 80) return '#4caf50'
    if (scorePercentage >= 60) return '#ff9800'
    return '#f44336'
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quiz Complete!</h1>
          <div
            className={styles.scoreCircle}
            style={{ borderColor: getScoreColor() }}
          >
            <div className={styles.scoreNumber} style={{ color: getScoreColor() }}>
              {scorePercentage}%
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber} style={{ color: '#4caf50' }}>
              {correctAnswers}
            </div>
            <div className={styles.statLabel}>Correct</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber} style={{ color: '#f44336' }}>
              {incorrectAnswers}
            </div>
            <div className={styles.statLabel}>Incorrect</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber} style={{ color: '#ff9800' }}>
              {skippedAnswers}
            </div>
            <div className={styles.statLabel}>Skipped</div>
          </div>
        </div>

        <div className={styles.reviewSection}>
          <h2 className={styles.reviewTitle}>Review</h2>
          <div className={styles.reviewList}>
            {questions.map((question, index) => {
              const answer = answers[index]
              const isCorrect = answer?.isCorrect
              const isSkipped = answer?.isSkipped
              const selectedOption = question.options.find(
                (opt) => opt.id === answer?.selectedAnswer
              )
              const correctOption = question.options.find(
                (opt) => opt.id === question.correctAnswer
              )

              return (
                <div
                  key={question.id}
                  className={`${styles.reviewItem} ${
                    isCorrect
                      ? styles.correct
                      : isSkipped
                      ? styles.skipped
                      : styles.incorrect
                  }`}
                >
                  <div className={styles.reviewQuestion}>
                    <span className={styles.questionNumber}>{index + 1}.</span>
                    {question.question}
                  </div>
                  <div className={styles.reviewAnswers}>
                    {isSkipped ? (
                      <div className={styles.skippedBadge}>Skipped</div>
                    ) : (
                      <>
                        <div className={styles.answerRow}>
                          <span className={styles.answerLabel}>Your answer:</span>
                          <span
                            className={`${styles.answerValue} ${
                              isCorrect ? styles.correctAnswer : styles.incorrectAnswer
                            }`}
                          >
                            {selectedOption?.id.toUpperCase()}. {selectedOption?.text}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className={styles.answerRow}>
                            <span className={styles.answerLabel}>Correct answer:</span>
                            <span className={`${styles.answerValue} ${styles.correctAnswer}`}>
                              {correctOption?.id.toUpperCase()}. {correctOption?.text}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {question.explanation && (
                      <div className={styles.reviewExplanation}>
                        <div className={styles.explanationHeader}>
                          <span className={styles.explanationIcon}>💡</span>
                          <span className={styles.explanationTitle}>Explanation</span>
                        </div>
                        <p className={styles.explanationText}>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.actionButtons}>
          {onBackToHome && (
            <button className={styles.backButton} onClick={onBackToHome}>
              Back to Home
            </button>
          )}
          <button className={styles.restartButton} onClick={onRestart}>
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  )
}

