"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Menu,
  BookmarkIcon,
  CheckCircle,
  Circle,
  HelpCircle,
  Sun,
  Moon,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  QuestionWithStatus,
  TestWithQuestion,
  TestSubmission,
  TestResponse,
} from "@/lib/tests/types";
import { Loader2 } from "lucide-react";
import {
  fetchTest,
  fetchTestResultWithQuestion,
  submitTest,
} from "@/app/actions/test";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Question Navigation Panel component
function QuestionNavigationPanel({
  questions,
  goToQuestion,
  currentQuestionIndex,
  isMarkedForReview,
  setShowQuestionPanel,
  mode,
}: {
  questions: QuestionWithStatus[];
  goToQuestion: (index: number) => void;
  currentQuestionIndex: number;
  isMarkedForReview: (questionId: string) => boolean;
  setShowQuestionPanel?: (show: boolean) => void;
  mode?: string;
}) {
  // Group questions by subject
  const groupedQuestions = questions.reduce((acc, question) => {
    const subjectName = question.subject;
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(question);
    return acc;
  }, {} as Record<string, QuestionWithStatus[]>);

  // Get counts
  const attemptedCount = questions.filter(
    (q) => q.status === "attempted" || q.selectedOption
  ).length;
  const reviewCount = questions.filter((q) => q.status === "review").length;
  const unattemptedCount = questions.filter((q) =>
    mode === "review"
      ? !q.selectedOption // In review mode, count all questions without selected option
      : (q.status === "unattempted" || q.status === "current") &&
        !q.selectedOption
  ).length;

  // Get button class for a question
  const getQuestionButtonClass = (
    question: QuestionWithStatus,
    index: number
  ) => {
    const isCurrent = index === currentQuestionIndex;
    const isReview = isMarkedForReview(question.id);
    const isCorrect =
      mode === "review" &&
      question.selectedOption &&
      question.options[question.correctAnswer.charCodeAt(0) - 65] ===
        question.selectedOption;

    const isIncorrect =
      mode === "review" &&
      question.selectedOption &&
      question.options[question.correctAnswer.charCodeAt(0) - 65] !==
        question.selectedOption;

    if (mode === "review") {
      if (isCorrect) {
        return "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300";
      } else if (isIncorrect) {
        return "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300";
      } else {
        return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-500";
      }
    }

    if (isCurrent) {
      return "border-blue-500 dark:border-blue-600 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 ring-2 ring-blue-400 dark:ring-blue-600";
    } else if (isReview) {
      return "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/70 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800";
    } else if (question.selectedOption) {
      return "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800";
    } else {
      return "border-border bg-card hover:bg-accent";
    }
  };

  return (
    <div className="p-4 pt-0 h-full overflow-y-auto bg-card">
      <div className="sticky pt-4 top-0 bg-card pb-2 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-1">Question Navigator</h3>
          {setShowQuestionPanel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowQuestionPanel(false)}
              className="md:hidden -mr-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          {mode != "review" && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Attempted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Current</span>
              </div>
            </>
          )}
          {mode === "review" && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Incorrect</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span>Unattempted</span>
              </div>
            </>
          )}
        </div>
        <Separator className="bg-border" />
      </div>

      {/* Questions by subject */}
      {Object.entries(groupedQuestions).map(([subject, subjectQuestions]) => (
        <div key={subject} className="mb-6">
          <h3 className="text-base font-semibold mb-3 flex items-center">
            <Badge className="mr-2 bg-primary">{subject}</Badge>
            <span className="text-xs text-muted-foreground">
              Questions {subjectQuestions[0]?.order}-
              {subjectQuestions[subjectQuestions.length - 1]?.order}
            </span>
          </h3>
          <div className="grid grid-cols-5 gap-1.5">
            {subjectQuestions.map((question, index) => {
              const questionIndex = questions.findIndex(
                (q) => q.id === question.id
              );
              return (
                <Button
                  key={question.id}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "w-full aspect-square p-0 text-sm font-medium border",
                    getQuestionButtonClass(question, questionIndex)
                  )}
                  onClick={() => {
                    goToQuestion(questionIndex);
                    setShowQuestionPanel?.(false);
                  }}
                >
                  {question.order}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-auto pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/50 rounded-md border border-emerald-100 dark:border-emerald-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {attemptedCount}
            </div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300">
              Answered
            </div>
          </div>
          <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/50 rounded-md border border-amber-100 dark:border-amber-800">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {reviewCount}
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-300">
              For Review
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded-md border border-border">
            <div className="text-2xl font-bold text-foreground/70">
              {unattemptedCount}
            </div>
            <div className="text-xs text-foreground/60">Unattempted</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestInterface() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const searchParams = useSearchParams();
  const testId = params.id;
  const mode = searchParams?.get("mode") || "test"; // "test", "review"
  const resultId = searchParams?.get("resultId");

  // Dark mode state
  const { setTheme, theme } = useTheme();

  // Loading state
  const [loading, setLoading] = useState(true);

  // Test data
  const [test, setTest] = useState<TestWithQuestion | null>(null);

  // state for question panel
  const [showQuestionPanel, setShowQuestionPanel] = useState(false);

  // Submit dialog state
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const [testSubmitLoader, setTestSubmitLoader] = useState(false);

  // Timer state
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions with status
  const [questions, setQuestions] = useState<QuestionWithStatus[]>([]);

  const pathname = usePathname();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(mode === "review");
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(
    mode !== "review"
  );

  // Prevent leaving the test
  useEffect(() => {
    if (mode === "review") return;
    if (isSubmitted) {
      setShouldBlockNavigation(false);
      return;
    }

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your test will be submitted";
        await handleSubmitTest();
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted]);

  // Handle back button/route changes
  useEffect(() => {
    if (mode === "review") return;
    if (isSubmitted) return;

    const handleBackButton = (e: PopStateEvent) => {
      if (!isSubmitted) {
        e.preventDefault();
        setShowExitConfirm(true);
        // Push the current path again to keep the user on the page
        window.history.pushState(null, "", pathname);
      }
    };

    window.history.pushState(null, "", pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isSubmitted, pathname]);

  const handleConfirmExit = async () => {
    setTestSubmitLoader(true);
    await handleSubmitTest();
    setShowExitConfirm(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  useEffect(() => {
    if (session.status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [session.status]);

  // Load test data
  useEffect(() => {
    async function loadTest() {
      setLoading(true);
      try {
        const testData = await fetchTest(testId as string);
        setTest(testData);

        // Initialize timer with test duration (converted to seconds)
        const initialTime = testData.duration * 60;
        setTimeRemaining(initialTime);

        // Calculate initial display time
        const hours = Math.floor(initialTime / 3600);
        const minutes = Math.floor((initialTime % 3600) / 60);
        const seconds = initialTime % 60;

        setTime({
          hours,
          minutes,
          seconds,
        });

        // Start the timer
        setTimerActive(true);

        // Initialize questions with status
        const questionsWithStatus = testData.questions.map((q, index) => ({
          ...q,
          subject: q.subject.name,
          status: index === 0 ? "current" : "unattempted",
          selectedOption:
            mode === "review"
              ? Math.random() > 0.3
                ? q.options[0]
                : undefined
              : undefined,
        }));

        setQuestions(questionsWithStatus as any);
      } catch (error) {
        console.error("Error loading test:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadResult() {
      setLoading(true);
      try {
        const resultData = await fetchTestResultWithQuestion(
          resultId as string
        );

        // Set the test information (using the test data from result)
        setTest({
          id: resultData.id,
          title: resultData.title,
          category: resultData.category,
          subjects: resultData.subjects,
          description: resultData.description || "",
          duration: resultData.duration,
          questions: resultData.questions, // Use the properly ordered questions
        });

        // Create a map of questionId to response for quick lookup
        const responseMap = new Map<string, QuestionResponse>();
        resultData.responses.forEach((response) => {
          responseMap.set(response.questionId, response);
        });

        // Initialize questions with status, maintaining the original order
        const questionsWithStatus = resultData.questions.map(
          (question, index) => {
            const response = responseMap.get(question.id);
            return {
              ...question,
              subject: question.subject.name,
              status: index === 0 ? "current" : "reviewed", // Changed from "unattempted" to "reviewed"
              selectedOption: response?.selectedAnswer || undefined,
              isCorrect: response?.isCorrect || false,
              marksAwarded: response?.isCorrect ? question.marks || 0 : 0,
            } as QuestionWithStatus;
          }
        );

        setQuestions(questionsWithStatus);
      } catch (error) {
        console.error("Error loading test result:", error);
      } finally {
        setLoading(false);
      }
    }

    if (mode != "review") loadTest();
    else {
      loadResult();
    }
  }, [testId, mode]);

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (mode === "review" || !currentQuestion) return; // Disable selection in review mode

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      selectedOption: optionId,
      // Keep the review status if it's already marked for review
      status: currentQuestion.status === "review" ? "review" : "attempted",
    };
    setQuestions(updatedQuestions);
  };

  // Handle review later
  const handleReviewLater = () => {
    if (mode === "review" || !currentQuestion) return; // Disable in review mode

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      status:
        currentQuestion.status === "review"
          ? currentQuestion.selectedOption
            ? "attempted"
            : "unattempted"
          : "review",
    };
    setQuestions(updatedQuestions);
  };

  // Handle navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (!questions.length) return;

      // Update current question status
      const updatedQuestions = [...questions];

      // Only change the current question's status if it's currently marked as "current"
      if (updatedQuestions[currentQuestionIndex].status === "current") {
        updatedQuestions[currentQuestionIndex] = {
          ...updatedQuestions[currentQuestionIndex],
          status: updatedQuestions[currentQuestionIndex].selectedOption
            ? "attempted"
            : "unattempted",
        };
      }

      // Store the previous status of the new question we're navigating to
      const previousStatus = updatedQuestions[index].status;

      // Set the new question to current, but preserve its "review" status in a special way
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        // If it was previously marked for review, we want to keep that information
        // but still show it as the current question
        status: "current",
      };

      setQuestions(updatedQuestions);
      setCurrentQuestionIndex(index);
    },
    [questions, currentQuestionIndex]
  );

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, goToQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, goToQuestion]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle test submission
  const handleSubmitTest = async () => {
    // Use functional update to get the latest state
    if (!test) return;

    // Stop the timer
    setTimerActive(false);

    setTestSubmitLoader(true);

    // Calculate actual time taken
    const totalDuration = test.duration;
    const timeTaken = totalDuration - Math.ceil(timeRemaining / 60);
    const duration = timeRemaining > 0 ? timeTaken : totalDuration;

    // Prepare submission data with current questions
    const responses: TestResponse[] = questions
      .filter((q) => q.selectedOption)
      .map((q) => ({
        questionId: q.id,
        selectedAnswer: q.selectedOption || "",
      }));

    const submission: TestSubmission = {
      testId: test.id,
      userId: session.data?.user?.id as string,
      duration,
      responses,
    };

    try {
      // Submit the test
      // console.log(submission);
      const res = await submitTest(submission);
      setIsSubmitted(true);
      setShowSubmitDialog(false);

      if (!res) {
        console.log("Error occured during submission");
        toast.error("Error occured during submission");
      } else {
        router.push(`/student/dashboard/tests/${testId}/result/${res.id}`);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Error submitting test");
      // Show error message
    } finally {
      setTestSubmitLoader(false);
    }
  };

  useEffect(() => {
    if (timeRemaining <= 0 && timerActive) {
      handleSubmitTest();
    }
  }, [timeRemaining, timerActive]);

  // Then modify your timer effect to just update time:
  useEffect(() => {
    if (mode === "review" || !test || !timerActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }

        // Update display time
        setTime({
          hours: Math.floor(newTime / 3600),
          minutes: Math.floor((newTime % 3600) / 60),
          seconds: newTime % 60,
        });

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, test, timerActive]);

  // Format time as 00:00:00
  const formattedTime = `${time.hours
    .toString()
    .padStart(2, "0")}h:${time.minutes
    .toString()
    .padStart(2, "0")}m:${time.seconds.toString().padStart(2, "0")}s`;

  // Get question counts
  const attemptedCount = questions.filter(
    (q) => q.status === "attempted" || q.selectedOption
  ).length;
  const reviewCount = questions.filter((q) => q.status === "review").length;
  const unattemptedCount = questions.filter((q) =>
    mode === "review"
      ? !q.selectedOption // In review mode, count all questions without selected option
      : (q.status === "unattempted" || q.status === "current") &&
        !q.selectedOption
  ).length;

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attempted":
        return (
          <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        );
      case "review":
        return (
          <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        );
      case "current":
        return (
          <Circle className="w-4 h-4 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />
        );
      default:
        return (
          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
        );
    }
  };

  // Check if a question is marked for review
  const isMarkedForReview = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    return (
      question?.status === "review" ||
      // Special case: if this is the current question and it was previously marked for review
      (question?.id === currentQuestion?.id &&
        currentQuestion?.status === "review")
    );
  };

  if (loading || !test || !currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ToastContainer />
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-end sm:justify-between p-4 bg-card border-b border-border shadow-sm">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden">
            <Image
              src="/logo.jpeg"
              alt="Vidyastraa Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">{test.title}</h1>
            <p className="text-sm text-muted-foreground">
              {mode === "review" ? "Review Answers" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="border-border bg-card"
          >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile sidebar toggle - moved to header */}
          <Sheet open={showQuestionPanel} onOpenChange={setShowQuestionPanel}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-border bg-card"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open question panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85%] sm:w-[350px] p-0 bg-background"
            >
              <QuestionNavigationPanel
                questions={questions}
                goToQuestion={goToQuestion}
                currentQuestionIndex={currentQuestionIndex}
                isMarkedForReview={isMarkedForReview}
                setShowQuestionPanel={setShowQuestionPanel}
                mode={mode}
              />
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />{" "}
                    {attemptedCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attempted Questions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1" /> {reviewCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Marked for Review</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  >
                    <Circle className="w-3.5 h-3.5 mr-1" /> {unattemptedCount}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unattempted Questions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {mode !== "review" && (
            <Badge
              variant="outline"
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formattedTime}</span>
            </Badge>
          )}
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
                    {isMarkedForReview(currentQuestion.id) ? (
                      <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    ) : (
                      getStatusIcon(currentQuestion.status)
                    )}
                  </CardTitle>
                </div>
                {mode !== "review" && (
                  <Button
                    variant={
                      isMarkedForReview(currentQuestion.id)
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      "gap-2",
                      isMarkedForReview(currentQuestion.id)
                        ? "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white"
                        : "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                    )}
                    onClick={handleReviewLater}
                  >
                    <BookmarkIcon className="w-4 h-4" />
                    {isMarkedForReview(currentQuestion.id)
                      ? "Remove Review"
                      : "Mark for Review"}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 text-lg font-medium">
                  {currentQuestion.question}
                </div>

                {currentQuestion.image && (
                  <div className="mb-6">
                    <div className="relative w-full h-48 md:h-64 rounded-md overflow-hidden">
                      <Image
                        src={
                          currentQuestion.image ||
                          "https://ui.shadcn.com/placeholder.svg"
                        }
                        alt="Question image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                <RadioGroup
                  value={currentQuestion.selectedOption ?? ""}
                  onValueChange={handleOptionSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => {
                    const optionId = String.fromCharCode(65 + index); // A, B, C, D
                    const isCorrect =
                      mode === "review" &&
                      currentQuestion.selectedOption &&
                      currentQuestion.options[
                        currentQuestion.correctAnswer.charCodeAt(0) - 65
                      ] === option;
                    const isIncorrect =
                      mode === "review" &&
                      currentQuestion.selectedOption == option &&
                      currentQuestion.selectedOption !==
                        currentQuestion.options[
                          currentQuestion.correctAnswer.charCodeAt(0) - 65
                        ];
                    return (
                      <div
                        key={optionId}
                        className={cn(
                          "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                          isCorrect
                            ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100"
                            : isIncorrect
                            ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100"
                            : currentQuestion.selectedOption === option
                            ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                            : "border-border hover:border-border/80 hover:bg-accent"
                        )}
                      >
                        <RadioGroupItem
                          value={option}
                          id={`option-${optionId}`}
                          className={cn(
                            isCorrect
                              ? "text-green-600 dark:text-green-400"
                              : isIncorrect
                              ? "text-red-600 dark:text-red-400"
                              : "text-blue-600 dark:text-blue-400"
                          )}
                          disabled={mode === "review"}
                        />
                        <Label
                          htmlFor={`option-${optionId}`}
                          className="flex-1 cursor-pointer text-base font-medium"
                        >
                          <span className="font-semibold mr-3">
                            {optionId}.
                          </span>
                          {option}
                        </Label>

                        {isCorrect && (
                          <Badge className="ml-2 bg-green-500 dark:bg-green-600">
                            Correct
                          </Badge>
                        )}

                        {isIncorrect && (
                          <Badge className="ml-2 bg-red-500 dark:bg-red-600">
                            Incorrect
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>

                {mode === "review" && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Solution</h3>
                    <p>{currentQuestion.solution}</p>
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

                {mode === "review" ? (
                  <Button
                    variant="outline"
                    className="gap-2 border-border bg-card hover:bg-accent"
                    onClick={() => router.push("/student/dashboard/tests")}
                  >
                    Back to Tests
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={testSubmitLoader}
                  >
                    {testSubmitLoader ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Test"
                    )}
                  </Button>
                )}

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
            mode={mode}
          />
        </div>
      </div>

      {/* Submit Test Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">
                You have {unattemptedCount} unattempted questions.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {attemptedCount}
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-500">
                  Attempted
                </p>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md">
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  {reviewCount}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-500">
                  For Review
                </p>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <p className="text-xl font-bold text-foreground/70">
                  {unattemptedCount}
                </p>
                <p className="text-xs text-foreground/60">Unattempted</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitTest} disabled={testSubmitLoader}>
              {testSubmitLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitConfirm} onOpenChange={handleCancelExit}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Exit Test?</DialogTitle>
            <DialogDescription>
              You haven't submitted your test yet. Are you sure you want to
              leave? Your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">
                You have {unattemptedCount} unattempted questions.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelExit}>
              Continue Test
            </Button>
            <Button onClick={handleConfirmExit} disabled={testSubmitLoader}>
              {testSubmitLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
