"use client"
import { useRouter } from "next/navigation"
import { Download, ArrowLeft, Eye, CheckCircle, XCircle, HelpCircle, Trophy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TestResultsProps {
  params: {
    id: string
  }
}

export default function TestResults({ params }: TestResultsProps) {
  const router = useRouter()
  const testId = params.id

  // In a real app, this data would come from the API
  const testResult = {
    id: "result-123",
    testId: testId,
    title: "JEE Main 2024",
    subtitle: "Paper 1",
    duration: 180, // minutes
    totalQuestions: 90,
    totalMarks: 360,
    attempted: 72,
    correct: 58,
    wrong: 14,
    unattempted: 18,
    score: 232,
    percentage: 64.4,
    submittedAt: new Date().toISOString(),
    subjectScores: [
      { subject: "PHYSICS", total: 30, attempted: 25, correct: 20, score: 80, percentage: 66.7 },
      { subject: "CHEMISTRY", total: 30, attempted: 24, correct: 18, score: 72, percentage: 60 },
      { subject: "MATHS", total: 30, attempted: 23, correct: 20, score: 80, percentage: 66.7 },
    ],
  }

  const handleViewAnswers = () => {
    router.push(`/student/dashboard/tests/${testId}?mode=review`)
  }

  const handleBackToTests = () => {
    router.push("/student/dashboard/tests")
  }

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    console.log("Downloading report...")
    alert("Report download started")
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Test Results</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {testResult.title} - {testResult.subtitle}
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={handleBackToTests}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
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
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                      {testResult.score} / {testResult.totalMarks}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">{testResult.percentage.toFixed(1)}%</p>
                  </div>
                  <Trophy className="h-10 w-10 text-amber-500" />
                </div>
                <Progress value={testResult.percentage} className="h-2 mt-4" />
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
                      <span className="text-slate-700 dark:text-slate-300">Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      >
                        {testResult.correct}
                      </Badge>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        {((testResult.correct / testResult.totalQuestions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-slate-700 dark:text-slate-300">Incorrect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                      >
                        {testResult.wrong}
                      </Badge>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        {((testResult.wrong / testResult.totalQuestions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-slate-700 dark:text-slate-300">Unattempted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      >
                        {testResult.unattempted}
                      </Badge>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        {((testResult.unattempted / testResult.totalQuestions) * 100).toFixed(1)}%
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
                    <span className="text-slate-500 dark:text-slate-400">Total Questions</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">{testResult.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Marks</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">{testResult.totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Duration</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">{testResult.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Submitted</span>
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {new Date(testResult.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Your performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testResult.subjectScores.map((subject) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge
                          className={
                            subject.subject === "PHYSICS"
                              ? "bg-blue-600"
                              : subject.subject === "CHEMISTRY"
                                ? "bg-emerald-600"
                                : "bg-purple-600"
                          }
                        >
                          {subject.subject}
                        </Badge>
                        <span className="ml-2 text-slate-700 dark:text-slate-300">
                          {subject.correct} / {subject.total} correct
                        </span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-50">
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
                            : "h-2 bg-purple-100 dark:bg-purple-950"
                      }
                    />
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
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

          <Card className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Areas of strength and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <h3 className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Strengths
                  </h3>
                  <ul className="mt-2 space-y-1 text-emerald-700 dark:text-emerald-400 text-sm pl-7 list-disc">
                    <li>Strong performance in Mathematics (66.7%)</li>
                    <li>Good accuracy in Physics (80% of attempted questions correct)</li>
                    <li>Overall good attempt rate (80% questions attempted)</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <h3 className="font-medium text-amber-800 dark:text-amber-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="mt-2 space-y-1 text-amber-700 dark:text-amber-400 text-sm pl-7 list-disc">
                    <li>Chemistry performance needs improvement (60%)</li>
                    <li>20% of questions were left unattempted</li>
                    <li>19.4% of attempted questions were incorrect</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-200 dark:border-slate-800 pt-4">
              <Button onClick={handleViewAnswers} className="gap-2">
                <Eye className="h-4 w-4" />
                View Detailed Answers
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
