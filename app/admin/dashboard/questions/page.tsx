"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import MathDisplay from "@/components/math-display";
import { toast } from "react-toastify";
import AddQuestionForm from "./add-question-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
interface ChapterWithQuestions extends Chapter {
  questions: Question[];
}

interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  questions: Question[];
}

type Question = {
  id: string;
  type:
    | "MCQ"
    | "MULTI_SELECT"
    | "ASSERTION_REASON"
    | "FILL_IN_BLANK"
    | "MATCHING";
  questionText: string;
  questionImage: string | null;
  solutionText: string | null;
  solutionImage: string | null;
  difficulty: "BEGINNER" | "MODERATE" | "ADVANCED";
  negativeMarking: number | null;
  partialMarking: boolean | null;
  subject: {
    name: "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY";
  };
  chapter: {
    name: string;
  };
  options: {
    id: string;
    optionText: string | null;
    optionImage: string | null;
    isCorrect: boolean;
  }[];
  matchingPairs?: {
    id: string;
    leftText: string;
    leftImage: string | null;
    rightText: string;
    rightImage: string | null;
  }[];
  correctAnswer?: string;
  createdAt: string;
};

export default function QuestionsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<ChapterWithQuestions[]>([]);
  const [availableChapters, setAvailableChapters] = useState<
    ChapterWithQuestions[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<string>("all");
  const [selectedSolutionOption, setSelectedSolutionOption] = useState<
    Record<string, string>
  >({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const subjects: ("PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY")[] = [
    "PHYSICS",
    "CHEMISTRY",
    "MATHS",
    "BIOLOGY",
  ];
  const difficulties: ("BEGINNER" | "MODERATE" | "ADVANCED")[] = [
    "BEGINNER",
    "MODERATE",
    "ADVANCED",
  ];
  const questionTypes = [
    "all",
    "MCQ",
    "MULTI_SELECT",
    "ASSERTION_REASON",
    "FILL_IN_BLANK",
    "MATCHING",
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchChapters("");
      await fetchQuestions();
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedSubject) {
        await fetchChapters(selectedSubject);
      }
      await fetchQuestions();
    };
    fetchData();
  }, [selectedSubject, selectedChapter, selectedQuestionType]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject) params.append("subject", selectedSubject);
      if (selectedChapter) params.append("chapterId", selectedChapter);
      if (selectedQuestionType !== "all")
        params.append("type", selectedQuestionType);

      const res = await fetch(`/api/questions?${params.toString()}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const fetchedQuestions = Array.isArray(data)
        ? data
        : data.questions || [];

      // Ensure options are properly initialized
      const processedQuestions = fetchedQuestions.map((q) => ({
        ...q,
        options: q.options || [],
        matchingPairs: q.matchingPairs || [],
      }));

      setQuestions(processedQuestions);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (subject: string) => {
    try {
      const res = await fetch(`/api/chapters?subject=${subject}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const chaptersWithQuestions = data.chapters || [];
      setChapters(chaptersWithQuestions);
      setAvailableChapters(chaptersWithQuestions);
    } catch (err) {
      console.error("Error fetching chapters:", err);
      toast.error("❌ Failed to fetch chapters.");
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const method = editingQuestion ? "PATCH" : "POST";
      const url = editingQuestion
        ? `/api/questions/${editingQuestion.id}`
        : "/api/questions";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          negativeMarking:
            data.type === "MCQ" ? data.negativeMarking || -1 : null,
          partialMarking:
            data.type === "MULTI_SELECT" ? data.partialMarking || false : null,
        }),
      });

      if (res.ok) {
        const responseData = await res.json();
        const updatedQuestion = responseData.question;
        toast.success(
          `✅ Question ${editingQuestion ? "updated" : "added"} successfully!`,
          {
            containerId: "main-toast",
          }
        );

        if (editingQuestion) {
          setQuestions((prev) =>
            prev.map((q) => (q.id === editingQuestion.id ? updatedQuestion : q))
          );
        } else {
          setQuestions((prev) => [...prev, updatedQuestion]);
        }

        setEditingQuestion(null);
        setOpen(false);
        fetchQuestions();

        if (selectedSubject) {
          fetchChapters(selectedSubject);
        }
      } else {
        if (!data.solutionText && !data.solutionImage) {
          toast.error(
            "❌ Please provide either a solution text or a solution image.",
            {
              containerId: "main-toast",
            }
          );
          return;
        }

        if (!data.solutionText && data.solutionImage) {
          toast.error(
            "❌ Please provide a solution text also.",
            {
              containerId: "main-toast",
            }
          );
          return;
        }

        if (data.solutionText && data.solutionText.trim().length < 5) {
          toast.error("❌ Solution text must be at least 5 characters long.", {
            containerId: "main-toast",
          });
          return;
        }

        toast.error(`❌ Failed: Unknown error`, {
          containerId: "main-toast",
        });
      }
    } catch (err: any) {
      toast.error(
        `❌ Something went wrong while ${
          editingQuestion ? "updating" : "adding"
        } the question.`,
        {
          containerId: "main-toast",
        }
      );
      console.error("Submission error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("🗑️ Question deleted successfully.", {
          containerId: "main-toast",
        });
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        if (selectedSubject) {
          fetchChapters(selectedSubject);
        }
      } else {
        const errorData = await res.text();
        toast.error("❌ Delete failed: " + errorData);
      }
    } catch (err) {
      toast.error("❌ Delete error: " + (err as any).message);
    } finally {
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    }
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Filter questions by type if selected
  const filteredQuestions =
    selectedQuestionType === "all"
      ? questions
      : questions.filter((q) => q.type === selectedQuestionType);

  // Group questions by chapter
  const questionsByChapter = filteredQuestions.reduce((acc, q) => {
    const chapterName = q.chapter?.name || "Uncategorized";
    if (!acc[chapterName]) {
      acc[chapterName] = [];
    }
    acc[chapterName].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Create chapter objects from grouped questions
  const chaptersWithFilteredQuestions = Object.entries(questionsByChapter)
    .map(([name, questions]) => {
      // Find the actual chapter object if it exists
      const existingChapter = chapters.find((c) => c.name === name);
      return {
        id: existingChapter?.id || `temp-${name}`,
        name,
        subjectId: existingChapter?.subjectId || "",
        questions: questions.filter(
          (q) =>
            q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.solutionText?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      };
    })
    .filter(
      (chapter) =>
        searchQuery === "" ||
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.questions.length > 0
    );

  const openDeleteDialog = (id: string) => {
    setQuestionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const renderQuestionContent = (question: Question) => {
    if (!question) return null;

    // Parse assertion and reason for ASSERTION_REASON type
    let assertion = "";
    let reason = "";

    if (question.type === "ASSERTION_REASON") {
      const parts = question.questionText.split("\n---\n");
      if (parts.length === 2) {
        assertion = parts[0];
        reason = parts[1];
      }
    }

    // Parse matching table headers for MATCHING type
    let matchingHeaders = {
      instruction: "Match List I with List II.",
      headers: {
        left: "List I",
        right: "List II",
        leftSub: "",
        rightSub: "",
      },
    };

    if (question.type === "MATCHING" && question.questionText) {
      try {
        const parsedData = JSON.parse(question.questionText);
        if (parsedData.headers) {
          matchingHeaders = parsedData;
        }
      } catch (e) {
        // If parsing fails, use default headers
      }
    }

    // Parse solution options if available
    let solutionOptions = [];
    let solutionExplanation = question.solutionText || "";

    if (question.solutionText) {
      try {
        const solutionData = JSON.parse(question.solutionText);
        if (solutionData.options && Array.isArray(solutionData.options)) {
          solutionOptions = solutionData.options;
          solutionExplanation = solutionData.explanation || "";
        }
      } catch (e) {
        // If parsing fails, use the text as is
      }
    }

    // Helper function to render options
    const renderOptions = () => {
      if (!question.options || question.options.length === 0) {
        return (
          <div className="text-amber-600 text-sm p-2 bg-amber-50 rounded-md dark:bg-amber-900/20 dark:text-amber-300">
            No options available for this question
          </div>
        );
      }

      return (
        <ul className="list-none space-y-2 mt-2">
          {question.options.map((opt, idx) => (
            <li
              key={opt.id || idx}
              className={`flex items-start gap-2 p-2 rounded-md ${
                opt.isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                {String.fromCharCode(65 + idx)}
              </div>
              <div className="flex-1">
                <div
                  className={`${
                    opt.isCorrect
                      ? "font-medium text-green-700 dark:text-green-400"
                      : ""
                  }`}
                >
                  {opt.optionText ? renderMathContent(opt.optionText) : ""}
                </div>
                {opt.optionImage && (
                  <img
                    src={opt.optionImage || "/placeholder.svg"}
                    alt={`Option ${idx + 1}`}
                    className="mt-2 max-w-[120px] h-auto object-contain border rounded"
                  />
                )}
              </div>
              {opt.isCorrect && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Correct
                </span>
              )}
            </li>
          ))}
        </ul>
      );
    };

    // Helper function to render matching pairs
    const renderMatchingPairs = () => {
      if (!question.matchingPairs || question.matchingPairs.length === 0) {
        return (
          <div className="text-amber-600 text-sm p-2 bg-amber-50 rounded-md dark:bg-amber-900/20 dark:text-amber-300">
            No matching pairs available for this question
          </div>
        );
      }

      return (
        <div className="mt-4">
          <p className="mb-2">{matchingHeaders.instruction}</p>
          <Table className="border-collapse border border-gray-300 dark:border-gray-700">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-300 dark:border-gray-700 w-12"></TableHead>
                <TableHead className="border border-gray-300 dark:border-gray-700 text-center">
                  {matchingHeaders.headers.left}
                  {matchingHeaders.headers.leftSub && (
                    <div className="text-sm font-normal">
                      ({matchingHeaders.headers.leftSub})
                    </div>
                  )}
                </TableHead>
                <TableHead className="border border-gray-300 dark:border-gray-700 w-12"></TableHead>
                <TableHead className="border border-gray-300 dark:border-gray-700 text-center">
                  {matchingHeaders.headers.right}
                  {matchingHeaders.headers.rightSub && (
                    <div className="text-sm font-normal">
                      ({matchingHeaders.headers.rightSub})
                    </div>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {question.matchingPairs.map((pair, index) => (
                <TableRow key={pair.id || index}>
                  <TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
                    {String.fromCharCode(65 + index)}.
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-gray-700">
                    {renderMathContent(pair.leftText)}
                    {pair.leftImage && (
                      <img
                        src={pair.leftImage || "/placeholder.svg"}
                        alt={`Left ${index + 1}`}
                        className="mt-2 max-w-[100px] h-auto object-contain"
                      />
                    )}
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
                    {index + 1}.
                  </TableCell>
                  <TableCell className="border border-gray-300 dark:border-gray-700">
                    {renderMathContent(pair.rightText)}
                    {pair.rightImage && (
                      <img
                        src={pair.rightImage || "/placeholder.svg"}
                        alt={`Right ${index + 1}`}
                        className="mt-2 max-w-[100px] h-auto object-contain"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    };

    // Find the correct answer for FILL_IN_BLANK type
    const correctAnswer =
      question.type === "FILL_IN_BLANK"
        ? question.options?.find((o) => o.isCorrect)?.optionText ||
          question.correctAnswer
        : null;

    // Render solution options
    const renderSolutionOptions = () => {
      if (!solutionOptions || solutionOptions.length === 0) return null;

      return (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Options:</h4>
          <RadioGroup
            value={selectedSolutionOption[question.id] || ""}
            onValueChange={(value) => {
              setSelectedSolutionOption((prev) => ({
                ...prev,
                [question.id]: value,
              }));
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {solutionOptions.map((option, idx) => (
                <div
                  key={idx}
                  className={`border p-3 rounded-md ${
                    option.isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div>
                      <label
                        htmlFor={`solution-${question.id}-${idx}`}
                        className={`font-medium ${
                          option.isCorrect
                            ? "text-green-700 dark:text-green-400"
                            : ""
                        }`}
                      >
                        Option {idx + 1}
                      </label>
                      <div className="text-sm">{option.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {/* Question header with type badge */}
        <div className="flex items-center gap-2">
          <Badge
            className={`
            ${
              question.type === "MCQ"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : ""
            }
            ${
              question.type === "MULTI_SELECT"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                : ""
            }
            ${
              question.type === "ASSERTION_REASON"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                : ""
            }
            ${
              question.type === "FILL_IN_BLANK"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : ""
            }
            ${
              question.type === "MATCHING"
                ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
                : ""
            }
          `}
          >
            {question.type}
          </Badge>

          {question.type === "MCQ" &&
            question.negativeMarking !== null &&
            question.negativeMarking > -1 && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                Negative: {question.negativeMarking}
              </Badge>
            )}

          {question.type === "MULTI_SELECT" && question.partialMarking && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Partial Marking
            </Badge>
          )}
        </div>

        {/* Question content */}
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {question.type === "ASSERTION_REASON" ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-4 border-amber-500">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                  Assertion:
                </h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {renderMathContent(assertion)}
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Reason:
                </h3>
                <div className="text-gray-800 dark:text-gray-200">
                  {renderMathContent(reason)}
                </div>
              </div>
            </div>
          ) : question.type === "MATCHING" ? (
            <>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">
                {matchingHeaders.instruction}
              </h2>
              {renderMatchingPairs()}
            </>
          ) : (
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {renderMathContent(question.questionText)}
            </h2>
          )}

          {question.questionImage && (
            <div className="mt-3">
              <img
                src={question.questionImage || "/placeholder.svg"}
                alt="Question"
                className="max-w-full rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Type-specific content */}
          <div className="mt-4">
            {(question.type === "MCQ" ||
              question.type === "MULTI_SELECT" ||
              question.type === "ASSERTION_REASON") && (
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {question.type === "ASSERTION_REASON"
                    ? "Select the correct statement:"
                    : "Options:"}
                </h3>
                {renderOptions()}
              </div>
            )}

            {question.type === "MATCHING" &&
              question.options &&
              question.options.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correct Matching:
                  </h3>
                  {renderOptions()}
                </div>
              )}

            {question.type === "FILL_IN_BLANK" && correctAnswer && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-4 border-green-500">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">
                  Correct Answer:
                </h3>
                <div className="text-green-700 dark:text-green-400 font-medium">
                  {correctAnswer}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Solution */}
        {(solutionExplanation ||
          question.solutionImage ||
          solutionOptions.length > 0) && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            {solutionOptions.length > 0 && renderSolutionOptions()}

            <h4 className="font-medium text-sm mb-2 mt-4 flex items-center text-gray-700 dark:text-gray-300">
              <Eye className="h-4 w-4 mr-1" /> Solution:
            </h4>

            {solutionExplanation && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                {renderMathContent(solutionExplanation)}
              </div>
            )}

            {question.solutionImage && (
              <img
                src={question.solutionImage || "/placeholder.svg"}
                alt="solution"
                className="mt-3 max-w-full rounded-md border dark:border-gray-700"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-200">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => questionToDelete && handleDelete(questionToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Add Question Dialog */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
            onClick={() => {
              setEditingQuestion(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </section>

      {/* Question Form */}
      <AddQuestionForm
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
        editingQuestion={editingQuestion}
        availableChapters={availableChapters}
        subjects={subjects}
        difficulties={difficulties}
      />

      {/* Filters */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Filter Questions</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Subject filters */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
              Subject:
            </h3>
            <div className="flex flex-wrap gap-3">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => {
                    if (subj === selectedSubject) {
                      setSelectedSubject(null);
                      setSelectedChapter(null);
                    } else {
                      setSelectedSubject(subj);
                      setSelectedChapter(null);
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    selectedSubject === subj
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {subj}
                </button>
              ))}
              {selectedSubject && (
                <button
                  onClick={() => {
                    setSelectedSubject(null);
                    setSelectedChapter(null);
                  }}
                  className="px-4 py-2 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Clear Subject
                </button>
              )}
            </div>
          </div>

          {/* Question type filters */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
              Question Type:
            </h3>
            <Tabs
              value={selectedQuestionType}
              onValueChange={setSelectedQuestionType}
              className="w-full"
            >
              <TabsList className="w-full justify-start overflow-x-auto">
                {questionTypes.map((type) => (
                  <TabsTrigger key={type} value={type} className="capitalize">
                    {type === "all" ? "All Types" : type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Chapter filters - only show if subject is selected */}
          {selectedSubject && chapters.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                Chapter:
              </h3>
              <div className="flex flex-wrap gap-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      if (chapter.id === selectedChapter) {
                        setSelectedChapter(null);
                      } else {
                        setSelectedChapter(chapter.id);
                      }
                    }}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      selectedChapter === chapter.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {chapter.name}
                  </button>
                ))}
                {selectedChapter && (
                  <button
                    onClick={() => setSelectedChapter(null)}
                    className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Clear Chapter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Questions List */}
      <section>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Loading questions...
            </span>
          </div>
        ) : chaptersWithFilteredQuestions.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No questions found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedSubject(null);
                setSelectedChapter(null);
                setSelectedQuestionType("all");
                setSearchQuery("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {chaptersWithFilteredQuestions.map((chapter) => (
              <div
                key={chapter.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div
                  className="flex items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800"
                  onClick={() => toggleChapter(chapter.id)}
                >
                  {expandedChapters[chapter.id] ? (
                    <ChevronDown className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  )}
                  <FolderOpen className="h-5 w-5 mr-2 text-yellow-500" />
                  <h3 className="font-medium text-lg">{chapter.name}</h3>
                  <Badge className="ml-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {chapter.questions.length} questions
                  </Badge>
                </div>

                {expandedChapters[chapter.id] && (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {chapter.questions.map((q) => (
                      <li key={q.id} className="p-5">
                        <div className="flex flex-col">
                          <div className="flex-1 mb-4">
                            {renderQuestionContent(q)}
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-wrap gap-3 items-center text-sm text-gray-600 dark:text-gray-400">
                              <Badge
                                className={
                                  q.difficulty === "BEGINNER"
                                    ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                                    : q.difficulty === "MODERATE"
                                    ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-700 dark:text-amber-300 dark:border-amber-700"
                                    : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                }
                              >
                                {q.difficulty.charAt(0) +
                                  q.difficulty.slice(1).toLowerCase()}
                              </Badge>

                              <p>
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  Subject:
                                </span>{" "}
                                {q.subject?.name ?? "Unknown"}
                              </p>

                              <p>
                                Created:{" "}
                                {new Date(q.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => {
                                  setEditingQuestion(q);
                                  setOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => openDeleteDialog(q.id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function renderMathContent(text: string | null | undefined) {
  if (!text) return null;

  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2);
          return (
            <MathDisplay
              key={index}
              math={math}
              display={true}
              className="my-2"
            />
          );
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return (
            <MathDisplay
              key={index}
              math={math}
              display={false}
              className="inline"
            />
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </>
  );
}
