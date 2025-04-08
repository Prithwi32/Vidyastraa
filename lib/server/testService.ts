import { prisma } from "@/lib/prisma"

export async function getTestById(testId: string) {
  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
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
          include: {
            question: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    return test
  } catch (error) {
    console.error("[testService.getTestById] Error fetching test:", error)
    throw new Error("Failed to fetch test details")
  }
}
