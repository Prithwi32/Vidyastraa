"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleHelpIcon,
  ClipboardList,
  Edit,
  Loader2,
  TimerIcon,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteTest, getTestById } from "@/app/actions/test";
import { QuestionDetailModal } from "@/components/QuestionDetailModal";
import { BlockMath, InlineMath } from "react-katex";

function LatexRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Split content by LaTeX blocks (either inline $...$ or block $$...$$)
  const parts = content.split(/(\$[^$]*\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1);
          // Check if it's block math (double $$)
          if (part.startsWith("$$") && part.endsWith("$$")) {
            return <BlockMath key={index} math={latex} />;
          }
          try {
            return <InlineMath key={index} math={latex} />;
          } catch (e) {
            console.error("Error rendering LaTeX:", e);
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export default function ViewTestPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testData = await getTestById(params.id as string);
        setTest(testData);
      } catch (error) {
        console.error("Error fetching test:", error);
        toast.error("An error occurred while fetching test details");
        router.push("/admin/dashboard/tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.id, router]);

  const handleDeleteTest = async () => {
    setDeleting(true);

    try {
      const res = await deleteTest(params.id as string);
      if (res.success) {
        toast.success("Test deleted successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard/tests");
        }, 800);
      } else {
        toast.error("An error occurred while deleting test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("An unexpected error occurred");
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Group questions by subject
  const questionsBySubject: Record<string, any[]> = {};
  if (test) {
    test.questions.forEach((q: any) => {
      const subjectName =
        q.question.subject?.name || q.question.subject || "UNKNOWN";

      if (!questionsBySubject[subjectName]) {
        questionsBySubject[subjectName] = [];
      }
      questionsBySubject[subjectName].push(q);
    });
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">
            Loading test details...
          </p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold">Test not found</h2>
        <p className="text-muted-foreground mb-4">
          The test you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/dashboard/tests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tests
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
          <p className="text-muted-foreground">{test.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard/tests")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/dashboard/tests/${params.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Test</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this test? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteTest}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Test"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Test Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Test Overview</CardTitle>
              <CardDescription>
                Detailed information about the test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Category
                  </h3>
                  <Badge
                    variant="outline"
                    className={`${
                      test.category === "JEE"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : test.category === "NEET"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-purple-200 bg-purple-50 text-purple-700"
                    }`}
                  >
                    {test.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Subjects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {test.subjects.map((subject: string) => (
                      <Badge key={subject} variant="secondary">
                        {subject.charAt(0) + subject.slice(1).toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Course
                  </h3>
                  <p>{test.course.title}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Created On
                  </h3>
                  <p>{formatDate(test.createdAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Question Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(questionsBySubject).map(
                    ([subject, questions]) => (
                      <div key={subject} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className={`${
                              subject === "PHYSICS"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : subject === "CHEMISTRY"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : subject === "MATHS"
                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                            }`}
                          >
                            {subject.charAt(0) + subject.slice(1).toLowerCase()}
                          </Badge>
                          <span className="text-sm font-medium">
                            {questions.length} questions
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total marks:{" "}
                          {questions.reduce((sum, q) => sum + q.marks, 0)}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Required: {questions.length} questions
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Questions</CardTitle>
              <CardDescription>
                All questions included in this test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-center">Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {test.questions.map((q: any, index: number) => (
                      <TableRow
                        key={q.question.id}
                        onClick={() => setSelectedQuestion(q.question)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md truncate">
                            {q.question.type === "MATCHING" ? (
                              <>
                                {(() => {
                                  try {
                                    const matchData = JSON.parse(
                                      q.question.questionText
                                    );
                                    const pairsPreview =
                                      q.question.matchingPairs
                                        ?.slice(0, 2)
                                        .map(
                                          (pair) =>
                                            `${pair.leftText} → ${pair.rightText}`
                                        )
                                        .join(", ");

                                    return (
                                      <span className="text-muted-foreground">
                                        {matchData.instruction || "Match items"}{" "}
                                        - {pairsPreview}
                                        {q.question.matchingPairs?.length > 2 &&
                                          "..."}
                                      </span>
                                    );
                                  } catch {
                                    // Fallback if JSON parsing fails
                                    const fallbackPairs =
                                      q.question.matchingPairs
                                        ?.slice(0, 2)
                                        .map(
                                          (pair) =>
                                            `${pair.leftText} → ${pair.rightText}`
                                        )
                                        .join(", ");

                                    return (
                                      <span className="text-muted-foreground">
                                        Match the following - {fallbackPairs}
                                        {q.question.matchingPairs?.length > 2 &&
                                          "..."}
                                      </span>
                                    );
                                  }
                                })()}
                              </>
                            ) : (
                              <LatexRenderer
                                content={q.question.questionText}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {q.question.subject.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {q.question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{q.marks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <QuestionDetailModal
              question={selectedQuestion}
              open={!!selectedQuestion}
              onOpenChange={(open) => !open && setSelectedQuestion(null)}
            />
          </Card>
        </div>

        {/* Test Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Total Questions</span>
                </div>
                <span className="font-medium">{test.questions.length}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <CircleHelpIcon className="mr-2 h-4 w-4" />
                  <span>Total Marks</span>
                </div>
                <span className="font-medium">
                  {test.questions.reduce(
                    (sum: number, q: any) => sum + q.marks,
                    0
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <TimerIcon className="mr-2 h-4 w-4" />
                  <span>Total Duration</span>
                </div>
                <span className="font-medium">{test.duration}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Subject Distribution</h3>
                {Object.entries(questionsBySubject).map(
                  ([subject, questions]) => (
                    <div
                      key={subject}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {subject.charAt(0) + subject.slice(1).toLowerCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${
                              subject === "PHYSICS"
                                ? "bg-blue-500"
                                : subject === "CHEMISTRY"
                                ? "bg-green-500"
                                : subject === "MATHS"
                                ? "bg-purple-500"
                                : "bg-amber-500"
                            }`}
                            style={{
                              width: `${
                                (questions.length / test.questions.length) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round(
                            (questions.length / test.questions.length) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Difficulty Distribution</h3>
                {["BEGINNER", "MODERATE", "ADVANCED", "UNKNOWN"].map(
                  (difficulty) => {
                    const count = test.questions.filter(
                      (q: any) => q.question.difficulty === difficulty
                    ).length;
                    const percentage = (count / test.questions.length) * 100;

                    return (
                      <div
                        key={difficulty}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {difficulty.charAt(0) +
                            difficulty.slice(1).toLowerCase()}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-100">
                            <div
                              className={`h-2 rounded-full ${
                                difficulty === "BEGINNER"
                                  ? "bg-green-500"
                                  : difficulty === "MODERATE"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  window.open(`/api/export/tests/${test.id}`);
                  toast.success("Test exported successfully!");
                }}
              >
                Export Test
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/admin/dashboard/tests/${params.id}/edit`)
                }
              >
                Edit Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
