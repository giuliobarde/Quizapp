'use client'

import { Question } from '@/types/quiz'
import styles from './QuizComponent.module.css'

interface QuizComponentProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | null
  isCorrect: boolean | null
  onAnswerSelect: (answerId: string) => void
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

export default function QuizComponent({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isCorrect,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSkip,
  canGoPrevious,
  canGoNext,
}: QuizComponentProps) {
  const showFeedback = selectedAnswer !== null && isCorrect !== null
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
          <div className={styles.questionCounter}>
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>

        <div className={styles.questionSection}>
          <h1 className={styles.question}>{question.question}</h1>

          {showFeedback && (
            <>
              <div className={`${styles.feedback} ${isCorrect ? styles.correctFeedback : styles.incorrectFeedback}`}>
                {isCorrect ? (
                  <span className={styles.feedbackIcon}>✓</span>
                ) : (
                  <span className={styles.feedbackIcon}>✗</span>
                )}
                <span className={styles.feedbackText}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              {question.explanation && (
                <div className={styles.explanation}>
                  <div className={styles.explanationHeader}>
                    <span className={styles.explanationIcon}>💡</span>
                    <span className={styles.explanationTitle}>Explanation</span>
                  </div>
                  <p className={styles.explanationText}>{question.explanation}</p>
                </div>
              )}
            </>
          )}

          <div className={styles.options}>
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.id
              const isCorrectAnswer = option.id === question.correctAnswer
              const showAsCorrect = showFeedback && isCorrectAnswer
              const showAsIncorrect = showFeedback && isSelected && !isCorrect
              
              return (
                <button
                  key={option.id}
                  className={`${styles.option} ${
                    isSelected ? styles.selected : ''
                  } ${
                    showAsCorrect ? styles.correct : ''
                  } ${
                    showAsIncorrect ? styles.incorrect : ''
                  }`}
                  onClick={() => onAnswerSelect(option.id)}
                  disabled={showFeedback}
                >
                  <span className={styles.optionLabel}>{option.id.toUpperCase()}</span>
                  <span className={styles.optionText}>{option.text}</span>
                  {showAsCorrect && <span className={styles.checkmark}>✓</span>}
                  {showAsIncorrect && <span className={styles.crossmark}>✗</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onSkip}
          >
            Skip Question
          </button>
          <div className={styles.navigationButtons}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              Previous
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={onNext}
              disabled={!canGoNext && !selectedAnswer}
            >
              {canGoNext ? 'Next' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

