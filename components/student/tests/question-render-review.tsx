"use client"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import LatexRenderer from "./latex-renderer"
import type { QuestionWithStatus } from "@/lib/tests/types"

interface QuestionRendererProps {
  question: QuestionWithStatus
  handleOptionSelect: (optionId: string) => void
  handleFillInBlankChange: (value: string, blankIndex: number) => void
  mode: "test" | "review"
}

export default function QuestionRenderer({
  question,
  handleOptionSelect,
  handleFillInBlankChange,
  mode,
}: QuestionRendererProps) {
  if (!question) return null

  // Get correct options for review mode
  const correctOptions = question.options.filter((opt) => opt.isCorrect)
  const correctOptionIds = correctOptions.map((opt) => opt.id)

  switch (question.type) {
    case "MCQ":
      return (
        <RadioGroup
          value={(question.selectedOption as string) ?? ""}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          {question.options.map((option, index) => {
            const optionId = String.fromCharCode(65 + index)
            const isCorrect = mode === "review" && option.isCorrect
            const isSelected = question.selectedOption === option.id
            const isIncorrect = mode === "review" && isSelected && !option.isCorrect

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isSelected
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40"
                    : "border-border hover:border-border/80 hover:bg-accent",
                  mode === "review" && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/40",
                  mode === "review" && isIncorrect && "border-red-500 bg-red-50 dark:bg-red-900/40",
                )}
              >
                <RadioGroupItem
                  value={option.id}
                  id={`option-${optionId}`}
                  className="text-blue-600 dark:text-blue-400"
                  disabled={mode === "review"}
                />
                <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option.optionText || ""} />
                  {mode === "review" && isCorrect && <span className="ml-2 text-green-600 text-sm">✓ Correct</span>}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      )

    case "MULTI_SELECT":
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const optionId = String.fromCharCode(65 + index)
            const selectedOptions = Array.isArray(question.selectedOption) ? question.selectedOption : []
            const isSelected = selectedOptions.includes(option.id)
            const isCorrect = mode === "review" && option.isCorrect

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isSelected
                    ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40"
                    : "border-border hover:border-border/80 hover:bg-accent",
                  mode === "review" && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/40",
                )}
              >
                <Checkbox
                  id={`option-${optionId}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOptionSelect(option.id)}
                  className="h-5 w-5 rounded-md text-blue-600 dark:text-blue-400"
                  disabled={mode === "review"}
                />
                <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option.optionText || ""} />
                  {mode === "review" && isCorrect && <span className="ml-2 text-green-600 text-sm">✓ Correct</span>}
                </Label>
              </div>
            )
          })}
        </div>
      )

    case "ASSERTION_REASON": {
      const questionText = question?.questionText ?? ""
      const parts = questionText.split(/-{3,}/)

      const assertionRaw = parts[0]?.trim() || ""
      const reasonRaw = parts[1]?.trim() || ""

      const assertion = assertionRaw.replace(/^Assertion:\s*/i, "") || "Assertion not provided."
      const reason = reasonRaw.replace(/^Reason:\s*/i, "") || "Reason not provided."

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Assertion:</h4>
            <div className="rounded-lg bg-muted/50 p-4">
              <LatexRenderer content={assertion} />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Reason:</h4>
            <div className="rounded-lg bg-muted/50 p-4">
              <LatexRenderer content={reason} />
            </div>
          </div>

          <RadioGroup
            value={(question.selectedOption as string) ?? ""}
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const optionId = String.fromCharCode(65 + index)
              const isSelected = question.selectedOption === option.id
              const isCorrect = mode === "review" && option.isCorrect

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                    isSelected
                      ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40"
                      : "border-border hover:border-border/80 hover:bg-accent",
                    mode === "review" && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/40",
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${optionId}`}
                    className="text-blue-600 dark:text-blue-400"
                    disabled={mode === "review"}
                  />
                  <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                    <span className="font-semibold mr-3">{optionId}.</span>
                    <LatexRenderer content={option.optionText || ""} />
                    {mode === "review" && isCorrect && <span className="ml-2 text-green-600 text-sm">✓ Correct</span>}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )
    }

    case "FILL_IN_BLANK": {
      const questionText = question?.questionText ?? ""
      const currentAnswer = Array.isArray(question?.selectedOption)
        ? question.selectedOption[0] || ""
        : question.selectedOption || ""

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
            {mode === "review" && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Correct answer(s): </span>
                <span className="text-green-600">{correctOptions.map((opt) => opt.optionText).join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )
    }

    case "MATCHING": {
      let questionData: any = {
        instruction: "",
        headers: { left: "", right: "" },
      }
      try {
        questionData = JSON.parse(question.questionText || "{}")
      } catch (e) {
        questionData = {
          instruction: question.questionText,
          headers: { left: "", right: "" },
        }
      }

      const selectedOption = question.selectedOption as string
      const matchingPairs = question.matchingPairs || []

      return (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <LatexRenderer content={questionData.instruction} />
          </div>

          {matchingPairs.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 dark:bg-muted/80">
                    <th className="p-3 text-left">{questionData.headers.left || "List I"}</th>
                    <th className="p-3 text-left">{questionData.headers.right || "List II"}</th>
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

          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === option.id
              const isCorrect = mode === "review" && option.isCorrect

              return (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                    isSelected ? "border-primary bg-primary/10 dark:bg-primary/20" : "border-muted",
                    mode === "review" && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/40",
                  )}
                >
                  <input
                    type="radio"
                    name={`matching-${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    disabled={mode === "review"}
                    onChange={() => handleOptionSelect(option.id)}
                    className="mt-1"
                  />
                  <span className="text-sm flex-1">
                    <LatexRenderer content={option.optionText || ""} />
                    {mode === "review" && isCorrect && <span className="ml-2 text-green-600 text-sm">✓ Correct</span>}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }

    default:
      return <div>Unsupported question type</div>
  }
}


