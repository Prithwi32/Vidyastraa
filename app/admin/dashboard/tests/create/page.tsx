"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Filter, Search, X, Loader2 } from "lucide-react";
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

// Mock data for questions
const mockQuestions = [
  {
    id: "1",
    subject: "PHYSICS",
    question:
      "An electromagnetic wave going through vacuum is described by E = E₀sin(kx − ωt). Which of the following is independent of the wavelength?",
    options: ["k", "ω", "k/ω", "kω"],
    correctAnswer: "ω",
    difficulty: "ADVANCED",
  },
  {
    id: "2",
    subject: "PHYSICS",
    question:
      "A particle is moving in a circular path with constant speed. Which of the following statements is correct?",
    options: [
      "The velocity and acceleration of the particle are perpendicular to each other",
      "The velocity and acceleration of the particle are parallel to each other",
      "The velocity and acceleration of the particle make an angle of 45° with each other",
      "The velocity and acceleration of the particle are in opposite directions",
    ],
    correctAnswer:
      "The velocity and acceleration of the particle are perpendicular to each other",
    difficulty: "MODERATE",
  },
  {
    id: "3",
    subject: "CHEMISTRY",
    question: "Which of the following is not a colligative property?",
    options: [
      "Elevation in boiling point",
      "Depression in freezing point",
      "Osmotic pressure",
      "Optical activity",
    ],
    correctAnswer: "Optical activity",
    difficulty: "MODERATE",
  },
  {
    id: "4",
    subject: "CHEMISTRY",
    question: "The IUPAC name of the compound CH₃-CH=CH-CHO is:",
    options: ["But-2-enal", "But-3-enal", "But-2-en-1-al", "But-3-en-1-al"],
    correctAnswer: "But-2-enal",
    difficulty: "BEGINNER",
  },
  {
    id: "5",
    subject: "MATHS",
    question: "If f(x) = x² - 3x + 2, then f'(2) equals:",
    options: ["1", "2", "3", "4"],
    correctAnswer: "1",
    difficulty: "BEGINNER",
  },
  {
    id: "6",
    subject: "MATHS",
    question: "The integral ∫(1/x)dx equals:",
    options: ["log|x| + C", "log(x) + C", "x log|x| + C", "x/log|x| + C"],
    correctAnswer: "log|x| + C",
    difficulty: "MODERATE",
  },
  {
    id: "7",
    subject: "BIOLOGY",
    question: "Which of the following is not a function of the liver?",
    options: [
      "Production of bile",
      "Storage of glycogen",
      "Detoxification of harmful substances",
      "Production of insulin",
    ],
    correctAnswer: "Production of insulin",
    difficulty: "MODERATE",
  },
  {
    id: "8",
    subject: "BIOLOGY",
    question:
      "The process by which plants lose water in the form of water vapor is called:",
    options: ["Transpiration", "Respiration", "Photosynthesis", "Guttation"],
    correctAnswer: "Transpiration",
    difficulty: "BEGINNER",
  },
];

// Mock data for courses
const mockCourses = [
  { id: "1", title: "JEE Advanced Complete Course", category: "JEE" },
  { id: "2", title: "NEET Complete Course", category: "NEET" },
  { id: "3", title: "Physics Crash Course", category: "CRASH_COURSES" },
  { id: "4", title: "Mathematics Foundation", category: "OTHER" },
  { id: "5", title: "Chemistry Mastery", category: "OTHER" },
  { id: "6", title: "Biology Crash Course", category: "CRASH_COURSES" },
  { id: "7", title: "JEE Mains Crash Course", category: "CRASH_COURSES" },
];

export default function CreateTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");

  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<string>("JEE");
  const [testTitle, setTestTitle] = useState<string>("");
  const [testDescription, setTestDescription] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>(
    courseIdParam || ""
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);

  // Set test type based on selected course
  useEffect(() => {
    if (selectedCourse) {
      const course = mockCourses.find((c) => c.id === selectedCourse);
      if (course) {
        setTestType(
          course.category === "NEET"
            ? "NEET"
            : course.category === "JEE"
            ? "JEE"
            : "INDIVIDUAL"
        );
      }
    }
  }, [selectedCourse]);

  // Filter questions based on test type, subject, search query, and difficulty
  const filteredQuestions = mockQuestions.filter((question) => {
    // Filter by test type
    if (testType === "JEE" && question.subject === "BIOLOGY") return false;
    if (testType === "NEET" && question.subject === "MATHS") return false;
    if (
      testType === "INDIVIDUAL" &&
      selectedSubject &&
      question.subject !== selectedSubject
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
  const questionsBySubject: Record<string, typeof mockQuestions> = {};
  filteredQuestions.forEach((question) => {
    if (!questionsBySubject[question.subject]) {
      questionsBySubject[question.subject] = [];
    }
    questionsBySubject[question.subject].push(question);
  });

  // Get total questions by subject
  const totalQuestionsBySubject: Record<string, number> = {};
  mockQuestions.forEach((question) => {
    if (!totalQuestionsBySubject[question.subject]) {
      totalQuestionsBySubject[question.subject] = 0;
    }
    totalQuestionsBySubject[question.subject]++;
  });

  // Get selected questions by subject
  const selectedQuestionsBySubject: Record<string, number> = {};
  selectedQuestions.forEach((id) => {
    const question = mockQuestions.find((q) => q.id === id);
    if (question) {
      if (!selectedQuestionsBySubject[question.subject]) {
        selectedQuestionsBySubject[question.subject] = 0;
      }
      selectedQuestionsBySubject[question.subject]++;
    }
  });

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAllInSubject = (subject: string) => {
    const subjectQuestionIds = questionsBySubject[subject].map((q) => q.id);
    const allSelected = subjectQuestionIds.every((id) =>
      selectedQuestions.includes(id)
    );

    if (allSelected) {
      // Deselect all questions in this subject
      setSelectedQuestions((prev) =>
        prev.filter((id) => !subjectQuestionIds.includes(id))
      );
    } else {
      // Select all questions in this subject
      const newSelectedQuestions = [...selectedQuestions];
      subjectQuestionIds.forEach((id) => {
        if (!newSelectedQuestions.includes(id)) {
          newSelectedQuestions.push(id);
        }
      });
      setSelectedQuestions(newSelectedQuestions);
    }
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

  const handleCreateTest = async () => {
    if (!testTitle) {
      toast.error("Test title is required");
      return;
    }

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question");
      return;
    }

    setLoading(true);

    // Here you would typically send the data to your API
    const testData = {
      title: testTitle,
      category: testType,
      subjects: Object.keys(questionsBySubject).filter((subject) =>
        selectedQuestions.some((id) => {
          const question = mockQuestions.find((q) => q.id === id);
          return question?.subject === subject;
        })
      ),
      description: testDescription,
      courseId: selectedCourse,
      questions: selectedQuestions.map((id) => {
        return {
          questionId: id,
          marks: 4, // Default marks
        };
      }),
    };

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating test with data:", testData);
      toast.success("Test created successfully!");

      setTimeout(() => {
        router.push("/admin/dashboard/tests");
      }, 2000);
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Test</h1>
        <p className="text-muted-foreground">
          Create a new test by selecting questions from the question bank
        </p>
      </div>

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
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {mockCourses.map((course) => (
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
                  <RadioGroupItem value="INDIVIDUAL" id="individual" />
                  <Label htmlFor="individual" className="font-normal">
                    Individual Subject
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

            <div className="pt-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Selected Questions
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Total questions selected: {selectedQuestions.length}
                      </p>
                      {Object.entries(selectedQuestionsBySubject).map(
                        ([subject, count]) => (
                          <p key={subject}>
                            {subject}: {count} /{" "}
                            {totalQuestionsBySubject[subject] || 0} questions
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateTest}
              disabled={
                loading ||
                selectedQuestions.length === 0 ||
                !testTitle ||
                !selectedCourse
              }
            >
              {loading ? (
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
            <Tabs
              defaultValue={Object.keys(questionsBySubject)[0] || "PHYSICS"}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-4 overflow-x-auto">
                {Object.keys(questionsBySubject).map((subject) => (
                  <TabsTrigger
                    key={subject}
                    value={subject}
                    className="flex-shrink-0"
                  >
                    {subject.charAt(0) + subject.slice(1).toLowerCase()}
                    <Badge variant="secondary" className="ml-1.5">
                      {questionsBySubject[subject].length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(questionsBySubject).map(
                ([subject, questions]) => (
                  <TabsContent
                    key={subject}
                    value={subject}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Showing {questions.length} questions
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Selected: {selectedQuestionsBySubject[subject] || 0} /{" "}
                          {questions.length}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAllInSubject(subject)}
                          className="h-8 text-xs"
                        >
                          {questions.every((q) =>
                            selectedQuestions.includes(q.id)
                          )
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {questions.map((question) => (
                        <div
                          key={question.id}
                          className={`rounded-lg border p-3 transition-colors ${
                            selectedQuestions.includes(question.id)
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() =>
                                handleSelectQuestion(question.id)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`px-2 py-0 text-xs ${
                                    question.difficulty === "BEGINNER"
                                      ? "border-green-200 bg-green-50 text-green-700"
                                      : question.difficulty === "MODERATE"
                                      ? "border-amber-200 bg-amber-50 text-amber-700"
                                      : "border-red-200 bg-red-50 text-red-700"
                                  }`}
                                >
                                  {question.difficulty.charAt(0) +
                                    question.difficulty.slice(1).toLowerCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ID: {question.id}
                                </span>
                              </div>
                              <p className="text-sm font-medium">
                                {question.question}
                              </p>
                              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 mt-2">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {String.fromCharCode(65 + index)}.
                                    </span>
                                    <span className="text-xs">
                                      {option}
                                      {option === question.correctAnswer && (
                                        <span className="ml-1 text-green-600">
                                          ✓
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {questions.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                          <div className="rounded-full bg-slate-100 p-3">
                            <X className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="mt-2 text-sm font-medium">
                            No questions found
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Try adjusting your filters or search query
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )
              )}

              {Object.keys(questionsBySubject).length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="rounded-full bg-slate-100 p-3">
                    <X className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium">
                    No questions found
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
