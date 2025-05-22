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
  question: QuestionWithStatus;
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
          {question.options.map((option, index) => {
            const optionId = String.fromCharCode(65 + index);
            const isCorrect =
              mode === "review" &&
              question.options[question.correctAnswer.charCodeAt(0) - 65] ===
                option;
            const isIncorrect =
              mode === "review" &&
              question.selectedOption === option &&
              question.options[question.correctAnswer.charCodeAt(0) - 65] !==
                option;

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  question.selectedOption === option.id
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                    : "border-border hover:border-border/80 hover:bg-accent"
                )}
              >
                <RadioGroupItem
                  value={option.id}
                  id={`option-${optionId}`}
                  className="text-blue-600 dark:text-blue-400"
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
          {question.options.map((option, index) => {
            const optionId = String.fromCharCode(65 + index);
            const isSelected = Array.isArray(question.selectedOption)
              ? question.selectedOption.includes(option.id)
              : false;
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isSelected
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                    : "border-border hover:border-border/80 hover:bg-accent"
                )}
              >
                <Checkbox
                  id={`option-${optionId}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOptionSelect(option.id)}
                  className="h-5 w-5 rounded-md text-blue-600 dark:text-blue-400"
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
            {question.options.map((option, index) => {
              const optionId = String.fromCharCode(65 + index);

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                    question.selectedOption === option.id
                      ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                      : "border-border hover:border-border/80 hover:bg-accent"
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${optionId}`}
                    className="text-blue-600 dark:text-blue-400"
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

      const currentAnswer = Array.isArray(question?.selectedOption)
        ? question.selectedOption[0] || ""
        : "";

      return (
        <div className="space-y-4">
          <div className="text-lg font-medium">Fill in the Blank:</div>
          <div className="text-lg">
            <LatexRenderer content={questionText} />
          </div>

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
                  {matchingPairs.map((pair, idx) => (
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
            {options.map((option, index) => {
              const isSelected = selectedOption === option.id;
              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-muted"
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
