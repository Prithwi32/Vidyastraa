import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { useState } from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface QuestionDetailModalProps {
  question: {
    id: string;
    type:
      | "MCQ"
      | "MULTI_SELECT"
      | "ASSERTION_REASON"
      | "FILL_IN_BLANK"
      | "MATCHING";
    questionText: string;
    questionImage?: string | null;
    solutionText?: string | null;
    solutionImage?: string | null;
    difficulty: "BEGINNER" | "MODERATE" | "HARD" | "UNKNOWN";
    subject: {
      name: string;
    };
    chapter: {
      name: string;
    };
    options?: Array<{
      id: string;
      text: string;
      image?: string | null;
      isCorrect?: boolean;
    }>;
    matchingPairs?: Array<{
      leftText: string;
      leftImage?: string | null;
      rightText: string;
      rightImage?: string | null;
    }>;
    correctAnswer: string | string[];
    marks?: number;
  } | null;
  negativeMarking?: number;
  partialMarking?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionDetailModal({
  question,
  open,
  onOpenChange,
  negativeMarking,
  partialMarking,
}: QuestionDetailModalProps) {
  const { theme } = useTheme();
  const [showSolution, setShowSolution] = useState(false);

  if (!question) {
    return null;
  }

  const difficultyColors = {
    BEGINNER: {
      light: "bg-green-50 text-green-700 border-green-200",
      dark: "bg-green-900/30 text-green-300 border-green-700",
    },
    MODERATE: {
      light: "bg-amber-50 text-amber-700 border-amber-200",
      dark: "bg-amber-900/30 text-amber-300 border-amber-700",
    },
    ADVANCED: {
      light: "bg-red-50 text-red-700 border-red-200",
      dark: "bg-red-900/30 text-red-300 border-red-700",
    },
    UNKNOWN: {
      light: "bg-gray-50 text-gray-700 border-gray-200",
      dark: "bg-gray-800 text-gray-300 border-gray-600",
    },
  };

  const subjectColors = {
    PHYSICS: {
      light: "bg-blue-50 text-blue-700 border-blue-200",
      dark: "bg-blue-900/30 text-blue-300 border-blue-700",
    },
    CHEMISTRY: {
      light: "bg-green-50 text-green-700 border-green-200",
      dark: "bg-green-900/30 text-green-300 border-green-700",
    },
    MATHS: {
      light: "bg-purple-50 text-purple-700 border-purple-200",
      dark: "bg-purple-900/30 text-purple-300 border-purple-700",
    },
    BIOLOGY: {
      light: "bg-amber-50 text-amber-700 border-amber-200",
      dark: "bg-amber-900/30 text-amber-300 border-amber-700",
    },
  };

  const typeColors = {
    MCQ: {
      light: "bg-blue-50 text-blue-700 border-blue-200",
      dark: "bg-blue-900/30 text-blue-300 border-blue-700",
    },
    MULTI_SELECT: {
      light: "bg-purple-50 text-purple-700 border-purple-200",
      dark: "bg-purple-900/30 text-purple-300 border-purple-700",
    },
    ASSERTION_REASON: {
      light: "bg-orange-50 text-orange-700 border-orange-200",
      dark: "bg-orange-900/30 text-orange-300 border-orange-700",
    },
    FILL_IN_BLANK: {
      light: "bg-teal-50 text-teal-700 border-teal-200",
      dark: "bg-teal-900/30 text-teal-300 border-teal-700",
    },
    MATCHING: {
      light: "bg-indigo-50 text-indigo-700 border-indigo-200",
      dark: "bg-indigo-900/30 text-indigo-300 border-indigo-700",
    },
  };

  const getSubjectColor = (subjectName?: string) => {
    if (!subjectName) return subjectColors.BIOLOGY;
    const key = subjectName as keyof typeof subjectColors;
    return subjectColors[key] || subjectColors.BIOLOGY;
  };

  const renderWithLatex = (text?: string | null) => {
    if (!text) return null;
    return <Latex>{text}</Latex>;
  };

  const renderMCQOptions = () => (
    <div className="space-y-2">
      <h3 className="font-semibold">Options:</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {question.options?.map((option, index) => (
          <div
            key={option.id}
            className={`rounded-lg p-3 border transition-colors ${
              option.isCorrect
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-muted/50 hover:bg-muted/70"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-medium">
                {String.fromCharCode(65 + index)}.
              </span>
              <div className="flex-1">{renderWithLatex(option.text)}</div>
              {option.image && (
                <img
                  src={option.image}
                  alt="Option diagram"
                  className="mt-2 rounded-md border max-w-full"
                />
              )}
              {option.isCorrect && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                  Correct
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMultiSelectOptions = () => (
    <div className="space-y-2">
      <h3 className="font-semibold">Options (Select all that apply):</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {question.options?.map((option, index) => (
          <div
            key={option.id}
            className={`rounded-lg p-3 border transition-colors ${
              option.isCorrect
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-muted/50 hover:bg-muted/70"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-medium">
                {String.fromCharCode(65 + index)}.
              </span>
              <div className="flex-1">{renderWithLatex(option.text)}</div>
              {option.image && (
                <img
                  src={option.image}
                  alt="Option diagram"
                  className="mt-2 rounded-md border max-w-full"
                />
              )}
              {option.isCorrect && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                  Correct
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Note: This question has multiple correct answers.
      </div>
    </div>
  );

  const renderAssertionReasonOptions = () => {
    const options = question.options || [];

    return (
      <div className="space-y-2">
        <h4 className="font-medium">Options:</h4>
        <div className="grid gap-2 md:grid-cols-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`rounded-lg p-3 border transition-colors ${
                option.isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                  : "bg-muted/50 hover:bg-muted/70"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                <div className="flex-1">{renderWithLatex(option.text)}</div>
                {option.isCorrect && (
                  <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                    Correct
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFillInBlank = () => (
    <div className="space-y-2">
      <h3 className="font-semibold">Correct Answer:</h3>
      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
        {renderWithLatex(question.options?.[0]?.text)}
      </div>
      <div className="text-sm text-muted-foreground">
        Note: This is a fill-in-the-blank question. The correct answer is shown
        above.
      </div>
    </div>
  );

  const renderMatchingPairs = () => (
    <div className="space-y-2">
      <h3 className="font-semibold">Matching Pairs:</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left bg-muted/50 dark:bg-muted/80">
                {JSON.parse(question.questionText).headers.left}
              </th>
              <th className="p-3 text-left bg-muted/50 dark:bg-muted/80">
                {JSON.parse(question.questionText).headers.left}
              </th>
            </tr>
          </thead>
          <tbody>
            {question.matchingPairs?.map((pair, index) => (
              <tr
                key={index}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {pair.leftImage && (
                      <img
                        src={pair.leftImage}
                        alt="Left column"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <div>{renderWithLatex(pair.leftText)}</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {pair.rightImage && (
                      <img
                        src={pair.rightImage}
                        alt="Right column"
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <div>{renderWithLatex(pair.rightText)}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-muted-foreground">
        Note: Match items from Column A with their correct counterparts in
        Column B.
      </div>
    </div>
  );

  const renderMatchingOptions = () => (
    <div className="space-y-2">
      <h3 className="font-semibold">Options:</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {question.options?.map((option, index) => (
          <div
            key={option.id}
            className={`rounded-lg p-3 border transition-colors ${
              option.isCorrect
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-muted/50 hover:bg-muted/70"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="font-medium">
                {String.fromCharCode(65 + index)}.
              </span>
              <div className="flex-1">{renderWithLatex(option.text)}</div>
              {option.image && (
                <img
                  src={option.image}
                  alt="Option diagram"
                  className="mt-2 rounded-md border max-w-full"
                />
              )}
              {option.isCorrect && (
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                  Correct
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionTypeSpecificContent = () => {
    switch (question.type) {
      case "MCQ":
        return renderMCQOptions();
      case "MULTI_SELECT":
        return renderMultiSelectOptions();
      case "ASSERTION_REASON":
        return renderAssertionReasonOptions();
      case "FILL_IN_BLANK":
        return renderFillInBlank();
      case "MATCHING":
        return (
          <>
            {renderMatchingPairs()}
            {renderMatchingOptions()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span>Question Details</span>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`${
                  getSubjectColor(question?.subject?.name)[
                    theme === "dark" ? "dark" : "light"
                  ]
                }`}
              >
                {question?.subject?.name?.charAt(0) +
                  question?.subject?.name?.slice(1).toLowerCase() || "Unknown"}
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  typeColors[question.type][theme === "dark" ? "dark" : "light"]
                }`}
              >
                {question.type.replace(/_/g, " ")}
              </Badge>
              <Badge
                variant="outline"
                className={`${
                  difficultyColors[question?.difficulty || "UNKNOWN"][
                    theme === "dark" ? "dark" : "light"
                  ]
                }`}
              >
                {question?.difficulty?.charAt(0) +
                  question?.difficulty?.slice(1).toLowerCase() || "Unknown"}
              </Badge>
              {question?.marks && (
                <Badge variant="outline" className="font-mono">
                  {question.marks} {question.marks === 1 ? "mark" : "marks"}
                </Badge>
              )}
              {negativeMarking !== undefined && negativeMarking > 0 && (
                <Badge
                  variant="outline"
                  className="font-mono text-red-600 dark:text-red-400"
                >
                  -{negativeMarking} penalty
                </Badge>
              )}
              {partialMarking && (
                <Badge
                  variant="outline"
                  className="text-amber-600 dark:text-amber-400"
                >
                  Partial Marking
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Chapter Info */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Chapter:</span>
              <span className="text-muted-foreground">
                {question?.chapter?.name || "Not specified"}
              </span>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <h3 className="font-semibold">Question:</h3>
              <div className="rounded-lg bg-muted/50 p-4">
                {question?.questionImage && (
                  <div className="mb-4 max-w-full flex justify-center">
                    <img
                      src={question.questionImage}
                      alt="Question diagram"
                      className="rounded-md border max-h-60 object-contain"
                    />
                  </div>
                )}
                <div className="whitespace-pre-wrap">
                  {question.type !== "ASSERTION_REASON" &&
                    question.type !== "MATCHING" &&
                    renderWithLatex(question?.questionText)}
                  {question.type === "ASSERTION_REASON" && (
                    <>
                      {renderWithLatex(question?.questionText?.split("---")[0])}
                      {renderWithLatex(question?.questionText?.split("---")[1])}
                    </>
                  )}
                  {question.type === "MATCHING" && (
                    <>
                      {renderWithLatex(
                        JSON.parse(question.questionText).instruction
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Question Type Specific Content */}
            {renderQuestionTypeSpecificContent()}

            {/* Solution */}
            {question.solutionText && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Solution:</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolution(!showSolution)}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    {showSolution ? "Hide" : "Show"} Solution
                  </Button>
                </div>
                {showSolution && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    {question.solutionImage && (
                      <div className="mb-4 max-w-full flex justify-center">
                        <img
                          src={question.solutionImage}
                          alt="Solution diagram"
                          className="rounded-md border max-h-60 object-contain"
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {renderWithLatex(question.solutionText)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
