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

