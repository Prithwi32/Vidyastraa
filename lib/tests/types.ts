import type { Subject, TestType, Difficulty, TestSubject } from "@prisma/client"

// Types based on Prisma schema
export interface TestItem {
  id: string;
  title: string;
  category: TestType;
  subjects: TestSubject[];
  courseId: string;
  createdAt: Date;
  totalQuestions: number;
  duration: number;
  description?: string;
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


export type QuestionStatus = "unattempted" | "attempted" | "review" | "current";

export type QuestionType = 
  | "MCQ" 
  | "MULTI_SELECT" 
  | "ASSERTION_REASON" 
  | "FILL_IN_BLANK" 
  | "MATCHING";

export interface QuestionOption {
  id: string;
  optionText?: string;
  optionImage?: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  leftText: string;
  leftImage?: string;
  rightText: string;
  rightImage?: string;
}

export interface QuestionWithStatus {
  id: string;
  type: QuestionType;
  questionText: string;
  questionImage?: string;
  solutionText?: string;
  solutionImage?: string;
  difficulty: Difficulty;
  subject: string; // Subject name
  chapter: string; // Chapter name
  marks: number;
  negativeMark: number;
  partialMarking: boolean;
  status: QuestionStatus;
  selectedOption?: string | string[]; // For MCQ: string, for MULTI_SELECT: string[]
  options: QuestionOption[];
  matchingPairs: MatchingPair[];
}

export interface TestWithQuestion {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  category: TestType;
  subjects: TestSubject[];
  questions: QuestionWithStatus[];
}

export interface SubmitTestParams {
  testId: string;
  userId: string;
  duration: number; // in minutes
  responses: TestResponseInput[];
}

export interface TestResponseInput {
  questionId: string;
  selectedAnswer: string | string[]; // string for single answer, string[] for multi-select
}

export interface TestResponse {
  id: string;
  testResultId: string;
  questionId: string;
  answer: string[]; // Stores answer(s) as array (single element for non-multi-select)
  marksAwarded: number;
  isCorrect: boolean;
  isAnswered: boolean;
  createdAt: Date;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  duration: number; // in minutes
  totalMarks: number; // Maximum possible marks
  attempted: number; // Number of questions attempted
  correct: number; // Number of correct answers
  wrong: number; // Number of wrong answers
  score: number; // Actual score obtained (after negative marking)
  submittedAt: Date;
}

// For internal use in the submitTest function
interface QuestionData {
  type: QuestionType;
  correctOptionIds: string[];
  marks: number;
  negativeMark: number;
  partialMarking: boolean;
}

interface ProcessedResponse {
  testResultId: string;
  questionId: string;
  answer: string[];
  marksAwarded: number;
  isCorrect: boolean;
  isAnswered: boolean;
}