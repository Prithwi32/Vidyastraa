import { prisma } from "@/lib/prisma";
import type { TestSubmission } from "@/lib/tests/types";

// In a real app, these functions would interact with your database
// using Prisma client to fetch and manipulate data

export async function getTestWithQuestions(testId: string) {
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

    // Transform the data to match our frontend types
    return {
      id: test.id,
      title: test.title,
      category: test.category,
      subjects: test.subjects,
      description: test.description || undefined,
      duration: 180, // This would come from the test data in a real app
      questions: test.questions.map((tq) => ({
        id: tq.questionId,
        question: tq.question.question,
        image: tq.question.image || undefined,
        options: tq.question.options,
        correctAnswer: tq.question.correctAnswer,
        subject: tq.question.subject,
        difficulty: tq.question.difficulty,
        solution: tq.question.solution,
        marks: tq.marks,
        order: tq.order || undefined,
      })),
    };
  } catch (error) {
    console.error("Error fetching test:", error);
    throw error;
  }
}

export async function submitTestResult(submission: TestSubmission) {
  try {
    // Calculate the results
    const test = await prisma.test.findUnique({
      where: { id: submission.testId },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!test) {
      throw new Error("Test not found");
    }

    // Create a map of question IDs to correct answers
    const questionMap = new Map(
      test.questions.map((tq) => [
        tq.questionId,
        {
          correctAnswer: tq.question.correctAnswer,
          marks: tq.marks,
        },
      ])
    );

    // Calculate scores
    let correct = 0;
    let wrong = 0;
    let totalMarks = 0;

    const responseResults = submission.responses
      .map((response) => {
        const question = questionMap.get(response.questionId);
        if (!question) return null;

        const isCorrect = response.selectedAnswer === question.correctAnswer;
        if (isCorrect) {
          correct++;
          totalMarks += question.marks;
        } else {
          wrong++;
        }

        return {
          questionId: response.questionId,
          selectedAnswer: response.selectedAnswer,
          isCorrect,
        };
      })
      .filter(Boolean) as {
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }[];

    // Create the test result
    const testResult = await prisma.testResult.create({
      data: {
        testId: submission.testId,
        userId: submission.userId,
        duration: submission.duration,
        totalMarks: test.questions.reduce((sum, tq) => sum + tq.marks, 0),
        attempted: submission.responses.length,
        correct,
        wrong,
        score: totalMarks,
        responses: {
          create: responseResults.map((response) => ({
            questionId: response.questionId,
            selectedAnswer: response.selectedAnswer,
            isCorrect: response.isCorrect,
          })),
        },
      },
    });

    return testResult.id;
  } catch (error) {
    console.error("Error submitting test:", error);
    throw error;
  }
}

export async function getTestResult(resultId: string) {
  try {
    const result = await prisma.testResult.findUnique({
      where: { id: resultId },
      include: {
        test: true,
        responses: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error("Test result not found");
    }

    // Calculate subject-wise scores
    const subjectScores = new Map<
      string,
      {
        subject: string;
        total: number;
        attempted: number;
        correct: number;
        score: number;
      }
    >();

    result.responses.forEach((response) => {
      const subject = response.question.subject;

      if (!subjectScores.has(subject)) {
        subjectScores.set(subject, {
          subject,
          total: 0,
          attempted: 0,
          correct: 0,
          score: 0,
        });
      }

      const score = subjectScores.get(subject)!;
      score.total++;
      score.attempted++;

      if (response.isCorrect) {
        score.correct++;
        // In a real app, you would get the marks from the TestQuestion relation
        score.score += 4;
      }
    });

    // Transform to our frontend type
    return {
      id: result.id,
      testId: result.testId,
      userId: result.userId,
      duration: result.duration,
      totalMarks: result.totalMarks,
      attempted: result.attempted,
      correct: result.correct,
      wrong: result.wrong,
      score: result.score,
      percentage: (result.score / result.totalMarks) * 100,
      submittedAt: result.submittedAt,
      test: {
        id: result.test.id,
        title: result.test.title,
        category: result.test.category,
        subjects: result.test.subjects,
      },
      subjectScores: Array.from(subjectScores.values()).map((score) => ({
        ...score,
        percentage: (score.correct / score.total) * 100,
      })),
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
  } catch (error) {
    console.error("Error fetching test result:", error);
    throw error;
  }
}
