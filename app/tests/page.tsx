"use client";

import { useState, useEffect } from "react";
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
import { set } from "date-fns";

// Define question status types
type QuestionStatus = "unattempted" | "attempted" | "review" | "current";

// Define question interface with all state information
interface Question {
  id: number;
  subject: "Physics" | "Chemistry" | "Mathematics";
  text: string;
  options: { id: string; text: string }[];
  status: QuestionStatus;
  selectedOption?: string;
}

export default function ExamInterface() {
  // Dark mode state
  const { setTheme } = useTheme();

  // state for question panel
  const [showQuestionPanel, setShowQuestionPanel] = useState(false);

  // Timer state
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 0-based index, so 15 is question 16

  // Generate sample questions with initial states
  const [questions, setQuestions] = useState<Question[]>(() => {
    const sampleQuestions: Question[] = [];

    // Physics questions (1-30)
    for (let i = 1; i <= 30; i++) {
      sampleQuestions.push({
        id: i,
        subject: "Physics",
        text: "An electromagnetic wave going through vacuum is described by E = E₀sin(kx − ωt). Which of the following is independent of the wavelength?",
        options: [
          { id: "A", text: "k" },
          { id: "B", text: "ω" },
          { id: "C", text: "k/ω" },
          { id: "D", text: "kω" },
        ],
        status: "unattempted",
        selectedOption: undefined,
      });
    }

    // Chemistry questions (31-60)
    for (let i = 31; i <= 60; i++) {
      sampleQuestions.push({
        id: i,
        subject: "Chemistry",
        text: `Chemistry question ${i}`,
        options: [
          { id: "A", text: "Option A" },
          { id: "B", text: "Option B" },
          { id: "C", text: "Option C" },
          { id: "D", text: "Option D" },
        ],
        status: "unattempted",
        selectedOption: undefined,
      });
    }

    // Mathematics questions (61-90)
    for (let i = 61; i <= 90; i++) {
      sampleQuestions.push({
        id: i,
        subject: "Mathematics",
        text: `Mathematics question ${i}`,
        options: [
          { id: "A", text: "Option A" },
          { id: "B", text: "Option B" },
          { id: "C", text: "Option C" },
          { id: "D", text: "Option D" },
        ],
        status: "unattempted",
        selectedOption: undefined,
      });
    }

    return sampleQuestions;
  });

  // Current question
  const currentQuestion = questions[currentQuestionIndex];

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
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
  const goToQuestion = (index: number) => {
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
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        const newSeconds = prevTime.seconds + 1;
        const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
        const newHours = prevTime.hours + Math.floor(newMinutes / 60);

        return {
          hours: newHours,
          minutes: newMinutes % 60,
          seconds: newSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as 00:00:00
  const formattedTime = `${time.hours
    .toString()
    .padStart(2, "0")}h:${time.minutes
    .toString()
    .padStart(2, "0")}m:${time.seconds.toString().padStart(2, "0")}s`;

  // Get question counts
  const attemptedCount = questions.filter(
    (q) => q.status === "attempted"
  ).length;
  const reviewCount = questions.filter((q) => q.status === "review").length;
  const unattemptedCount = questions.filter(
    (q) => q.status === "unattempted" || q.status === "current"
  ).length;

  // Get status icon
  const getStatusIcon = (status: QuestionStatus) => {
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
  const isMarkedForReview = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    return (
      question?.status === "review" ||
      // Special case: if this is the current question and it was previously marked for review
      (question?.id === currentQuestion.id &&
        currentQuestion.status === "review")
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-end sm:justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-white">JEE</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              JEE Main 2024
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Misc Paper 1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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
                className="md:hidden border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open question panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
              <QuestionNavigationPanel
                questions={questions}
                goToQuestion={goToQuestion}
                currentQuestionIndex={currentQuestionIndex}
                isMarkedForReview={isMarkedForReview}
                setShowQuestionPanel={setShowQuestionPanel}
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
            <Card className="border-slate-700 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 flex flex-row items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-t-lg px-4 sm:p-6">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    {currentQuestion.subject}
                  </Badge>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    Question {currentQuestion.id}
                    {isMarkedForReview(currentQuestion.id) ? (
                      <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    ) : (
                      getStatusIcon(currentQuestion.status)
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

              <CardContent className="pt-4 dark:bg-slate-900">
                <div className="mb-6 text-slate-700 dark:text-slate-200 text-lg font-medium">
                  {currentQuestion.text}
                </div>

                <RadioGroup
                  value={currentQuestion.selectedOption ?? ""}
                  onValueChange={handleOptionSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                        currentQuestion.selectedOption === option.id
                          ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                      )}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={`option-${option.id}`}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer text-base font-medium text-slate-700 dark:text-slate-200"
                      >
                        <span className="font-semibold mr-3">{option.id}.</span>
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {`>`} Solution
                  </span>
                </div>
              </CardContent>

              <CardFooter className="px-2 sm:px-4 flex justify-between pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-lg">
                <Button
                  variant="outline"
                  className="gap-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  Submit Test
                </Button>

                <Button
                  variant="outline"
                  className="gap-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
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
        <div className="hidden md:block w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
          <QuestionNavigationPanel
            questions={questions}
            goToQuestion={goToQuestion}
            currentQuestionIndex={currentQuestionIndex}
            isMarkedForReview={isMarkedForReview}
          />
        </div>
      </div>
    </div>
  );
}

// Update the QuestionNavigationPanel component to match the new dark theme
function QuestionNavigationPanel({
  questions,
  goToQuestion,
  currentQuestionIndex,
  isMarkedForReview,
  setShowQuestionPanel,
}: {
  questions: Question[];
  goToQuestion: (index: number) => void;
  currentQuestionIndex: number;
  isMarkedForReview: (questionId: number) => boolean;
  setShowQuestionPanel?: (show: boolean) => void;
}) {
  // Get questions by subject
  const physicsQuestions = questions.filter((q) => q.subject === "Physics");
  const chemistryQuestions = questions.filter((q) => q.subject === "Chemistry");
  const mathQuestions = questions.filter((q) => q.subject === "Mathematics");

  // Get counts
  const attemptedCount = questions.filter(
    (q) => q.status === "attempted"
  ).length;
  const reviewCount = questions.filter((q) => q.status === "review").length;
  const unattemptedCount = questions.filter(
    (q) => q.status === "unattempted" || q.status === "current"
  ).length;

  // Get button class for a question
  const getQuestionButtonClass = (question: Question, index: number) => {
    const isCurrent = index === currentQuestionIndex;
    const isReview = isMarkedForReview(question.id);

    if (isCurrent) {
      return "border-blue-500 dark:border-blue-600 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 ring-2 ring-blue-400 dark:ring-blue-600";
    } else if (isReview) {
      return "border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/70 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800";
    } else if (question.selectedOption) {
      return "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800";
    } else {
      return "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700";
    }
  };

  return (
    <div className="p-4 pt-0 h-full overflow-y-auto bg-white dark:bg-slate-900">
      <div className="sticky pt-4 top-0 bg-white dark:bg-slate-900 pb-2 z-10">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Question Navigator
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-500"></div>
            <span>Attempted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500 dark:bg-amber-500"></div>
            <span>Review</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-500"></div>
            <span>Current</span>
          </div>
        </div>
        <Separator className="bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Physics section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
          <Badge className="mr-2 bg-blue-600 dark:bg-blue-700 text-white">
            Physics
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Questions 1-30
          </span>
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {physicsQuestions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              size="icon"
              className={cn(
                "w-full aspect-square p-0 text-sm font-medium border",
                getQuestionButtonClass(question, question.id - 1)
              )}
              onClick={() => {
                goToQuestion(question.id - 1);
                setShowQuestionPanel?.(false);
              }}
            >
              {question.id}
            </Button>
          ))}
        </div>
      </div>

      {/* Chemistry section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
          <Badge className="mr-2 bg-emerald-600 dark:bg-emerald-700 text-white">
            Chemistry
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Questions 31-60
          </span>
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {chemistryQuestions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              size="icon"
              className={cn(
                "w-full aspect-square p-0 text-sm font-medium border",
                getQuestionButtonClass(question, question.id - 1)
              )}
              onClick={() => {
                goToQuestion(question.id - 1);
                setShowQuestionPanel?.(false);
              }}
            >
              {question.id}
            </Button>
          ))}
        </div>
      </div>

      {/* Mathematics section */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center">
          <Badge className="mr-2 bg-purple-600 dark:bg-purple-700 text-white">
            Mathematics
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Questions 31-60
          </span>
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {mathQuestions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              size="icon"
              className={cn(
                "w-full aspect-square p-0 text-sm font-medium border",
                getQuestionButtonClass(question, question.id - 1)
              )}
              onClick={() => {
                goToQuestion(question.id - 1);
                setShowQuestionPanel?.(false);
              }}
            >
              {question.id}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
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
          <div className="text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
              {unattemptedCount}
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-400">
              Unattempted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
