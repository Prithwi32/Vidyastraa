"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Eye, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import "katex/dist/katex.min.css"
import { InlineMath, BlockMath } from "react-katex"

function LatexRenderer({ content }: { content: string }) {
  if (!content) return null

  // Split content by LaTeX blocks (either inline $...$ or block $$...$$)
  const parts = content.split(/(\$[^$]*\$)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1)
          // Check if it's block math (double $$)
          if (part.startsWith("$$") && part.endsWith("$$")) {
            return <BlockMath key={index} math={latex} />
          }
          try {
            return <InlineMath key={index} math={latex} />
          } catch (e) {
            console.error("Error rendering LaTeX:", e)
            return <span key={index}>{part}</span>
          }
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

export default function TestResultView({ result, test }) {
  const router = useRouter()
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  // Group questions by subject
  const questionsBySubject = result.responses.reduce((acc, response) => {
    const question = test.questions.find((q) => q.id === response.questionId)
    if (!question) return acc

    const subjectName = question.subject.name
    if (!acc[subjectName]) {
      acc[subjectName] = []
    }

    acc[subjectName].push({
      ...question,
      response,
    })

    return acc
  }, {})

  // Calculate subject-wise performance
  const subjectPerformance = Object.entries(questionsBySubject).map(([subject, questions]) => {
    const totalQuestions = questions.length
    const correctAnswers = questions.filter((q) => q.response.isCorrect).length
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

    return {
      subject,
      totalQuestions,
      correctAnswers,
      percentage,
    }
  })

  // Filter questions to display
  const questionsToDisplay = selectedSubject
    ? questionsBySubject[selectedSubject]
    : result.responses.map((response) => {
        const question = test.questions.find((q) => q.id === response.questionId)
        return { ...question, response }
      })

  // Limit questions if not showing all
  const displayedQuestions = showAllQuestions ? questionsToDisplay : questionsToDisplay.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="bg-muted rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{test.title} - Results</CardTitle>
              <p className="text-muted-foreground mt-1">
                Completed on {new Date(result.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => router.push("/student/dashboard/tests")}>
              <ArrowLeft className="h-4 w-4" /> Back to Tests
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{result.score.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.correct}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{result.wrong}</div>
              <div className="text-sm text-muted-foreground">Incorrect Answers</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Subject Performance</h3>

            <div className="space-y-3">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.subject}</span>
                    <span>
                      {subject.correctAnswers}/{subject.totalQuestions} ({subject.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedSubject === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedSubject(null)}
        >
          All Questions
        </Button>

        {Object.keys(questionsBySubject).map((subject) => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </Button>
        ))}
      </div>

      {/* Questions Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Question Review</h2>
          <Button variant="link" onClick={() => setShowAllQuestions(!showAllQuestions)}>
            {showAllQuestions ? "Show Less" : "Show All"}
          </Button>
        </div>

        {displayedQuestions.map((question, index) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{question.subject.name}</Badge>
                  <Badge variant="outline">{question.type.replace(/_/g, " ")}</Badge>
                  {question.response.isCorrect ? (
                    <Badge className="bg-green-500">Correct</Badge>
                  ) : (
                    <Badge className="bg-red-500">Incorrect</Badge>
                  )}
                </div>
                <div className="text-sm">
                  {question.response.marksAwarded} / {question.marks} marks
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Question */}
                <div>
                  <div className="font-medium mb-2">Question {index + 1}:</div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <LatexRenderer content={question.questionText} />

                    {question.questionImage && (
                      <div className="mt-2">
                        <img
                          src={question.questionImage || "/placeholder.svg"}
                          alt="Question"
                          className="max-h-48 object-contain mx-auto rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* User's Answer */}
                <div>
                  <div className="font-medium mb-2">Your Answer:</div>
                  <div
                    className={`p-3 rounded-md ${
                      question.response.isCorrect
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {question.type === "MCQ" && (
                      <div className="flex items-center gap-2">
                        {question.response.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <span>
                          {question.response.answer && question.response.answer.length > 0 ? (
                            <LatexRenderer content={question.response.answer[0]} />
                          ) : (
                            "No answer provided"
                          )}
                        </span>
                      </div>
                    )}

                    {question.type === "MULTI_SELECT" && (
                      <div className="space-y-2">
                        {question.response.answer && question.response.answer.length > 0 ? (
                          question.response.answer.map((ans, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <LatexRenderer content={ans} />
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <span>No answer provided</span>
                          </div>
                        )}
                      </div>
                    )}

                    {question.type === "FILL_IN_BLANK" && (
                      <div className="flex items-center gap-2">
                        {question.response.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <span>
                          {question.response.answer && question.response.answer.length > 0 ? (
                            <LatexRenderer content={question.response.answer[0]} />
                          ) : (
                            "No answer provided"
                          )}
                        </span>
                      </div>
                    )}

                    {question.type === "MATCHING" && (
                      <div className="space-y-2">
                        {question.response.answer && question.response.answer.length > 0 ? (
                          question.response.answer.map((ans, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {ans.isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                              )}
                              <span>
                                {ans.left} → {ans.right}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <span>No answer provided</span>
                          </div>
                        )}
                      </div>
                    )}

                    {question.type === "ASSERTION_REASON" && (
                      <div className="flex items-center gap-2">
                        {question.response.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <span>
                          {question.response.answer && question.response.answer.length > 0 ? (
                            <LatexRenderer content={question.response.answer[0]} />
                          ) : (
                            "No answer provided"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Correct Answer (if wrong) */}
                {!question.response.isCorrect && (
                  <div>
                    <div className="font-medium mb-2">Correct Answer:</div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-md">
                      {question.type === "MCQ" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <LatexRenderer content={question.options.find((o) => o.isCorrect)?.text || ""} />
                        </div>
                      )}

                      {question.type === "MULTI_SELECT" && (
                        <div className="space-y-2">
                          {question.options
                            .filter((o) => o.isCorrect)
                            .map((option, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <LatexRenderer content={option.text || ""} />
                              </div>
                            ))}
                        </div>
                      )}

                      {question.type === "FILL_IN_BLANK" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <LatexRenderer content={question.options.find((o) => o.isCorrect)?.text || ""} />
                        </div>
                      )}

                      {question.type === "MATCHING" && (
                        <div className="space-y-2">
                          {question.matchingPairs?.map((pair, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <span>
                                {pair.leftText} → {pair.rightText}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "ASSERTION_REASON" && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <LatexRenderer content={question.options.find((o) => o.isCorrect)?.text || ""} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Solution */}
                {question.solutionText && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 mb-2"
                      onClick={() => {
                        // Toggle solution visibility logic
                        const solutionEl = document.getElementById(`solution-${question.id}`)
                        if (solutionEl) {
                          solutionEl.classList.toggle("hidden")
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" /> View Solution
                    </Button>

                    <div id={`solution-${question.id}`} className="hidden">
                      <div className="bg-muted p-3 rounded-md">
                        <LatexRenderer content={question.solutionText} />

                        {question.solutionImage && (
                          <div className="mt-2">
                            <img
                              src={question.solutionImage || "/placeholder.svg"}
                              alt="Solution"
                              className="max-h-48 object-contain mx-auto rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 pt-3">
              <div className="text-sm text-muted-foreground">Question ID: {question.id}</div>
            </CardFooter>
          </Card>
        ))}

        {!showAllQuestions && questionsToDisplay.length > 5 && (
          <Button variant="outline" className="w-full" onClick={() => setShowAllQuestions(true)}>
            Show All {questionsToDisplay.length} Questions
          </Button>
        )}
      </div>
    </div>
  )
}
