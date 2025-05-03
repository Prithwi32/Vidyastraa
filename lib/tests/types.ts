import type { Subject, TestType, Difficulty, TestSubject } from "@prisma/client"

// Types based on Prisma schema
export interface TestItem {
  id: string
  title: string
  category: TestType
  subjects: Subject[]
  description?: string
  courseId: string
  createdAt: Date
  totalQuestions: number
  duration: number
}

export interface TestResultItem {
  id: string
  testId: string
  userId: string
  duration: number
  totalMarks: number
  attempted: number
  totalQuestions?: number
  correct: number
  wrong: number
  score: number
  submittedAt: Date
  test: {
    title: string
    category: TestType
  }
}

export interface QuestionItem {
  id: string
  question: string
  image?: string
  options: string[]
  correctAnswer: string
  subject: Subject
  difficulty?: Difficulty
  solution: string
  marks?: number
  order?: number
}

export interface TestWithQuestion {
  id: string
  title: string
  category: TestType
  subjects: TestSubject[]
  description?: string
  duration: number
  questions: QuestionItem[]
}

export interface TestResponse {
  questionId: string
  selectedAnswer: string
}

export interface TestSubmission {
  testId: string
  userId: string
  duration: number
  responses: TestResponse[]
}

export interface SubjectResult {
  subject: Subject
  total: number
  attempted: number
  correct: number
  score: number
  percentage: number
}

export interface TestResultWithDetails {
  id: string
  testId: string
  userId: string
  duration: number
  totalMarks: number
  attempted: number
  correct: number
  wrong: number
  totalQuestions: number
  score: number
  percentage: number
  submittedAt: Date
  test: {
    id: string
    title: string
    category: TestType
    subjects: Subject[]
  }
  subjectScores: SubjectResult[]
  responses: {
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
    question: {
      id: string
      question: string
      options: string[]
      correctAnswer: string
      subject: Subject
      solution: string
    }
  }[]
}

export type QuestionStatus = "unattempted" | "attempted" | "review" | "current"

export interface QuestionWithStatus extends QuestionItem {
  status: QuestionStatus
  selectedOption?: string
}
