"use server";

import { prisma } from "@/lib/prisma";
import { Category, Subject, Test, Question, TestType } from "@prisma/client";

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

export async function getTestById(
  id: string
) {
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
  title: string
  description?: string
  category: TestType
  subjects: Subject[]
  courseId: string
  questions: Array<{
    questionId: string
    marks: number
  }>
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
      })

      await prisma.testQuestion.deleteMany({
        where: { testId },
      })

      const testQuestions = await Promise.all(
        data.questions.map(async (question, index) => {
          return prisma.testQuestion.create({
            data: {
              testId,
              questionId: question.questionId,
              marks: question.marks,
              order: index + 1, 
            },
          })
        })
      )

      return {
        ...updatedTest,
        questions: testQuestions,
      }
    })

    return { success: true, test: result }
  } catch (error) {
    console.error('Error updating test:', error)
    return { success: false, error: 'Failed to update test' }
  }
}


export async function deleteTest(testId: string) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.testQuestion.deleteMany({
        where: { testId },
      })

      const deletedTest = await prisma.test.delete({
        where: { id: testId },
      })

      return deletedTest
    })

    return { 
      success: true, 
      message: 'Test deleted successfully',
      deletedTestId: result.id
    }
  } catch (error) {
    console.error('Error deleting test:', error)
    
    return { 
      success: false, 
      error: 'Failed to delete test. It may be referenced by other records.'
    }
  }
}