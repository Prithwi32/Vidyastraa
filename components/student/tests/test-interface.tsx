"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { fetchTest, submitTest } from "@/app/actions/test";
import { toast, ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import Image from "next/image";
import "katex/dist/katex.min.css";
import QuestionNavigationPanel from "@/components/student/tests/question-navigation-panel";
import LatexRenderer from "@/components/student/tests/latex-renderer";
import QuestionRenderer from "@/components/student/tests/question-renderer";
import { Maximize2 } from "lucide-react";
export default function TestInterface() {
  const router = useRouter();
  const params = useParams();
  const session = useSession();
  const testId = params.id;

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

  // Fix: Add timerInitialized ref
  const timerInitialized = useRef(false);

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions with status
  const [questions, setQuestions] = useState<QuestionWithStatus[]>([]);

  const pathname = `/student/dashboard/tests/${testId}`;
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile =
    typeof window !== "undefined"
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
      : false;

  // Initialize fullscreen when test loads
  useEffect(() => {
    if (!isMobile && test && !isSubmitted) {
      const initializeFullscreen = async () => {
        try {
          // Check if we're already in fullscreen
          if (!document.fullscreenElement) {
            await enterFullScreen();
          }
        } catch (err) {
          console.error("Initial fullscreen error:", err);
        }
      };

      initializeFullscreen();
    }
  }, [test, isSubmitted, isMobile]);

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (!isMobile && !isCurrentlyFullscreen && !isSubmitted) {
        // Show exit confirmation when exiting fullscreen
        setShowExitConfirm(true);
        // Attempt to re-enter fullscreen after a short delay
        setTimeout(() => {
          if (!document.fullscreenElement) {
            enterFullScreen();
          }
        }, 500);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isSubmitted, isMobile]);

  // Handle Escape key only in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitted && isFullscreen) {
        e.preventDefault();
        setShowExitConfirm(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitted, isFullscreen]);

  const enterFullScreen = async () => {
    try {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        // Only request if not already in fullscreen
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Prevent leaving the test
  useEffect(() => {
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
    try {
      await handleSubmitTest();
      // Exit fullscreen after submission
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setShowExitConfirm(false);
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Error submitting test");
    } finally {
      setTestSubmitLoader(false);
    }
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

        // Only initialize timer if not already initialized for this test
        if (!timerInitialized.current) {
          const initialTime = testData.duration * 60;
          setTimeRemaining(initialTime);
          setTime({
            hours: Math.floor(initialTime / 3600),
            minutes: Math.floor((initialTime % 3600) / 60),
            seconds: initialTime % 60,
          });
          setTimerActive(true);
          timerInitialized.current = true;
        }

        // Initialize questions with status and image
        const questionsWithStatus = testData.questions.map((q, index) => ({
          ...q,
          status: q.status || (index === 0 ? "current" : "unattempted"),
          selectedOption: undefined,
        }));

        setQuestions(questionsWithStatus);
      } catch (error) {
        console.error("Error loading test:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTest();
    // Only run this effect when testId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Helper to get image for current question
  const getCurrentQuestionImage = () => {
    if (!currentQuestion) return null;
    return currentQuestion.questionImage || null;
  };

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    const updatedQuestions = [...questions];

    if (currentQuestion.type === "MULTI_SELECT") {
      // For multi-select questions, toggle the selected option
      const selectedOptions = Array.isArray(currentQuestion.selectedOption)
        ? [...currentQuestion.selectedOption]
        : [];

      const optionIndex = selectedOptions.indexOf(optionId);
      if (optionIndex === -1) {
        selectedOptions.push(optionId);
      } else {
        selectedOptions.splice(optionIndex, 1);
      }
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        selectedOption: selectedOptions,
        status: currentQuestion.status === "review" ? "review" : "attempted",
      };
    } else if (currentQuestion.type === "FILL_IN_BLANK") {
      // For fill in the blank, we'll handle this separately with handleFillInBlankChange
      return;
    } else {
      // For other question types (MCQ, ASSERTION_REASON)
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        selectedOption: optionId,
        status: currentQuestion.status === "review" ? "review" : "attempted",
      };
    }
    setQuestions(updatedQuestions);
  };

  const handleFillInBlankChange = (value: string, blankIndex: number) => {
    if (!currentQuestion) return;

    const updatedQuestions = [...questions];
    const currentAnswers = Array.isArray(currentQuestion.selectedOption)
      ? [...currentQuestion.selectedOption]
      : [];

    while (currentAnswers.length <= blankIndex) {
      currentAnswers.push("");
    }

    currentAnswers[blankIndex] = value;

    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      selectedOption: currentAnswers[0].length > 0 ? currentAnswers : undefined,
      status: currentAnswers[0].length > 0 ? "attempted" : "unattempted",
    };

    setQuestions(updatedQuestions);
  };

  // Handle review later
  const handleReviewLater = () => {
    if (!currentQuestion) return;

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
    if (!test) return;
    setTimerActive(false);
    setTestSubmitLoader(true);
    const totalDuration = test.duration;
    const timeTaken = totalDuration - Math.ceil(timeRemaining / 60);
    const duration = timeRemaining > 0 ? timeTaken : totalDuration;

    // Prepare submission data with current questions
    const responses: TestResponse[] = questions
      .filter((q) => q.selectedOption)
      .map((q) => ({
        questionId: q.id,
        selectedAnswer: Array.isArray(q.selectedOption)
          ? q.selectedOption.join(",")
          : q.selectedOption || "",
      }));

    const submission: TestSubmission = {
      testId: test.id,
      userId:
        (session.data as any)?.user?.id ||
        (session.data as any)?.user?.userId ||
        (session.data as any)?.user?.email ||
        "",
      duration,
      responses,
    };

    try {
      const res = await submitTest(submission);
      setIsSubmitted(true);
      setShowSubmitDialog(false);
      if (!res) {
        toast.error("Error occured during submission");
      } else {
        router.push(
          `/student/dashboard/tests/${testId as string}/result/${res.id}`
        );
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Error submitting test");
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
    if (!test || !timerActive) return;

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
  }, [test, timerActive]);

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
  const unattemptedCount = questions.filter(
    (q) =>
      (q.status === "unattempted" || q.status === "current") &&
      !q.selectedOption
  ).length;

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
            <p className="text-sm text-muted-foreground">Test Mode</p>
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
          {!isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={enterFullScreen}
              className="ml-2"
              title={
                isFullscreen ? "Currently in fullscreen" : "Enter fullscreen"
              }
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
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
                mode="test"
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
          <Badge
            variant="outline"
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-medium">{formattedTime}</span>
          </Badge>
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
                    ) : currentQuestion.selectedOption ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </CardTitle>
                </div>
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
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 text-lg font-medium">
                  {currentQuestion.type !== "ASSERTION_REASON" &&
                    currentQuestion.type !== "MATCHING" && (
                      <LatexRenderer content={currentQuestion.questionText} />
                    )}
                </div>

                {getCurrentQuestionImage() && (
                  <div className="mb-6">
                    <div className="relative w-full h-48 md:h-64 rounded-md overflow-hidden">
                      <Image
                        src={
                          getCurrentQuestionImage() ||
                          "https://ui.shadcn.com/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Question image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}

                <QuestionRenderer
                  question={currentQuestion}
                  handleOptionSelect={handleOptionSelect}
                  handleFillInBlankChange={handleFillInBlankChange}
                  mode="test"
                />
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
            mode="test"
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
      <Dialog
        open={showExitConfirm}
        onOpenChange={(open) => {
          if (!open) {
            // If cancelling exit, re-enter fullscreen if not mobile
            if (!isMobile) {
              enterFullScreen();
            }
            setShowExitConfirm(false);
          } else {
            setShowExitConfirm(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Exit Fullscreen?</DialogTitle>
            <DialogDescription>
              Tests must be completed in fullscreen mode. Are you sure you want
              to exit?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Exiting fullscreen may result in test submission.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (!isMobile) {
                  enterFullScreen();
                }
                setShowExitConfirm(false);
              }}
            >
              Continue Test
            </Button>
            <Button
              onClick={handleConfirmExit}
              disabled={testSubmitLoader}
              variant="destructive"
            >
              {testSubmitLoader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit and Exit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
