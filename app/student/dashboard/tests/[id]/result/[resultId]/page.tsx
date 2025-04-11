"use client";

import { useState, useEffect } from "react";
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
import type { TestResultWithDetails } from "@/lib/tests/types";
import { Loader2 } from "lucide-react";
import { fetchTestResult } from "@/app/actions/test";
import { sub } from "date-fns";

export default function TestResults() {
  const params = useParams();
  const router = useRouter();
  const { id: testId, resultId } = params;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TestResultWithDetails | null>(null);

  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      try {
        const resultData = await fetchTestResult(resultId as string);
        setResult(resultData);
        console.log(resultData);
      } catch (error) {
        console.error("Error loading test result:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [resultId]);

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

  const handleViewAnswers = () => {
    router.push(
      `/student/dashboard/tests/${testId}?mode=review&resultId=${resultId}`
    );
  };

  const handleBackToTests = () => {
    router.push("/student/dashboard/tests");
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Downloading report...");
    alert("Report download started");
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
                {result.subjectScores.map((subject) => (
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
                          : subject.subject === "MATHS" ? "h-2 bg-amber-100 dark:bg-amber-950" : "h-2 bg-purple-100 dark:bg-purple-950"
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
            <CardHeader className="pb-2">
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Areas of strength and improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <h3 className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Strengths
                  </h3>
                  <ul className="mt-2 space-y-1 text-emerald-700 dark:text-emerald-400 text-sm pl-7 list-disc">
                    <li>
                      Strong performance in Mathematics (
                      {result.subjectScores
                        .find((s) => s.subject === "MATHS")
                        ?.percentage.toFixed(1)}
                      %)
                    </li>
                    <li>
                      Good accuracy in Physics (
                      {Math.round(
                        ((result.subjectScores.find(
                          (s) => s.subject === "PHYSICS"
                        )?.correct || 0) /
                          (result.subjectScores.find(
                            (s) => s.subject === "PHYSICS"
                          )?.attempted || 1)) *
                          100
                      )}
                      % of attempted questions correct)
                    </li>
                    <li>
                      Overall good attempt rate (
                      {Math.round(
                        (result.attempted / result.totalQuestions) * 100
                      )}
                      % questions attempted)
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="mt-2 space-y-1 text-amber-700 dark:text-amber-400 text-sm pl-7 list-disc">
                    <li>
                      Chemistry performance needs improvement (
                      {result.subjectScores
                        .find((s) => s.subject === "CHEMISTRY")
                        ?.percentage.toFixed(1)}
                      %)
                    </li>
                    <li>
                      {Math.round(
                        (result.totalQuestions - result.attempted) * 100
                      )}
                      % of questions were left unattempted
                    </li>
                    <li>
                      {Math.round((result.wrong / result.attempted) * 100)}% of
                      attempted questions were incorrect
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
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
