"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter} from "next/navigation"
import { ChevronLeft, ChevronRight, Menu, CheckCircle, Circle, Sun, Moon, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import type { QuestionWithStatus, TestWithQuestion } from "@/lib/tests/types"
import { fetchTestResultWithQuestion } from "@/app/actions/test"
import { ToastContainer } from "react-toastify"
import { useSession } from "next-auth/react"
import Image from "next/image"
import "katex/dist/katex.min.css"
import QuestionNavigationPanel from "./question-navigation-panel"
import LatexRenderer from "./latex-renderer"
import QuestionRenderer from "./question-renderer"

type Props = {
  testId: string
  resultId: string
}

type QuestionResponse = {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
}

export default function ReviewInterface({ testId, resultId }: Props) {
  const router = useRouter()
  const params = useParams()
  const session = useSession()

  // Dark mode state
  const { setTheme, theme } = useTheme()

  // Loading state
  const [loading, setLoading] = useState(true)

  // Test data
  const [test, setTest] = useState<TestWithQuestion | null>(null)

  // state for question panel
  const [showQuestionPanel, setShowQuestionPanel] = useState(false)

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Questions with status
  const [questions, setQuestions] = useState<QuestionWithStatus[]>([])

  useEffect(() => {
    if (session.status === "loading") {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [session.status])

  // Load test result data
  useEffect(() => {
    async function loadResult() {
      setLoading(true)
      try {
        const resultData = await fetchTestResultWithQuestion(resultId as string)

        // Set the test information (using the test data from result)
        setTest({
          id: resultData.id,
          title: resultData.title,
          category: resultData.category,
          subjects: resultData.subjects,
          description: resultData.description || "",
          duration: resultData.duration,
          questions: resultData.questions, // Use the properly ordered questions
        })

        // Create a map of questionId to response for quick lookup
        const responseMap = new Map<string, QuestionResponse>()
        resultData.responses.forEach((response) => {
          responseMap.set(response.questionId, response)
        })

        // Initialize questions with status, maintaining the original order
        const questionsWithStatus = resultData.questions.map((question, index) => {
          const response = responseMap.get(question.id)
          return {
            ...question,
            subject: question.subject.name,
            status: index === 0 ? "current" : "reviewed", // Changed from "unattempted" to "reviewed"
            selectedOption: response?.selectedAnswer || undefined,
            isCorrect: response?.isCorrect || false,
            marksAwarded: response?.isCorrect ? question.marks || 0 : 0,
          } as QuestionWithStatus
        })

        setQuestions(questionsWithStatus)
      } catch (error) {
        console.error("Error loading test result:", error)
      } finally {
        setLoading(false)
      }
    }

    if (resultId) {
      loadResult()
    }
  }, [resultId])

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null

  // Handle navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (!questions.length) return

      // Update current question status
      const updatedQuestions = [...questions]

      // Only change the current question's status if it's currently marked as "current"
      if (updatedQuestions[currentQuestionIndex].status === "current") {
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          status: "reviewed",
        }
      }

      // Set the new question to current
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        status: "current",
      }

      setQuestions(updatedQuestions)
      setCurrentQuestionIndex(index)
    },
    [questions, currentQuestionIndex],
  )

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, questions.length, goToQuestion])

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex, goToQuestion])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Check if a question is marked for review
  const isMarkedForReview = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    return question?.status === "review"
  }

  // Get question counts
  const correctCount = questions.filter((q) => q.isCorrect).length
  const incorrectCount = questions.filter((q) => q.selectedOption && !q.isCorrect).length
  const unattemptedCount = questions.filter((q) => !q.selectedOption).length

  if (loading || !test || !currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading test results...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ToastContainer />
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-end sm:justify-between p-4 bg-card border-b border-border shadow-sm">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
            <Image src="/logo.jpeg" alt="Vidyastraa Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{test.title}</h1>
            <p className="text-sm text-muted-foreground">Review Answers</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="border-border bg-card">
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile sidebar toggle - moved to header */}
          <Sheet open={showQuestionPanel} onOpenChange={setShowQuestionPanel}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-border bg-card">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open question panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0 bg-background">
              <QuestionNavigationPanel
                questions={questions}
                goToQuestion={goToQuestion}
                currentQuestionIndex={currentQuestionIndex}
                isMarkedForReview={isMarkedForReview}
                setShowQuestionPanel={setShowQuestionPanel}
                mode="review"
              />
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-3">
            <Badge
              variant="outline"
              className="px-3 py-1 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> {correctCount}
            </Badge>

            <Badge
              variant="outline"
              className="px-3 py-1 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
            >
              <X className="w-3.5 h-3.5 mr-1" /> {incorrectCount}
            </Badge>

            <Badge
              variant="outline"
              className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            >
              <Circle className="w-3.5 h-3.5 mr-1" /> {unattemptedCount}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 relative">
        {/* Question panel */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="border-border shadow-sm bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted rounded-t-lg px-4 sm:p-6">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {currentQuestion.subject}
                  </Badge>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Question {currentQuestionIndex + 1}
                    {currentQuestion.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : currentQuestion.selectedOption ? (
                      <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </CardTitle>
                </div>
                <Badge
                  variant={currentQuestion.isCorrect ? "success" : "destructive"}
                  className={cn(
                    "gap-2",
                    currentQuestion.isCorrect
                      ? "bg-green-500 hover:bg-green-600"
                      : currentQuestion.selectedOption
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-slate-500 hover:bg-slate-600",
                  )}
                >
                  {currentQuestion.isCorrect
                    ? `+${currentQuestion.marks || 4}`
                    : currentQuestion.selectedOption
                      ? `-${currentQuestion.negativeMark || 1}`
                      : "0"}
                </Badge>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 text-lg font-medium">
                  {currentQuestion.type !== "ASSERTION_REASON" && currentQuestion.type !== "MATCHING" && (
                    <LatexRenderer content={currentQuestion.questionText} />
                  )}
                </div>

                {currentQuestion.image && (
                  <div className="mb-6">
                    <div className="relative w-full h-48 md:h-64 rounded-md overflow-hidden">
                      <Image
                        src={currentQuestion.image || "https://ui.shadcn.com/placeholder.svg" || "/placeholder.svg"}
                        alt="Question image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                <QuestionRenderer
                  question={currentQuestion}
                  handleOptionSelect={() => {}}
                  handleFillInBlankChange={() => {}}
                  mode="review"
                />

                {currentQuestion.solution && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Solution</h3>
                    <p>
                      <LatexRenderer content={currentQuestion.solution} />
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-2 sm:px-4 flex justify-between pt-4 border-t border-border bg-muted rounded-b-lg">
                <Button
                  variant="outline"
                  className="gap-2 border-border bg-card hover:bg-accent"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 border-border bg-card hover:bg-accent"
                  onClick={() => router.push("/student/dashboard/tests")}
                >
                  Back to Tests
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 border-border bg-card hover:bg-accent"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Question navigation sidebar - desktop */}
        <div className="hidden md:block w-80 bg-card border-l border-border overflow-y-auto">
          <QuestionNavigationPanel
            questions={questions}
            goToQuestion={goToQuestion}
            currentQuestionIndex={currentQuestionIndex}
            isMarkedForReview={isMarkedForReview}
            mode="review"
          />
        </div>
      </div>
    </div>
  )
}
