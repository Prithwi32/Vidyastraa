"use server";

import { prisma } from "@/lib/prisma";
import {
  SubjectResult,
  TestItem,
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
} from "@prisma/client";

export async function createTest(testData: {
  title: string;
  category: Category;
  subjects: Subject[];
  description?: string;
  courseId: string;
  questions: Array<{ questionId: string; marks?: number }>;
}) {
  try {
    const newTest = await prisma.$transaction(async (prisma) => {
      const test = await prisma.test.create({
        data: {
          title: testData.title,
          category: testData.category,
          subjects: testData.subjects,
          description: testData.description,
          courseId: testData.courseId,
          duration: 30,
        },
      });

      const testQuestions = await Promise.all(
        testData.questions.map((q, index) =>
          prisma.testQuestion.create({
            data: {
              testId: test.id,
              questionId: q.questionId,
              marks: q.marks || 4,
              order: index,
            },
          })
        )
      );

      return { ...test, questions: testQuestions };
    });

    return { success: true, test: newTest };
  } catch (error) {
    console.error("Error creating test:", error);
    return { success: false, error: "Failed to create test" };
  }
}

export async function getAllTests() {
  try {
    const tests = await prisma.test.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            detailedDescription: true,
            thumbnail: true,
            category: true,
          },
        },
        questions: {
          select: {
            order: true,
            marks: true,
            question: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, tests };
  } catch (error) {
    console.error("Error fetching tests:", error);
    return { success: false, error: "Failed to fetch tests" };
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
            question: true,
          },
          orderBy: {
            order: "asc",
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

    return test;
  } catch (error) {
    console.error("Error fetching test:", error);
    throw new Error("Failed to fetch test details");
  }
}

interface UpdateTestData {
  title: string;
  description?: string;
  category: TestType;
  subjects: Subject[];
  courseId: string;
  questions: Array<{
    questionId: string;
    marks: number;
  }>;
}

export async function updateTest(testId: string, data: UpdateTestData) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const updatedTest = await prisma.test.update({
        where: { id: testId },
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          subjects: data.subjects,
          courseId: data.courseId,
        },
      });

      await prisma.testQuestion.deleteMany({
        where: { testId },
      });

      const testQuestions = await Promise.all(
        data.questions.map(async (question, index) => {
          return prisma.testQuestion.create({
            data: {
              testId,
              questionId: question.questionId,
              marks: question.marks,
              order: index + 1,
            },
          });
        })
      );

      return {
        ...updatedTest,
        questions: testQuestions,
      };
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

export async function fetchUpcomingTests(userId: string): Promise<TestItem[]> {
  try {
    const enrolledCourses = await prisma.enrolledCourse.findMany({
      where: { userId },
      select: { courseId: true },
    });

    const enrolledCourseIds = enrolledCourses.map((ec) => ec.courseId);
    if (enrolledCourseIds.length === 0) return [];

    const takenTests = await prisma.testResult.findMany({
      where: { userId },
      select: { testId: true },
    });
    const takenTestIds = takenTests.map((tt) => tt.testId);

    const upcomingTests = await prisma.test.findMany({
      where: {
        courseId: { in: enrolledCourseIds },
        id: { notIn: takenTestIds },
      },
      include: {
        questions: {
          select: {
            marks: true,
            question: {
              select: {
                subject: true,
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return upcomingTests.map((test) => {
      const totalQuestions = test.questions.length;

      const subjects = Array.from(
        new Set(test.questions.map((tq) => tq.question.subject))
      );

      return {
        id: test.id,
        title: test.title,
        category: test.category as TestType,
        subjects: subjects as Subject[],
        courseId: test.courseId,
        createdAt: test.createdAt,
        totalQuestions,
        duration: test.duration,
        description: test.description || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching upcoming tests:", error);
    return [];
  }
}

export async function fetchTest(testId: string): Promise<TestWithQuestion> {
  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!test) {
      throw new Error("Test not found");
    }

    const subjectGroups: Record<Subject, typeof test.questions> = {} as any;
    test.questions.forEach((tq) => {
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

    const testWithQuestions: TestWithQuestion = {
      id: test.id,
      title: test.title,
      category: test.category as TestType,
      subjects: test.subjects as Subject[],
      description: test.description || undefined,
      duration: test.duration,
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
    };

    return testWithQuestions;
  } catch (error) {
    console.error("Error fetching test:", error);
    throw new Error("Failed to fetch test");
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
      where: {
        testId: testId,
      },
      include: {
        question: {
          select: {
            id: true,
            correctAnswer: true,
            options: true,
          },
        },
      },
    });

    const questionMap = new Map<
      string,
      {
        correctAnswer: string;
        options: string[];
        marks: number;
      }
    >();

    testQuestions.forEach((tq) => {
      questionMap.set(tq.questionId, {
        correctAnswer: tq.question.correctAnswer,
        options: tq.question.options,
        marks: tq.marks,
      });
    });

    let totalMarks = 0;
    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    const testResponses: Omit<TestResponse, "id" | "createdAt">[] = [];

    responses.forEach((response) => {
      const questionData = questionMap.get(response.questionId);
      if (!questionData) return;

      let actualCorrectAnswer: string;
      if (
        ["A", "B", "C", "D"].includes(questionData.correctAnswer.toUpperCase())
      ) {
        const optionIndex =
          questionData.correctAnswer.toUpperCase().charCodeAt(0) -
          "A".charCodeAt(0);
        actualCorrectAnswer = questionData.options[optionIndex];
      } else {
        actualCorrectAnswer = questionData.correctAnswer;
      }

      let actualSelectedAnswer: string;
      if (
        ["A", "B", "C", "D"].includes(response.selectedAnswer.toUpperCase())
      ) {
        const optionIndex =
          response.selectedAnswer.toUpperCase().charCodeAt(0) -
          "A".charCodeAt(0);
        actualSelectedAnswer = questionData.options[optionIndex];
      } else {
        actualSelectedAnswer = response.selectedAnswer;
      }

      const isCorrect = actualSelectedAnswer === actualCorrectAnswer;
      if (response.selectedAnswer) attempted++;

      if (isCorrect) {
        correct++;
        totalMarks += questionData.marks;
      } else if (response.selectedAnswer) {
        wrong++;
      }

      testResponses.push({
        testResultId: "",
        questionId: response.questionId,
        selectedAnswer: response.selectedAnswer,
        isCorrect,
      });
    });

    const totalPossibleMarks = testQuestions.reduce(
      (sum, tq) => sum + tq.marks,
      0
    );

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

      await tx.testResponse.createMany({
        data: testResponses.map((tr) => ({
          ...tr,
          testResultId: testResult.id,
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
  // Fetch the test result with all related data
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
            select: {
              id: true,
              question: true,
              options: true,
              correctAnswer: true,
              subject: true,
              solution: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new Error("Test result not found");
  }

  // Get all test questions with their marks
  const testQuestions = await prisma.testQuestion.findMany({
    where: { testId: result.testId },
    include: {
      question: {
        select: {
          subject: true,
        },
      },
    },
  });

  const totalQuestions = testQuestions.length; 

  const questionMarksMap = new Map<string, number>();
  const questionSubjectMap = new Map<string, Subject>();

  testQuestions.forEach((tq) => {
    questionMarksMap.set(tq.questionId, tq.marks);
    questionSubjectMap.set(tq.questionId, tq.question.subject);
  });

  const subjectStats = new Map<
    Subject,
    {
      total: number; // Total questions in subject
      attempted: number; // Questions attempted in subject
      correct: number; // Correct answers in subject
      totalMarks: number; // Total possible marks in subject
      obtainedMarks: number; // Marks obtained in subject
    }
  >();

  result.test.subjects.forEach((subject) => {
    subjectStats.set(subject, {
      total: 0,
      attempted: 0,
      correct: 0,
      totalMarks: 0,
      obtainedMarks: 0,
    });
  });

  testQuestions.forEach(({ questionId, marks, question }) => {
    const subject = question.subject;
    if (subjectStats.has(subject)) {
      const stats = subjectStats.get(subject)!;
      subjectStats.set(subject, {
        ...stats,
        total: stats.total + 1,
        totalMarks: stats.totalMarks + marks,
      });
    }
  });

  // Process responses to count attempted and correct answers per subject
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

  // Convert to SubjectResult format
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
      result.totalMarks > 0
        ? (result.score / result.totalMarks) * 100
        : 0,
    submittedAt: result.submittedAt,
    test: {
      id: result.test.id,
      title: result.test.title,
      category: result.test.category,
      subjects: result.test.subjects,
    },
    subjectScores,
    responses: result.responses.map((response) => ({
      questionId: response.questionId,
      selectedAnswer: response.selectedAnswer,
      isCorrect: response.isCorrect,
      question: {
        id: response.question.id,
        question: response.question.question,
        options: response.question.options,
        correctAnswer: response.question.correctAnswer,
        subject: response.question.subject,
        solution: response.question.solution,
      },
    })),
  };
}