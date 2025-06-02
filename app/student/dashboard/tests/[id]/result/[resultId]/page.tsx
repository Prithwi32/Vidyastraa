"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TestResponse, TestResultWithDetails } from "@/lib/tests/types";
import { Loader2 } from "lucide-react";
import {
  fetchTestResult,
  fetchTestResultWithQuestion,
} from "@/app/actions/test";
import { sub } from "date-fns";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Question, Subject } from "@prisma/client";

type TestSubject = "PHYSICS" | "CHEMISTRY" | "BIOLOGY" | "MATHS";

export default function TestResults() {
  const params = useParams();
  const router = useRouter();
  const { id: testId, resultId } = params;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TestResultWithDetails | null>(null);

  // Main data loading effect
  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      try {
        const resultData = await fetchTestResult(resultId as string);
        setResult(resultData);
      } catch (error) {
        console.error("Error loading test result:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [resultId]);

  // Back button handler effect
  useEffect(() => {
    const handleBackButton = () => {
      router.push("/student/dashboard/tests");
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router]);

  // Calculate subject scores (memoize if needed)
  const subjectScores = result?.subjectScores || [];

  // Early return for loading state
  if (loading || !result) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  const handleViewAnswers = () => {
    router.push(
      `/student/dashboard/tests/${testId}/result/${resultId}/testReview`
    );
  };

  const handleBackToTests = () => {
    router.push("/student/dashboard/tests");
  };

  const handleDownloadReport = async () => {
    if (!result) {
      console.error("No result data available");
      return;
    }

    try {
      // Fetch complete test data including unattempted questions
      const testWithResponses = await fetchTestResultWithQuestion(result.id);

      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();
      const fontSize = 12;
      const margin = 50;
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let y = height - margin;

      const drawText = (
        text: string,
        size = fontSize,
        lineGap = 16,
        x = margin
      ) => {
        if (y < margin + lineGap) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }

        const lines = text.split("\n");
        lines.forEach((line) => {
          page.drawText(line, {
            x,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
          });
          y -= lineGap;
        });
      };

      // Header Section
      drawText(`Test Report - ${testWithResponses.title}`, 18, 24);
      drawText(
        `Date: ${new Date(result.submittedAt).toLocaleDateString()}`,
        fontSize,
        20
      );
      drawText(`Score: ${result.score} / ${result.totalMarks}`, fontSize, 20);
      drawText(`Percentage: ${result.percentage.toFixed(2)}%`, fontSize, 20);
      drawText(
        `Correct: ${result.correct} || Incorrect: ${
          result.wrong
        } || Unattempted: ${
          testWithResponses.questions.length - result.attempted
        }`,
        fontSize,
        24
      );

      // Questions Summary Section
      // drawText("\nQuestions Summary", 16, 24);

      // // Process all questions (both attempted and unattempted)
      // testWithResponses.questions.forEach((question, idx) => {
      //   const response = testWithResponses.responses.find(
      //     (r) => r.questionId === question.id
      //   );

      //   // Question Text
      //   drawText(`\n${idx + 1}. ${question.question}`, fontSize, 18);

      //   // Options
      //   question.options.forEach((opt: string, optIdx: number) => {
      //     const optionLabel = String.fromCharCode(65 + optIdx);
      //     drawText(`   ${optionLabel}. ${opt}`, fontSize - 1, 16, margin + 20);
      //   });

      //   // Process user answer
      //   let userAnswerText = "Not answered";
      //   let isCorrect = response?.isCorrect || false;

      //   if (response?.selectedAnswer) {
      //     // First try to match the exact option text
      //     const exactMatchIndex = question.options.findIndex(
      //       (opt) => opt === response.selectedAnswer
      //     );
      //     if (exactMatchIndex >= 0) {
      //       const optionLetter = String.fromCharCode(65 + exactMatchIndex);
      //       userAnswerText = `${optionLetter}. ${question.options[exactMatchIndex]}`;
      //     }
      //     // If no exact match, try to parse as index (0-3) or letter (A-D)
      //     else {
      //       let optionIndex = -1;

      //       // Check if it's a letter (A-D)
      //       if (/^[A-Da-d]$/.test(response.selectedAnswer)) {
      //         optionIndex =
      //           response.selectedAnswer.toUpperCase().charCodeAt(0) -
      //           "A".charCodeAt(0);
      //       }
      //       // Check if it's an index (0-3)
      //       else if (/^[0-3]$/.test(response.selectedAnswer)) {
      //         optionIndex = parseInt(response.selectedAnswer);
      //       }

      //       if (optionIndex >= 0 && optionIndex < question.options.length) {
      //         const optionLetter = String.fromCharCode(65 + optionIndex);
      //         userAnswerText = `${optionLetter}. ${question.options[optionIndex]}`;
      //       } else {
      //         // Fallback to showing the raw value
      //         userAnswerText = response.selectedAnswer;
      //       }
      //     }
      //   }

      //   // Process correct answer
      //   let correctAnswerIndex = -1;
      //   if (/^[A-Da-d]$/.test(question.correctAnswer)) {
      //     correctAnswerIndex =
      //       question.correctAnswer.toUpperCase().charCodeAt(0) -
      //       "A".charCodeAt(0);
      //   } else if (/^[0-3]$/.test(question.correctAnswer)) {
      //     correctAnswerIndex = parseInt(question.correctAnswer);
      //   } else {
      //     correctAnswerIndex = question.options.findIndex(
      //       (opt) => opt === question.correctAnswer
      //     );
      //   }

      //   const correctAnswerText =
      //     correctAnswerIndex >= 0 &&
      //     correctAnswerIndex < question.options.length
      //       ? `${String.fromCharCode(65 + correctAnswerIndex)}. ${
      //           question.options[correctAnswerIndex]
      //         }`
      //       : question.correctAnswer;

      //   // Draw user answer
      //   drawText(
      //     `   Your answer: ${userAnswerText}`,
      //     fontSize,
      //     16,
      //     margin + 20
      //   );

      //   const statusText = response
      //     ? `Status: ${isCorrect ? "CORRECT" : "INCORRECT"}`
      //     : "Status: UNATTEMPTED";

      //   drawText(`   ${statusText}`, fontSize, 16, margin + 20);

      //   if (!isCorrect || !response) {
      //     drawText(
      //       `   Correct answer: ${correctAnswerText}`,
      //       fontSize,
      //       16,
      //       margin + 20
      //     );
      //   }

      //   // Add space between questions
      //   drawText("", fontSize, 12);
      // });

      // Generate and download the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Test_Report_${testWithResponses.title.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_${new Date(result.submittedAt).toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading || !result) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Test Results</h1>
              <p className="text-muted-foreground">{result.test.title}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleBackToTests}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold">
                      {result.score} / {result.totalMarks}
                    </div>
                    <p className="text-muted-foreground">
                      {result.percentage.toFixed(1)}%
                    </p>
                  </div>
                  <Trophy className="h-10 w-10 text-amber-500" />
                </div>
                <Progress value={result.percentage} className="h-2 mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Questions Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      >
                        {result.correct}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {(
                          (result.correct / result.totalQuestions) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span>Incorrect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                      >
                        {result.wrong}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {((result.wrong / result.totalQuestions) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 text-slate-400 mr-2" />
                      <span>Unattempted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      >
                        {result.totalQuestions - result.attempted}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {(
                          ((result.totalQuestions - result.attempted) /
                            result.totalQuestions) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Test Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Questions
                    </span>
                    <span className="font-medium">{result.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Marks</span>
                    <span className="font-medium">{result.totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {result.duration} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-medium">
                      {new Date(result.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>
                Your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjectScores.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge
                          className={
                            subject.subject === "PHYSICS"
                              ? "bg-blue-600"
                              : subject.subject === "CHEMISTRY"
                              ? "bg-emerald-600"
                              : subject.subject === "BIOLOGY"
                              ? "bg-purple-600"
                              : "bg-amber-600"
                          }
                        >
                          {subject.subject}
                        </Badge>
                        <span className="ml-2">
                          {subject.correct} / {subject.total} correct
                        </span>
                      </div>
                      <span className="font-medium">
                        {subject.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={subject.percentage}
                      className={
                        subject.subject === "PHYSICS"
                          ? "h-2 bg-blue-100 dark:bg-blue-950"
                          : subject.subject === "CHEMISTRY"
                          ? "h-2 bg-emerald-100 dark:bg-emerald-950"
                          : subject.subject === "MATHS"
                          ? "h-2 bg-amber-100 dark:bg-amber-950"
                          : "h-2 bg-purple-100 dark:bg-purple-950"
                      }
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Attempted: {subject.attempted} / {subject.total}
                      </span>
                      <span>Score: {subject.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-card border-border">
            <CardFooter className="flex justify-center border-t border-border pt-4">
              <Button onClick={handleViewAnswers} className="gap-2">
                <Eye className="h-4 w-4" />
                View Detailed Answers
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}


