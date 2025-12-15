export interface Question {
  id: number
  question: string
  options: { id: string; text: string }[]
  correctAnswer: string
  explanation?: string
}

export interface Answer {
  questionId: number
  selectedAnswer: string | null
  isCorrect: boolean | null
  isSkipped: boolean
}

export interface Quiz {
  id: string
  name: string
  title: string
  description: string
  questionCount: number
  difficulty: string
  timeLimit?: number // time limit in seconds (optional)
}

export interface QuizResult {
  answers: Answer[]
  timeSpent: number // total time spent in seconds
  timedOut: boolean // whether the quiz ended due to timeout
}

