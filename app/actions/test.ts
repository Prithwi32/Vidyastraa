"use server";

import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  QuestionType,
  QuestionWithStatus,
  SubjectResult,
  TestItem,
  TestResultItem,
  TestResultWithDetails,
  TestWithQuestion,
} from "@/lib/tests/types";
import {
  Category,
  Subject,
  Test,
  Question,
  TestType,
  Difficulty,
  TestResult,
  TestResponse,
  TestSubject,
  MatchingPair,
} from "@prisma/client";
import { getServerSession } from "next-auth/next";

interface QuestionData {
  questionId: string;
  marks: number;
  negativeMark: number;
  partialMarking: boolean;
}

interface CreateTestData {
  title: string;
  duration: number;
  category: TestType;
  subjects: TestSubject[];
  description?: string;
  courseId: string;
  questions: QuestionData[];
}

export async function createTest(testData: CreateTestData) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const validSubjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];
    const invalidSubjects = testData.subjects.filter(
      (subject) => !validSubjects.includes(subject)
    );

    if (invalidSubjects.length > 0) {
      throw new Error(`Invalid subjects: ${invalidSubjects.join(", ")}`);
    }

    const result = await prisma.$transaction(async (prisma) => {
      const test = await prisma.test.create({
        data: {
          title: testData.title,
          description: testData.description,
          duration: Number(testData.duration),
          category: testData.category,
          courseId: testData.courseId,
          subjects: testData.subjects,
        },
      });

      await Promise.all(
        testData.questions.map((question) =>
          prisma.testQuestion.create({
            data: {
              testId: test.id,
              questionId: question.questionId,
              marks: question.marks,
              negativeMark: question.negativeMark,
              partialMarking: question.partialMarking,
            },
          })
        )
      );

      return test;
    });

    return {
      success: true,
      message: "Test created successfully",
      testId: result.id,
    };
  } catch (error) {
    console.error("Error creating test:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create test",
    };
  }
}

// In your test action file
export async function getAllTests() {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const tests = await prisma.test.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            category: true,
            thumbnail: true,
            detailedDescription: true,
          },
        },
        questions: {
          include: {
            question: {
              include: {
                subject: true,
              },
            },
          },
        },
        results: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
            score: true,
            submittedAt: true,
          },
        },
      },
    });

    // Add isEnrolled flag for each test
    const testsWithEnrollment = await Promise.all(
      tests.map(async (test) => {
        let isEnrolled = false;
        if (test.courseId) {
          const enrollment = await prisma.enrolledCourse.findFirst({
            where: {
              userId: session.user.id,
              courseId: test.courseId,
            },
          });
          isEnrolled = !!enrollment;
        }
        return {
          ...test,
          isEnrolled,
        };
      })
    );

    return {
      success: true,
      tests: testsWithEnrollment,
    };
  } catch (error) {
    console.error("Error fetching tests:", error);
    return { success: false, message: "Failed to fetch tests" };
  }
}

export type TestWithQuestions = Test & {
  questions: Array<{
    question: Question;
    marks?: number;
    order: number | null;
  }>;
  course: {
    id: string;
    name: string;
  };
};

export async function getTestById(id: string) {
  try {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: {
              include: {
                subject: true,
                chapter: true,
                options: {
                  select: {
                    id: true,
                    optionText: true,
                    optionImage: true,
                    isCorrect: true,
                  },
                },
                matchingPairs: true,
              },
            },
          },
          orderBy: {
            question: {
              chapter: {
                name: 'asc',
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!test) {
      return null;
    }

    // Transform the data to match the expected format
    const transformedTest = {
      ...test,
      questions: test.questions.map((tq) => ({
        ...tq,
        marks: tq.marks,
        negativeMark: tq.negativeMark,
        partialMarking: tq.partialMarking,
        question: {
          ...tq.question,
          correctAnswer: tq.question.options.find((opt) => opt.isCorrect)?.id || '',
          options: tq.question.options.map((opt) => ({
            id: opt.id,
            text: opt.optionText,
            image: opt.optionImage,
            isCorrect: opt.isCorrect,
          })),
        },
      })),
    };

    return transformedTest;
  } catch (error) {
    console.error("Error fetching test:", error);
    throw new Error("Failed to fetch test details");
  }
}

export interface UpdateTestData {
  title: string;
  description?: string;
  category: "JEE" | "NEET" | "CRASH_COURSES" | "INDIVIDUAL" | "OTHER";
  subjects: ("PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY")[];
  courseId: string;
  duration: number | string;
  questions: Array<{
    questionId: string;
    marks: number;
    negativeMark?: number;
    partialMarking?: boolean;
  }>;
}

export async function updateTest(testId: string, data: UpdateTestData) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedTest = await tx.test.update({
        where: { id: testId },
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          subjects: data.subjects,
          duration: Number(data.duration),
          courseId: data.courseId,
        },
      });

      await tx.testQuestion.deleteMany({
        where: { testId },
      });

      await tx.testQuestion.createMany({
        data: data.questions.map((q) => ({
          testId,
          questionId: q.questionId,
          marks: q.marks,
          negativeMark: q.negativeMark ?? 0,
          partialMarking: q.partialMarking ?? false,
        })),
      });

      const testWithQuestions = await tx.test.findUnique({
        where: { id: testId },
        include: {
          questions: true,
        },
      });

      return testWithQuestions;
    });

    return { success: true, test: result };
  } catch (error) {
    console.error("Error updating test:", error);
    return { success: false, error: "Failed to update test" };
  }
}

export async function deleteTest(testId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.testQuestion.deleteMany({
        where: { testId },
      });

      const deletedTest = await prisma.test.delete({
        where: { id: testId },
      });

      return deletedTest;
    });

    return {
      success: true,
      message: "Test deleted successfully",
      deletedTestId: result.id,
    };
  } catch (error) {
    console.error("Error deleting test:", error);

    return {
      success: false,
      error: "Failed to delete test. It may be referenced by other records.",
    };
  }
}

export async function fetchUpcomingTests(
  userId: string
): Promise<TestItem[] | null> {
  try {
    // 1. Get enrolled course IDs for the user
    const enrolledCourses = await prisma.enrolledCourse.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const enrolledCourseIds = enrolledCourses.map((ec) => ec.courseId);
    if (enrolledCourseIds.length === 0) return [];

    // 2. Get test IDs already taken by the user
    const takenTests = await prisma.testResult.findMany({
      where: { userId },
      select: { testId: true },
    });
    const takenTestIds = takenTests.map((tt) => tt.testId);

    // 3. Fetch tests not yet taken by the user
    const upcomingTests = await prisma.test.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        id: { notIn: takenTestIds },
      },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // 4. Format for UI
    return upcomingTests.map((test) => {
      const totalQuestions = test.questions.length;

      const subjects = test.subjects.map((ts) => ts);

      return {
        id: test.id,
        title: test.title,
        category: test.category,
        subjects: subjects,
        courseId: test.courseId,
        createdAt: test.createdAt,
        totalQuestions,
        duration: test.duration,
        description: test.description || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming tests:", error);
    return null;
  }
}

export async function fetchTest(testId: string): Promise<TestWithQuestion> {
  try {
    if (!testId || typeof testId !== 'string') {
      throw new Error('Invalid test ID');
    }

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: { 
          include: {
            question: {
              include: {
                subject: true,
                options: true,
                matchingPairs: {
                  orderBy: { order: 'asc' }
                },
                chapter: true
              }
            }
          }
        },
        course: {
          select: {
            title: true,
            category: true
          }
        }
      }
    });

    if (!test) {
      throw new Error('Test not found');
    }

    // Validate test structure
    if (!test.questions || !Array.isArray(test.questions)) {
      throw new Error('Invalid test structure - missing questions');
    }

    // Process questions while maintaining their order from the query
    const questionsWithStatus: QuestionWithStatus[] = test.questions.map((tq, index) => {
      const question = tq.question;
      
      // Validate question structure
      if (!question || !question.subject) {
        throw new Error(`Invalid question structure for question ${tq.questionId}`);
      }

      // Prepare ordered matching pairs
      const orderedMatchingPairs: MatchingPair[] = question.matchingPairs
        .sort((a, b) => a.order - b.order)
        .map(pair => ({
          id: pair.id,
          leftText: pair.leftText,
          leftImage: pair.leftImage || undefined,
          rightText: pair.rightText,
          rightImage: pair.rightImage || undefined
        }));

      return {
        id: question.id,
        type: question.type as QuestionType,
        questionText: question.questionText,
        questionImage: question.questionImage || undefined,
        solutionText: question.solutionText || undefined,
        solutionImage: question.solutionImage || undefined,
        difficulty: question.difficulty as Difficulty,
        subject: question.subject.name,
        chapter: question.chapter?.name || 'Uncategorized',
        marks: tq.marks,
        negativeMark: tq.negativeMark || 0,
        partialMarking: tq.partialMarking || false,
        status: index === 0 ? 'current' : 'unattempted',
        selectedOption: undefined,
        options: question.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText || undefined,
          optionImage: opt.optionImage || undefined,
          isCorrect: opt.isCorrect
        })),
        matchingPairs: orderedMatchingPairs
      };
    });

    const testWithQuestions: TestWithQuestion = {
      id: test.id,
      title: test.title,
      description: test.description || undefined,
      duration: test.duration,
      category: test.course.category as TestType,
      subjects: test.subjects as TestSubject[],
      questions: questionsWithStatus
    };

    return testWithQuestions;
  } catch (error) {
    console.error('Error fetching test:', error);
    throw new Error(`Failed to fetch test: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface SubmitTestParams {
  testId: string;
  userId: string;
  duration: number;
  responses: {
    questionId: string;
    selectedAnswer: string;
  }[];
}

export async function submitTest({
  testId,
  userId,
  duration,
  responses,
}: SubmitTestParams): Promise<TestResult | null> {
  try {
    const testQuestions = await prisma.testQuestion.findMany({
      where: { testId },
      include: {
        question: {
          include: {
            options: {
              where: { isCorrect: true },
              select: { id: true, optionText: true }
            },
            matchingPairs: true
          }
        }
      }
    });

    // Create a map for quick lookup of test questions
    const questionMap = new Map<
      string, 
      {
        type: QuestionType;
        correctOptionIds: string[];
        correctOptionTexts: string[];
        marks: number;
        negativeMark: number;
        partialMarking: boolean;
        totalCorrectOptions: number;
      }
    >();

    testQuestions.forEach((tq) => {
      questionMap.set(tq.questionId, {
        type: tq.question.type as QuestionType,
        correctOptionIds: tq.question.options.map(opt => opt.id.toLowerCase()),
        correctOptionTexts: tq.question.options
          .map(opt => (opt.optionText ?? '').toLowerCase().trim())
          .filter((text): text is string => text !== null),
        marks: tq.marks,
        negativeMark: tq.negativeMark || 0,
        partialMarking: tq.partialMarking || false,
        totalCorrectOptions: tq.question.options.length
      });
    });

    let totalMarks = 0;
    let correct = 0;
    let wrong = 0;
    let attempted = responses.length; 

    const testResponses: Omit<TestResponse, "id" | "createdAt">[] = [];

    // Process each response
    for (const response of responses) {
      const questionData = questionMap.get(response.questionId);
      if (!questionData) continue;

      let isCorrect = false;
      let marksAwarded = 0;
      let answerStatus = false;

      // Handle different question types
      switch (questionData.type) {
        case "MCQ":
        case "MATCHING":  
        case "ASSERTION_REASON":
          const selectedOption = response.selectedAnswer as string;
          isCorrect = questionData.correctOptionIds.includes(selectedOption);
          answerStatus = !!selectedOption;
          marksAwarded = isCorrect ? questionData.marks : -questionData.negativeMark;
          break;

        case "MULTI_SELECT":
          // Multiple correct answers (comma-separated in response)
          const selectedOptions = (response.selectedAnswer as string).split(',');
          const correctOptions = questionData.correctOptionIds;
          const totalCorrectOptions = questionData.totalCorrectOptions;
          
          // Count correct and wrong selections
          const correctSelections = selectedOptions.filter(opt => 
            correctOptions.includes(opt)
          ).length;
          const wrongSelections = selectedOptions.filter(opt => 
            !correctOptions.includes(opt)
          ).length;
          
          // Calculate marks based on the new rules
          if (wrongSelections > 0) {
            marksAwarded = 0;
            isCorrect = false;
          } else if (correctSelections === totalCorrectOptions) {
            marksAwarded = questionData.marks;
            isCorrect = true;
          } else if (correctSelections > 0) {
            marksAwarded = (questionData.marks * correctSelections) / totalCorrectOptions;
            isCorrect = false;
          } else {
            marksAwarded = 0;
            isCorrect = false;
          }
          
          answerStatus = selectedOptions.length > 0;
          break;

        case "FILL_IN_BLANK":
          isCorrect = questionData.correctOptionTexts.includes(response.selectedAnswer.toLowerCase().trim() as string);
          answerStatus = !!response.selectedAnswer;
          marksAwarded = isCorrect ? questionData.marks : -questionData.negativeMark;
          break;
      }

      // Update counters
      if (isCorrect) correct++;
      else if (answerStatus) wrong++;
      console.log(questionData.type,marksAwarded);
      totalMarks += marksAwarded;

      // Prepare response for database
      testResponses.push({
        testResultId: "", 
        questionId: response.questionId,
        answer: Array.isArray(response.selectedAnswer) 
          ? response.selectedAnswer 
          : [response.selectedAnswer],
        marksAwarded,
        isCorrect,
        isAnswered: answerStatus
      });
    }

    // Calculate total possible marks (sum of all question marks)
    const totalPossibleMarks = testQuestions.reduce(
      (sum, tq) => sum + tq.marks, 
      0
    );

    totalMarks=Math.max(0, totalMarks); 

    // Create test result and responses in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const testResult = await tx.testResult.create({
        data: {
          testId,
          userId,
          duration,
          totalMarks: totalPossibleMarks,
          attempted,
          correct,
          wrong,
          score: totalMarks,
        },
      });

      // Create responses for answered questions
      await tx.testResponse.createMany({
        data: testResponses.map((tr) => ({
          ...tr,
          testResultId: testResult.id,
        })),
      });

      // Create empty responses for unattempted questions
      const unansweredQuestionIds = testQuestions
        .map(tq => tq.questionId)
        .filter(id => !responses.some(r => r.questionId === id));

      await tx.testResponse.createMany({
        data: unansweredQuestionIds.map(questionId => ({
          testResultId: testResult.id,
          questionId,
          answer: [],
          marksAwarded: 0,
          isCorrect: false,
          isAnswered: false
        })),
      });

      return testResult;
    });

    return result;
  } catch (error) {
    console.error("Error submitting test:", error);
    return null;
  }
}

export async function fetchTestResult(
  resultId: string
): Promise<TestResultWithDetails> {
  const result = await prisma.testResult.findUnique({
    where: { id: resultId },
    include: {
      test: {
        select: {
          id: true,
          title: true,
          category: true,
          subjects: true,
        },
      },
      responses: {
        include: {
          question: {
            include: {
              subject: true, // Make sure to include the subject relation
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error("Test result not found");
  }

  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: result.testId },
    include: {
      question: {
        include: {
          subject: true, // Include subject relation here too
        },
      },
    },
  });

  const totalQuestions = testQuestions.length;

  const questionMarksMap = new Map<string, number>();
  const questionSubjectMap = new Map<string, Subject>();

  const subjectStats = new Map<
    Subject,
    {
      total: number;
      attempted: number;
      correct: number;
      totalMarks: number;
      obtainedMarks: number;
    }
  >();

  // Initialize subject stats
  testQuestions.forEach(({ question }) => {
    const subject = question.subject.name as Subject; // Access subject name here
    if (!subjectStats.has(subject)) {
      subjectStats.set(subject, {
        total: 0,
        attempted: 0,
        correct: 0,
        totalMarks: 0,
        obtainedMarks: 0,
      });
    }
  });

  testQuestions.forEach(({ questionId, marks, question }) => {
    const subject = question.subject.name as Subject; // Access subject name here
    questionMarksMap.set(questionId, marks);
    questionSubjectMap.set(questionId, subject);

    const stats = subjectStats.get(subject)!;
    subjectStats.set(subject, {
      ...stats,
      total: stats.total + 1,
      totalMarks: stats.totalMarks + marks,
    });
  });

  result.responses.forEach((response) => {
    const marks = questionMarksMap.get(response.questionId) || 0;
    const subject = questionSubjectMap.get(response.questionId);

    if (subject && subjectStats.has(subject)) {
      const stats = subjectStats.get(subject)!;
      subjectStats.set(subject, {
        ...stats,
        attempted: stats.attempted + 1,
        correct: stats.correct + (response.isCorrect ? 1 : 0),
        obtainedMarks: stats.obtainedMarks + (response.isCorrect ? marks : 0),
      });
    }
  });

  const subjectScores: SubjectResult[] = Array.from(subjectStats.entries()).map(
    ([subject, stats]) => ({
      subject,
      total: stats.total,
      attempted: stats.attempted,
      correct: stats.correct,
      score: stats.obtainedMarks,
      percentage:
        stats.totalMarks > 0
          ? (stats.obtainedMarks / stats.totalMarks) * 100
          : 0,
    })
  );

  const totalPossibleMarks = Array.from(subjectStats.values()).reduce(
    (sum, stats) => sum + stats.totalMarks,
    0
  );

  return {
    id: result.id,
    testId: result.testId,
    userId: result.userId,
    duration: result.duration,
    totalMarks: result.totalMarks,
    totalQuestions,
    attempted: result.attempted,
    correct: result.correct,
    wrong: result.wrong,
    score: result.score,
    percentage:
      totalPossibleMarks > 0 ? (result.score / totalPossibleMarks) * 100 : 0,
    submittedAt: result.submittedAt,
    test: {
      id: result.test.id,
      title: result.test.title,
      category: result.test.category,
      subjects: Array.from(subjectStats.keys()),
    },
    subjectScores,
    responses: result.responses.map((response) => ({
      questionId: response.questionId,
      selectedAnswer: response.selectedAnswer,
      isCorrect: response.isCorrect,
      question: {
        id: response.question.id,
        question: response.question.question,
        image: response.question.image,
        options: response.question.options,
        correctAnswer: response.question.correctAnswer,
        subject: response.question.subject.name as Subject, // Access subject name here
        solution: response.question.solution,
      },
    })),
  };
}

export async function fetchTestResultWithQuestion(
  resultId: string
): Promise<TestWithQuestion & { responses: QuestionResponse[] }> {
  try {
    const result = await prisma.testResult.findUnique({
      where: { id: resultId },
      include: {
        test: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    subject: true,
                  },
                },
              },
              // orderBy: {
              //   order: "asc",
              // },
            },
          },
        },
        responses: {
          include: {
            question: {
              include: {
                subject: true,
                testQuestions: {
                  where: {
                    testId: prisma.testResult
                      .findUnique({
                        where: { id: resultId },
                        select: { testId: true },
                      })
                      .then((r) => r?.testId),
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new Error("Test result not found");
    }

    const responseMap = new Map<string, (typeof result.responses)[0]>();
    result.responses.forEach((response) => {
      responseMap.set(response.questionId, response);
    });

    // Group questions by subject (same logic as fetchTest)
    const subjectGroups: Record<Subject, typeof result.test.questions> =
      {} as any;
    result.test.questions.forEach((tq) => {
      const subject = tq.question.subject as Subject;
      if (!subjectGroups[subject]) {
        subjectGroups[subject] = [];
      }
      subjectGroups[subject].push(tq);
    });

    let currentOrder = 1;
    const questionsWithNewOrder = Object.entries(subjectGroups).flatMap(
      ([_, subjectQuestions]) => {
        const reorderedQuestions = subjectQuestions.map((tq) => ({
          ...tq,
          order: currentOrder++,
        }));
        return reorderedQuestions;
      }
    );

    questionsWithNewOrder.sort((a, b) => (a.order || 0) - (b.order || 0));

    const testWithQuestions: TestWithQuestion & {
      responses: QuestionResponse[];
    } = {
      id: result.test.id,
      title: result.test.title,
      category: result.test.category as TestType,
      subjects: result.test.subjects as Subject[],
      description: result.test.description || undefined,
      duration: result.test.duration,
      questions: questionsWithNewOrder.map((tq) => ({
        id: tq.question.id,
        question: tq.question.question,
        image: tq.question.image || undefined,
        options: tq.question.options,
        correctAnswer: tq.question.correctAnswer,
        subject: tq.question.subject as Subject,
        difficulty: tq.question.difficulty as Difficulty,
        solution: tq.question.solution,
        marks: tq.marks,
        order: tq.order || undefined,
      })),
      responses: questionsWithNewOrder.map((tq) => {
        const response = responseMap.get(tq.question.id);
        return {
          questionId: tq.question.id,
          selectedAnswer: response?.selectedAnswer || null,
          isCorrect: response?.isCorrect || false,
          marksAwarded: response?.isCorrect ? tq.marks : 0,
        };
      }),
    };

    return testWithQuestions;
  } catch (error) {
    console.error("Error fetching test result:", error);
    throw new Error("Failed to fetch test result");
  }
}

interface QuestionResponse {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
  marksAwarded: number;
}

export async function fetchCompletedTests(
  userId: string
): Promise<TestResultItem[] | null> {
  try {
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      include: {
        test: {
          include: {
            questions: {
              select: {
                questionId: true,
              },
            },
          },
        },
      },
    });

    return results.map((result) => ({
      id: result.id,
      testId: result.testId,
      userId: result.userId,
      duration: result.duration,
      totalMarks: result.totalMarks,
      attempted: result.attempted,
      correct: result.correct,
      wrong: result.wrong,
      score: result.score,
      totalQuestions: result.test.questions.length,
      submittedAt: result.submittedAt,
      test: {
        title: result.test.title,
        category: result.test.category as TestType,
      },
    }));
  } catch (error) {
    console.error("Error fetching completed tests:", error);
    return null;
  }
}
