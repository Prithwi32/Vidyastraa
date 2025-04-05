// "use client";

// import { useState } from "react";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   Edit,
//   FileQuestion,
//   Folder,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Trash,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import FileUpload from "@/components/admin/FileUpload";

// // Mock data for questions
// const mockQuestions = [
//   {
//     id: "1",
//     subject: "PHYSICS",
//     question:
//       "An electromagnetic wave going through vacuum is described by E = E₀sin(kx − ωt). Which of the following is independent of the wavelength?",
//     options: ["k", "ω", "k/ω", "kω"],
//     correctAnswer: "ω",
//     difficulty: "ADVANCED",
//     createdAt: "2023-04-15T10:30:00Z",
//   },
//   {
//     id: "2",
//     subject: "PHYSICS",
//     question:
//       "A particle is moving in a circular path with constant speed. Which of the following statements is correct?",
//     options: [
//       "The velocity and acceleration of the particle are perpendicular to each other",
//       "The velocity and acceleration of the particle are parallel to each other",
//       "The velocity and acceleration of the particle make an angle of 45° with each other",
//       "The velocity and acceleration of the particle are in opposite directions",
//     ],
//     correctAnswer:
//       "The velocity and acceleration of the particle are perpendicular to each other",
//     difficulty: "MODERATE",
//     createdAt: "2023-04-10T14:20:00Z",
//   },
//   {
//     id: "3",
//     subject: "CHEMISTRY",
//     question: "Which of the following is not a colligative property?",
//     options: [
//       "Elevation in boiling point",
//       "Depression in freezing point",
//       "Osmotic pressure",
//       "Optical activity",
//     ],
//     correctAnswer: "Optical activity",
//     difficulty: "MODERATE",
//     createdAt: "2023-04-05T09:15:00Z",
//   },
//   {
//     id: "4",
//     subject: "CHEMISTRY",
//     question: "The IUPAC name of the compound CH₃-CH=CH-CHO is:",
//     options: ["But-2-enal", "But-3-enal", "But-2-en-1-al", "But-3-en-1-al"],
//     correctAnswer: "But-2-enal",
//     difficulty: "BEGINNER",
//     createdAt: "2023-04-01T11:45:00Z",
//   },
//   {
//     id: "5",
//     subject: "MATHS",
//     question: "If f(x) = x² - 3x + 2, then f'(2) equals:",
//     options: ["1", "2", "3", "4"],
//     correctAnswer: "1",
//     difficulty: "BEGINNER",
//     createdAt: "2023-03-28T16:30:00Z",
//   },
//   {
//     id: "6",
//     subject: "MATHS",
//     question: "The integral ∫(1/x)dx equals:",
//     options: ["log|x| + C", "log(x) + C", "x log|x| + C", "x/log|x| + C"],
//     correctAnswer: "log|x| + C",
//     difficulty: "MODERATE",
//     createdAt: "2023-03-25T13:10:00Z",
//   },
//   {
//     id: "7",
//     subject: "BIOLOGY",
//     question: "Which of the following is not a function of the liver?",
//     options: [
//       "Production of bile",
//       "Storage of glycogen",
//       "Detoxification of harmful substances",
//       "Production of insulin",
//     ],
//     correctAnswer: "Production of insulin",
//     difficulty: "MODERATE",
//     createdAt: "2023-03-20T10:00:00Z",
//   },
//   {
//     id: "8",
//     subject: "BIOLOGY",
//     question:
//       "The process by which plants lose water in the form of water vapor is called:",
//     options: ["Transpiration", "Respiration", "Photosynthesis", "Guttation"],
//     correctAnswer: "Transpiration",
//     difficulty: "BEGINNER",
//     createdAt: "2023-03-15T08:45:00Z",
//   },
// ];

// export default function QuestionsPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
//   const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
//   const [activeTab, setActiveTab] = useState<string>("all");
//   const [openFolders, setOpenFolders] = useState<string[]>([
//     "PHYSICS",
//     "CHEMISTRY",
//     "MATHS",
//     "BIOLOGY",
//   ]);
//   const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];
//   const difficulties = ["BEGINNER", "MODERATE", "ADVANCED"];
//   const [open, setOpen] = useState(false);
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswer, setCorrectAnswer] = useState("");
//   const [solution, setSolution] = useState("");
//   const [subject, setSubject] = useState("PHYSICS");
//   const [difficulty, setDifficulty] = useState("BEGINNER");
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (solution.trim().length < 5) {
//       toast.error("❌ Solution must be at least 5 characters long.");
//       return;
//     }

//     const payload = {
//       question,
//       options,
//       correctAnswer,
//       solution,
//       subject,
//       difficulty,
//       image,
//     };

//     setLoading(true);

//     try {
//       const res = await fetch("/api/questions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         toast.success("✅ Question added successfully!");
//         setQuestion("");
//         setOptions(["", "", "", ""]);
//         setCorrectAnswer("");
//         setSolution("");
//         setImage(null);
//         setOpen(false);
//       } else {
//         const errorData = await res.json();
//         toast.error(`❌ Failed: ${errorData.error}`);
//       }
//     } catch (err) {
//       toast.error("❌ Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle folder open/close
//   const toggleFolder = (subject: string) => {
//     setOpenFolders((prev) =>
//       prev.includes(subject)
//         ? prev.filter((s) => s !== subject)
//         : [...prev, subject]
//     );
//   };

//   // Filter questions based on search query, subject, and difficulty
//   const filteredQuestions = mockQuestions.filter((question) => {
//     const matchesSearch = question.question
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesSubject =
//       subjectFilter === "ALL" || question.subject === subjectFilter;
//     const matchesDifficulty =
//       difficultyFilter === "ALL" || question.difficulty === difficultyFilter;
//     return matchesSearch && matchesSubject && matchesDifficulty;
//   });

//   // Group questions by subject
//   const questionsBySubject: Record<string, typeof mockQuestions> = {};
//   mockQuestions.forEach((question) => {
//     if (!questionsBySubject[question.subject]) {
//       questionsBySubject[question.subject] = [];
//     }
//     questionsBySubject[question.subject].push(question);
//   });

//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(date);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
//           <p className="text-muted-foreground">Manage your question bank</p>
//         </div>
//         <ToastContainer position="top-right" autoClose={3000} />
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-blue-600 hover:bg-blue-700">
//               <Plus className="mr-2 h-4 w-4" />
//               Add Question
//             </Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add New Question</DialogTitle>
//               <DialogDescription>
//                 Fill out the details to add a new question.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Subject and Difficulty */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label>Subject</Label>
//                   <Select value={subject} onValueChange={setSubject}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select subject" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {subjects.map((sub) => (
//                         <SelectItem key={sub} value={sub}>
//                           {sub}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label>Difficulty</Label>
//                   <Select value={difficulty} onValueChange={setDifficulty}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select difficulty" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {difficulties.map((level) => (
//                         <SelectItem key={level} value={level}>
//                           {level}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               {/* Question */}
//               <div>
//                 <Label>Question</Label>
//                 <Textarea
//                   placeholder="Type the question here"
//                   value={question}
//                   onChange={(e) => setQuestion(e.target.value)}
//                   rows={3}
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <Label>Upload Image (optional)</Label>
//                 <FileUpload onUpload={(url) => setImage(url)} />
//                 {image && (
//                   <div className="w-28 h-28 mt-2 border rounded-md overflow-hidden">
//                     <img
//                       src={image}
//                       alt="Uploaded"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Options */}
//               <div>
//                 <Label>Options</Label>
//                 <div className="space-y-2">
//                   {options.map((opt, idx) => (
//                     <Input
//                       key={idx}
//                       placeholder={`Option ${String.fromCharCode(65 + idx)}`}
//                       value={opt}
//                       onChange={(e) => {
//                         const updated = [...options];
//                         updated[idx] = e.target.value;
//                         setOptions(updated);
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Correct Answer */}
//               <div>
//                 <Label>Correct Answer (A/B/C/D)</Label>
//                 <Input
//                   placeholder="Enter A/B/C/D"
//                   value={correctAnswer}
//                   onChange={(e) =>
//                     setCorrectAnswer(e.target.value.toUpperCase())
//                   }
//                 />
//               </div>

//               {/* Solution */}
//               <div>
//                 <Label>Solution</Label>
//                 <Textarea
//                   placeholder="Explain the answer here"
//                   value={solution}
//                   onChange={(e) => setSolution(e.target.value)}
//                   rows={4}
//                 />
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full ${
//                     loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//                   }`}
//                 >
//                   {loading ? "Adding..." : "Add Question"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="space-y-4"
//       >
//         <div className="flex justify-between">
//           <TabsList>
//             <TabsTrigger value="all" className="relative">
//               All Questions
//               <Badge className="ml-2 px-1 py-0 absolute -top-1 -right-1 text-xs">
//                 {mockQuestions.length}
//               </Badge>
//             </TabsTrigger>
//             <TabsTrigger value="folders">Subject Folders</TabsTrigger>
//           </TabsList>
//         </div>

//         <TabsContent value="all" className="space-y-4">
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Question Bank</CardTitle>
//               <CardDescription>
//                 Manage all your questions in one place
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search questions..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-9"
//                   />
//                 </div>
//                 <Select value={subjectFilter} onValueChange={setSubjectFilter}>
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Filter by subject" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL">All Subjects</SelectItem>
//                     <SelectItem value="PHYSICS">Physics</SelectItem>
//                     <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
//                     <SelectItem value="MATHS">Mathematics</SelectItem>
//                     <SelectItem value="BIOLOGY">Biology</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={difficultyFilter}
//                   onValueChange={setDifficultyFilter}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Filter by difficulty" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALL">All Difficulties</SelectItem>
//                     <SelectItem value="BEGINNER">Beginner</SelectItem>
//                     <SelectItem value="MODERATE">Moderate</SelectItem>
//                     <SelectItem value="ADVANCED">Advanced</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-[300px]">
//                         <div className="flex items-center gap-1">
//                           Question
//                           <ArrowUpDown className="h-3 w-3" />
//                         </div>
//                       </TableHead>
//                       <TableHead>Subject</TableHead>
//                       <TableHead>Difficulty</TableHead>
//                       <TableHead>Created On</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredQuestions.map((question) => (
//                       <TableRow key={question.id}>
//                         <TableCell className="font-medium">
//                           {question.question.length > 60
//                             ? `${question.question.substring(0, 60)}...`
//                             : question.question}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className={`${
//                               question.subject === "PHYSICS"
//                                 ? "border-blue-200 bg-blue-50 text-blue-700"
//                                 : question.subject === "CHEMISTRY"
//                                 ? "border-green-200 bg-green-50 text-green-700"
//                                 : question.subject === "MATHS"
//                                 ? "border-purple-200 bg-purple-50 text-purple-700"
//                                 : "border-amber-200 bg-amber-50 text-amber-700"
//                             }`}
//                           >
//                             {question.subject.charAt(0) +
//                               question.subject.slice(1).toLowerCase()}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className={`${
//                               question.difficulty === "BEGINNER"
//                                 ? "border-green-200 bg-green-50 text-green-700"
//                                 : question.difficulty === "MODERATE"
//                                 ? "border-amber-200 bg-amber-50 text-amber-700"
//                                 : "border-red-200 bg-red-50 text-red-700"
//                             }`}
//                           >
//                             {question.difficulty.charAt(0) +
//                               question.difficulty.slice(1).toLowerCase()}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{formatDate(question.createdAt)}</TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" className="h-8 w-8 p-0">
//                                 <span className="sr-only">Open menu</span>
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                               <DropdownMenuItem>
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 <span>Edit</span>
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator />
//                               <DropdownMenuItem className="text-red-600">
//                                 <Trash className="mr-2 h-4 w-4" />
//                                 <span>Delete</span>
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))}

//                     {filteredQuestions.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={5} className="h-24 text-center">
//                           No questions found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="folders" className="space-y-4">
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle>Subject Folders</CardTitle>
//               <CardDescription>Browse questions by subject</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 {Object.entries(questionsBySubject).map(
//                   ([subject, questions]) => (
//                     <Collapsible
//                       key={subject}
//                       open={openFolders.includes(subject)}
//                       onOpenChange={() => toggleFolder(subject)}
//                       className="border rounded-md"
//                     >
//                       <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-50">
//                         <div className="flex items-center gap-3">
//                           <Folder
//                             className={`h-5 w-5 ${
//                               subject === "PHYSICS"
//                                 ? "text-blue-600"
//                                 : subject === "CHEMISTRY"
//                                 ? "text-green-600"
//                                 : subject === "MATHS"
//                                 ? "text-purple-600"
//                                 : "text-amber-600"
//                             }`}
//                           />
//                           <span className="font-medium">
//                             {subject.charAt(0) + subject.slice(1).toLowerCase()}
//                           </span>
//                           <Badge variant="secondary">{questions.length}</Badge>
//                         </div>
//                         <ChevronDown
//                           className={`h-4 w-4 transition-transform ${
//                             openFolders.includes(subject) ? "rotate-180" : ""
//                           }`}
//                         />
//                       </CollapsibleTrigger>
//                       <CollapsibleContent>
//                         <Separator />
//                         <div className="p-4 space-y-2">
//                           {questions.map((question) => (
//                             <div
//                               key={question.id}
//                               className="flex items-start gap-3 p-3 rounded-md border hover:bg-slate-50"
//                             >
//                               <FileQuestion className="h-5 w-5 text-slate-400 mt-0.5" />
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <Badge
//                                     variant="outline"
//                                     className={`${
//                                       question.difficulty === "BEGINNER"
//                                         ? "border-green-200 bg-green-50 text-green-700"
//                                         : question.difficulty === "MODERATE"
//                                         ? "border-amber-200 bg-amber-50 text-amber-700"
//                                         : "border-red-200 bg-red-50 text-red-700"
//                                     }`}
//                                   >
//                                     {question.difficulty.charAt(0) +
//                                       question.difficulty
//                                         .slice(1)
//                                         .toLowerCase()}
//                                   </Badge>
//                                   <span className="text-xs text-muted-foreground">
//                                     ID: {question.id}
//                                   </span>
//                                 </div>
//                                 <p className="text-sm">{question.question}</p>
//                               </div>
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button
//                                     variant="ghost"
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <span className="sr-only">Open menu</span>
//                                     <MoreHorizontal className="h-4 w-4" />
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                   <DropdownMenuItem>
//                                     <Edit className="mr-2 h-4 w-4" />
//                                     <span>Edit</span>
//                                   </DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   <DropdownMenuItem className="text-red-600">
//                                     <Trash className="mr-2 h-4 w-4" />
//                                     <span>Delete</span>
//                                   </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </div>
//                           ))}
//                         </div>
//                       </CollapsibleContent>
//                     </Collapsible>
//                   )
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

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

    if (solution.trim().length < 5) {
      toast.error("❌ Solution must be at least 5 characters long.");
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
        toast.success("✅ Question added successfully!");
        resetForm();
        setOpen(false);
        fetchQuestions(selectedSubject);
      } else {
        const errorData = await res.json();
        toast.error(`❌ Failed: ${errorData.error}`);
      }
    } catch (err) {
      toast.error("❌ Something went wrong.");
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
        toast.success("🗑️ Question deleted successfully.");
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
      toast.success("Question updated successfully");

      // Reset form & state
      setEditingQuestion(null);
      fetchQuestions(selectedSubject);
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update question");
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
