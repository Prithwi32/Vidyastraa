"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteTest, getAllTests } from "@/app/actions/test";
import Loader from "@/components/Loader";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast, ToastContainer } from "react-toastify";

type Test = {
  id: string;
  title: string;
  category: string;
  subjects: string[];
  description?: string;
  questions: number;
  createdAt: Date;
};

export default function TestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [mockTests, setMockTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getTests();
  }, []);

  const getTests = async () => {
    setLoading(true);
    try {
      const res = await getAllTests();

      if (res.success) {
        const tests = res.tests || [];

        const arr = [];

        for (const test of tests) {
          arr.push({
            id: test.id,
            title: test.title,
            category: test.category,
            subjects: test.subjects,
            description: test.description ?? "",
            questions: test.questions.length,
            createdAt: test.createdAt,
          });
        }

        setMockTests(arr);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    setDeleting(true);
    
    try {
      const res = await deleteTest(testId);
      if (res.success) {
        toast.success("Test deleted successfully!");
        // Multiple approaches for better reliability
        router.refresh();
        setMockTests(prev => prev.filter(t => t.id !== testId)); 
      } else {
        toast.error(res.message || "An error occurred while deleting test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setDeleting(false);
    }
  };

  // Filter tests based on search query and category
  const filteredTests = mockTests.filter((test) => {
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">
            Manage your tests and assessments
          </p>
        </div>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 dark:text-white"
        >
          <Link href="/admin/dashboard/tests/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Test
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Tests</CardTitle>
          <CardDescription>
            View and manage all your created tests
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Created On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading &&
                  filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">
                        {test.title}
                      </TableCell>
                      <TableCell>
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
                          {test.category.split("_").join(" ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {test.subjects.map((subject) => (
                            <Badge
                              key={subject}
                              variant="secondary"
                              className="text-xs"
                            >
                              {subject.charAt(0) +
                                subject.slice(1).toLowerCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {test.questions}
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
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/tests/${test.id}/view`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Test</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/admin/dashboard/tests/${test.id}/edit`
                                )
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Test</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              <span>Export</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-red-50 dark:focus:bg-red-800"
                              onSelect={(e) => e.preventDefault()} // Prevent immediate closing
                            >
                              <Dialog
                                open={deleteDialogOpen}
                                onOpenChange={setDeleteDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <div className="flex items-center w-full">
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </div>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Test</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this test?
                                      This action cannot be undone.
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
                                      onClick={()=>handleDeleteTest(test.id)}
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
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}

                {loading && (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="hidden lg:table-cell"></TableCell>
                    <TableCell
                      colSpan={6}
                      className="h-16 w-full flex justify-center items-center"
                    >
                      <Loader />
                    </TableCell>
                  </TableRow>
                )}

                {!loading && filteredTests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No tests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
