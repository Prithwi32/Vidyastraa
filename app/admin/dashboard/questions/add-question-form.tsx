"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import FileUpload from "@/components/admin/FileUpload";
import MathDisplay from "@/components/math-display";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define types based on Prisma schema
type QuestionType =
  | "MCQ"
  | "MULTI_SELECT"
  | "ASSERTION_REASON"
  | "FILL_IN_BLANK"
  | "MATCHING";
type Difficulty = "BEGINNER" | "MODERATE" | "ADVANCED";
type Subject = "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY";

interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  subject?: { name: Subject } | null;
}

interface MatchingPair {
  id?: string;
  leftText: string;
  leftImage?: string | null;
  rightText: string;
  rightImage?: string | null;
  order: number;
}

interface QuestionOption {
  id?: string;
  optionText?: string | null;
  optionImage?: string | null;
  isCorrect: boolean;
}

interface QuestionFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  editingQuestion: any | null;
  subjects: Subject[];
  difficulties: Difficulty[];
}

export default function AddQuestionForm({
  open,
  setOpen,
  onSubmit,
  editingQuestion,
  subjects,
  difficulties,
}: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<QuestionType>("MCQ");
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState("");
  const [solutionImage, setSolutionImage] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject>("PHYSICS");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [chapter, setChapter] = useState("");
  const [isNewChapter, setIsNewChapter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableChapters, setAvailableChapters] = useState<Chapter[]>([]);

  // MCQ and Multi-select fields
  const [options, setOptions] = useState<QuestionOption[]>([
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
    { optionText: "", optionImage: null, isCorrect: false },
  ]);

  // Assertion-Reason fields
  const [assertion, setAssertion] = useState("");
  const [reason, setReason] = useState("");
  const [arOption, setArOption] = useState<number>(-1);

  // Numerical type fields
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Matching type fields
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([
    {
      leftText: "",
      leftImage: null,
      rightText: "",
      rightImage: null,
      order: 0,
    },
    {
      leftText: "",
      leftImage: null,
      rightText: "",
      rightImage: null,
      order: 1,
    },
    {
      leftText: "",
      leftImage: null,
      rightText: "",
      rightImage: null,
      order: 2,
    },
    {
      leftText: "",
      leftImage: null,
      rightText: "",
      rightImage: null,
      order: 3,
    },
  ]);

  // Table headers for matching
  const [leftColumnHeader, setLeftColumnHeader] = useState("List I");
  const [rightColumnHeader, setRightColumnHeader] = useState("List II");
  const [leftColumnSubheader, setLeftColumnSubheader] = useState("");
  const [rightColumnSubheader, setRightColumnSubheader] = useState("");

  // Reset form when editing question changes
  // useEffect(() => {
  //   if (editingQuestion) {
  //     setQuestionType(editingQuestion.type || "MCQ");

  //     if (editingQuestion.type === "ASSERTION_REASON") {
  //       // Parse assertion and reason from questionText if it contains the delimiter
  //       const parts = editingQuestion.questionText.split("\n---\n");
  //       if (parts.length === 2) {
  //         setAssertion(parts[0]);
  //         setReason(parts[1]);
  //       } else {
  //         setQuestionText(editingQuestion.questionText || "");
  //       }

  //       // Find the correct option index
  //       const correctOptionIndex =
  //         editingQuestion.options?.findIndex((opt: any) => opt.isCorrect) || -1;
  //       setArOption(correctOptionIndex);
  //     } else {
  //       setQuestionText(editingQuestion.questionText || "");
  //     }

  //     setQuestionImage(editingQuestion.questionImage || null);
  //     setSolutionText(editingQuestion.solutionText || null);
  //     setSolutionImage(editingQuestion.solutionImage || null);
  //     setSubject(editingQuestion.subject?.name || "PHYSICS");
  //     setDifficulty(editingQuestion.difficulty || "BEGINNER");
  //     setChapter(editingQuestion.chapter?.name || "");

  //     // Set options based on question type
  //     if (editingQuestion.options) {
  //       // Preserve the original order by sorting if needed
  //       const orderedOptions = [...editingQuestion.options].sort((a, b) => {
  //         // Add any sorting logic if your options have an order field
  //         return 0; // Default to original order
  //       });
  //       setOptions(orderedOptions);
  //     }

  //     if (
  //       editingQuestion.options &&
  //       ["MCQ", "MULTI_SELECT", "ASSERTION_REASON"].includes(
  //         editingQuestion.type
  //       )
  //     ) {
  //       setOptions(
  //         editingQuestion.options.map((opt: any) => ({
  //           id: opt.id,
  //           optionText: opt.optionText || "",
  //           optionImage: opt.optionImage || null,
  //           isCorrect: opt.isCorrect || false,
  //         }))
  //       );

  //       // Extract solution options from solutionText if available
  //       setSolutionText(editingQuestion.solutionText || "");
  //     }

  //     // Set matching pairs if available
  //     if (
  //       editingQuestion.matchingPairs &&
  //       editingQuestion.type === "MATCHING"
  //     ) {
  //       setMatchingPairs(
  //         editingQuestion.matchingPairs.map((pair: any) => ({
  //           id: pair.id,
  //           leftText: pair.leftText || "",
  //           leftImage: pair.leftImage || null,
  //           rightText: pair.rightText || "",
  //           rightImage: pair.rightImage || null,
  //         }))
  //       );

  //       // Try to extract table headers from questionText
  //       try {
  //         const tableData = JSON.parse(editingQuestion.questionText);
  //         if (tableData.headers) {
  //           setLeftColumnHeader(tableData.headers.left || "List I");
  //           setRightColumnHeader(tableData.headers.right || "List II");
  //           setLeftColumnSubheader(tableData.headers.leftSub || "");
  //           setRightColumnSubheader(tableData.headers.rightSub || "");
  //           setQuestionText(
  //             tableData.instruction || "Match List I with List II."
  //           );
  //         }
  //       } catch (e) {
  //         // If not JSON, just use the text as is
  //         setQuestionText(editingQuestion.questionText);
  //       }

  //       // Set options for matching questions if available
  //       if (editingQuestion.options && editingQuestion.options.length > 0) {
  //         setOptions(
  //           editingQuestion.options.map((opt: any) => ({
  //             id: opt.id,
  //             optionText: opt.optionText || "",
  //             optionImage: opt.optionImage || null,
  //             isCorrect: opt.isCorrect || false,
  //           }))
  //         );
  //       }
  //     }

  //     // Set correct answer for numerical questions
  //     if (editingQuestion.type === "FILL_IN_BLANK") {
  //       // Find the correct option
  //       const correctOpt = editingQuestion.options?.find(
  //         (opt: any) => opt.isCorrect
  //       );
  //       setCorrectAnswer(correctOpt?.optionText || "");
  //     }
  //   } else {
  //     resetForm();
  //   }
  // }, [editingQuestion]);

  // Remove this standalone block (it's causing the error)
// if (editingQuestion.matchingPairs && editingQuestion.type === "MATCHING") {
//   setMatchingPairs(
//     editingQuestion.matchingPairs
//       .map((pair: any) => ({
//         id: pair.id,
//         leftText: pair.leftText || "",
//         leftImage: pair.leftImage || null,
//         rightText: pair.rightText || "",
//         rightImage: pair.rightImage || null,
//         order: pair.order || 0, // Default to 0 if order is missing
//       }))
//       .sort((a, b) => a.order - b.order) // Sort by order
//   );
// }

// Update the useEffect that handles editingQuestion changes
useEffect(() => {
  if (editingQuestion) {
    setQuestionType(editingQuestion.type || "MCQ");

    if (editingQuestion.type === "ASSERTION_REASON") {
      // Parse assertion and reason from questionText if it contains the delimiter
      const parts = editingQuestion.questionText.split("\n---\n");
      if (parts.length === 2) {
        setAssertion(parts[0]);
        setReason(parts[1]);
      } else {
        setQuestionText(editingQuestion.questionText || "");
      }

      // Find the correct option index
      const correctOptionIndex =
        editingQuestion.options?.findIndex((opt: any) => opt.isCorrect) || -1;
      setArOption(correctOptionIndex);
    } else {
      setQuestionText(editingQuestion.questionText || "");
    }

    setQuestionImage(editingQuestion.questionImage || null);
    setSolutionText(editingQuestion.solutionText || null);
    setSolutionImage(editingQuestion.solutionImage || null);
    setSubject(editingQuestion.subject?.name || "PHYSICS");
    setDifficulty(editingQuestion.difficulty || "BEGINNER");
    setChapter(editingQuestion.chapter?.name || "");

    // Set options based on question type
    if (editingQuestion.options) {
      // Preserve the original order by sorting if needed
      const orderedOptions = [...editingQuestion.options].sort((a, b) => {
        // Add any sorting logic if your options have an order field
        return 0; // Default to original order
      });
      setOptions(orderedOptions);
    }

    if (
      editingQuestion.options &&
      ["MCQ", "MULTI_SELECT", "ASSERTION_REASON"].includes(
        editingQuestion.type
      )
    ) {
      setOptions(
        editingQuestion.options.map((opt: any) => ({
          id: opt.id,
          optionText: opt.optionText || "",
          optionImage: opt.optionImage || null,
          isCorrect: opt.isCorrect || false,
        }))
      );

      // Extract solution options from solutionText if available
      setSolutionText(editingQuestion.solutionText || "");
    }

    // Set matching pairs if available
    if (
      editingQuestion.matchingPairs &&
      editingQuestion.type === "MATCHING"
    ) {
      setMatchingPairs(
        editingQuestion.matchingPairs
          .map((pair: any) => ({
            id: pair.id,
            leftText: pair.leftText || "",
            leftImage: pair.leftImage || null,
            rightText: pair.rightText || "",
            rightImage: pair.rightImage || null,
            order: pair.order || 0,
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
      );

      // Try to extract table headers from questionText
      try {
        const tableData = JSON.parse(editingQuestion.questionText);
        if (tableData.headers) {
          setLeftColumnHeader(tableData.headers.left || "List I");
          setRightColumnHeader(tableData.headers.right || "List II");
          setLeftColumnSubheader(tableData.headers.leftSub || "");
          setRightColumnSubheader(tableData.headers.rightSub || "");
          setQuestionText(
            tableData.instruction || "Match List I with List II."
          );
        }
      } catch (e) {
        // If not JSON, just use the text as is
        setQuestionText(editingQuestion.questionText);
      }

      // Set options for matching questions if available
      if (editingQuestion.options && editingQuestion.options.length > 0) {
        setOptions(
          editingQuestion.options.map((opt: any) => ({
            id: opt.id,
            optionText: opt.optionText || "",
            optionImage: opt.optionImage || null,
            isCorrect: opt.isCorrect || false,
          }))
        );
      }
    }

    // Set correct answer for numerical questions
    if (editingQuestion.type === "FILL_IN_BLANK") {
      // Find the correct option
      const correctOpt = editingQuestion.options?.find(
        (opt: any) => opt.isCorrect
      );
      setCorrectAnswer(correctOpt?.optionText || "");
    }
  } else {
    resetForm();
  }
}, [editingQuestion]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`/api/chapters?subject=${subject}`);
        const data = await res.json();
        setAvailableChapters(data.chapters || []);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        toast.error("Failed to fetch chapters", { containerId: "main-toast" });
      }
    };

    if (subject) {
      fetchChapters();
    } else {
      setAvailableChapters([]);
    }
  }, [subject]);

  useEffect(() => {
    // If changing FROM MULTI_SELECT to any other type
    if (questionType !== "MULTI_SELECT") {
      const resetOptions = options.map((opt) => ({
        ...opt,
        isCorrect: false,
      }));
      setOptions(resetOptions);
    }
  }, [questionType]);

  const resetForm = () => {
    setQuestionType("MCQ");
    setQuestionText("");
    setAssertion("");
    setReason("");
    setArOption(-1);
    setQuestionImage(null);
    setSolutionText("");
    setCorrectAnswer("");
    setSolutionImage(null);
    setSubject("PHYSICS");
    setDifficulty("BEGINNER");
    setChapter("");
    setIsNewChapter(false);
    setOptions([
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
      { optionText: "", optionImage: null, isCorrect: false },
    ]);
    setCorrectAnswer("");
    setMatchingPairs([
      {
        leftText: "",
        leftImage: null,
        rightText: "",
        rightImage: null,
        order: 0,
      },
      {
        leftText: "",
        leftImage: null,
        rightText: "",
        rightImage: null,
        order: 1,
      },
      {
        leftText: "",
        leftImage: null,
        rightText: "",
        rightImage: null,
        order: 2,
      },
      {
        leftText: "",
        leftImage: null,
        rightText: "",
        rightImage: null,
        order: 3,
      },
    ]);
    setLeftColumnHeader("List I");
    setRightColumnHeader("List II");
    setLeftColumnSubheader("");
    setRightColumnSubheader("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate common fields
      if (!subject || !difficulty || !chapter.trim()) {
        toast.error("Please fill in all required fields", {
          containerId: "main-toast",
        });
        setLoading(false);
        return;
      }

      // Prepare question text based on question type
      let finalQuestionText = questionText;

      // For assertion-reason, combine assertion and reason
      if (questionType === "ASSERTION_REASON") {
        if (!assertion.trim() || !reason.trim()) {
          toast.error("Both assertion and reason must be provided", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }

        if (arOption === -1) {
          toast.error("Please select an answer option", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }

        finalQuestionText = `${assertion}\n---\n${reason}`;
      } else if (questionType === "MATCHING") {
        // For matching, store table headers in the question text as JSON
        finalQuestionText = JSON.stringify({
          instruction: questionText || "Match List I with List II.",
          headers: {
            left: leftColumnHeader,
            right: rightColumnHeader,
            leftSub: leftColumnSubheader,
            rightSub: rightColumnSubheader,
          },
        });
      } else if (!questionText.trim()) {
        toast.error("Question text is required", { containerId: "main-toast" });
        setLoading(false);
        return;
      }

      // Validate type-specific fields
      if (questionType === "MCQ" || questionType === "MULTI_SELECT") {
        if (
          options.some((opt) => !opt.optionText?.trim() && !opt.optionImage)
        ) {
          toast.error("All options must have either text or an image", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }

        if (questionType === "MCQ" && !options.some((opt) => opt.isCorrect)) {
          toast.error("Please select a correct answer", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }

        if (
          questionType === "MULTI_SELECT" &&
          !options.some((opt) => opt.isCorrect)
        ) {
          toast.error("Please select at least one correct answer", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }
      }

      if (questionType === "FILL_IN_BLANK" && !correctAnswer.trim()) {
        toast.error("Please provide the correct answer", {
          containerId: "main-toast",
        });
        setLoading(false);
        return;
      }

      // Validate solution - either text or image is required
      if (!solutionText && !solutionImage) {
        toast.error("Please provide either solution text or an image", {
          containerId: "main-toast",
        });
        setLoading(false);
        return;
      }

      // Prepare solution text with options
      const finalSolutionText = solutionText;

      // Prepare payload based on question type
      const payload: any = {
        type: questionType,
        questionText: finalQuestionText,
        questionImage,
        solutionText: finalSolutionText,
        solutionImage,
        subject,
        difficulty,
        chapter,
      };

      // Add type-specific data
      if (questionType === "MCQ") {
        payload.options = options;
      } else if (questionType === "MULTI_SELECT") {
        payload.options = options;
      } else if (questionType === "ASSERTION_REASON") {
        // Set the correct option based on arOption
        const arOptions = [
          {
            optionText:
              "Both Assertion and Reason are true and Reason is the correct explanation of Assertion",
            isCorrect: arOption === 0,
          },
          {
            optionText:
              "Both Assertion and Reason are true but Reason is not the correct explanation of Assertion",
            isCorrect: arOption === 1,
          },
          {
            optionText: "Assertion is true but Reason is false",
            isCorrect: arOption === 2,
          },
          {
            optionText: "Assertion is false but Reason is true",
            isCorrect: arOption === 3,
          },
          {
            optionText: "Both Assertion and Reason are false",
            isCorrect: arOption === 4,
          },
        ];
        payload.options = arOptions;
      } else if (questionType === "FILL_IN_BLANK") {
        payload.options = [
          {
            optionText: correctAnswer,
            isCorrect: true,
          },
        ];
        payload.correctAnswer = correctAnswer;
      } else if (questionType === "MATCHING") {
        if (
          matchingPairs.some(
            (pair) => !pair.leftText.trim() || !pair.rightText.trim()
          )
        ) {
          toast.error(
            "All matching pairs must have both left and right values",
            { containerId: "main-toast" }
          );
          setLoading(false);
          return;
        }

        if (!options.some((opt) => opt.isCorrect)) {
          toast.error("Please select a correct answer option", {
            containerId: "main-toast",
          });
          setLoading(false);
          return;
        }

        // Use the options as they are, just like MCQ
        payload.options = options;
        payload.matchingPairs = matchingPairs;
        if (questionType === "MATCHING") {
          payload.matchingPairs = matchingPairs.map((pair, index) => ({
            ...pair,
            order: index, // Ensure current order is preserved
          }));
        }

        // Store table headers in the question text as JSON
        payload.questionText = JSON.stringify({
          instruction: questionText || "Match List I with List II.",
          headers: {
            left: leftColumnHeader,
            right: rightColumnHeader,
            leftSub: leftColumnSubheader,
            rightSub: rightColumnSubheader,
          },
        });
      }

      // await onSubmit(payload);
      const success = await onSubmit(payload);
      if (success) {
        resetForm(); // Only reset if submission was successful
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to save question", { containerId: "main-toast" });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof QuestionOption,
    value: any
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleMatchingPairChange = (
    index: number,
    field: keyof MatchingPair,
    value: any
  ) => {
    const newPairs = [...matchingPairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setMatchingPairs(newPairs);
  };

  // Helper function to render math content
  const renderMathContent = (text: string) => {
    if (!text) return null;

    // Simple regex to find math expressions
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            // Display math
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
            // Inline math
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
            // Regular text
            return <span key={index}>{part}</span>;
          }
        })}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Fill out the details to{" "}
            {editingQuestion ? "update the" : "add a new"} question.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {editingQuestion && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-4 border-amber-500 mb-4">
              <p className="text-amber-800 dark:text-amber-300">
                Note: Subject cannot be changed when editing a question.
              </p>
            </div>
          )}
          {/* Question Type */}
          <div>
            <Label>Question Type</Label>
            <Select
              value={questionType}
              onValueChange={(value) => setQuestionType(value as QuestionType)}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                <SelectItem value="MCQ">
                  Multiple Choice Question (MCQ)
                </SelectItem>
                <SelectItem value="MULTI_SELECT">
                  Multiple Select Question
                </SelectItem>
                <SelectItem value="ASSERTION_REASON">
                  Assertion and Reason
                </SelectItem>
                <SelectItem value="FILL_IN_BLANK">
                  Numerical/Fill in the Blank
                </SelectItem>
                <SelectItem value="MATCHING">Match the Following</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject</Label>
              <Select
                value={subject}
                onValueChange={(value) => setSubject(value as Subject)}
                disabled={!!editingQuestion}
              >
                <SelectTrigger
                  className={`dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 ${
                    editingQuestion ? "opacity-70" : ""
                  }`}
                >
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
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as Difficulty)}
              >
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
                  value={
                    availableChapters.find((chap) => chap.name === chapter)
                      ?.id || ""
                  }
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsNewChapter(true);
                      setChapter("");
                    } else {
                      const selectedChapterObject = availableChapters.find(
                        (chap) => chap.id === value
                      );
                      if (selectedChapterObject) {
                        setChapter(selectedChapterObject.name);
                      }
                    }
                  }}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 flex-1">
                    <SelectValue placeholder="Select a chapter" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
                    {availableChapters
                      .filter((chap) => {
                        // Only show chapters for the currently selected subject in the form
                        return (
                          chap.subject?.name === subject ||
                          chap.subjectId === subject
                        );
                      })
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
                    setIsNewChapter(false);
                    setChapter("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Question Text - Different for each question type */}
          {questionType === "ASSERTION_REASON" ? (
            <div className="space-y-4">
              <div>
                <Label>Assertion</Label>
                <Textarea
                  placeholder="Type the assertion here. Use $ for inline math and $$ for display math."
                  value={assertion}
                  onChange={(e) => setAssertion(e.target.value)}
                  rows={2}
                  className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                {assertion && (
                  <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Preview:
                    </p>
                    <div className="question-preview">
                      {renderMathContent(assertion)}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Reason</Label>
                <Textarea
                  placeholder="Type the reason here. Use $ for inline math and $$ for display math."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
                {reason && (
                  <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Preview:
                    </p>
                    <div className="question-preview">
                      {renderMathContent(reason)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : questionType === "MATCHING" ? (
            <div className="space-y-4">
              <div>
                <Label>Instruction</Label>
                <Input
                  placeholder="Match List I with List II."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Left Column Header</Label>
                  <Input
                    placeholder="List I"
                    value={leftColumnHeader}
                    onChange={(e) => setLeftColumnHeader(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <Label>Right Column Header</Label>
                  <Input
                    placeholder="List II"
                    value={rightColumnHeader}
                    onChange={(e) => setRightColumnHeader(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Left Column Subheader (Optional)</Label>
                  <Input
                    placeholder="e.g., (Spectral Lines of Hydrogen for transitions from)"
                    value={leftColumnSubheader}
                    onChange={(e) => setLeftColumnSubheader(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <Label>Right Column Subheader (Optional)</Label>
                  <Input
                    placeholder="e.g., (Wavelengths (nm))"
                    value={rightColumnSubheader}
                    onChange={(e) => setRightColumnSubheader(e.target.value)}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="border rounded-md p-3 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Preview:
                </p>
                <Table className="border-collapse border border-gray-300 dark:border-gray-700">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border border-gray-300 dark:border-gray-700 w-12"></TableHead>
                      <TableHead className="border border-gray-300 dark:border-gray-700 text-center">
                        {leftColumnHeader}
                        {leftColumnSubheader && (
                          <div className="text-sm font-normal">
                            ({leftColumnSubheader})
                          </div>
                        )}
                      </TableHead>
                      <TableHead className="border border-gray-300 dark:border-gray-700 w-12"></TableHead>
                      <TableHead className="border border-gray-300 dark:border-gray-700 text-center">
                        {rightColumnHeader}
                        {rightColumnSubheader && (
                          <div className="text-sm font-normal">
                            ({rightColumnSubheader})
                          </div>
                        )}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchingPairs
                      .sort((a, b) => a.order - b.order)
                      .map((pair, index) => (
                        <TableRow key={pair.id || index}>
                          <TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
                            {String.fromCharCode(65 + index)}.
                          </TableCell>
                          <TableCell className="border border-gray-300 dark:border-gray-700">
                            <Textarea
                              value={pair.leftText}
                              onChange={(e) =>
                                handleMatchingPairChange(
                                  index,
                                  "leftText",
                                  e.target.value
                                )
                              }
                              placeholder="Use $ for inline math and $$ for display math"
                            />
                            {pair.leftText && (
                              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {renderMathContent(pair.leftText)}
                              </div>
                            )}
                            <div
                              className="mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileUpload
                                key={`left-image-${index}-${
                                  pair.leftImage || "new"
                                }`}
                                onUpload={(url) =>
                                  handleMatchingPairChange(
                                    index,
                                    "leftImage",
                                    url
                                  )
                                }
                                label="Left Image (Optional)"
                              />
                              {pair.leftImage && (
                                <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                                  <img
                                    src={pair.leftImage || "/placeholder.svg"}
                                    alt={`Left ${String.fromCharCode(
                                      65 + index
                                    )}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="border border-gray-300 dark:border-gray-700 font-medium">
                            {index + 1}.
                          </TableCell>
                          <TableCell className="border border-gray-300 dark:border-gray-700">
                            <Textarea
                              value={pair.rightText}
                              onChange={(e) =>
                                handleMatchingPairChange(
                                  index,
                                  "rightText",
                                  e.target.value
                                )
                              }
                              placeholder="Use $ for inline math and $$ for display math"
                            />
                            {pair.rightText && (
                              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {renderMathContent(pair.rightText)}
                              </div>
                            )}
                            <div
                              className="mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileUpload
                                key={`right-image-${index}-${
                                  pair.rightImage || "new"
                                }`}
                                onUpload={(url) =>
                                  handleMatchingPairChange(
                                    index,
                                    "rightImage",
                                    url
                                  )
                                }
                                label="Right Image (Optional)"
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
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {questionType === "MATCHING" && (
                <div>
                  <Label className="mt-4 block">
                    Answer Options (Select one correct answer)
                  </Label>
                  <div className="space-y-3 mt-2">
                    {options.map((option, index) => (
                      <div
                        key={`matching-option-${index}`}
                        className="border rounded-md p-3 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-2">
                            <RadioGroup
                              value={options
                                .findIndex((o) => o.isCorrect)
                                .toString()}
                              onValueChange={(value) => {
                                // Reset all options to incorrect first
                                const resetOptions = options.map((opt) => ({
                                  ...opt,
                                  isCorrect: false,
                                }));
                                // Set the selected option as correct
                                resetOptions[parseInt(value)].isCorrect = true;
                                setOptions(resetOptions);
                              }}
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`matching-option-${index}`}
                              />
                            </RadioGroup>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <Label htmlFor={`option-text-${index}`}>
                                Option {String.fromCharCode(65 + index)}
                              </Label>
                              <Input
                                id={`option-text-${index}`}
                                placeholder={`Enter option ${String.fromCharCode(
                                  65 + index
                                )}`}
                                value={option.optionText || ""}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    "optionText",
                                    e.target.value
                                  )
                                }
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
                                key={`option-image-${index}-${
                                  option.optionImage || "new"
                                }`}
                                onUpload={(url) =>
                                  handleOptionChange(index, "optionImage", url)
                                }
                                label={`Option ${String.fromCharCode(
                                  65 + index
                                )} Image (Optional)`}
                              />
                              {option.optionImage && (
                                <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                                  <img
                                    src={
                                      option.optionImage || "/placeholder.svg"
                                    }
                                    alt={`Option ${String.fromCharCode(
                                      65 + index
                                    )}`}
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
            </div>
          ) : (
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Preview:
                  </p>
                  <div className="question-preview">
                    {renderMathContent(questionText)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question Image Upload */}
          <div onClick={(e) => e.stopPropagation()}>
            <FileUpload
              key={`question-image-${questionImage || "new"}`}
              onUpload={(url) => setQuestionImage(url)}
              label="Question Image (Optional)"
            />
            {questionImage && (
              <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
                <img
                  src={questionImage || "/placeholder.svg"}
                  alt="Question"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Question Type Specific Fields */}
          {questionType === "MCQ" && (
            <>
              <div>
                <Label>Options (Select one correct answer)</Label>
                <div className="space-y-3 mt-2">
                  {options.map((option, index) => (
                    <div
                      key={`mcq-option-${index}`}
                      className="border rounded-md p-3 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-2">
                          <RadioGroup
                            value={options
                              .findIndex((o) => o.isCorrect)
                              .toString()}
                            onValueChange={(value) => {
                              // Reset all options to incorrect first
                              const resetOptions = options.map((opt) => ({
                                ...opt,
                                isCorrect: false,
                              }));
                              // Set the selected option as correct
                              resetOptions[parseInt(value)].isCorrect = true;
                              setOptions(resetOptions);
                            }}
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`mcq-option-${index}`}
                            />
                          </RadioGroup>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <Label htmlFor={`option-text-${index}`}>
                              Option {String.fromCharCode(65 + index)}
                            </Label>
                            <Input
                              id={`option-text-${index}`}
                              placeholder={`Enter option ${String.fromCharCode(
                                65 + index
                              )}`}
                              value={option.optionText || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "optionText",
                                  e.target.value
                                )
                              }
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
                              key={`option-image-${index}-${
                                option.optionImage || "new"
                              }`}
                              onUpload={(url) =>
                                handleOptionChange(index, "optionImage", url)
                              }
                              label={`Option ${String.fromCharCode(
                                65 + index
                              )} Image (Optional)`}
                            />
                            {option.optionImage && (
                              <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                                <img
                                  src={option.optionImage || "/placeholder.svg"}
                                  alt={`Option ${String.fromCharCode(
                                    65 + index
                                  )}`}
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
            </>
          )}

          {questionType === "MULTI_SELECT" && (
            <>
              <div>
                <Label>Options (Select all correct answers)</Label>
                <div className="space-y-3 mt-2">
                  {options.map((option, index) => (
                    <div
                      key={`multiselect-option-${index}`}
                      className="border rounded-md p-3 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-2">
                          {/* <Checkbox
                            id={`option-${index}`}
                            checked={option.isCorrect}
                            onCheckedChange={(checked) => {
                              handleOptionChange(index, "isCorrect", checked);
                            }}
                          /> */}
                          <Checkbox
                            id={`multiselect-option-${index}`}
                            checked={option.isCorrect}
                            onCheckedChange={(checked) => {
                              const newOptions = [...options];
                              newOptions[index].isCorrect = checked as boolean;
                              setOptions(newOptions);
                            }}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div>
                            <Label htmlFor={`option-text-${index}`}>
                              Option {String.fromCharCode(65 + index)}
                            </Label>
                            <Input
                              id={`option-text-${index}`}
                              placeholder={`Enter option ${String.fromCharCode(
                                65 + index
                              )}`}
                              value={option.optionText || ""}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "optionText",
                                  e.target.value
                                )
                              }
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
                              key={`option-image-${index}-${
                                option.optionImage || "new"
                              }`}
                              onUpload={(url) =>
                                handleOptionChange(index, "optionImage", url)
                              }
                              label={`Option ${String.fromCharCode(
                                65 + index
                              )} Image (Optional)`}
                            />
                            {option.optionImage && (
                              <div className="w-20 h-20 mt-2 border rounded-md overflow-hidden">
                                <img
                                  src={option.optionImage || "/placeholder.svg"}
                                  alt={`Option ${String.fromCharCode(
                                    65 + index
                                  )}`}
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
            </>
          )}

          {questionType === "ASSERTION_REASON" && (
            <div>
              <Label>Select the correct option</Label>
              <div className="space-y-3 mt-2">
                <div className="border rounded-md p-3 dark:border-gray-700">
                  <RadioGroup
                    value={arOption.toString()}
                    onValueChange={(value) => {
                      const selectedIndex = Number.parseInt(value);
                      setArOption(selectedIndex);

                      // Update the options array with the correct answer
                      const updatedOptions = [
                        "Both Assertion and Reason are true and Reason is the correct explanation of Assertion",
                        "Both Assertion and Reason are true but Reason is not the correct explanation of Assertion",
                        "Assertion is true but Reason is false",
                        "Assertion is false but Reason is true",
                        "Both Assertion and Reason are false",
                      ].map((text, index) => ({
                        optionText: text,
                        isCorrect: index === selectedIndex,
                      }));

                      setOptions(updatedOptions);
                    }}
                  >
                    {[
                      "Both Assertion and Reason are true and Reason is the correct explanation of Assertion",
                      "Both Assertion and Reason are true but Reason is not the correct explanation of Assertion",
                      "Assertion is true but Reason is false",
                      "Assertion is false but Reason is true",
                      "Both Assertion and Reason are false",
                    ].map((text, index) => (
                      <div
                        key={`ar-option-${index}`}
                        className="flex items-start space-x-2 py-2"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`ar-option-${index}`}
                        />
                        <Label
                          htmlFor={`ar-option-${index}`}
                          className="font-normal"
                        >
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
                placeholder="Enter the correct answer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <p className="text-sm text-gray-500 mt-1">
                Make sure your question includes a blank (e.g., _____ or [...])
                where the answer should go.
              </p>
            </div>
          )}

          {/* Solution */}
          <div>
            <Label>Solution Explanation</Label>
            <Textarea
              placeholder="Explain the solution here. Use $ for inline math and $$ for display math."
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={3}
              className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            {solutionText && (
              <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Preview:
                </p>
                <div className="solution-preview">
                  {renderMathContent(solutionText)}
                </div>
              </div>
            )}
          </div>

          {/* Solution Image Upload */}
          <div onClick={(e) => e.stopPropagation()}>
            <FileUpload
              key={`solution-image-${solutionImage || "new"}`}
              onUpload={(url) => setSolutionImage(url)}
              label="Solution Image (Optional)"
            />
            {solutionImage && (
              <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
                <img
                  src={solutionImage || "/placeholder.svg"}
                  alt="Solution"
                  className="w-full h-full object-cover"
                />
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
  );
}
