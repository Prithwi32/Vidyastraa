import type {
  TestItem,
  TestWithQuestions,
  TestSubmission,
  TestResultWithDetails,
  TestResultItem,
} from "@/lib/tests/types";

// In a real app, these would be API calls to your backend
// For now, we'll simulate them with mock data

// Fetch completed tests for the current user
export async function fetchCompletedTests(): Promise<TestResultItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "result-1",
      testId: "test-1",
      userId: "user-1",
      duration: 45,
      totalMarks: 80,
      attempted: 17,
      correct: 17,
      wrong: 3,
      score: 68,
      submittedAt: new Date("2023-05-15"),
      test: {
        title: "Physics - Mechanics",
        category: "JEE",
      },
    },
    {
      id: "result-2",
      testId: "test-2",
      userId: "user-1",
      duration: 55,
      totalMarks: 100,
      attempted: 22,
      correct: 19,
      wrong: 3,
      score: 78,
      submittedAt: new Date("2023-05-20"),
      test: {
        title: "Chemistry - Organic Compounds",
        category: "JEE",
      },
    },
    {
      id: "result-3",
      testId: "test-3",
      userId: "user-1",
      duration: 40,
      totalMarks: 60,
      attempted: 15,
      correct: 14,
      wrong: 1,
      score: 55,
      submittedAt: new Date("2023-05-25"),
      test: {
        title: "Mathematics - Calculus",
        category: "JEE",
      },
    },
    {
      id: "result-4",
      testId: "test-4",
      userId: "user-1",
      duration: 50,
      totalMarks: 80,
      attempted: 20,
      correct: 18,
      wrong: 2,
      score: 70,
      submittedAt: new Date("2023-06-01"),
      test: {
        title: "Biology - Cell Structure",
        category: "NEET",
      },
    },
  ];
}

// Fetch upcoming tests
export async function fetchUpcomingTests(): Promise<TestItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "test-5",
      title: "Physics - Electromagnetism",
      category: "JEE",
      subjects: ["PHYSICS"],
      courseId: "course-1",
      createdAt: new Date("2023-06-01"),
      totalQuestions: 25,
      duration: 60,
    },
    {
      id: "test-6",
      title: "Chemistry - Inorganic Chemistry",
      category: "JEE",
      subjects: ["CHEMISTRY"],
      courseId: "course-1",
      createdAt: new Date("2023-06-05"),
      totalQuestions: 30,
      duration: 75,
    },
    {
      id: "test-7",
      title: "Mathematics - Algebra",
      category: "JEE",
      subjects: ["MATHS"],
      courseId: "course-1",
      createdAt: new Date("2023-06-10"),
      totalQuestions: 20,
      duration: 45,
    },
  ];
}

// Fetch a test with its questions
export async function fetchTest(testId: string): Promise<TestWithQuestions> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate questions based on the test
  const test = {
    id: testId,
    title:
      testId === "test-5"
        ? "Physics - Electromagnetism"
        : testId === "test-6"
        ? "Chemistry - Inorganic Chemistry"
        : "Mathematics - Algebra",
    category: "JEE" as const,
    subjects: [
      testId === "test-5"
        ? "PHYSICS"
        : testId === "test-6"
        ? "CHEMISTRY"
        : "MATHS",
    ] as const,
    duration: testId === "test-5" ? 60 : testId === "test-6" ? 75 : 45,
    questions: [],
  };

  // Generate questions
  const numQuestions = testId === "test-5" ? 25 : testId === "test-6" ? 30 : 20;

  const subject = test.subjects[0];

  for (let i = 1; i <= numQuestions; i++) {
    test.questions.push({
      id: `q-${testId}-${i}`,
      question:
        subject === "PHYSICS"
          ? `An electromagnetic wave going through vacuum is described by E = E₀sin(kx − ωt). Which of the following is independent of the wavelength?`
          : subject === "CHEMISTRY"
          ? `Which of the following compounds has the highest boiling point?`
          : `If f(x) = x² - 4x + 3, what is the value of f(3)?`,
      options:
        subject === "PHYSICS"
          ? ["k", "ω", "k/ω", "kω"]
          : subject === "CHEMISTRY"
          ? [
              "Methane (CH₄)",
              "Ethane (C₂H₆)",
              "Propane (C₃H₈)",
              "Butane (C₄H₁₀)",
            ]
          : ["0", "2", "3", "6"],
      correctAnswer:
        subject === "PHYSICS"
          ? "ω"
          : subject === "CHEMISTRY"
          ? "Butane (C₄H₁₀)"
          : "0",
      subject,
      difficulty: "MODERATE",
      solution:
        subject === "PHYSICS"
          ? "The angular frequency ω is independent of wavelength as it depends on the frequency of the wave, not its spatial characteristics."
          : subject === "CHEMISTRY"
          ? "Butane (C₄H₁₀) has the highest boiling point among the given compounds due to its longer carbon chain and stronger intermolecular forces."
          : "f(3) = 3² - 4(3) + 3 = 9 - 12 + 3 = 0",
      marks: 4,
      order: i,
    });
  }

  return test;
}

// Submit a test
export async function submitTest(submission: TestSubmission): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would send the submission to your backend
  console.log("Submitting test:", submission);

  // Return the result ID
  return `result-${submission.testId}`;
}

// Fetch test result
export async function fetchTestResult(
  resultId: string
): Promise<TestResultWithDetails> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate a test result
  const testId = resultId.replace("result-", "");
  const test = {
    id: testId,
    title:
      testId === "test-5"
        ? "Physics - Electromagnetism"
        : testId === "test-6"
        ? "Chemistry - Inorganic Chemistry"
        : "Mathematics - Algebra",
    category: "JEE" as const,
    subjects: [
      testId === "test-5"
        ? "PHYSICS"
        : testId === "test-6"
        ? "CHEMISTRY"
        : "MATHS",
    ] as const,
  };

  // Generate a result
  const result: TestResultWithDetails = {
    id: resultId,
    testId,
    userId: "user-1",
    duration: 180,
    totalMarks: 360,
    attempted: 72,
    correct: 58,
    wrong: 14,
    score: 232,
    percentage: 64.4,
    submittedAt: new Date(),
    test,
    subjectScores: [
      {
        subject: "PHYSICS",
        total: 30,
        attempted: 25,
        correct: 20,
        score: 80,
        percentage: 66.7,
      },
      {
        subject: "CHEMISTRY",
        total: 30,
        attempted: 24,
        correct: 18,
        score: 72,
        percentage: 60,
      },
      {
        subject: "MATHS",
        total: 30,
        attempted: 23,
        correct: 20,
        score: 80,
        percentage: 66.7,
      },
    ],
    responses: [],
  };

  // Generate responses
  const numQuestions = 90;
  for (let i = 1; i <= numQuestions; i++) {
    const isAttempted = i <= 72;
    const isCorrect = i <= 58;

    if (isAttempted) {
      result.responses.push({
        questionId: `q-${testId}-${i}`,
        selectedAnswer: isCorrect ? "correct" : "incorrect",
        isCorrect,
        question: {
          id: `q-${testId}-${i}`,
          question: `Question ${i}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "correct",
          subject: i <= 30 ? "PHYSICS" : i <= 60 ? "CHEMISTRY" : "MATHS",
          solution: `Solution for question ${i}`,
        },
      });
    }
  }

  return result;
}
