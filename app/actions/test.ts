"use server";

import { prisma } from "@/lib/prisma";
import { Category, Subject, TestType } from "@prisma/client";

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
              category: true
            }
          },
          questions: {
            select: {
              order: true,
              marks: true,
              question: true
            },
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
  
      return { success: true, tests };
    } catch (error) {
      console.error("Error fetching tests:", error);
      return { success: false, error: "Failed to fetch tests" };
    }
  }

export const sampleTest = async () => {
  const res = await createTest({
    title: "NEET Sample Test",
    category: TestType.NEET,
    subjects: [Subject.PHYSICS, Subject.CHEMISTRY, Subject.BIOLOGY],
    description: "Simple questions",
    courseId: "f8601816-9952-4603-a933-ae5685727a06",
    questions: [
      { questionId: "f5d470aa-24e0-489e-b8c9-7d225510cee2", marks: 4 },
      { questionId: "a4ae6576-ef73-4bef-ab0b-09dd97b76a11", marks: 3 },
      { questionId: "5d25d140-e1c7-4622-9d02-7b58a9a8365b", marks: 2 },
    ],
  });

  console.log(res);
};
