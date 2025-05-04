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
      image?: string;
      question: string;
      solution: string;
      options: string[];
      correctAnswer: string;
      difficulty: "BEGINNER" | "MODERATE" | "HARD" | "UNKNOWN";
      subject: {
        name: string;
      };
      chapter: {
        name: string;
      };
      marks?: number;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export function QuestionDetailModal({
    question,
    open,
    onOpenChange,
  }: QuestionDetailModalProps) {
    const { theme } = useTheme();
    const [showSolution, setShowSolution] = useState(false);
  
    const difficultyColors = {
      BEGINNER: {
        light: "bg-green-50 text-green-700 border-green-200",
        dark: "bg-green-900/30 text-green-300 border-green-700",
      },
      MODERATE: {
        light: "bg-amber-50 text-amber-700 border-amber-200",
        dark: "bg-amber-900/30 text-amber-300 border-amber-700",
      },
      HARD: {
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
  
    const getSubjectColor = (subjectName?: string) => {
      if (!subjectName) return subjectColors.BIOLOGY;
      const key = subjectName as keyof typeof subjectColors;
      return subjectColors[key] || subjectColors.BIOLOGY;
    };
  
    const renderWithLatex = (text?: string) => {
      if (!text) return null;
      return <Latex>{text}</Latex>;
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Question Details</span>
              <div className="flex gap-2">
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
                  {question?.image && (
                    <div className="mb-4 max-w-full flex justify-center">
                      <img
                        src={question.image}
                        alt="Question diagram"
                        className="rounded-md border"
                      />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {renderWithLatex(question?.question)}
                  </div>
                </div>
              </div>
  
              {/* Options */}
              <div className="space-y-2">
                <h3 className="font-semibold">Options:</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {question?.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 border ${
                        option === question?.correctAnswer
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                          : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-medium">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <div>{renderWithLatex(option)}</div>
                        {option === question?.correctAnswer && (
                          <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                            Correct
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Solution */}
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
                    <div className="whitespace-pre-wrap">
                      {renderWithLatex(question?.solution)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }