"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-toastify"
import FileUpload from "@/components/admin/FileUpload"
import MathDisplay from "@/components/math-display"

// Define types based on Prisma schema
type QuestionType = "MCQ" | "MULTI_SELECT" | "ASSERTION_REASON" | "FILL_IN_BLANK" | "MATCHING"
type Difficulty = "BEGINNER" | "MODERATE" | "ADVANCED"
type Subject = "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY"

interface Chapter {
  id: string
  name: string
  subjectId: string
}

interface MatchingPair {
  id?: string
  leftText: string
  leftImage?: string | null
  rightText: string
  rightImage?: string | null
}

interface QuestionOption {
  id?: string
  optionText?: string | null
  optionImage?: string | null
  isCorrect: boolean
}

interface QuestionFormProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  editingQuestion: any | null
  availableChapters: Chapter[]
  subjects: Subject[]
  difficulties: Difficulty[]
}

export default function AddQuestionForm({
  open,
  setOpen,
  onSubmit,
  editingQuestion,
  availableChapters,
  subjects,
  difficulties,
}: QuestionFormProps) {
  // Common fields
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ")
  const [questionText, setQuestionText] = useState("")
  const [questionImage, setQuestionImage] = useState<string | null>(null)
  const [solutionText, setSolutionText] = useState("")
  const [solutionImage, setSolutionImage] = useState<string | null>(null)
  const [subject, setSubject] = useState<Subject>("PHYSICS")
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER")
  const [chapter, setChapter] = useState("")
  const [isNewChapter, setIsNewChapter] = useState(false)
  const [loading, setLoading] = useState(false)

  // MCQ and Multi-select fields
  const [options, setOptions] = useState<QuestionOption[]>([
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
  ])

  // Numerical type fields
  const [correctAnswer, setCorrectAnswer] = useState("")

  // Matching type fields
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([
    { leftText: "", leftImage: null, rightText: "", rightImage: null },
    { leftText: "", leftImage: null, rightText: "", rightImage: null },
    { leftText: "", leftImage: null, rightText: "", rightImage: null },
    { leftText: "", leftImage: null, rightText: "", rightImage: null },
  ])

  // Reset form when editing question changes
  useEffect(() => {
    if (editingQuestion) {
      setQuestionType(editingQuestion.type || "MCQ")
      setQuestionText(editingQuestion.questionText || "")
      setQuestionImage(editingQuestion.questionImage || null)
      setSolutionText(editingQuestion.solutionText || "")
      setSolutionImage(editingQuestion.solutionImage || null)
      setSubject(editingQuestion.subject || "PHYSICS")
      setDifficulty(editingQuestion.difficulty || "BEGINNER")
      setChapter(editingQuestion.chapter?.name || "")

      // Set options based on question type
      if (editingQuestion.options && ["MCQ", "MULTI_SELECT", "ASSERTION_REASON"].includes(editingQuestion.type)) {
        setOptions(
          editingQuestion.options.map((opt: any) => ({
            id: opt.id,
            optionText: opt.optionText || "",
            optionImage: opt.optionImage || null,
            isCorrect: opt.isCorrect || false,
          })),
        )
      }

      // Set matching pairs if available
      if (editingQuestion.matchingPairs && editingQuestion.type === "MATCHING") {
        setMatchingPairs(
          editingQuestion.matchingPairs.map((pair: any) => ({
            id: pair.id,
            leftText: pair.leftText || "",
            leftImage: pair.leftImage || null,
            rightText: pair.rightText || "",
            rightImage: pair.rightImage || null,
          })),
        )
      }

      // Set correct answer for numerical questions
      if (editingQuestion.type === "FILL_IN_BLANK") {
        setCorrectAnswer(editingQuestion.correctAnswer || "")
      }
    } else {
      resetForm()
    }
  }, [editingQuestion])

  const resetForm = () => {
    setQuestionType("MCQ")
    setQuestionText("")
    setQuestionImage(null)
    setSolutionText("")
    setSolutionImage(null)
    setSubject("PHYSICS")
    setDifficulty("BEGINNER")
    setChapter("")
    setIsNewChapter(false)
    setOptions([
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
    ])
    setCorrectAnswer("")
    setMatchingPairs([
      { leftText: "", leftImage: null, rightText: "", rightImage: null },
      { leftText: "", leftImage: null, rightText: "", rightImage: null },
      { leftText: "", leftImage: null, rightText: "", rightImage: null },
      { leftText: "", leftImage: null, rightText: "", rightImage: null },
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate common fields
      if (!questionText.trim() || !subject || !difficulty || !chapter.trim()) {
        toast.error("Please fill in all required fields", { containerId: "main-toast" })
        setLoading(false)
        return
      }

      // Validate type-specific fields
      if (questionType === "MCQ" || questionType === "MULTI_SELECT" || questionType === "ASSERTION_REASON") {
        if (options.some((opt) => !opt.optionText?.trim())) {
          toast.error("All options must have text", { containerId: "main-toast" })
          setLoading(false)
          return
        }

        if (questionType === "MCQ" && !options.some((opt) => opt.isCorrect)) {
          toast.error("Please select a correct answer", { containerId: "main-toast" })
          setLoading(false)
          return
        }

        if (questionType === "MULTI_SELECT" && !options.some((opt) => opt.isCorrect)) {
          toast.error("Please select at least one correct answer", { containerId: "main-toast" })
          setLoading(false)
          return
        }
      }

      if (questionType === "FILL_IN_BLANK" && !correctAnswer.trim()) {
        toast.error("Please provide the correct answer", { containerId: "main-toast" })
        setLoading(false)
        return
      }

      if (questionType === "MATCHING") {
        if (matchingPairs.some((pair) => !pair.leftText.trim() || !pair.rightText.trim())) {
          toast.error("All matching pairs must have both left and right values", { containerId: "main-toast" })
          setLoading(false)
          return
        }
      }

      // Prepare payload based on question type
      const payload = {
        type: questionType,
        questionText,
        questionImage,
        solutionText,
        solutionImage,
        subject,
        difficulty,
        chapter,
        options:
          questionType === "MCQ" || questionType === "MULTI_SELECT" || questionType === "ASSERTION_REASON"
            ? options
            : undefined,
        correctAnswer: questionType === "FILL_IN_BLANK" ? correctAnswer : undefined,
        matchingPairs: questionType === "MATCHING" ? matchingPairs : undefined,
      }

      await onSubmit(payload)
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error("Error submitting question:", error)
      toast.error("Failed to save question", { containerId: "main-toast" })
    } finally {
      setLoading(false)
    }
  }

  const handleOptionChange = (index: number, field: keyof QuestionOption, value: any) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const handleMatchingPairChange = (index: number, field: keyof MatchingPair, value: any) => {
    const newPairs = [...matchingPairs]
    newPairs[index] = { ...newPairs[index], [field]: value }
    setMatchingPairs(newPairs)
  }

  // Helper function to render math content
  const renderMathContent = (text: string) => {
    if (!text) return null

    // Simple regex to find math expressions
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g)

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            // Display math
            const math = part.slice(2, -2)
            return <MathDisplay key={index} math={math} display={true} className="my-2" />
          } else if (part.startsWith("$") && part.endsWith("$")) {
            // Inline math
            const math = part.slice(1, -1)
            return <MathDisplay key={index} math={math} display={false} className="inline" />
          } else {
            // Regular text
            return <span key={index}>{part}</span>
          }
        })}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Fill out the details to {editingQuestion ? "update the" : "add a new"} question.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question Type */}
          <div>
            <Label>Question Type</Label>
            <Select value={questionType} onValueChange={(value) => setQuestionType(value as QuestionType)}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                <SelectItem value="MCQ">Multiple Choice Question (MCQ)</SelectItem>
                <SelectItem value="MULTI_SELECT">Multiple Select Question</SelectItem>
                <SelectItem value="ASSERTION_REASON">Assertion and Reason</SelectItem>
                <SelectItem value="FILL_IN_BLANK">Numerical/Fill in the Blank</SelectItem>
                <SelectItem value="MATCHING">Match the Following</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject</Label>
              <Select value={subject} onValueChange={(value) => setSubject(value as Subject)}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                  {difficulties.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Input Field */}
          <div>
            <Label>Chapter</Label>
            {!isNewChapter ? (
              <div className="flex gap-2">
                <Select
                  value={availableChapters.find((chap) => chap.name === chapter)?.id}
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsNewChapter(true)
                      setChapter("")
                    } else {
                      const selectedChapterObject = availableChapters.find((chap) => chap.id === value)
                      if (selectedChapterObject) {
                        setChapter(selectedChapterObject.name)
                      }
                    }
                  }}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 flex-1">
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                    {availableChapters
                      .filter((chap) => chap.subjectId === subject)
                      .map((chap) => (
                        <SelectItem key={chap.id} value={chap.id}>
                          {chap.name}
                        </SelectItem>
                      ))}
                    <SelectItem value="new">+ Create New Chapter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new chapter name"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsNewChapter(false)
                    setChapter("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div>
            <Label>Question</Label>
            <Textarea
              placeholder="Type the question here. Use $ for inline math and $$ for display math."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            {questionText && (
              <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
                <div className="question-preview">{renderMathContent(questionText)}</div>
              </div>
            )}
          </div>

          {/* Question Image Upload */}
          <div onClick={(e) => e.stopPropagation()}>
            <FileUpload onUpload={(url) => setQuestionImage(url)} label="Question Image (Optional)" />
            {questionImage && (
              <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
                <img src={questionImage || "/placeholder.svg"} alt="Question" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Question Type Specific Fields */}
          {(questionType === "MCQ" || questionType === "MULTI_SELECT") && (
            <div>
              <Label>
                {questionType === "MCQ"
                  ? "Options (Select one correct answer)"
                  : "Options (Select all correct answers)"}
              </Label>
              <div className="space-y-3 mt-2">
                {options.map((option, index) => (
                  <div key={index} className="border rounded-md p-3 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="pt-2">
                        {questionType === "MCQ" ? (
                          <RadioGroup value={options.findIndex((o) => o.isCorrect).toString()}>
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                              checked={option.isCorrect}
                              onClick={() => {
                                const newOptions = options.map((opt, i) => ({
                                  ...opt,
                                  isCorrect: i === index,
                                }))
                                setOptions(newOptions)
                              }}
                            />
                          </RadioGroup>
                        ) : (
                          <Checkbox
                            id={`option-${index}`}
                            checked={option.isCorrect}
                            onCheckedChange={(checked) => {
                              handleOptionChange(index, "isCorrect", checked)
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label htmlFor={`option-text-${index}`}>Option {String.fromCharCode(65 + index)}</Label>
                          <Input
                            id={`option-text-${index}`}
                            placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                            value={option.optionText || ""}
                            onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                          />
                          {option.optionText && (
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {renderMathContent(option.optionText)}
                            </div>
                          )}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <FileUpload
                            onUpload={(url) => handleOptionChange(index, "optionImage", url)}
                            label={`Option ${String.fromCharCode(65 + index)} Image (Optional)`}
                          />
                          {option.optionImage && (
                            <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                              <img
                                src={option.optionImage || "/placeholder.svg"}
                                alt={`Option ${String.fromCharCode(65 + index)}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionType === "ASSERTION_REASON" && (
            <div>
              <Label>Assertion and Reason Options</Label>
              <div className="space-y-3 mt-2">
                <div className="border rounded-md p-3 dark:border-gray-700">
                  <RadioGroup value={options.findIndex((o) => o.isCorrect).toString()}>
                    {[
                      "Both Assertion and Reason are true and Reason is the correct explanation of Assertion",
                      "Both Assertion and Reason are true but Reason is not the correct explanation of Assertion",
                      "Assertion is true but Reason is false",
                      "Assertion is false but Reason is true",
                      "Both Assertion and Reason are false",
                    ].map((text, index) => (
                      <div key={index} className="flex items-start space-x-2 py-2">
                        <RadioGroupItem
                          value={index.toString()}
                          id={`ar-option-${index}`}
                          checked={options[index]?.isCorrect}
                          onClick={() => {
                            const newOptions = options.map((opt, i) => ({
                              ...opt,
                              optionText: i < 5 ? text : opt.optionText,
                              isCorrect: i === index,
                            }))
                            setOptions(newOptions)
                          }}
                        />
                        <Label htmlFor={`ar-option-${index}`} className="font-normal">
                          {String.fromCharCode(65 + index)}. {text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {questionType === "FILL_IN_BLANK" && (
            <div>
              <Label>Correct Answer</Label>
              <Input
                placeholder="Enter the correct numerical answer or text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
          )}

          {questionType === "MATCHING" && (
            <div>
              <Label>Matching Pairs</Label>
              <div className="space-y-3 mt-2">
                {matchingPairs.map((pair, index) => (
                  <div key={index} className="border rounded-md p-3 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Left Item {index + 1}</Label>
                        <Input
                          placeholder={`Enter left item ${index + 1}`}
                          value={pair.leftText}
                          onChange={(e) => handleMatchingPairChange(index, "leftText", e.target.value)}
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                        <div onClick={(e) => e.stopPropagation()}>
                          <FileUpload
                            onUpload={(url) => handleMatchingPairChange(index, "leftImage", url)}
                            label={`Left Item ${index + 1} Image (Optional)`}
                          />
                          {pair.leftImage && (
                            <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                              <img
                                src={pair.leftImage || "/placeholder.svg"}
                                alt={`Left ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Right Item {index + 1}</Label>
                        <Input
                          placeholder={`Enter right item ${index + 1}`}
                          value={pair.rightText}
                          onChange={(e) => handleMatchingPairChange(index, "rightText", e.target.value)}
                          className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        />
                        <div onClick={(e) => e.stopPropagation()}>
                          <FileUpload
                            onUpload={(url) => handleMatchingPairChange(index, "rightImage", url)}
                            label={`Right Item ${index + 1} Image (Optional)`}
                          />
                          {pair.rightImage && (
                            <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                              <img
                                src={pair.rightImage || "/placeholder.svg"}
                                alt={`Right ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution */}
          <div>
            <Label>Solution</Label>
            <Textarea
              placeholder="Explain the solution here. Use $ for inline math and $$ for display math."
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={3}
              className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            {solutionText && (
              <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
                <div className="solution-preview">{renderMathContent(solutionText)}</div>
              </div>
            )}
          </div>

          {/* Solution Image Upload */}
          <div onClick={(e) => e.stopPropagation()}>
            <FileUpload onUpload={(url) => setSolutionImage(url)} label="Solution Image (Optional)" />
            {solutionImage && (
              <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
                <img src={solutionImage || "/placeholder.svg"} alt="Solution" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 dark:bg-gray-600"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              {loading
                ? editingQuestion
                  ? "Updating..."
                  : "Adding..."
                : editingQuestion
                  ? "Update Question"
                  : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
