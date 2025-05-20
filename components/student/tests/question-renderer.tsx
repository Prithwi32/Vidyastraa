"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
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

  switch (question.type) {
    case "MCQ":
      return (
        <RadioGroup value={question.selectedOption ?? ""} onValueChange={handleOptionSelect} className="space-y-3">
          {question.options.map((option, index) => {
            const optionId = String.fromCharCode(65 + index)
            const isCorrect =
              mode === "review" && question.options[question.correctAnswer.charCodeAt(0) - 65] === option
            const isIncorrect =
              mode === "review" &&
              question.selectedOption === option &&
              question.options[question.correctAnswer.charCodeAt(0) - 65] !== option

            return (
              <div
                key={optionId}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isCorrect
                    ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100"
                    : isIncorrect
                      ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100"
                      : question.selectedOption === option
                        ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                        : "border-border hover:border-border/80 hover:bg-accent",
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
                        : "text-blue-600 dark:text-blue-400",
                  )}
                  disabled={mode === "review"}
                />
                <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option} />
                </Label>

                {isCorrect && <Badge className="ml-2 bg-green-500 dark:bg-green-600">Correct</Badge>}

                {isIncorrect && <Badge className="ml-2 bg-red-500 dark:bg-red-600">Incorrect</Badge>}
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
            const isSelected = Array.isArray(question.selectedOption) ? question.selectedOption.includes(option) : false
            const isCorrect =
              mode === "review" && Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionId)
            const isIncorrect =
              mode === "review" &&
              isSelected &&
              Array.isArray(question.correctAnswer) &&
              !question.correctAnswer.includes(optionId)

            return (
              <div
                key={optionId}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isCorrect
                    ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100"
                    : isIncorrect
                      ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100"
                      : isSelected
                        ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                        : "border-border hover:border-border/80 hover:bg-accent",
                )}
              >
                <Checkbox
                  id={`option-${optionId}`}
                  checked={isSelected}
                  onCheckedChange={() => handleOptionSelect(option)}
                  className={cn(
                    "h-5 w-5 rounded-md",
                    isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : isIncorrect
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400",
                  )}
                  disabled={mode === "review"}
                />
                <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                  <span className="font-semibold mr-3">{optionId}.</span>
                  <LatexRenderer content={option} />
                </Label>

                {isCorrect && <Badge className="ml-2 bg-green-500 dark:bg-green-600">Correct</Badge>}

                {isIncorrect && <Badge className="ml-2 bg-red-500 dark:bg-red-600">Incorrect</Badge>}
              </div>
            )
          })}
        </div>
      )

    case "ASSERTION_REASON":
      const questionText = question?.question ?? ""

      // Use regex or flexible split
      const parts = questionText.split(/-{3,}/) // splits on '---' with or without spaces/newlines

      // Clean up parts
      const assertionRaw = parts[0]?.trim() || ""
      const reasonRaw = parts[1]?.trim() || ""

      // Extract actual text after "Assertion:" and "Reason:" if present
      const assertion = assertionRaw.replace(/^Assertion:\s*/i, "") || "Assertion not provided."
      const reason = reasonRaw.replace(/^Reason:\s*/i, "") || "Reason not provided."

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

          <RadioGroup value={question.selectedOption ?? ""} onValueChange={handleOptionSelect} className="space-y-3">
            {question.options.map((option, index) => {
              const optionId = String.fromCharCode(65 + index)
              const isCorrect =
                mode === "review" && question.options[question.correctAnswer.charCodeAt(0) - 65] === option
              const isIncorrect =
                mode === "review" &&
                question.selectedOption === option &&
                question.options[question.correctAnswer.charCodeAt(0) - 65] !== option

              return (
                <div
                  key={optionId}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                    isCorrect
                      ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100"
                      : isIncorrect
                        ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100"
                        : question.selectedOption === option
                          ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                          : "border-border hover:border-border/80 hover:bg-accent",
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
                          : "text-blue-600 dark:text-blue-400",
                    )}
                    disabled={mode === "review"}
                  />
                  <Label htmlFor={`option-${optionId}`} className="flex-1 cursor-pointer text-base font-medium">
                    <span className="font-semibold mr-3">{optionId}.</span>
                    <LatexRenderer content={option} />
                  </Label>

                  {isCorrect && <Badge className="ml-2 bg-green-500 dark:bg-green-600">Correct</Badge>}

                  {isIncorrect && <Badge className="ml-2 bg-red-500 dark:bg-red-600">Incorrect</Badge>}
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )

    case "FILL_IN_BLANK": {
      const questionText = question?.question ?? ""

      const currentAnswer = Array.isArray(question?.selectedOption) ? question.selectedOption[0] || "" : ""

      const correctAnswer = Array.isArray(question?.correctAnswer) ? question.correctAnswer[0] : question?.correctAnswer

      return (
        <div className="space-y-4">
          <div className="text-lg font-medium">Fill in the Blank:</div>
          <div className="text-lg">{questionText}</div>

          <div className="relative">
            <Input
              id="blank-0"
              value={currentAnswer}
              placeholder="Enter your answer here..."
              onChange={(e) => handleFillInBlankChange(e.target.value, 0)}
              className={cn(
                "text-base h-12 w-full",
                mode === "review" && correctAnswer?.trim() === currentAnswer?.trim()
                  ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/40 text-green-900 dark:text-green-100"
                  : mode === "review"
                    ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/40 text-red-900 dark:text-red-100"
                    : "border-border",
              )}
              disabled={mode === "review"}
            />

            {mode === "review" && correctAnswer?.trim() === currentAnswer?.trim() && (
              <Badge className="absolute right-2 top-2 bg-green-500 dark:bg-green-600">Correct</Badge>
            )}

            {mode === "review" && correctAnswer?.trim() !== currentAnswer?.trim() && (
              <>
                <Badge className="absolute right-2 top-2 bg-red-500 dark:bg-red-600">Incorrect</Badge>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">Correct Answer: {correctAnswer}</div>
              </>
            )}
          </div>
        </div>
      )
    }

    case "MATCHING":
      try {
        const questionData = JSON.parse(question.question) // contains instruction & headers
        const options = question.options || []
        const correctAnswer = question.correctAnswer
        const selectedOption = question.selectedOption
        const modeIsReview = mode === "review"

        return (
          <div className="space-y-4">
            {/* Instruction */}
            <div className="rounded-lg bg-muted/50 p-4">
              <LatexRenderer content={questionData.instruction} />
            </div>

            {/* Matching Table (Visual Aid only) */}
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 dark:bg-muted/80">
                    <th className="p-3 text-left">
                      {questionData.headers.left || "List I"}
                      {questionData.headers.leftSub && (
                        <div className="text-xs text-muted-foreground">{questionData.headers.leftSub}</div>
                      )}
                    </th>
                    <th className="p-3 text-left">
                      {questionData.headers.right || "List II"}
                      {questionData.headers.rightSub && (
                        <div className="text-xs text-muted-foreground">{questionData.headers.rightSub}</div>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Just render dummy rows A-D and 1-4 for visual matching (optional) */}
                  {["A", "B", "C", "D"].map((item, index) => (
                    <tr key={item} className="border-b">
                      <td className="p-3 font-medium">Item {item}</td>
                      <td className="p-3 font-medium">Option {index + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Options to select (radio buttons) */}
            <div className="space-y-2">
              {options.map((option, index) => {
                const isSelected = selectedOption === option
                const isCorrect = correctAnswer === option

                return (
                  <label
                    key={index}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                      modeIsReview
                        ? isCorrect
                          ? "bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-700"
                          : isSelected
                            ? "bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-700"
                            : "border-muted"
                        : isSelected
                          ? "border-primary bg-primary/10 dark:bg-primary/20"
                          : "border-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name={`matching-${question.id}`}
                      value={option}
                      checked={isSelected}
                      disabled={modeIsReview}
                      onChange={() => handleOptionSelect(option)}
                      className="mt-1"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                )
              })}
            </div>

            {/* Correct Answer Display in Review Mode */}
            {modeIsReview && correctAnswer && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">Correct Answer:</h4>
                <div className="font-mono text-sm">{correctAnswer}</div>
              </div>
            )}
          </div>
        )
      } catch (e) {
        console.error("Error parsing matching question:", e)
        return (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 font-medium">Error displaying matching question</div>
            <div className="mt-2 text-sm text-red-800 dark:text-red-300">{question.question}</div>
          </div>
        )
      }

    default:
      return <div>Unsupported question type</div>
  }
}
