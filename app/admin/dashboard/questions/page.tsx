"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileUpload from "@/components/admin/FileUpload";
import { toast } from "react-toastify";

export default function QuestionsPage() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [solution, setSolution] = useState("");
  const [subject, setSubject] = useState("PHYSICS");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [questions, setQuestions] = useState([]);
  const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];
  const difficulties = ["BEGINNER", "MODERATE", "ADVANCED"];
  const [editingQuestion, setEditingQuestion] = useState(null);
  const isEditMode = !!editingQuestion;

  useEffect(() => {
    fetchQuestions(selectedSubject);
  }, [selectedSubject]);

  const fetchQuestions = async (subject?: string) => {
    setLoading(true);
    try {
      const url = subject
        ? `/api/questions?subject=${subject}`
        : "/api/questions";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error("❌ Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setSolution("");
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !question.trim() ||
      !correctAnswer.trim() ||
      options.some((opt) => !opt.trim()) ||
      !subject ||
      !difficulty
    ) {
      toast.error("❌ Please fill in all required fields.", {
        containerId: "main-toast",
      });
      return;
    }

    if (solution.trim().length < 5) {
      toast.error("❌ Solution must be at least 5 characters long.", {
        containerId: "main-toast",
      });
      return;
    }

    if (options.length !== 4) {
      toast.error("❌ Exactly 4 options are required.", {
        containerId: "main-toast",
      });
      return;
    }

    const payload = {
      question,
      options,
      correctAnswer,
      solution,
      subject,
      difficulty,
      image,
    };

    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("✅ Question added successfully!", {
          containerId: "main-toast",
        });

        setTimeout(() => {
          resetForm();
          setOpen(false);
          fetchQuestions(selectedSubject);
        }, 500);
      } else {
        const errorData = await res.json();
        toast.error(`❌ Failed: ${errorData.error || "Unknown error"}`, {
          containerId: "main-toast",
        });
      }
    } catch (err: any) {
      toast.error("❌ Something went wrong while adding the question.", {
        containerId: "main-toast",
      });
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
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
        fetchQuestions(selectedSubject);
      } else {
        const errorData = await res.text();
        toast.error("❌ Delete failed: " + errorData);
      }
    } catch (err) {
      toast.error("❌ Delete error: " + (err as any).message);
    }
  };

  const handleUpdateQuestion = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          difficulty,
          question,
          options,
          correctAnswer,
          solution,
          image,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      toast.success("Question updated successfully", {
        containerId: "main-toast",
      });

      // Reset form & state
      setEditingQuestion(null);
      fetchQuestions(selectedSubject);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update question", { containerId: "main-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-200">
      {/* Add Question Dialog */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Question</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Fill out the details to add a new question.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEditMode) {
                    handleUpdateQuestion(editingQuestion.id);
                  } else {
                    handleSubmit(e);
                  }
                }}
                className="space-y-5"
              >
                {/* Subject and Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                        {subjects.map((sub) => (
                          <SelectItem
                            key={sub}
                            value={sub}
                            className="dark:text-gray-200"
                          >
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                        {difficulties.map((level) => (
                          <SelectItem
                            key={level}
                            value={level}
                            className="dark:text-gray-200"
                          >
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Question */}
                <div>
                  <Label>Question</Label>
                  <Textarea
                    placeholder="Type the question here"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <FileUpload onUpload={(url) => setImage(url)} />
                  </div>
                  {image && (
                    <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
                      <img
                        src={image}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Options */}
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {options.map((opt, idx) => (
                      <Input
                        key={idx}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[idx] = e.target.value;
                          setOptions(updated);
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                      />
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <Label>Correct Answer (A/B/C/D)</Label>
                  <Input
                    placeholder="Enter A/B/C/D"
                    value={correctAnswer}
                    onChange={(e) =>
                      setCorrectAnswer(e.target.value.toUpperCase())
                    }
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>

                {/* Solution */}
                <div>
                  <Label>Solution</Label>
                  <Textarea
                    placeholder="Explain the answer here"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    rows={4}
                    className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
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
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                      ? "Update Question"
                      : "Add Question"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Filters */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Filter by Subject</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() =>
                setSelectedSubject(subj === selectedSubject ? null : subj)
              }
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
              onClick={() => setSelectedSubject(null)}
              className="px-4 py-2 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Clear Filter
            </button>
          )}
        </div>
      </section>

      {/* Questions List */}
      <section>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">
            Loading questions...
          </p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No questions found.
          </p>
        ) : (
          <ul className="space-y-6">
            {questions.map((q) => (
              <li
                key={q.id}
                className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow-sm bg-white dark:bg-gray-900"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold text-lg">{q.question}</h2>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="dark:bg-gray-800 dark:text-gray-200"
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingQuestion(q);
                          setSubject(q.subject);
                          setDifficulty(q.difficulty);
                          setQuestion(q.question);
                          setOptions(q.options);
                          setCorrectAnswer(q.correctAnswer);
                          setSolution(q.solution);
                          setImage(q.image || "");
                          setOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {q.image && (
                  <img
                    src={q.image}
                    alt="question"
                    className="mt-3 max-w-full rounded-md border dark:border-gray-700"
                  />
                )}

                <ul className="list-disc pl-6 mt-4 space-y-1 text-sm text-gray-800 dark:text-gray-300">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-3 items-center text-sm text-gray-600 dark:text-gray-400">
                  <Badge
                    className={
                      q.difficulty === "BEGINNER"
                        ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
                        : q.difficulty === "MODERATE"
                        ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-700 dark:text-amber-300 dark:border-amber-700"
                        : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                    }
                  >
                    {" "}
                    {q.difficulty
                      ? q.difficulty.charAt(0) +
                        q.difficulty.slice(1).toLowerCase()
                      : "Unknown"}
                  </Badge>

                  <p>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Answer:
                    </span>{" "}
                    {q.correctAnswer}
                  </p>

                  <p className="ml-auto">
                    Created: {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
