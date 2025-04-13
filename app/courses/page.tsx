"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
interface Course {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnail?: string | null;
  detailedDescription: string;
  keyTopics: string[];
  difficultyLevel: "BEGINNER" | "MODERATE" | "ADVANCED";
  duration: string;
  price: number;
  category: "JEE" | "NEET" | "CRASH_COURSES" | "OTHER";
}

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const { data: session, status } = useSession();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data.courses);
        setAllCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    async function fetchEnrolledCourses() {
      if (status === "authenticated") {
        try {
          const res = await axios.get("/api/courses/enrolled");
          const enrolledIds = res.data.map((enrollment: any) => enrollment.id);
          setEnrolledCourses(enrolledIds);
        } catch (error) {
          console.error("Error fetching enrolled courses:", error);
        }
      }
    }

    fetchCourses();
    fetchEnrolledCourses();
  }, [status]);

  const handlePayment = async (courseId: string, price: number) => {
    try {
      if (status !== "authenticated") {
        toast.error("Please log in to purchase a course.");
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
        return;
      }

      const res = await fetch("/api/payments/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100 }),
      });
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZOR_KEY_ID,
        order_id: data.id,
        handler: async function (response: any) {
          try {
            console.log("Razorpay Response:", response);

            // Verify the payment
            const verifyRes = await fetch("/api/payments/verifyOrder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.isOk) {
              toast.success("Payment Successful!");

              // Store payment & enroll user
              await fetch("/api/payments/processPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: session?.user?.id,
                  courseId,
                  paymentId: response.razorpay_payment_id,
                  amount: price,
                  status: "SUCCESS",
                }),
              });

              setEnrolledCourses([...enrolledCourses, courseId]);
              toast.success("Enrollment successful!");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed.");
          }
        },
      };

      const payment = new (window as any).Razorpay(options);
      payment.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Payment initiation failed.");
    }
  };

  const handleFilter = () => {
    let filtered = [...allCourses];
    if (categoryFilter) {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }
    if (difficultyFilter) {
      filtered = filtered.filter((c) => c.difficultyLevel === difficultyFilter);
    }
    setCourses(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [categoryFilter, difficultyFilter]);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container py-12">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">
          Our Courses
        </h2>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10">
          <Select onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JEE">JEE</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="CRASH_COURSES">Crash Courses</SelectItem>
              <SelectItem value="OTHER">Others</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="MODERATE">Moderate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>

          {(categoryFilter || difficultyFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setCategoryFilter("");
                setDifficultyFilter("");
                setCourses(allCourses);
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {courses.length === 0 ? (
              <p className="text-center col-span-full text-muted-foreground">
                No courses match your filter.
              </p>
            ) : (
              courses.map((course: any) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300">
                    <CardHeader>
                      <img
                        src={course.thumbnail || "/placeholder.png"}
                        alt={course.title}
                        className="h-40 w-full object-cover rounded-md mb-4"
                      />
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {course.subtitle}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2 line-clamp-3">
                        {course.detailedDescription}
                      </p>
                      <p className="text-sm">
                        <strong>Difficulty:</strong> {course.difficultyLevel}
                      </p>
                      <p className="text-sm">
                        <strong>Duration:</strong> {course.duration}
                      </p>
                      <p className="text-lg font-semibold mt-2 text-green-700">
                        ₹{course.price}
                      </p>
                    </CardContent>
                    <CardFooter>
                      {enrolledCourses.includes(course.id) ? (
                        <Button className="w-full" disabled>
                          Enrolled ✅
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePayment(course.id, course.price)}
                          className="w-full"
                        >
                          Buy Course <ArrowRight className="ml-2" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
