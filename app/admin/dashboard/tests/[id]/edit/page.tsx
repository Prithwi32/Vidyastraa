"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
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
import { getTestById, updateTest } from "@/app/actions/test";
import { getAllCourses } from "@/app/actions/course";

type Course = {
  id: string;
  title: string;
  category: string;
};

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingTest, setFetchingTest] = useState(true);
  const [testType, setTestType] = useState<string>("JEE");
  const [testTitle, setTestTitle] = useState<string>("");
  const [testDuration, setTestDuration] = useState<string>("");
  const [testDescription, setTestDescription] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [subjectRequirements, setSubjectRequirements] = useState<
    Record<string, number>
  >({});
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState<Course[]>([]);
  // Add a new state to track marks for each question
  const [questionMarks, setQuestionMarks] = useState<Record<string, number>>(
    {}
  );


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        await fetchQuestions();
        await getCourses();
        await fetchTest();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [params.id, router]);

  const fetchTest = async () => {
    try {
      const testData: any = await getTestById(params.id as string);

      setTestTitle(testData.title);
      setTestDescription(testData.description || "");
      setTestType(testData.category);
      if (testData.category == "INDIVIDUAL")
        setSelectedSubject(testData.subjects[0]);
      setSelectedCourse(testData.courseId);
      const arr = [];
      const marks: Record<string, number> = {};
      for (let data of testData.questions) {
        arr.push(data.question.id);
        marks[data.question.id] = data.marks;
      }
      setQuestionMarks(marks);
      setSelectedQuestions(arr);

      const questionsCountBySubject: Record<string, number> = {};
      if (testData) {
        testData.questions.forEach((q: any) => {
          const subject = q.question.subject;
          if (!questionsCountBySubject[subject]) {
            questionsCountBySubject[subject] = 0;
          }
          questionsCountBySubject[subject]++;
        });
      }

      setSubjectRequirements(questionsCountBySubject);
    } catch (error) {
      console.error("Error fetching test:", error);
      toast.error("An error occurred while fetching test details");
      router.push("/admin/dashboard/tests");
    } finally {
      setFetchingTest(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      toast.error("Failed to fetch questions");
    }
  };

  const getCourses = async (): Promise<void> => {
    try {
      const res = await getAllCourses();

      if (res.success) {
        setCourses(res.courses as any);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error("Failed to fetch courses:", error);
    }
  };

  // Set test type based on selected course
  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.id === selectedCourse);
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
  const filteredQuestions = questions.filter((question) => {
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
  const questionsBySubject: Record<string, typeof questions> = {};
  filteredQuestions.forEach((question) => {
    if (!questionsBySubject[question.subject]) {
      questionsBySubject[question.subject] = [];
    }
    questionsBySubject[question.subject].push(question);
  });

  // Get total questions by subject
  const totalQuestionsBySubject: Record<string, number> = {};
  questions.forEach((question) => {
    if (!totalQuestionsBySubject[question.subject]) {
      totalQuestionsBySubject[question.subject] = 0;
    }
    totalQuestionsBySubject[question.subject]++;
  });

  // Get selected questions by subject
  const selectedQuestionsBySubject: Record<string, number> = {};
  selectedQuestions.forEach((id) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      if (!selectedQuestionsBySubject[question.subject]) {
        selectedQuestionsBySubject[question.subject] = 0;
      }
      selectedQuestionsBySubject[question.subject]++;
    }
  });

  // Add a function to handle marks changes
  const handleMarksChange = (questionId: string, marks: number) => {
    setQuestionMarks((prev) => ({
      ...prev,
      [questionId]: marks,
    }));
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      } else {
        // Add question with default marks if not already set
        if (!questionMarks[questionId]) {
          setQuestionMarks((prev) => ({
            ...prev,
            [questionId]: 4, // Default marks
          }));
        }
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
      const newQuestionMarks = { ...questionMarks };
      subjectQuestionIds.forEach((id) => {
        if (!newSelectedQuestions.includes(id)) {
          newSelectedQuestions.push(id);
          // Initialize marks if not already set
          if (!newQuestionMarks[id]) {
            newQuestionMarks[id] = 4; // Default marks
          }
        }
      });
      setSelectedQuestions(newSelectedQuestions);
      setQuestionMarks(newQuestionMarks);
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

  const handleSubjectRequirementChange = (subject: string, value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setSubjectRequirements((prev) => ({
      ...prev,
      [subject]: numValue,
    }));
  };

  const areRequirementsMet = () => {
    for (const [subject, required] of Object.entries(subjectRequirements)) {
      if (
        required > 0 &&
        (selectedQuestionsBySubject[subject] || 0) < required
      ) {
        return false;
      }
    }
    return true;
  };

  const handleUpdateTest = async () => {
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

    if (!areRequirementsMet()) {
      toast.error("Please meet all subject requirements");
      return;
    }

    setLoading(true);

    const testData = {
      id: params.id,
      title: testTitle,
      category: testType,
      subjects: Object.keys(questionsBySubject).filter((subject) =>
        selectedQuestions.some((id) => {
          const question = questions.find((q) => q.id === id);
          return question?.subject === subject;
        })
      ),
      description: testDescription,
      courseId: selectedCourse,
      questions: selectedQuestions.map((id) => {
        return {
          questionId: id,
          marks: questionMarks[id] || 4, // Use stored marks or default to 4
        };
      }),
    };

    try {
      await updateTest(params.id as string, testData as any);

      if (toast.success) {
        toast.success("Test updated successfully!");
        setTimeout(() => {
          router.push(`/admin/dashboard/tests/${params.id}/view`);
        }, 800);
      } else toast.error("An unexpected error occurred");
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTest) {
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

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Test</h1>
        <p className="text-muted-foreground">
          Update test details and question selection
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
                <Label htmlFor="test-duration">Test Duration (In Minutes)</Label>
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
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
                        .filter(([_, count]) => count > 0)
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
              onClick={handleUpdateTest}
              disabled={
                loading ||
                selectedQuestions.length === 0 ||
                !testTitle ||
                !selectedCourse ||
                !areRequirementsMet()
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Test"
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
                          {subjectRequirements[subject] > 0 &&
                            ` (${subjectRequirements[subject]} required)`}
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
                              ? "border-blue-300 bg-blue-50 dark:bg-slate-900"
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
                                {/* Add marks selector here */}
                                {selectedQuestions.includes(question.id) && (
                                  <div className="flex items-center ml-auto">
                                    <span className="text-xs text-muted-foreground mr-1">
                                      Marks:
                                    </span>
                                    <div className="flex items-center border rounded-md">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 rounded-none rounded-l-md p-0"
                                        onClick={() =>
                                          handleMarksChange(
                                            question.id,
                                            Math.max(
                                              1,
                                              (questionMarks[question.id] ||
                                                4) - 1
                                            )
                                          )
                                        }
                                        disabled={
                                          (questionMarks[question.id] || 4) <= 1
                                        }
                                      >
                                        <span className="sr-only">
                                          Decrease
                                        </span>
                                        <span className="text-xs">-</span>
                                      </Button>

                                      <Select
                                        value={(
                                          questionMarks[question.id] || 4
                                        ).toString()}
                                        onValueChange={(value) =>
                                          handleMarksChange(
                                            question.id,
                                            Number.parseInt(value)
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-6 w-12 border-0 rounded-none px-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="1">1</SelectItem>
                                          <SelectItem value="2">2</SelectItem>
                                          <SelectItem value="3">3</SelectItem>
                                          <SelectItem value="4">4</SelectItem>
                                        </SelectContent>
                                      </Select>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 rounded-none rounded-r-md p-0"
                                        onClick={() =>
                                          handleMarksChange(
                                            question.id,
                                            Math.min(
                                              4,
                                              (questionMarks[question.id] ||
                                                4) + 1
                                            )
                                          )
                                        }
                                        disabled={
                                          (questionMarks[question.id] || 4) >= 4
                                        }
                                      >
                                        <span className="sr-only">
                                          Increase
                                        </span>
                                        <span className="text-xs">+</span>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm font-medium">
                                {question.question}
                              </p>
                              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 mt-2">
                              {question.options.map((option, index) => {
                                    const optionLetter = String.fromCharCode(
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
                              })}
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
