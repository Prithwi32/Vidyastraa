"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LatexRenderer from "./latex-renderer";
import type { QuestionWithStatus } from "@/lib/tests/types";

interface QuestionRendererProps {
  question: any; // Accepts ReviewQuestion or QuestionWithStatus
  handleOptionSelect: (optionId: string) => void;
  handleFillInBlankChange: (value: string, blankIndex: number) => void;
  mode: "test" | "review";
}

export default function QuestionRenderer({
  question,
  handleOptionSelect,
  handleFillInBlankChange,
  mode,
}: QuestionRendererProps) {
  if (!question) return null;

  switch (question.type) {
    case "MCQ":
      return (
        <RadioGroup
          value={question.selectedOption ?? ""}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          {question.options.map((option: any, index: number) => {
            const optionId = String.fromCharCode(65 + index);
            let isCorrect = false;
            let isIncorrect = false;
            if (mode === "review") {
              // Find correct answer id (from isCorrect or correctAnswer/correctOptionId)
              const correctOption =
                question.options.find((opt: any) => opt.isCorrect) ||
                question.options.find(
                  (opt: any) =>
                    opt.id ===
                    (question.correctAnswer || question.correctOptionId)
                );
              const correctId = correctOption
                ? correctOption.id
                : question.correctAnswer || question.correctOptionId;
              isCorrect = option.id === correctId;
              isIncorrect = question.selectedOption === option.id && !isCorrect;
            }
            // Set dot color for review mode
            let dotColor = "text-blue-600 dark:text-blue-400";
            if (mode === "review") {
              if (isCorrect) dotColor = "text-green-600 dark:text-green-400";
              else if (isIncorrect) dotColor = "text-red-600 dark:text-red-400";
              else if (question.selectedOption === option.id)
                dotColor = "text-blue-600 dark:text-blue-400";
              else dotColor = "text-border dark:text-border";
            }
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  mode === "review"
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/40 dark:text-green-100"
                      : isIncorrect
                      ? "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/40 dark:text-red-100"
                      : question.selectedOption === option.id
                      ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                      : "border-border hover:border-border/80 hover:bg-accent"
                    : question.selectedOption === option.id
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                    : "border-border hover:border-border/80 hover:bg-accent"
                )}
              >
                <RadioGroupItem
                  value={option.id}
                  id={`option-${optionId}`}
                  className={dotColor}
                  disabled={mode === "review"}
                />
                <Label
                  htmlFor={`option-${optionId}`}
                  className="flex-1 cursor-pointer text-base font-medium"
                >
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option.optionText || ""} />
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      );

    case "MULTI_SELECT":
      return (
        <div className="space-y-3">
          {question.options.map((option: any, index: number) => {
            const optionId = String.fromCharCode(65 + index);
            const isSelected = Array.isArray(question.selectedOption)
              ? question.selectedOption.includes(option.id)
              : false;
            let isCorrect = false;
            let isPartial = false;
            let isIncorrect = false;
            if (mode === "review") {
              const correctIds = question.options
                .filter((opt: any) => opt.isCorrect)
                .map((opt: any) => opt.id);
              if (!correctIds.length) {
                const fallback = (
                  question.correctAnswers ||
                  question.correctAnswer ||
                  question.correctOptionId ||
                  ""
                )
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean);
                fallback.forEach((id: string) => {
                  if (!correctIds.includes(id)) correctIds.push(id);
                });
              }

              const isUnattempted =
                !question.selectedOption ||
                (Array.isArray(question.selectedOption) &&
                  question.selectedOption.length === 0);
              if (isUnattempted) {
                isCorrect = correctIds.includes(option.id);
                isPartial = false;
                isIncorrect = false;
              } else {
                isCorrect = correctIds.includes(option.id) && isSelected;
                isPartial = correctIds.includes(option.id) && !isSelected;
                isIncorrect = !correctIds.includes(option.id) && isSelected;
              }
            }

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  mode === "review"
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/40 dark:text-green-100"
                      : isPartial
                      ? "border-yellow-500 bg-yellow-50 text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-100"
                      : isIncorrect
                      ? "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/40 dark:text-red-100"
                      : "border-border hover:border-border/80 hover:bg-accent"
                    : isSelected
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                    : "border-border hover:border-border/80 hover:bg-accent"
                )}
              >
                <Checkbox
                  id={`option-${optionId}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOptionSelect(option.id)}
                  className={cn(
                    "h-5 w-5 rounded-md border",
                    mode === "review"
                      ? isCorrect
                        ? "border-green-600 text-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                        : isPartial
                        ? "border-yellow-600 text-yellow-600 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white"
                        : isIncorrect
                        ? "border-red-600 text-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white"
                        : "border-border text-border"
                      : isSelected
                      ? "border-blue-600 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      : "border-border text-border"
                  )}
                  disabled={mode === "review"}
                />
                <Label
                  htmlFor={`option-${optionId}`}
                  className="flex-1 cursor-pointer text-base font-medium"
                >
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option.optionText || ""} />
                </Label>
              </div>
            );
          })}
        </div>
      );

    case "ASSERTION_REASON": {
      const questionText = question?.questionText ?? "";
      // Use regex or flexible split
      const parts = questionText.split(/-{3,}/); // splits on '---' with or without spaces/newlines
      // Clean up parts
      const assertionRaw = parts[0]?.trim() || "";
      const reasonRaw = parts[1]?.trim() || "";
      // Extract actual text after "Assertion:" and "Reason:" if present
      const assertion =
        assertionRaw.replace(/^Assertion:\s*/i, "") ||
        "Assertion not provided.";
      const reason =
        reasonRaw.replace(/^Reason:\s*/i, "") || "Reason not provided.";
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Assertion:</h4>
            <div className="rounded-lg bg-muted/50 p-4">
              <LatexRenderer content={assertion || "Assertion not provided."} />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Reason:</h4>
            <div className="rounded-lg bg-muted/50 p-4">
              <LatexRenderer content={reason} />
            </div>
          </div>
          <RadioGroup
            value={question.selectedOption ?? ""}
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {question.options.map((option: any, index: number) => {
              const optionId = String.fromCharCode(65 + index);
              let isCorrect = false;
              let isIncorrect = false;
              if (mode === "review") {
                // Find correct answer id (from isCorrect or correctAnswer/correctOptionId)
                const correctOption =
                  question.options.find((opt: any) => opt.isCorrect) ||
                  question.options.find(
                    (opt: any) =>
                      opt.id ===
                      (question.correctAnswer || question.correctOptionId)
                  );
                const correctId = correctOption
                  ? correctOption.id
                  : question.correctAnswer || question.correctOptionId;
                isCorrect = option.id === correctId;
                isIncorrect =
                  question.selectedOption === option.id && !isCorrect;
              }
              // Set dot color for review mode
              let dotColor = "text-blue-600 dark:text-blue-400";
              if (mode === "review") {
                if (isCorrect) dotColor = "text-green-600 dark:text-green-400";
                else if (isIncorrect)
                  dotColor = "text-red-600 dark:text-red-400";
                else if (question.selectedOption === option.id)
                  dotColor = "text-blue-600 dark:text-blue-400";
                else dotColor = "text-border dark:text-border";
              }
              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                    mode === "review"
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/40 dark:text-green-100"
                        : isIncorrect
                        ? "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/40 dark:text-red-100"
                        : question.selectedOption === option.id
                        ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                        : "border-border hover:border-border/80 hover:bg-accent"
                      : question.selectedOption === option.id
                      ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                      : "border-border hover:border-border/80 hover:bg-accent"
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${optionId}`}
                    className={dotColor}
                    disabled={mode === "review"}
                  />
                  <Label
                    htmlFor={`option-${optionId}`}
                    className="flex-1 cursor-pointer text-base font-medium"
                  >
                    <span className="font-semibold mr-3">{optionId}.</span>
                    <LatexRenderer content={option.optionText || ""} />
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      );
    }

    case "FILL_IN_BLANK": {
      const questionText = question?.questionText ?? "";
      // Always fill with user answer in review mode
      const currentAnswer =
        mode === "review"
          ? Array.isArray(question?.selectedOption)
            ? question.selectedOption[0] || ""
            : ""
          : Array.isArray(question?.selectedOption)
          ? question.selectedOption[0] || ""
          : "";
      return (
        <div className="space-y-4">
          {/* <div className="text-lg font-medium">Fill in the Blank:</div>
          <div className="text-lg">
            <LatexRenderer content={questionText} />
          </div> */}
          <div className="relative">
            <Input
              id="blank-0"
              value={currentAnswer}
              placeholder="Enter your answer here..."
              onChange={(e) => handleFillInBlankChange(e.target.value, 0)}
              className="text-base h-12 w-full border-border"
              disabled={mode === "review"}
            />
          </div>
        </div>
      );
    }

    case "MATCHING": {
      let questionData: any = {
        instruction: "",
        headers: { left: "", right: "" },
      };
      try {
        questionData = JSON.parse(question.questionText || "{}");
      } catch (e) {
        questionData = {
          instruction: question.questionText,
          headers: { left: "", right: "" },
        };
      }
      const options = question.options || [];
      const selectedOption = question.selectedOption;
      const modeIsReview = mode === "review";
      const matchingPairs = question.matchingPairs || [];
      // Find correct option id
      const correctOption =
        options.find((opt: any) => opt.isCorrect) ||
        options.find(
          (opt: any) =>
            opt.id === (question.correctAnswer || question.correctOptionId)
        );
      const correctId = correctOption
        ? correctOption.id
        : question.correctAnswer || question.correctOptionId;
      // Unattempted: selectedOption is empty or undefined
      const isUnattempted = !selectedOption;
      return (
        <div className="space-y-4">
          {/* Instruction */}
          <div className="rounded-lg bg-muted/50 p-4">
            <LatexRenderer content={questionData.instruction} />
          </div>
          {/* Matching Table (Actual Pairs) */}
          {matchingPairs.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 dark:bg-muted/80">
                    <th className="p-3 text-left">
                      {questionData.headers.left || "List I"}
                    </th>
                    <th className="p-3 text-left">
                      {questionData.headers.right || "List II"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matchingPairs.map((pair: any, idx: number) => (
                    <tr key={pair.id || idx} className="border-b">
                      <td className="p-3 font-medium">
                        <LatexRenderer content={pair.leftText} />
                      </td>
                      <td className="p-3 font-medium">
                        <LatexRenderer content={pair.rightText} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Options to select (radio buttons) */}
          <div className="space-y-2">
            {options.map((option: any, index: number) => {
              const isSelected = selectedOption === option.id;
              let isCorrect = false;
              let isIncorrect = false;
              if (modeIsReview) {
                if (isUnattempted) {
                  isCorrect = option.id === correctId;
                  isIncorrect = false;
                } else {
                  isCorrect = option.id === correctId;
                  isIncorrect = isSelected && !isCorrect;
                }
              }
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    modeIsReview
                      ? isCorrect
                        ? "border-green-500 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-900/40 dark:text-green-100"
                        : isIncorrect
                        ? "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/40 dark:text-red-100"
                        : isSelected
                        ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                        : "border-border hover:border-border/80 hover:bg-accent"
                      : isSelected
                      ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                      : "border-border hover:border-border/80 hover:bg-accent"
                  )}
                >
                  <input
                    type="radio"
                    name={`matching-${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    disabled={modeIsReview}
                    onChange={() => handleOptionSelect(option.id)}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    <LatexRenderer content={option.optionText || ""} />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }
    default:
      return <div>Unsupported question type</div>;
  }
}
