"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
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

// Mock data for tests
const mockTests = [
  {
    id: "1",
    title: "JEE Main Mock Test 1",
    category: "JEE",
    subjects: ["PHYSICS", "CHEMISTRY", "MATHS"],
    questionCount: 90,
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: "2",
    title: "JEE Advanced Practice Test",
    category: "JEE",
    subjects: ["PHYSICS", "CHEMISTRY", "MATHS"],
    questionCount: 54,
    createdAt: "2023-04-10T14:20:00Z",
  },
  {
    id: "3",
    title: "NEET Full Mock Test",
    category: "NEET",
    subjects: ["PHYSICS", "CHEMISTRY", "BIOLOGY"],
    questionCount: 180,
    createdAt: "2023-04-05T09:15:00Z",
  },
  {
    id: "4",
    title: "Physics Mechanics Test",
    category: "INDIVIDUAL",
    subjects: ["PHYSICS"],
    questionCount: 30,
    createdAt: "2023-04-01T11:45:00Z",
  },
  {
    id: "5",
    title: "Organic Chemistry Practice",
    category: "INDIVIDUAL",
    subjects: ["CHEMISTRY"],
    questionCount: 25,
    createdAt: "2023-03-28T16:30:00Z",
  },
  {
    id: "6",
    title: "Calculus Test",
    category: "INDIVIDUAL",
    subjects: ["MATHS"],
    questionCount: 20,
    createdAt: "2023-03-25T13:10:00Z",
  },
  {
    id: "7",
    title: "Biology Systems Test",
    category: "INDIVIDUAL",
    subjects: ["BIOLOGY"],
    questionCount: 40,
    createdAt: "2023-03-20T10:00:00Z",
  },
];

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">
            Manage your tests and assessments
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:text-white">
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
                {filteredTests.map((test) => (
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
                        }`}
                      >
                        {test.category}
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
                            {subject.charAt(0) + subject.slice(1).toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {test.questionCount}
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Test</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Export</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredTests.length === 0 && (
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
