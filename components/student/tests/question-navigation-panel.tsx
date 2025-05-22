"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { QuestionWithStatus } from "@/lib/tests/types";

interface QuestionNavigationPanelProps {
  questions: QuestionWithStatus[];
  goToQuestion: (index: number) => void;
  currentQuestionIndex: number;
  isMarkedForReview: (questionId: string) => boolean;
  setShowQuestionPanel?: (show: boolean) => void;
  mode: "test" | "review";
}

// Add a helper to group questions by subject
function groupQuestionsBySubject(
  questions: QuestionWithStatus[]
): Record<string, Array<QuestionWithStatus & { globalIndex: number }>> {
  const grouped: Record<
    string,
    Array<QuestionWithStatus & { globalIndex: number }>
  > = {};
  questions.forEach((q: QuestionWithStatus, idx: number) => {
    if (!grouped[q.subject]) grouped[q.subject] = [];
    grouped[q.subject].push({ ...q, globalIndex: idx });
  });
  return grouped;
}

export default function QuestionNavigationPanel({
  questions,
  goToQuestion,
  currentQuestionIndex,
  isMarkedForReview,
  setShowQuestionPanel,
  mode,
}: QuestionNavigationPanelProps) {
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

  // For review mode
  const correctCount =
    mode === "review" ? questions.filter((q) => q.isCorrect).length : 0;
  const incorrectCount =
    mode === "review"
      ? questions.filter((q) => q.selectedOption && !q.isCorrect).length
      : 0;

  // Get button class for a question
  const getQuestionButtonClass = (
    question: QuestionWithStatus,
    index: number
  ) => {
    const isCurrent = index === currentQuestionIndex;
    const isReview = isMarkedForReview(question.id);
    const isCorrect = mode === "review" && question.isCorrect;

    const isIncorrect =
      mode === "review" && question.selectedOption && !question.isCorrect;

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

  const grouped = groupQuestionsBySubject(questions);

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
          {mode !== "review" && (
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
      {Object.entries(grouped).map(([subject, subjectQuestions]) => {
        const start = (subjectQuestions as any)[0]?.globalIndex + 1;
        const end =
          (subjectQuestions as any)[(subjectQuestions as any).length - 1]
            ?.globalIndex + 1;
        return (
          <div key={subject} className="mb-4">
            <div className="font-semibold text-base mb-2 flex items-center gap-2">
              <span>{subject}</span>
              <span className="text-xs text-muted-foreground">
                ({start}-{end})
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(
                subjectQuestions as Array<
                  QuestionWithStatus & { globalIndex: number }
                >
              ).map((q, idx) => {
                const qNum = q.globalIndex + 1;
                return (
                  <Button
                    key={q.id}
                    variant="outline"
                    size="icon"
                    className={cn(
                      "w-full aspect-square p-0 text-sm font-medium border",
                      getQuestionButtonClass(q, q.globalIndex)
                    )}
                    onClick={() => {
                      goToQuestion(q.globalIndex);
                      setShowQuestionPanel?.(false);
                    }}
                  >
                    {qNum}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-auto pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-2">
          {mode === "review" ? (
            <>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/50 rounded-md border border-green-100 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {correctCount}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  Correct
                </div>
              </div>
              <div className="text-center p-2 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-100 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {incorrectCount}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">
                  Incorrect
                </div>
              </div>
              <div className="text-center p-2 bg-muted rounded-md border border-border">
                <div className="text-2xl font-bold text-foreground/70">
                  {unattemptedCount}
                </div>
                <div className="text-xs text-foreground/60">Unattempted</div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
