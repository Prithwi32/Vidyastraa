// "use client";

// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import {
//   Calendar,
//   Clock,
//   BookOpen,
//   ArrowRight,
//   Sun,
//   Moon,
//   Filter,
//   Search,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuCheckboxItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "next-themes";
// import Link from "next/link";
// import { getAllTests } from "@/app/actions/test";
// import Loader from "@/components/Loader";

// // Define types based on the model
// enum Category {
//   JEE = "JEE",
//   NEET = "NEET",
//   CRASH_COURSES = "CRASH_COURSES",
//   OTHER = "OTHER",
//   INDIVIDUAL = "INDIVIDUAL",
// }

// interface Test {
//   id: string;
//   title: string;
//   category: Category;
//   subjects: string[];
//   description?: string;
//   questions: number;
//   createdAt: Date;
// }

// // Get badge color based on category
// const getCategoryColor = (category: Category) => {
//   switch (category) {
//     case Category.INDIVIDUAL:
//       return "bg-emerald-500 hover:bg-emerald-600";
//     case Category.NEET:
//       return "bg-amber-500 hover:bg-amber-600";
//     case Category.JEE:
//       return "bg-rose-500 hover:bg-rose-600";
//     default:
//       return "bg-slate-500 hover:bg-slate-600";
//   }
// };

// export default function TestCardsGrid() {
//   const { theme, setTheme } = useTheme();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState<Category[]>(
//     Object.values(Category)
//   );
//   const [tests, setTests] = useState<Test[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getTests();
//   }, []);

//   const getTests = async () => {
//     setLoading(true);
//     try {
//       const res = await getAllTests();
//       if (res.success) {
//         const arr = [];

//         for (const test of res.tests || []) {
//           arr.push({
//             id: test.id,
//             title: test.title,
//             category: test.category as Category,
//             subjects: test.subjects,
//             description: test.description ?? "",
//             questions: test.questions.length,
//             createdAt: test.createdAt,
//           });
//         }

//         setTests(arr);
//       }
//     } catch (error) {
//       console.error("Error fetching tests:", error);
//     }finally {
//       setLoading(false);
//     }
//   };

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark");
//   };

//   // Filter tests based on search query and selected categories
//   const filteredTests = tests.filter((test) => {
//     const matchesSearch =
//       test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       false;
//     const matchesCategory = selectedCategories.includes(test.category);
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className={`min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950`}>
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
//             Available Tests
//           </h1>

//           <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
//               <Input
//                 type="text"
//                 placeholder="Search tests..."
//                 className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="flex gap-3">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
//                   >
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filter
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   {Object.values(Category).map((category) => (
//                     <DropdownMenuCheckboxItem
//                       key={category}
//                       checked={selectedCategories.includes(category)}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           setSelectedCategories([
//                             ...selectedCategories,
//                             category,
//                           ]);
//                         } else {
//                           setSelectedCategories(
//                             selectedCategories.filter((c) => c !== category)
//                           );
//                         }
//                       }}
//                     >
//                       {category.split("_").join(" ")}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={toggleTheme}
//                 className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
//               >
//                 <Sun className="h-4 w-4 hidden dark:block" />
//                 <Moon className="h-4 w-4 dark:hidden" />
//                 <span className="sr-only">Toggle theme</span>
//               </Button>
//             </div>
//           </div>
//         </div>

//         {!loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//           {filteredTests.map((test) => (
//             <TestCard key={test.id} test={test} />
//           ))}

//           {filteredTests.length === 0 && (
//             <div className="col-span-full py-12 text-center">
//               <p className="text-slate-500 dark:text-slate-400">
//                 No tests found matching your criteria.
//               </p>
//             </div>
//           )}
//         </div>}
//         {loading &&
//          <div className="col-span-full w-full py-20 place-items-center">
//           <Loader/>
//          </div>
//         }
//       </div>
//     </div>
//   );
// }

// function TestCard({ test }: { test: Test }) {
//   const [attemptCount, setAttemptCount] = useState(0);
//   const [formattedDate, setFormattedDate] = useState("");

//   useEffect(() => {
//     setAttemptCount(Math.floor(Math.random() * 10000));
//     setFormattedDate(format(test.createdAt, "MMM d, yyyy"));
//   }, [test.createdAt]);

//   const estimatedTime = Math.floor(test.questions / 0.9); // Rough estimate: 0.9 questions per minute

//   return (
//     <Card className="overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-full">
//       <CardContent className="p-5 flex-1">
//         <div className="flex justify-between items-start mb-3">
//           <Badge
//             className={`${getCategoryColor(
//               test.category
//             )} text-white font-medium`}
//           >
//             {test.category.split("_").join(" ")}
//           </Badge>
//           <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
//             {attemptCount.toLocaleString()} Attempts
//           </div>
//         </div>

//         <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
//           {test.title}
//         </h2>

//         {test.description && (
//           <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
//             {test.description}
//           </p>
//         )}

//         <div className="flex flex-wrap gap-2 mb-4">
//           {test.subjects.map((subject,idx) => (
//             <Badge
//               key={idx}
//               variant="outline"
//               className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
//             >
//               {subject}
//             </Badge>
//           ))}
//         </div>

//         <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
//           <div className="flex items-center gap-1">
//             <BookOpen className="w-4 h-4 flex-shrink-0" />
//             <span className="truncate">{test.questions} Questions</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Clock className="w-4 h-4 flex-shrink-0" />
//             <span className="truncate">{estimatedTime} Minutes</span>
//           </div>
//           <div className="flex items-center gap-1 col-span-2">
//             <Calendar className="w-4 h-4 flex-shrink-0" />
//             <span className="truncate">Created: {formattedDate}</span>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="px-5 pb-5 pt-0">
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Link className="w-full" href={`/tests/${test.id}`}>
//                 <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                   Take Test
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </Link>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Start this test now</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
  Filter,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Link from "next/link";
import { getAllTests } from "@/app/actions/test";
import Loader from "@/components/Loader";

// Define types based on the model
enum Category {
  JEE = "JEE",
  NEET = "NEET",
  CRASH_COURSES = "CRASH_COURSES",
  OTHER = "OTHER",
  INDIVIDUAL = "INDIVIDUAL",
}

interface Test {
  id: string;
  title: string;
  category: Category;
  subjects: string[];
  description?: string;
  questions: number;
  createdAt: Date;
  courseId: string | null;
  results: {
    id: string;
    score: number;
  }[];
  isEnrolled?: boolean;
}

// Get badge color based on category
const getCategoryColor = (category: Category) => {
  switch (category) {
    case Category.INDIVIDUAL:
      return "bg-emerald-500 hover:bg-emerald-600";
    case Category.NEET:
      return "bg-amber-500 hover:bg-amber-600";
    case Category.JEE:
      return "bg-rose-500 hover:bg-rose-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
};

export default function TestCardsGrid() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    Object.values(Category)
  );
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTests();
  }, [status]);

  const getTests = async () => {
    setLoading(true);
    try {
      const res = await getAllTests();
      if (res.success) {
        const tests = res.tests?.map((test) => ({
          id: test.id,
          title: test.title,
          category: test.category as Category,
          subjects: test.subjects,
          description: test.description ?? "",
          questions: test.questions.length,
          createdAt: test.createdAt,
          courseId: test.course?.id || null,
          results: test.results || [],
          isEnrolled: test.isEnrolled || false,
        })) || [];
        
        setTests(tests);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Filter tests based on search query and selected categories
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesCategory = selectedCategories.includes(test.category);
    return matchesSearch && matchesCategory;
  });

  const handleTestAction = (test: Test) => {
    if (status === "unauthenticated") {
      toast.error("Please login to take this test");
      router.push("/auth/signin");
      return;
    }

    if (test.courseId && !test.isEnrolled) {
      toast.error("Please enroll in the course to take this test");
      router.push(`/courses`);
      return;
    }

    if (test.results.length > 0) {
      router.push(
        `/student/dashboard/tests/${test.id}/result/${test.results[0].id}`
      );
    } else {
      router.push(`/student/dashboard/tests/${test.id}`);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Available Tests
          </h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="text"
                placeholder="Search tests..."
                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {Object.values(Category).map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category)
                          );
                        }
                      }}
                    >
                      {category.split("_").join(" ")}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>

        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onAction={handleTestAction}
                isAuthenticated={status === "authenticated"}
              />
            ))}

            {filteredTests.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">
                  No tests found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="col-span-full w-full py-20 place-items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

function TestCard({
  test,
  onAction,
  isAuthenticated,
}: {
  test: Test;
  onAction: (test: Test) => void;
  isAuthenticated: boolean;
}) {
  const [attemptCount, setAttemptCount] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setAttemptCount(Math.floor(Math.random() * 10000));
    setFormattedDate(format(test.createdAt, "MMM d, yyyy"));
  }, [test.createdAt]);

  const estimatedTime = Math.floor(test.questions / 0.9); // Rough estimate: 0.9 questions per minute

  const getButtonText = () => {
    if (!isAuthenticated) return "Take Test";
    if (test.courseId && !test.isEnrolled) return "Take Test";
    return test.results.length > 0 ? "View Results" : "Take Test";
  };

  const getTooltipContent = () => {
    if (!isAuthenticated) return "Login to take this test";
    if (test.courseId && !test.isEnrolled)
      return "Enroll in course to take this test";
    return test.results.length > 0
      ? "View your test results"
      : "Start this test now";
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <CardContent className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge
            className={`${getCategoryColor(
              test.category
            )} text-white font-medium`}
          >
            {test.category.split("_").join(" ")}
          </Badge>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {attemptCount.toLocaleString()} Attempts
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">
          {test.title}
        </h2>

        {test.description && (
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
            {test.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {test.subjects.map((subject, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            >
              {subject}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{test.questions} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{estimatedTime} Minutes</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Created: {formattedDate}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onAction(test)}
              >
                {getButtonText()}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipContent()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
