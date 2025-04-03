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
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    async function fetchEnrolledCourses() {
      if (status === "authenticated") {
        try {
          const res = await axios.get("/api/courses/enrolled");
          const enrolledIds = res.data.map((enrollment: any) => enrollment.courseId);
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
        return;
      }

      const res = await fetch("/api/payments/createOrder", {
        method: "POST",
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

              const userId = session?.user?.id;
              if (!userId) {
                toast.error("User not authenticated!");
                return;
              }

              // Store payment & enroll user
              await fetch("/api/payments/processPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  courseId,
                  paymentId: response.razorpay_payment_id,
                  amount: price,
                  status: "SUCCESS",
                }),
              });

              setEnrolledCourses([...enrolledCourses, courseId]);
              toast.success("Enrollment successful! You are now enrolled.");
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

  return (
    <div className="container py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">
        Our Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-40 w-full object-cover rounded-md mb-4"
                    />
                  )}
                  <CardTitle>{course.title}</CardTitle>
                  {course.subtitle && (
                    <p className="text-sm text-gray-500">{course.subtitle}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {course.detailedDescription}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Key Topics:</strong> {course.keyTopics.join(", ")}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Difficulty:</strong> {course.difficultyLevel}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p className="text-lg font-semibold mt-2 text-green-800">
                    ₹{course.price}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Category:</strong> {course.category}
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
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
