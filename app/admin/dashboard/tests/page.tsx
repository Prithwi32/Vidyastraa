// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   ArrowUpDown,
//   Download,
//   Eye,
//   MoreHorizontal,
//   Plus,
//   Search,
//   Trash,
//   Edit,
//   Loader2,
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
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { deleteTest, getAllTests } from "@/app/actions/test";
// import Loader from "@/components/Loader";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { toast, ToastContainer } from "react-toastify";

// type Test = {
//   id: string;
//   title: string;
//   category: string;
//   subjects: string[];
//   description?: string;
//   questions: number;
//   createdAt: Date;
// };

// export default function TestsPage() {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
//   const [mockTests, setMockTests] = useState<Test[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     getTests();
//   }, []);

//   const getTests = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllTests();

//       if (res.success) {
//         const tests = res.tests || [];

//         const arr = [];

//         for (const test of tests) {
//           arr.push({
//             id: test.id,
//             title: test.title,
//             category: test.category,
//             subjects: test.subjects,
//             description: test.description ?? "",
//             questions: test.questions.length,
//             createdAt: test.createdAt,
//           });
//         }

//         setMockTests(arr);
//       }
//     } catch (error) {
//       console.error("Error fetching tests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteTest = async (testId: string) => {
//     setDeleting(true);

//     try {
//       const res = await deleteTest(testId);
//       if (res.success) {
//         toast.success("Test deleted successfully!");
//         // Multiple approaches for better reliability
//         router.refresh();
//         setMockTests((prev) => prev.filter((t) => t.id !== testId));
//       } else {
//         toast.error(res.message || "An error occurred while deleting test");
//       }
//     } catch (error) {
//       console.error("Error deleting test:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setDeleteDialogOpen(false);
//       setDeleting(false);
//     }
//   };

//   // Filter tests based on search query and category
//   const filteredTests = mockTests.filter((test) => {
//     const matchesSearch = test.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       categoryFilter === "ALL" || test.category === categoryFilter;
//     return matchesSearch && matchesCategory;
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
//       <ToastContainer />
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
//           <p className="text-muted-foreground">
//             Manage your tests and assessments
//           </p>
//         </div>
//         <Button
//           asChild
//           className="bg-blue-600 hover:bg-blue-700 dark:text-white"
//         >
//           <Link href="/admin/dashboard/tests/create">
//             <Plus className="mr-2 h-4 w-4" />
//             Create Test
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle>All Tests</CardTitle>
//           <CardDescription>
//             View and manage all your created tests
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search tests..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//               <SelectTrigger className="w-full sm:w-[180px]">
//                 <SelectValue placeholder="Filter by category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All Categories</SelectItem>
//                 <SelectItem value="JEE">JEE</SelectItem>
//                 <SelectItem value="NEET">NEET</SelectItem>
//                 <SelectItem value="INDIVIDUAL">Individual</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[300px]">
//                     <div className="flex items-center gap-1">
//                       Test Name
//                       <ArrowUpDown className="h-3 w-3" />
//                     </div>
//                   </TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>Subjects</TableHead>
//                   <TableHead className="text-center">Questions</TableHead>
//                   <TableHead>Created On</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {!loading &&
//                   filteredTests.map((test) => (
//                     <TableRow key={test.id}>
//                       <TableCell className="font-medium">
//                         {test.title}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant="outline"
//                           className={`${
//                             test.category === "JEE"
//                               ? "border-blue-200 bg-blue-50 text-blue-700"
//                               : test.category === "NEET"
//                               ? "border-green-200 bg-green-50 text-green-700"
//                               : "border-purple-200 bg-purple-50 text-purple-700"
//                           }`}
//                         >
//                           {test.category.split("_").join(" ")}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex flex-wrap gap-1">
//                           {test.subjects.map((subject) => (
//                             <Badge
//                               key={subject}
//                               variant="secondary"
//                               className="text-xs"
//                             >
//                               {subject.charAt(0) +
//                                 subject.slice(1).toLowerCase()}
//                             </Badge>
//                           ))}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-center">
//                         {test.questions}
//                       </TableCell>
//                       <TableCell>{formatDate(test.createdAt)}</TableCell>
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                               <span className="sr-only">Open menu</span>
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuItem
//                               onClick={() =>
//                                 router.push(
//                                   `/admin/dashboard/tests/${test.id}/view`
//                                 )
//                               }
//                             >
//                               <Eye className="mr-2 h-4 w-4" />
//                               <span>View Test</span>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() =>
//                                 router.push(
//                                   `/admin/dashboard/tests/${test.id}/edit`
//                                 )
//                               }
//                             >
//                               <Edit className="mr-2 h-4 w-4" />
//                               <span>Edit Test</span>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem
//                               onClick={() =>
//                                 window.open(`/api/export/tests/${test.id}`)
//                               }
//                             >
//                               <Download className="mr-2 h-4 w-4" />
//                               <span>Export as PDF</span>
//                             </DropdownMenuItem>

//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem
//                               className="text-red-600 focus:bg-red-50 dark:focus:bg-red-800"
//                               onSelect={(e) => e.preventDefault()} // Prevent immediate closing
//                             >
//                               <Dialog
//                                 open={deleteDialogOpen}
//                                 onOpenChange={setDeleteDialogOpen}
//                               >
//                                 <DialogTrigger asChild>
//                                   <div className="flex items-center w-full">
//                                     <Trash className="mr-2 h-4 w-4" />
//                                     <span>Delete</span>
//                                   </div>
//                                 </DialogTrigger>
//                                 <DialogContent>
//                                   <DialogHeader>
//                                     <DialogTitle>Delete Test</DialogTitle>
//                                     <DialogDescription>
//                                       Are you sure you want to delete this test?
//                                       This action cannot be undone.
//                                     </DialogDescription>
//                                   </DialogHeader>
//                                   <DialogFooter>
//                                     <Button
//                                       variant="outline"
//                                       onClick={() => setDeleteDialogOpen(false)}
//                                       disabled={deleting}
//                                     >
//                                       Cancel
//                                     </Button>
//                                     <Button
//                                       variant="destructive"
//                                       onClick={() => handleDeleteTest(test.id)}
//                                       disabled={deleting}
//                                     >
//                                       {deleting ? (
//                                         <>
//                                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                           Deleting...
//                                         </>
//                                       ) : (
//                                         "Delete Test"
//                                       )}
//                                     </Button>
//                                   </DialogFooter>
//                                 </DialogContent>
//                               </Dialog>
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}

//                 {loading && (
//                   <TableRow>
//                     <TableCell></TableCell>
//                     <TableCell className="hidden lg:table-cell"></TableCell>
//                     <TableCell
//                       colSpan={6}
//                       className="h-16 w-full flex justify-center items-center"
//                     >
//                       <Loader />
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!loading && filteredTests.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-24 text-center">
//                       No tests found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  Edit,
  Loader2,
  Users,
  BarChart,
  FileQuestion,
  ListChecks,
  CircleHelp,
  AlignJustify,
  SplitSquareVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteTest, getAllTests } from "@/app/actions/test"
import Loader from "@/components/Loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast, ToastContainer } from "react-toastify"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Test = {
  id: string
  title: string
  category: string
  subjects: string[]
  description?: string
  questions: {
    id: string
    question: {
      type: "MCQ" | "MULTI_SELECT" | "ASSERTION_REASON" | "FILL_IN_BLANK" | "MATCHING"
    }
  }[]
  createdAt: Date
  attempts?: number
}

export default function TestsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")
  const [mockTests, setMockTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [testToDelete, setTestToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    getTests()
  }, [])

  const getTests = async () => {
    setLoading(true)
    try {
      const res = await getAllTests()

      if (res.success) {
        const tests = res.tests || []

        const arr = []

        for (const test of tests) {
          arr.push({
            id: test.id,
            title: test.title,
            category: test.category,
            subjects: test.subjects,
            description: test.description ?? "",
            questions: test.questions,
            createdAt: test.createdAt,
          })
        }

        setMockTests(arr)
      }
    } catch (error) {
      console.error("Error fetching tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTest = async (testId: string) => {
    setDeleting(true)

    try {
      const res = await deleteTest(testId)
      if (res.success) {
        toast.success("Test deleted successfully!")
        // Multiple approaches for better reliability
        router.refresh()
        setMockTests((prev) => prev.filter((t) => t.id !== testId))
      } else {
        toast.error(res.message || "An error occurred while deleting test")
      }
    } catch (error) {
      console.error("Error deleting test:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setDeleteDialogOpen(false)
      setDeleting(false)
      setTestToDelete(null)
    }
  }

  // Filter tests based on search query, category, and active tab
  const filteredTests = mockTests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "ALL" || test.category === categoryFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "jee" && test.category === "JEE") ||
      (activeTab === "neet" && test.category === "NEET") ||
      (activeTab === "other" && test.category !== "JEE" && test.category !== "NEET")

    return matchesSearch && matchesCategory && matchesTab
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Calculate question type distribution for a test
  const getQuestionTypeDistribution = (test: Test) => {
    const distribution: Record<string, number> = {
      MCQ: 0,
      MULTI_SELECT: 0,
      ASSERTION_REASON: 0,
      FILL_IN_BLANK: 0,
      MATCHING: 0,
    }

    test.questions.forEach((q) => {
      if (q.question && q.question.type) {
        distribution[q.question.type] = (distribution[q.question.type] || 0) + 1
      } else {
        // Default to MCQ for backward compatibility
        distribution.MCQ = (distribution.MCQ || 0) + 1
      }
    })

    return distribution
  }

  // Get question type badge color
  const getQuestionTypeBadgeColor = (type: string) => {
    switch (type) {
      case "MCQ":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "MULTI_SELECT":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "ASSERTION_REASON":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "FILL_IN_BLANK":
        return "bg-green-100 text-green-800 border-green-200"
      case "MATCHING":
        return "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get question type icon
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "MCQ":
        return <FileQuestion className="h-4 w-4" />
      case "MULTI_SELECT":
        return <ListChecks className="h-4 w-4" />
      case "ASSERTION_REASON":
        return <CircleHelp className="h-4 w-4" />
      case "FILL_IN_BLANK":
        return <AlignJustify className="h-4 w-4" />
      case "MATCHING":
        return <SplitSquareVertical className="h-4 w-4" />
      default:
        return <FileQuestion className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">Manage your tests and assessments</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:text-white">
          <Link href="/admin/dashboard/tests/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Test
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{mockTests.length}</CardTitle>
            <CardDescription>Total Tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Across all categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{mockTests.reduce((sum, test) => sum + (test.attempts || 0), 0)}</CardTitle>
            <CardDescription>Total Attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">By all students</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {mockTests.reduce((sum, test) => sum + test.questions.length, 0)}
            </CardTitle>
            <CardDescription>Total Questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">In all tests</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Tests</CardTitle>
          <CardDescription>View and manage all your created tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Tests</TabsTrigger>
              <TabsTrigger value="jee">JEE</TabsTrigger>
              <TabsTrigger value="neet">NEET</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="JEE">JEE</SelectItem>
                <SelectItem value="NEET">NEET</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="CRASH_COURSES">Crash Courses</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-1">
                      Test Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead className="text-center">Question Types</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading &&
                  filteredTests.map((test) => {
                    const questionTypeDistribution = getQuestionTypeDistribution(test)

                    return (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.title}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              test.category === "JEE"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : test.category === "NEET"
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : "border-purple-200 bg-purple-50 text-purple-700"
                            } text-center`}
                          >
                            {test.category.split("_").join(" ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {test.subjects.map((subject) => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject.charAt(0) + subject.slice(1).toLowerCase()}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{test.questions.length}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {Object.entries(questionTypeDistribution)
                              .filter(([_, count]) => count > 0)
                              .map(([type, count]) => (
                                <Badge
                                  key={type}
                                  variant="outline"
                                  className={`text-xs ${getQuestionTypeBadgeColor(type)}`}
                                >
                                  {type === "MCQ"
                                    ? "MCQ"
                                    : type === "MULTI_SELECT"
                                      ? "Multi"
                                      : type === "ASSERTION_REASON"
                                        ? "A-R"
                                        : type === "FILL_IN_BLANK"
                                          ? "Fill"
                                          : type === "MATCHING"
                                            ? "Match"
                                            : type}
                                  : {count}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(test.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/tests/${test.id}/view`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Test</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/tests/${test.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Test</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/api/export/tests/${test.id}`)}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Export as PDF</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:bg-red-50 dark:focus:bg-red-800"
                                onClick={() => {
                                  setTestToDelete(test.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                {loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader />
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && filteredTests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-muted-foreground mb-2">No tests found.</p>
                        {searchQuery || categoryFilter !== "ALL" ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("")
                              setCategoryFilter("ALL")
                            }}
                          >
                            Clear Filters
                          </Button>
                        ) : (
                          <Button variant="outline" asChild>
                            <Link href="/admin/dashboard/tests/create">Create Your First Test</Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this test? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setTestToDelete(null)
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => testToDelete && handleDeleteTest(testToDelete)}
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
  )
}
