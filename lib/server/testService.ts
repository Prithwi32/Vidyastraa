import { prisma } from "@/lib/prisma"

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
                options: true,
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
