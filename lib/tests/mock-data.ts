import type { TestWithQuestion, QuestionWithStatus } from "./types"

// Mock test data for testing
export const mockTest: TestWithQuestion = {
  id: "test-123",
  title: "Mock Test for All Question Types",
  description: "This test contains examples of all question types for testing purposes.",
  duration: 60, // 60 minutes
  category: "JEE",
  subjects: ["PHYSICS", "CHEMISTRY", "MATHS"],
  questions: [
    {
      id: "q1",
      type: "MCQ",
      questionText: "What is the value of $\\pi$ (rounded to 2 decimal places)?",
      options: ["3.10", "3.14", "3.16", "3.18"],
      correctAnswer: "B",
      subject: "MATHS",
      order: 1,
      marks: 4,
      negativeMark: 1,
      solution: "The value of $\\pi$ is approximately 3.14159, which rounds to 3.14.",
    },
    {
      id: "q2",
      type: "MULTI_SELECT",
      questionText: "Which of the following are prime numbers?",
      options: ["15", "17", "19", "21"],
      correctAnswer: ["B", "C"],
      subject: "MATHS",
      order: 2,
      marks: 4,
      negativeMark: 1,
      solution: "17 and 19 are prime numbers. 15 = 3 × 5 and 21 = 3 × 7 are composite numbers.",
    },
    {
      id: "q3",
      type: "ASSERTION_REASON",
      question:
        "Assertion: The acceleration due to gravity decreases with altitude.\n---\nReason: The gravitational force is inversely proportional to the square of the distance from the center of the Earth.",
      options: [
        "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
        "Both Assertion and Reason are true but Reason is not the correct explanation of Assertion.",
        "Assertion is true but Reason is false.",
        "Assertion is false but Reason is true.",
      ],
      correctAnswer: "A",
      subject: "PHYSICS",
      order: 3,
      marks: 4,
      negativeMark: 1,
      solution:
        "Both statements are true. The acceleration due to gravity decreases with altitude because the gravitational force is inversely proportional to the square of the distance from the center of the Earth.",
    },
    {
      id: "q4",
      type: "FILL_IN_BLANK",
      questionText: "The chemical formula for water is _______.",
      options: [],
      correctAnswer: ["H2O"],
      subject: "CHEMISTRY",
      order: 4,
      marks: 4,
      negativeMark: 1,
      solution: "Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula H2O.",
    },
    {
      id: "q5",
      type: "MATCHING",
      question: JSON.stringify({
        instruction: "Match the following elements with their symbols:",
        headers: {
          left: "Element",
          right: "Symbol",
        },
      }),
      options: ["A-1, B-2, C-3, D-4", "A-2, B-1, C-4, D-3", "A-3, B-4, C-1, D-2", "A-4, B-3, C-2, D-1"],
      correctAnswer: "A-2, B-1, C-4, D-3",
      subject: "CHEMISTRY",
      order: 5,
      marks: 4,
      negativeMark: 1,
      solution: "The correct matches are: Sodium (Na), Potassium (K), Calcium (Ca), Magnesium (Mg).",
    },
  ],
}

// Mock test result data with answers
export const mockTestResult = {
  id: "result-123",
  testId: "test-123",
  title: "Mock Test for All Question Types",
  description: "This test contains examples of all question types for testing purposes.",
  duration: 60,
  category: "JEE",
  subjects: ["PHYSICS", "CHEMISTRY", "MATHS"],
  questions: mockTest.questions.map((q) => ({
    ...q,
    subject: { name: q.subject },
  })),
  responses: [
    {
      questionId: "q1",
      selectedAnswer: "3.14",
      isCorrect: true,
    },
    {
      questionId: "q2",
      selectedAnswer: ["17", "19"],
      isCorrect: true,
    },
    {
      questionId: "q3",
      selectedAnswer: "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
      isCorrect: true,
    },
    {
      questionId: "q4",
      selectedAnswer: "H2O",
      isCorrect: true,
    },
    {
      questionId: "q5",
      selectedAnswer: "A-2, B-1, C-4, D-3",
      isCorrect: true,
    },
  ],
  score: 20,
  totalMarks: 20,
  submittedAt: new Date().toISOString(),
}

// Function to generate questions with status for testing
export function generateMockQuestionsWithStatus(mode: "test" | "review"): QuestionWithStatus[] {
  if (mode === "test") {
    return mockTest.questions.map((q, index) => ({
      ...q,
      status: index === 0 ? "current" : "unattempted",
      selectedOption: undefined,
    })) as QuestionWithStatus[]
  } else {
    // For review mode
    return mockTest.questions.map((q, index) => {
      const response = mockTestResult.responses.find((r) => r.questionId === q.id)
      return {
        ...q,
        subject: q.subject,
        status: index === 0 ? "current" : "reviewed",
        selectedOption: response?.selectedAnswer,
        isCorrect: response?.isCorrect || false,
        marksAwarded: response?.isCorrect ? q.marks : 0,
      } as QuestionWithStatus
    })
  }
}
