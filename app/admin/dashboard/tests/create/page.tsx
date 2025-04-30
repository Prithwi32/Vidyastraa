"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Filter,
  Search,
  X,
  Loader2,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/Loader";
import { createTest } from "@/app/actions/test";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type Course = {
  id: string;
  title: string;
  category: string;
};

type Chapter = {
  id: string;
  name: string;
  subjectId: string;
  questions: Question[];
};

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution: string;
  difficulty: "BEGINNER" | "MODERATE" | "ADVANCED";
  subject: string;
  chapter: {
    id: string;
    name: string;
  };
  image: string | null;
  createdAt: string;
};

export default function CreateTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");
  const [loading, setLoading] = useState(true);
  const [testLoader, setTestLoader] = useState(false);
  const [testType, setTestType] = useState<string>("JEE");
  const [testTitle, setTestTitle] = useState<string>("");
  const [testDuration, setTestDuration] = useState<string>("");
  const [testDescription, setTestDescription] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>(
    courseIdParam || ""
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjectRequirements, setSubjectRequirements] = useState<
    Record<string, number>
  >({});
  const [questionMarks, setQuestionMarks] = useState<Record<string, number>>(
    {}
  );
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const subjects: string[] = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];
  const difficulties: ("BEGINNER" | "MODERATE" | "ADVANCED")[] = [
    "BEGINNER",
    "MODERATE",
    "ADVANCED",
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
  }, [selectedSubject, selectedChapter]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = "/api/questions";
      const params = new URLSearchParams();

      if (selectedSubject) {
        params.append("subject", selectedSubject);
      }

      if (selectedChapter) {
        params.append("chapterId", selectedChapter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();

      const questionsArray = Array.isArray(data) ? data : data.questions || [];
      setQuestions(questionsArray);
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error("❌ Failed to fetch questions.");
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
      const chaptersData = Array.isArray(data) ? data : data.chapters || [];
      setChapters(chaptersData);
    } catch (err) {
      console.error("Error fetching chapters:", err);
      toast.error("❌ Failed to fetch chapters.");
    }
  };

  const resetForm = () => {
    setTestTitle("");
    setTestDuration("");
    setTestDescription("");
    setSelectedQuestions([]);
    setQuestionMarks({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !testTitle.trim() ||
      !testDuration.trim() ||
      !selectedCourse ||
      selectedQuestions.length === 0
    ) {
      toast.error("❌ Please fill in all required fields.");
      return;
    }

    if (!areRequirementsMet()) {
      toast.error("❌ Please meet all subject requirements.");
      return;
    }

    setTestLoader(true);

    const testData = {
      title: testTitle,
      duration: testDuration,
      category: testType,
      subjects: Object.keys(questionsBySubject).filter((subject) =>
        selectedQuestions.some((id) => {
          const question = questions.find((q) => q.id === id);
          return question?.subject === subject;
        })
      ),
      description: testDescription,
      courseId: selectedCourse,
      subjectRequirements,
      questions: selectedQuestions.map((id) => {
        return {
          questionId: id,
          marks: questionMarks[id] || 4,
        };
      }),
    };

    try {
      const res = await createTest(testData as any);

      if (res.success) {
        toast.success("Test created successfully!");

        setTimeout(() => {
          router.push("/admin/dashboard/tests");
        }, 900);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setTestLoader(false);
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        // Initialize marks to 4 when selecting a question
        if (!questionMarks[questionId]) {
          setQuestionMarks((prevMarks) => ({
            ...prevMarks,
            [questionId]: 4,
          }));
        }
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAllInChapter = (
    chapterId: string,
    questions: Question[]
  ) => {
    const chapterQuestionIds = questions.map((q) => q.id);
    const allSelected = chapterQuestionIds.every((id) =>
      selectedQuestions.includes(id)
    );

    if (allSelected) {
      // Deselect all questions in this chapter
      setSelectedQuestions((prev) =>
        prev.filter((id) => !chapterQuestionIds.includes(id))
      );
    } else {
      // Select all questions in this chapter
      const newSelectedQuestions = [...selectedQuestions];
      chapterQuestionIds.forEach((id) => {
        if (!newSelectedQuestions.includes(id)) {
          newSelectedQuestions.push(id);
          // Initialize marks to 4 for newly selected questions
          if (!questionMarks[id]) {
            setQuestionMarks((prevMarks) => ({
              ...prevMarks,
              [id]: 4,
            }));
          }
        }
      });
      setSelectedQuestions(newSelectedQuestions);
    }
  };

  const handleMarksChange = (questionId: string, marks: number) => {
    setQuestionMarks((prevMarks) => ({
      ...prevMarks,
      [questionId]: marks,
    }));
  };

  const handleDifficultyFilterChange = (difficulty: string) => {
    setDifficultyFilter((prev) => {
      if (prev.includes(difficulty)) {
        return prev.filter((d) => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter([]);
  };

  const handleSubjectRequirementChange = (subject: string, value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setSubjectRequirements((prev) => ({
      ...prev,
      [subject]: numValue,
    }));
  };

  const areRequirementsMet = () => {
    const relevantSubjects =
      testType === "JEE"
        ? ["PHYSICS", "CHEMISTRY", "MATHS"]
        : testType === "NEET"
        ? ["PHYSICS", "CHEMISTRY", "BIOLOGY"]
        : testType === "INDIVIDUAL" && selectedSubject
        ? [selectedSubject]
        : Object.keys(subjectRequirements);

    return relevantSubjects.every((subject) => {
      const required = subjectRequirements[subject] || 0;
      const selected = selectedQuestionsBySubject[subject] || 0;
      return selected >= required;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Filter questions based on test type, subject, search query, and difficulty
  const filteredQuestions = questions.filter((question) => {
    // Filter by test type
    if (testType === "JEE" && question.subject.name === "BIOLOGY") return false;
    if (testType === "NEET" && question.subject.name === "MATHS") return false;
    if (
      testType === "INDIVIDUAL" &&
      selectedSubject &&
      question.subject.name !== selectedSubject
    )
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !question.question.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by difficulty
    if (
      difficultyFilter.length > 0 &&
      !difficultyFilter.includes(question.difficulty)
    )
      return false;

    return true;
  });

  // Group questions by subject
  const questionsBySubject: Record<string, Question[]> = {};
  filteredQuestions.forEach((question) => {
    const subjectName = question.subject.name;
    if (!questionsBySubject[subjectName]) {
      questionsBySubject[subjectName] = [];
    }
    questionsBySubject[subjectName].push(question);
  });

  // Group questions by chapter within each subject
  const questionsBySubjectAndChapter: Record<
    string,
    Record<string, Question[]>
  > = {};

  Object.keys(questionsBySubject).forEach((subject) => {
    questionsBySubjectAndChapter[subject] = {};

    questionsBySubject[subject].forEach((question) => {
      const chapterId = question.chapter?.id || "uncategorized";
      const chapterName = question.chapter?.name || "Uncategorized";

      if (!questionsBySubjectAndChapter[subject][chapterId]) {
        questionsBySubjectAndChapter[subject][chapterId] = [];
      }

      questionsBySubjectAndChapter[subject][chapterId].push(question);
    });
  });

  // Get total questions by subject
  const totalQuestionsBySubject: Record<string, number> = {};
  questions.forEach((question) => {
    const subjectName = question.subject.name;
    if (!totalQuestionsBySubject[subjectName]) {
      totalQuestionsBySubject[subjectName] = 0;
    }
    totalQuestionsBySubject[subjectName]++;
  });

  // Get selected questions by subject
  const selectedQuestionsBySubject: Record<string, number> = {};
  selectedQuestions.forEach((id) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      const subjectName = question.subject.name;
      if (!selectedQuestionsBySubject[subjectName]) {
        selectedQuestionsBySubject[subjectName] = 0;
      }
      selectedQuestionsBySubject[subjectName]++;
    }
  });

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Test</h1>
        <p className="text-muted-foreground">
          Create a new test by selecting questions from the question bank
        </p>
      </div>

      {!loading && (
        <div className="grid gap-6 md:grid-cols-5">
          {/* Test Configuration */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>
                Configure the basic details of your test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-title">Test Title</Label>
                <Input
                  id="test-title"
                  placeholder="Enter test title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-duration">
                  Test Duration (In Minutes)
                </Label>
                <Input
                  id="test-duration"
                  placeholder="Enter test duration"
                  value={testDuration}
                  onChange={(e) => setTestDuration(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-description">Description (Optional)</Label>
                <Input
                  id="test-description"
                  placeholder="Enter test description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Test Type</Label>
                <RadioGroup
                  value={testType}
                  onValueChange={setTestType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="JEE" id="jee" />
                    <Label htmlFor="jee" className="font-normal">
                      JEE (Physics, Chemistry, Mathematics)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NEET" id="neet" />
                    <Label htmlFor="neet" className="font-normal">
                      NEET (Physics, Chemistry, Biology)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CRASH_COURSES" id="CRASH_COURSES" />
                    <Label htmlFor="CRASH_COURSES" className="font-normal">
                      CRASH COURSES
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OTHER" id="OTHER" />
                    <Label htmlFor="OTHER" className="font-normal">
                      OTHER
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INDIVIDUAL" id="individual" />
                    <Label htmlFor="individual" className="font-normal">
                      INDIVIDUAL SUBJECT
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {testType === "INDIVIDUAL" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Select Subject</Label>
                  <Select
                    value={selectedSubject || ""}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHYSICS">Physics</SelectItem>
                      <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
                      <SelectItem value="MATHS">Mathematics</SelectItem>
                      <SelectItem value="BIOLOGY">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Subject Requirements</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Specify the minimum number of questions required for each
                  subject
                </p>

                {(testType === "JEE"
                  ? ["PHYSICS", "CHEMISTRY", "MATHS"]
                  : testType === "NEET"
                  ? ["PHYSICS", "CHEMISTRY", "BIOLOGY"]
                  : testType === "INDIVIDUAL" && selectedSubject
                  ? [selectedSubject]
                  : ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]
                ).map((subject) => (
                  <div key={subject} className="flex items-center gap-2">
                    <Label htmlFor={`req-${subject}`} className="w-24">
                      {subject.charAt(0) + subject.slice(1).toLowerCase()}
                    </Label>
                    <Input
                      id={`req-${subject}`}
                      type="number"
                      min="0"
                      placeholder="Required"
                      value={subjectRequirements[subject] || ""}
                      onChange={(e) =>
                        handleSubjectRequirementChange(subject, e.target.value)
                      }
                      className="w-24"
                    />
                    <span className="text-xs text-muted-foreground">
                      Selected: {selectedQuestionsBySubject[subject] || 0} /{" "}
                      {totalQuestionsBySubject[subject] || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div
                  className={`rounded-md ${
                    areRequirementsMet() ? "bg-blue-50" : "bg-amber-50"
                  } p-4`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {areRequirementsMet() ? (
                        <Check className="h-5 w-5 text-blue-600" />
                      ) : (
                        <X className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Selected Questions
                      </h3>
                      <h3
                        className={`text-sm font-medium ${
                          areRequirementsMet()
                            ? "text-blue-800"
                            : "text-amber-800"
                        }`}
                      >
                        {areRequirementsMet()
                          ? "Requirements Met"
                          : "Requirements Not Met"}
                      </h3>
                      <div
                        className={`mt-2 text-sm ${
                          areRequirementsMet()
                            ? "text-blue-700"
                            : "text-amber-700"
                        }`}
                      >
                        <p>
                          Total questions selected: {selectedQuestions.length}
                        </p>
                        {Object.entries(subjectRequirements)
                          .filter(([subject, count]) => {
                            if (count <= 0) return false;
                            // Only include subjects relevant to the current test type
                            if (testType === "JEE")
                              return ["PHYSICS", "CHEMISTRY", "MATHS"].includes(
                                subject
                              );
                            if (testType === "NEET")
                              return [
                                "PHYSICS",
                                "CHEMISTRY",
                                "BIOLOGY",
                              ].includes(subject);
                            if (testType === "INDIVIDUAL")
                              return subject === selectedSubject;
                            if (
                              testType === "CRASH_COURSES" ||
                              testType === "OTHER"
                            )
                              return true;
                            return false;
                          })
                          .map(([subject, required]) => (
                            <p key={subject}>
                              {subject}:{" "}
                              {selectedQuestionsBySubject[subject] || 0} /{" "}
                              {required} required
                              {(selectedQuestionsBySubject[subject] || 0) <
                                required && " ⚠️"}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  selectedQuestions.length === 0 ||
                  !testTitle ||
                  !testDuration ||
                  !selectedCourse ||
                  !areRequirementsMet()
                }
              >
                {testLoader ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Test"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Question Selection */}
          {/* Question Selection Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Select Questions</CardTitle>
              <CardDescription>
                Choose questions to include in your test
              </CardDescription>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                      {difficultyFilter.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 rounded-sm px-1 font-normal"
                        >
                          {difficultyFilter.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleDifficultyFilterChange("BEGINNER")}
                      >
                        <Checkbox
                          checked={difficultyFilter.includes("BEGINNER")}
                          className="mr-2 h-4 w-4"
                        />
                        <span>Beginner</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDifficultyFilterChange("MODERATE")}
                      >
                        <Checkbox
                          checked={difficultyFilter.includes("MODERATE")}
                          className="mr-2 h-4 w-4"
                        />
                        <span>Moderate</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDifficultyFilterChange("ADVANCED")}
                      >
                        <Checkbox
                          checked={difficultyFilter.includes("ADVANCED")}
                          className="mr-2 h-4 w-4"
                        />
                        <span>Advanced</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={clearFilters}
                      className="justify-center text-blue-600"
                    >
                      Clear Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue={subjects[0]} className="w-full">
                <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                  {subjects
                    .filter((subject) => {
                      if (testType === "JEE") return subject !== "BIOLOGY";
                      if (testType === "NEET") return subject !== "MATHS";
                      if (testType === "INDIVIDUAL" && selectedSubject)
                        return subject === selectedSubject;
                      return true;
                    })
                    .map((subject) => {
                      const subjectQuestions = filteredQuestions.filter(
                        (q) => q.subject.name === subject
                      );
                      return (
                        <TabsTrigger
                          key={subject}
                          value={subject}
                          className="flex-shrink-0"
                          disabled={subjectQuestions.length === 0}
                        >
                          {subject.charAt(0) + subject.slice(1).toLowerCase()}
                          <Badge variant="secondary" className="ml-1.5">
                            {subjectQuestions.length}
                          </Badge>
                        </TabsTrigger>
                      );
                    })}
                </TabsList>

                {subjects
                  .filter((subject) => {
                    if (testType === "JEE") return subject !== "BIOLOGY";
                    if (testType === "NEET") return subject !== "MATHS";
                    if (testType === "INDIVIDUAL" && selectedSubject)
                      return subject === selectedSubject;
                    return true;
                  })
                  .map((subject) => {
                    const subjectQuestions = filteredQuestions.filter(
                      (q) => q.subject.name === subject
                    );

                    // Group questions by chapter for this subject
                    const questionsByChapter: Record<string, Question[]> = {};
                    subjectQuestions.forEach((question) => {
                      const chapterId = question.chapter?.id || "uncategorized";
                      if (!questionsByChapter[chapterId]) {
                        questionsByChapter[chapterId] = [];
                      }
                      questionsByChapter[chapterId].push(question);
                    });

                    return (
                      <TabsContent
                        key={subject}
                        value={subject}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Showing {subjectQuestions.length} questions in{" "}
                            {Object.keys(questionsByChapter).length} chapters
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            Selected: {selectedQuestionsBySubject[subject] || 0}{" "}
                            / {subjectRequirements[subject] || 0} required
                          </span>
                        </div>

                        <div className="space-y-4">
                          {Object.entries(questionsByChapter).map(
                            ([chapterId, chapterQuestions]) => {
                              const chapterName =
                                chapterQuestions[0]?.chapter?.name ||
                                "Uncategorized";
                              const isExpanded =
                                expandedChapters[chapterId] || false;
                              const allSelected = chapterQuestions.every((q) =>
                                selectedQuestions.includes(q.id)
                              );

                              return (
                                <div
                                  key={chapterId}
                                  className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden"
                                >
                                  <div
                                    className="flex items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800"
                                    onClick={() => toggleChapter(chapterId)}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                                    )}
                                    <FolderOpen className="h-5 w-5 mr-2 text-yellow-500" />
                                    <h3 className="font-medium text-lg flex-1">
                                      {chapterName}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        {chapterQuestions.length} questions
                                      </Badge>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectAllInChapter(
                                            chapterId,
                                            chapterQuestions
                                          );
                                        }}
                                        className="h-8 text-xs"
                                      >
                                        {allSelected
                                          ? "Deselect All"
                                          : "Select All"}
                                      </Button>
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="space-y-3 p-4">
                                      {chapterQuestions.map((question) => (
                                        <div
                                          key={question.id}
                                          className={`rounded-lg border p-3 transition-colors ${
                                            selectedQuestions.includes(
                                              question.id
                                            )
                                              ? "border-blue-300 bg-blue-50 dark:bg-slate-900"
                                              : "border-gray-200 hover:border-gray-300"
                                          }`}
                                        >
                                          <div className="flex items-start gap-3">
                                            <Checkbox
                                              checked={selectedQuestions.includes(
                                                question.id
                                              )}
                                              onCheckedChange={() =>
                                                handleSelectQuestion(
                                                  question.id
                                                )
                                              }
                                              className="mt-1"
                                            />
                                            <div className="flex-1 space-y-1">
                                              <div className="flex items-center gap-2">
                                                <Badge
                                                  variant="outline"
                                                  className={`px-2 py-0 text-xs ${
                                                    question.difficulty ===
                                                    "BEGINNER"
                                                      ? "border-green-200 bg-green-50 text-green-700"
                                                      : question.difficulty ===
                                                        "MODERATE"
                                                      ? "border-amber-200 bg-amber-50 text-amber-700"
                                                      : "border-red-200 bg-red-50 text-red-700"
                                                  }`}
                                                >
                                                  {question.difficulty.charAt(
                                                    0
                                                  ) +
                                                    question.difficulty
                                                      .slice(1)
                                                      .toLowerCase()}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                  ID: {question.id}
                                                </span>
                                                {/* Marks selector */}
                                                {selectedQuestions.includes(
                                                  question.id
                                                ) && (
                                                  <div className="flex items-center ml-auto">
                                                    <span className="text-xs font-medium mr-2">
                                                      Marks:
                                                    </span>
                                                    <div className="flex items-center border rounded-md">
                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-none"
                                                        onClick={() => {
                                                          const currentMarks =
                                                            questionMarks[
                                                              question.id
                                                            ] || 4;
                                                          if (
                                                            currentMarks > 1
                                                          ) {
                                                            handleMarksChange(
                                                              question.id,
                                                              currentMarks - 1
                                                            );
                                                          }
                                                        }}
                                                        disabled={
                                                          (questionMarks[
                                                            question.id
                                                          ] || 4) <= 1
                                                        }
                                                      >
                                                        <Minus className="h-3 w-3" />
                                                        <span className="sr-only">
                                                          Decrease
                                                        </span>
                                                      </Button>

                                                      <Select
                                                        value={(
                                                          questionMarks[
                                                            question.id
                                                          ] || 4
                                                        ).toString()}
                                                        onValueChange={(
                                                          value
                                                        ) =>
                                                          handleMarksChange(
                                                            question.id,
                                                            Number.parseInt(
                                                              value
                                                            )
                                                          )
                                                        }
                                                      >
                                                        <SelectTrigger className="h-6 w-12 border-0 focus:ring-0 focus:ring-offset-0 p-0 pl-2">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          <SelectItem value="1">
                                                            1
                                                          </SelectItem>
                                                          <SelectItem value="2">
                                                            2
                                                          </SelectItem>
                                                          <SelectItem value="3">
                                                            3
                                                          </SelectItem>
                                                          <SelectItem value="4">
                                                            4
                                                          </SelectItem>
                                                        </SelectContent>
                                                      </Select>

                                                      <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-none"
                                                        onClick={() => {
                                                          const currentMarks =
                                                            questionMarks[
                                                              question.id
                                                            ] || 4;
                                                          if (
                                                            currentMarks < 4
                                                          ) {
                                                            handleMarksChange(
                                                              question.id,
                                                              currentMarks + 1
                                                            );
                                                          }
                                                        }}
                                                        disabled={
                                                          (questionMarks[
                                                            question.id
                                                          ] || 4) >= 4
                                                        }
                                                      >
                                                        <Plus className="h-3 w-3" />
                                                        <span className="sr-only">
                                                          Increase
                                                        </span>
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <p className="text-sm font-medium">
                                                {question.question}
                                              </p>
                                              {question.image && (
                                                <div className="mb-6">
                                                  <div className="relative w-full h-48 rounded-md my-4 overflow-hidden">
                                                    <Image
                                                      src={
                                                        question.image ||
                                                        "https://ui.shadcn.com/placeholder.svg" ||
                                                        "/placeholder.svg"
                                                      }
                                                      alt="Question image"
                                                      fill
                                                      className="object-contain"
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 mt-2">
                                                {question.options.map(
                                                  (option, index) => {
                                                    const optionLetter =
                                                      String.fromCharCode(
                                                        65 + index
                                                      );
                                                    return (
                                                      <span
                                                        key={index}
                                                        className="text-xs block"
                                                      >
                                                        {option}
                                                        {optionLetter ===
                                                          question.correctAnswer && (
                                                          <span className="ml-1 text-green-600">
                                                            ✓
                                                          </span>
                                                        )}
                                                      </span>
                                                    );
                                                  }
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}

                          {subjectQuestions.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                              <div className="rounded-full bg-slate-100 p-3">
                                <X className="h-6 w-6 text-slate-400" />
                              </div>
                              <h3 className="mt-2 text-sm font-medium">
                                No questions found for {subject.toLowerCase()}
                              </h3>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Try adjusting your filters or search query
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    );
                  })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {loading && (
        <div className="w-full h-[200px] flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
