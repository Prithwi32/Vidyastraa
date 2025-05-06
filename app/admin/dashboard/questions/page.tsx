// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash,
//   MoreHorizontal,
//   FolderOpen,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import FileUpload from "@/components/admin/FileUpload";
// import MathDisplay from "@/components/math-display";
// import { toast } from "react-toastify";

// interface ChapterWithQuestions extends Chapter {
//   questions: Question[];
// }
// interface Chapter {
//   id: string;
//   name: string;
//   subjectId: string;
//   questions: Question[];
// }

// type Question = {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: string;
//   solution: string;
//   difficulty: "BEGINNER" | "MODERATE" | "ADVANCED";
//   subject: "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY";
//   chapter: {
//     name: string;
//   };
//   image: string | null;
//   createdAt: string;
// };

// export default function QuestionsPage() {
//   const [open, setOpen] = useState(false);
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswer, setCorrectAnswer] = useState("");
//   const [solution, setSolution] = useState("");
//   const [subject, setSubject] = useState<
//     "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY"
//   >("PHYSICS");
//   const [difficulty, setDifficulty] = useState<
//     "BEGINNER" | "MODERATE" | "ADVANCED"
//   >("BEGINNER");
//   const [chapter, setChapter] = useState("");
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
//   const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [chapters, setChapters] = useState<ChapterWithQuestions[]>([]);
//   const [availableChapters, setAvailableChapters] = useState<
//     ChapterWithQuestions[]
//   >([]);
//   const [isNewChapter, setIsNewChapter] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [expandedChapters, setExpandedChapters] = useState<
//     Record<string, boolean>
//   >({});

//   const subjects: ("PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY")[] = [
//     "PHYSICS",
//     "CHEMISTRY",
//     "MATHS",
//     "BIOLOGY",
//   ];
//   const difficulties: ("BEGINNER" | "MODERATE" | "ADVANCED")[] = [
//     "BEGINNER",
//     "MODERATE",
//     "ADVANCED",
//   ];

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchChapters("");
//       await fetchQuestions();
//     };
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (selectedSubject) {
//         await fetchChapters(selectedSubject);
//       }
//       await fetchQuestions();
//     };
//     fetchData();
//   }, [selectedSubject, selectedChapter]);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       let url = "/api/questions";
//       const params = new URLSearchParams();

//       if (selectedSubject) {
//         params.append("subject", selectedSubject);
//       }

//       if (selectedChapter) {
//         params.append("chapterId", selectedChapter);
//       }

//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       const res = await fetch(url, { cache: "no-store" });
//       const data = await res.json();

//       const questionsArray = Array.isArray(data) ? data : data.questions || [];
//       setQuestions(questionsArray);
//     } catch (err) {
//       console.error("Error fetching questions:", err);
//       toast.error("❌ Failed to fetch questions.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChapters = async (subject: string) => {
//     try {
//       const res = await fetch(`/api/chapters?subject=${subject}`, {
//         cache: "no-store",
//       });
//       const data = await res.json();
//       const chaptersWithQuestions = data.chapters || [];
//       setChapters(chaptersWithQuestions);
//       setAvailableChapters(chaptersWithQuestions);
//     } catch (err) {
//       console.error("Error fetching chapters:", err);
//       toast.error("❌ Failed to fetch chapters.");
//     }
//   };

//   const resetForm = () => {
//     setQuestion("");
//     setOptions(["", "", "", ""]);
//     setCorrectAnswer("");
//     setSolution("");
//     setChapter("");
//     setSubject("PHYSICS");
//     setDifficulty("BEGINNER");
//     setImage(null);
//     setEditingQuestion(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !question.trim() ||
//       !correctAnswer.trim() ||
//       options.some((opt) => !opt.trim()) ||
//       !subject ||
//       !difficulty ||
//       !chapter.trim()
//     ) {
//       toast.error("❌ Please fill in all required fields.", {
//         containerId: "main-toast",
//       });
//       return;
//     }

//     if (solution.trim().length < 5) {
//       toast.error("❌ Solution must be at least 5 characters long.", {
//         containerId: "main-toast",
//       });
//       return;
//     }

//     if (options.length !== 4) {
//       toast.error("❌ Exactly 4 options are required.", {
//         containerId: "main-toast",
//       });
//       return;
//     }

//     const payload = {
//       question,
//       options,
//       correctAnswer,
//       solution,
//       subject,
//       difficulty,
//       chapter,
//       image,
//     };

//     console.log(payload);

//     try {
//       const method = editingQuestion ? "PATCH" : "POST";
//       const url = editingQuestion
//         ? `/api/questions/${editingQuestion.id}`
//         : "/api/questions";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const responseData = await res.json();
//         const updatedQuestion = responseData.question;
//         toast.success(
//           `✅ Question ${editingQuestion ? "updated" : "added"} successfully!`,
//           {
//             containerId: "main-toast",
//           }
//         );

//         if (editingQuestion) {
//           setQuestions((prev) =>
//             prev.map((q) =>
//               q.id === editingQuestion.id ? updatedQuestion.question : q
//             )
//           );
//         } else {
//           // Add new question to state
//           setQuestions((prev) => [...prev, updatedQuestion.question]);
//         }

//         resetForm();
//         setOpen(false);
//         fetchQuestions();

//         if (selectedSubject) {
//           fetchChapters(selectedSubject);
//         }
//       } else {
//         const errorData = await res.json();
//         toast.error(`❌ Failed: ${errorData.error || "Unknown error"}`, {
//           containerId: "main-toast",
//         });
//       }
//     } catch (err: any) {
//       toast.error(
//         `❌ Something went wrong while ${
//           editingQuestion ? "updating" : "adding"
//         } the question.`,
//         {
//           containerId: "main-toast",
//         }
//       );
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(true);
//       setEditingQuestion(null);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await fetch(`/api/questions/${id}`, {
//         method: "DELETE",
//       });

//       if (res.ok) {
//         toast.success("🗑️ Question deleted successfully.", {
//           containerId: "main-toast",
//         });
//         fetchQuestions();
//         if (selectedSubject) {
//           fetchChapters(selectedSubject);
//         }
//       } else {
//         const errorData = await res.text();
//         toast.error("❌ Delete failed: " + errorData);
//       }
//     } catch (err) {
//       toast.error("❌ Delete error: " + (err as any).message);
//     }
//   };

//   const toggleChapter = (chapter: string) => {
//     setExpandedChapters((prev) => ({
//       ...prev,
//       [chapter]: !prev[chapter],
//     }));
//   };

//   const questionsByChapter = questions.reduce((acc, q) => {
//     if (!q) return acc; // Skip if question is undefined/null

//     const chapterName = q.chapter?.name || "Uncategorized";
//     if (!acc[chapterName]) {
//       acc[chapterName] = [];
//     }
//     acc[chapterName].push(q);
//     return acc;
//   }, {} as Record<string, Question[]>);

//   const filteredChapters = availableChapters
//     .map((chapter) => ({
//       ...chapter,
//       questions: chapter.questions.filter((q) =>
//         q.question.toLowerCase().includes(searchQuery.toLowerCase())
//       ),
//     }))
//     .filter(
//       (chapter) =>
//         searchQuery === "" ||
//         chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         chapter.questions.length > 0
//     );

//   return (
//     <main className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-200">
//       {/* Add Question Dialog */}
//       <section className="mb-10">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
//                 onClick={() => {
//                   resetForm();
//                   setEditingQuestion(null);
//                 }}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Question
//               </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-700">
//               <DialogHeader>
//                 <DialogTitle className="text-xl">
//                   {editingQuestion ? "Edit Question" : "Add New Question"}
//                 </DialogTitle>
//                 <DialogDescription className="text-gray-500 dark:text-gray-400">
//                   Fill out the details to{" "}
//                   {editingQuestion ? "update the" : "add a new"} question.
//                 </DialogDescription>
//               </DialogHeader>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Subject and Difficulty */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label>Subject</Label>
//                     <Select
//                       value={subject}
//                       onValueChange={(value) => {
//                         setSubject(
//                           value as "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY"
//                         );
//                         fetchChapters(value);
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select subject" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {subjects.map((sub) => (
//                           <SelectItem key={sub} value={sub}>
//                             {sub}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label>Difficulty</Label>
//                     <Select
//                       value={difficulty}
//                       onValueChange={(value) => setDifficulty(value as any)}
//                     >
//                       <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
//                         <SelectValue placeholder="Select difficulty" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
//                         {difficulties.map((level) => (
//                           <SelectItem
//                             key={level}
//                             value={level}
//                             className="dark:text-gray-200"
//                           >
//                             {level}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Chapter Input Field */}
//                 <div>
//                   <Label>Chapter</Label>
//                   {!isNewChapter ? (
//                     <div className="flex gap-2">
//                       <Select
//                         value={
//                           availableChapters.find(
//                             (chap) => chap.name === chapter
//                           )?.id
//                         }
//                         onValueChange={(value) => {
//                           if (value === "new") {
//                             setIsNewChapter(true);
//                             setChapter("");
//                           } else {
//                             const selectedChapterObject =
//                               availableChapters.find(
//                                 (chap) => chap.id === value
//                               );
//                             if (selectedChapterObject) {
//                               setChapter(selectedChapterObject.name);
//                             }
//                           }
//                         }}
//                       >
//                         <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 flex-1">
//                           <SelectValue placeholder="Select a chapter">
//                             {chapter} {/* Display the chapter name */}
//                           </SelectValue>
//                         </SelectTrigger>
//                         <SelectContent className="dark:bg-gray-800 dark:text-gray-200">
//                           {availableChapters
//                             .filter((chap) => chap.subject.name === subject)
//                             .map((chap) => (
//                               <SelectItem key={chap.id} value={chap.id}>
//                                 {chap.name}
//                               </SelectItem>
//                             ))}
//                           <SelectItem value="new">
//                             + Create New Chapter
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter new chapter name"
//                         value={chapter}
//                         onChange={(e) => setChapter(e.target.value)}
//                         className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 flex-1"
//                       />
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => {
//                           setIsNewChapter(false);
//                           setChapter("");
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Question */}
//                 <div>
//                   <Label>Question</Label>
//                   <Textarea
//                     placeholder="Type the question here. Use $ for inline math and $$ for display math."
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                     rows={3}
//                     className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
//                   />
//                   {question && (
//                     <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
//                         Preview:
//                       </p>
//                       <div className="question-preview">
//                         {renderMathContent(question)}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Image Upload */}
//                 <div>
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <FileUpload onUpload={(url) => setImage(url)} />
//                   </div>
//                   {image && (
//                     <div className="w-28 h-28 mt-3 border rounded-md overflow-hidden shadow dark:border-gray-700">
//                       <img
//                         src={image}
//                         alt="Uploaded"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Options */}
//                 <div>
//                   <Label>Options (supports LaTeX math: - $x^2$)</Label>
//                   <div className="space-y-2">
//                     {options.map((opt, idx) => (
//                       <div key={idx} className="space-y-1">
//                         <Input
//                           placeholder={`Option ${String.fromCharCode(
//                             65 + idx
//                           )}`}
//                           value={opt}
//                           onChange={(e) => {
//                             const updated = [...options];
//                             updated[idx] = e.target.value;
//                             setOptions(updated);
//                           }}
//                           className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
//                         />
//                         {opt && (
//                           <div className="ml-6 text-sm text-gray-600 dark:text-gray-400">
//                             {renderMathContent(opt)}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Correct Answer */}
//                 <div>
//                   <Label>Correct Answer (A/B/C/D)</Label>
//                   <Input
//                     placeholder="Enter A/B/C/D"
//                     value={correctAnswer}
//                     onChange={(e) =>
//                       setCorrectAnswer(e.target.value.toUpperCase())
//                     }
//                     className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
//                   />
//                 </div>

//                 {/* Solution */}
//                 <div>
//                   <Label>Solution (supports LaTeX math: - $x^2$)</Label>
//                   <Textarea
//                     placeholder="Explain the answer here. Use $ for inline math and $$ for display math."
//                     value={solution}
//                     onChange={(e) => setSolution(e.target.value)}
//                     rows={4}
//                     className="resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
//                   />
//                   {solution && (
//                     <div className="mt-2 p-3 border rounded-md dark:border-gray-700">
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
//                         Preview:
//                       </p>
//                       <div className="solution-preview">
//                         {renderMathContent(solution)}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <DialogFooter>
//                   <Button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full ${
//                       loading
//                         ? "bg-gray-400 dark:bg-gray-600"
//                         : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                     }`}
//                   >
//                     {loading
//                       ? editingQuestion
//                         ? "Updating..."
//                         : "Adding..."
//                       : editingQuestion
//                       ? "Update Question"
//                       : "Add Question"}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="mb-8">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <h2 className="text-xl font-semibold">Filter Questions</h2>
//           <div className="relative w-full sm:w-64">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search questions..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
//             />
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-3 mb-4">
//           {subjects.map((subj) => (
//             <button
//               key={subj}
//               onClick={() => {
//                 if (subj === selectedSubject) {
//                   setSelectedSubject(null);
//                   setSelectedChapter(null);
//                 } else {
//                   setSelectedSubject(subj);
//                   setSelectedChapter(null);
//                 }
//               }}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition ${
//                 selectedSubject === subj
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//               }`}
//             >
//               {subj}
//             </button>
//           ))}
//           {selectedSubject && (
//             <button
//               onClick={() => {
//                 setSelectedSubject(null);
//                 setSelectedChapter(null);
//               }}
//               className="px-4 py-2 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
//             >
//               Clear Filter
//             </button>
//           )}
//         </div>

//         {selectedSubject && chapters.length > 0 && (
//           <div className="mt-4">
//             <h3 className="text-lg font-medium mb-2">Chapters:</h3>
//             <div className="flex flex-wrap gap-2">
//               {chapters.map((chapter) => (
//                 <button
//                   key={chapter.id}
//                   onClick={() => {
//                     if (chapter.id === selectedChapter) {
//                       setSelectedChapter(null);
//                     } else {
//                       setSelectedChapter(chapter.id);
//                     }
//                   }}
//                   className={`px-3 py-1 rounded-md text-sm font-medium transition ${
//                     selectedChapter === chapter.id
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   {chapter.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Questions List */}
//       <section>
//         {loading ? (
//           <p className="text-gray-600 dark:text-gray-400">
//             Loading questions...
//           </p>
//         ) : questions.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-400">
//             No questions found.
//           </p>
//         ) : (
//           <div className="space-y-6">
//             {filteredChapters.map((chapter) => (
//               <div
//                 key={chapter.id}
//                 className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden"
//               >
//                 <div
//                   className="flex items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-800"
//                   onClick={() => toggleChapter(chapter.id)}
//                 >
//                   {expandedChapters[chapter.id] ? (
//                     <ChevronDown className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
//                   ) : (
//                     <ChevronRight className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
//                   )}
//                   <FolderOpen className="h-5 w-5 mr-2 text-yellow-500" />
//                   <h3 className="font-medium text-lg">{chapter.name}</h3>
//                   <Badge className="ml-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
//                     {chapter.questions.length} questions
//                   </Badge>
//                 </div>

//                 {expandedChapters[chapter.id] && (
//                   <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//                     {chapter.questions.map((q) => (
//                       <li key={q.id} className="p-5">
//                         <div className="flex justify-between">
//                           <h2 className="font-semibold text-lg">
//                             {renderMathContent(q.question)}
//                           </h2>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-8 w-8 p-0"
//                               >
//                                 <span className="sr-only">Open menu</span>
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent
//                               align="end"
//                               className="dark:bg-gray-800 dark:text-gray-200"
//                             >
//                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                               <DropdownMenuItem
//                                 onClick={() => {
//                                   setEditingQuestion(q);
//                                   setSubject(q.subject.name);
//                                   setDifficulty(q.difficulty);
//                                   setQuestion(q.question);
//                                   setOptions(q.options);
//                                   setCorrectAnswer(q.correctAnswer);
//                                   setSolution(q.solution);
//                                   setChapter(q.chapter?.name || "");
//                                   // setChapter(q.chapter.id);
//                                   setImage(q.image || null);
//                                   setOpen(true);

//                                   console.log("Editing question:", {
//                                     subject: q.subject,
//                                     chapter: q.chapter?.name,
//                                   });
//                                 }}
//                               >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 <span>Edit</span>
//                               </DropdownMenuItem>

//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem
//                                 className="text-red-600"
//                                 onClick={() => handleDelete(q.id)}
//                               >
//                                 <Trash className="mr-2 h-4 w-4" />
//                                 <span>Delete</span>
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>

//                         {q.image && (
//                           <img
//                             src={q.image}
//                             alt="question"
//                             className="mt-3 max-w-full rounded-md border dark:border-gray-700"
//                           />
//                         )}

//                         <ul className="list-disc pl-6 mt-4 space-y-1 text-sm text-gray-800 dark:text-gray-300">
//                           {q.options.map((opt, idx) => (
//                             <li key={idx}>{renderMathContent(opt)}</li>
//                           ))}
//                         </ul>

//                         <div className="mt-4 flex flex-wrap gap-3 items-center text-sm text-gray-600 dark:text-gray-400">
//                           <Badge
//                             className={
//                               q.difficulty === "BEGINNER"
//                                 ? "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700"
//                                 : q.difficulty === "MODERATE"
//                                 ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-700 dark:text-amber-300 dark:border-amber-700"
//                                 : "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
//                             }
//                           >
//                             {" "}
//                             {q.difficulty.charAt(0) +
//                               q.difficulty.slice(1).toLowerCase()}
//                           </Badge>

//                           <p>
//                             <span className="text-green-600 dark:text-green-400 font-medium">
//                               Answer:
//                             </span>{" "}
//                             {q.correctAnswer}
//                           </p>

//                           <p>
//                             <span className="text-blue-600 dark:text-blue-400 font-medium">
//                               Subject:
//                             </span>{" "}
//                             {q.subject?.name ?? "Unkown"}
//                           </p>

//                           <p className="ml-auto">
//                             Created:{" "}
//                             {new Date(q.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// // Helper function to render math content
// function renderMathContent(text: string) {
//   if (!text) return null;

//   // Simple regex to find math expressions
//   const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

//   return (
//     <>
//       {parts.map((part, index) => {
//         if (part.startsWith("$$") && part.endsWith("$$")) {
//           // Display math
//           const math = part.slice(2, -2);
//           return (
//             <MathDisplay
//               key={index}
//               math={math}
//               display={true}
//               className="my-2"
//             />
//           );
//         } else if (part.startsWith("$") && part.endsWith("$")) {
//           // Inline math
//           const math = part.slice(1, -1);
//           return (
//             <MathDisplay
//               key={index}
//               math={math}
//               display={false}
//               className="inline"
//             />
//           );
//         } else {
//           // Regular text
//           return <span key={index}>{part}</span>;
//         }
//       })}
//     </>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash, MoreHorizontal, FolderOpen, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MathDisplay from "@/components/math-display"
import { toast } from "react-toastify"
import AddQuestionForm from "./add-question-form"

interface ChapterWithQuestions extends Chapter {
  questions: Question[]
}
interface Chapter {
  id: string
  name: string
  subjectId: string
  questions: Question[]
}

type Question = {
  id: string
  type: "MCQ" | "MULTI_SELECT" | "ASSERTION_REASON" | "FILL_IN_BLANK" | "MATCHING"
  questionText: string
  questionImage: string | null
  solutionText: string | null
  solutionImage: string | null
  difficulty: "BEGINNER" | "MODERATE" | "ADVANCED"
  subject: {
    name: "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY"
  }
  chapter: {
    name: string
  }
  options: {
    id: string
    optionText: string | null
    optionImage: string | null
    isCorrect: boolean
  }[]
  matchingPairs?: {
    id: string
    leftText: string
    leftImage: string | null
    rightText: string
    rightImage: string | null
  }[]
  correctAnswer?: string
  createdAt: string
}

export default function QuestionsPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [chapters, setChapters] = useState<ChapterWithQuestions[]>([])
  const [availableChapters, setAvailableChapters] = useState<ChapterWithQuestions[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({})

  const subjects: ("PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY")[] = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]
  const difficulties: ("BEGINNER" | "MODERATE" | "ADVANCED")[] = ["BEGINNER", "MODERATE", "ADVANCED"]

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchChapters("")
      await fetchQuestions()
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedSubject) {
        await fetchChapters(selectedSubject)
      }
      await fetchQuestions()
    }
    fetchData()
  }, [selectedSubject, selectedChapter])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      let url = "/api/questions"
      const params = new URLSearchParams()

      if (selectedSubject) {
        params.append("subject", selectedSubject)
      }

      if (selectedChapter) {
        params.append("chapterId", selectedChapter)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const res = await fetch(url, { cache: "no-store" })
      const data = await res.json()

      const questionsArray = Array.isArray(data) ? data : data.questions || []
      setQuestions(questionsArray)
    } catch (err) {
      console.error("Error fetching questions:", err)
      toast.error("❌ Failed to fetch questions.")
    } finally {
      setLoading(false)
    }
  }

  const fetchChapters = async (subject: string) => {
    try {
      const res = await fetch(`/api/chapters?subject=${subject}`, {
        cache: "no-store",
      })
      const data = await res.json()
      const chaptersWithQuestions = data.chapters || []
      setChapters(chaptersWithQuestions)
      setAvailableChapters(chaptersWithQuestions)
    } catch (err) {
      console.error("Error fetching chapters:", err)
      toast.error("❌ Failed to fetch chapters.")
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const method = editingQuestion ? "PATCH" : "POST"
      const url = editingQuestion ? `/api/questions/${editingQuestion.id}` : "/api/questions"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        const responseData = await res.json()
        const updatedQuestion = responseData.question
        toast.success(`✅ Question ${editingQuestion ? "updated" : "added"} successfully!`, {
          containerId: "main-toast",
        })

        if (editingQuestion) {
          setQuestions((prev) => prev.map((q) => (q.id === editingQuestion.id ? updatedQuestion.question : q)))
        } else {
          // Add new question to state
          setQuestions((prev) => [...prev, updatedQuestion.question])
        }

        setEditingQuestion(null)
        setOpen(false)
        fetchQuestions()

        if (selectedSubject) {
          fetchChapters(selectedSubject)
        }
      } else {
        const errorData = await res.json()
        toast.error(`❌ Failed: ${errorData.error || "Unknown error"}`, {
          containerId: "main-toast",
        })
      }
    } catch (err: any) {
      toast.error(`❌ Something went wrong while ${editingQuestion ? "updating" : "adding"} the question.`, {
        containerId: "main-toast",
      })
      console.error("Submission error:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("🗑️ Question deleted successfully.", {
          containerId: "main-toast",
        })
        fetchQuestions()
        if (selectedSubject) {
          fetchChapters(selectedSubject)
        }
      } else {
        const errorData = await res.text()
        toast.error("❌ Delete failed: " + errorData)
      }
    } catch (err) {
      toast.error("❌ Delete error: " + (err as any).message)
    }
  }

  const toggleChapter = (chapter: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapter]: !prev[chapter],
    }))
  }

  const questionsByChapter = questions.reduce(
    (acc, q) => {
      if (!q) return acc // Skip if question is undefined/null

      const chapterName = q.chapter?.name || "Uncategorized"
      if (!acc[chapterName]) {
        acc[chapterName] = []
      }
      acc[chapterName].push(q)
      return acc
    },
    {} as Record<string, Question[]>,
  )

  const filteredChapters = availableChapters
    .map((chapter) => ({
      ...chapter,
      questions: chapter.questions.filter((q) => q.questionText.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter(
      (chapter) =>
        searchQuery === "" ||
        chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.questions.length > 0,
    )

  // Helper function to render question content based on type
  const renderQuestionContent = (question: Question) => {
    switch (question.type) {
      case "MCQ":
      case "MULTI_SELECT":
        return (
          <>
            <h2 className="font-semibold text-lg">{renderMathContent(question.questionText)}</h2>
            {question.questionImage && (
              <img
                src={question.questionImage || "/placeholder.svg"}
                alt="question"
                className="mt-3 max-w-full rounded-md border dark:border-gray-700"
              />
            )}
            <ul className="list-disc pl-6 mt-4 space-y-1 text-sm text-gray-800 dark:text-gray-300">
              {question.options.map((opt, idx) => (
                <li key={idx} className={opt.isCorrect ? "font-semibold text-green-600 dark:text-green-400" : ""}>
                  {opt.optionText && renderMathContent(opt.optionText)}
                  {opt.optionImage && (
                    <img
                      src={opt.optionImage || "/placeholder.svg"}
                      alt={`option ${idx + 1}`}
                      className="mt-1 max-w-[100px] rounded-md border dark:border-gray-700"
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )

      case "ASSERTION_REASON":
        return (
          <>
            <h2 className="font-semibold text-lg">{renderMathContent(question.questionText)}</h2>
            {question.questionImage && (
              <img
                src={question.questionImage || "/placeholder.svg"}
                alt="question"
                className="mt-3 max-w-full rounded-md border dark:border-gray-700"
              />
            )}
            <ul className="list-none pl-6 mt-4 space-y-1 text-sm text-gray-800 dark:text-gray-300">
              {question.options.map((opt, idx) => (
                <li key={idx} className={opt.isCorrect ? "font-semibold text-green-600 dark:text-green-400" : ""}>
                  {String.fromCharCode(65 + idx)}. {opt.optionText}
                </li>
              ))}
            </ul>
          </>
        )

      case "FILL_IN_BLANK":
        return (
          <>
            <h2 className="font-semibold text-lg">{renderMathContent(question.questionText)}</h2>
            {question.questionImage && (
              <img
                src={question.questionImage || "/placeholder.svg"}
                alt="question"
                className="mt-3 max-w-full rounded-md border dark:border-gray-700"
              />
            )}
            <div className="mt-4 text-sm">
              <span className="font-medium">Correct Answer: </span>
              <span className="text-green-600 dark:text-green-400">{question.correctAnswer}</span>
            </div>
          </>
        )

      case "MATCHING":
        return (
          <>
            <h2 className="font-semibold text-lg">{renderMathContent(question.questionText)}</h2>
            {question.questionImage && (
              <img
                src={question.questionImage || "/placeholder.svg"}
                alt="question"
                className="mt-3 max-w-full rounded-md border dark:border-gray-700"
              />
            )}
            {question.matchingPairs && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">Left Column</h3>
                  <ul className="space-y-2">
                    {question.matchingPairs.map((pair, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>
                          {idx + 1}. {pair.leftText}
                        </span>
                        {pair.leftImage && (
                          <img
                            src={pair.leftImage || "/placeholder.svg"}
                            alt={`left ${idx + 1}`}
                            className="w-8 h-8 object-cover rounded-md border dark:border-gray-700"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Right Column</h3>
                  <ul className="space-y-2">
                    {question.matchingPairs.map((pair, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>
                          {String.fromCharCode(65 + idx)}. {pair.rightText}
                        </span>
                        {pair.rightImage && (
                          <img
                            src={pair.rightImage || "/placeholder.svg"}
                            alt={`right ${idx + 1}`}
                            className="w-8 h-8 object-cover rounded-md border dark:border-gray-700"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )

      default:
        return <h2 className="font-semibold text-lg">{renderMathContent(question.questionText)}</h2>
    }
  }

  return (
    <main className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-200">
      {/* Add Question Dialog */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white"
            onClick={() => {
              setEditingQuestion(null)
              setOpen(true)
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

        <div className="flex flex-wrap gap-3 mb-4">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => {
                if (subj === selectedSubject) {
                  setSelectedSubject(null)
                  setSelectedChapter(null)
                } else {
                  setSelectedSubject(subj)
                  setSelectedChapter(null)
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
                setSelectedSubject(null)
                setSelectedChapter(null)
              }}
              className="px-4 py-2 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Clear Filter
            </button>
          )}
        </div>

        {selectedSubject && chapters.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Chapters:</h3>
            <div className="flex flex-wrap gap-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (chapter.id === selectedChapter) {
                      setSelectedChapter(null)
                    } else {
                      setSelectedChapter(chapter.id)
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
            </div>
          </div>
        )}
      </section>

      {/* Questions List */}
      <section>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No questions found.</p>
        ) : (
          <div className="space-y-6">
            {filteredChapters.map((chapter) => (
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
                        <div className="flex justify-between">
                          <div className="flex-1">{renderQuestionContent(q)}</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-gray-200">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingQuestion(q)
                                  setOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(q.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {q.solutionText && (
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <h4 className="font-medium text-sm mb-1">Solution:</h4>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {renderMathContent(q.solutionText)}
                            </div>
                            {q.solutionImage && (
                              <img
                                src={q.solutionImage || "/placeholder.svg"}
                                alt="solution"
                                className="mt-2 max-w-full rounded-md border dark:border-gray-700"
                              />
                            )}
                          </div>
                        )}

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
                            {q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()}
                          </Badge>

                          <Badge className="bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700">
                            {q.type}
                          </Badge>

                          <p>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Subject:</span>{" "}
                            {q.subject?.name ?? "Unknown"}
                          </p>

                          <p className="ml-auto">Created: {new Date(q.createdAt).toLocaleDateString()}</p>
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
  )
}

// Helper function to render math content
function renderMathContent(text: string) {
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
