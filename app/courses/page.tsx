"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import Script from "next/script";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnail?: string | null;
  shortDescription?: string | null;
  detailedDescription: string;
  keyTopics: string[];
  difficultyLevel: "BEGINNER" | "MODERATE" | "ADVANCED";
  duration: string;
  features: string[];
  price: number;
  category: "JEE" | "NEET" | "CRASH_COURSES" | "OTHER";
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  const handlePayment = async (courseId: string, price: number) => {
    try {
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

            const verifyRes = await fetch("/api/payments/verifyOrder", {
              method: "POST",
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            console.log("Verify Order Response:", verifyData);

            verifyData.isOk ? toast.success("Payment Successful!") : toast.error("Payment verification failed.");
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
      <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>
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
                  {course.subtitle && <p className="text-sm text-gray-500">{course.subtitle}</p>}
                </CardHeader>
                <CardContent>
                  {course.shortDescription && <p className="mb-2">{course.shortDescription}</p>}
                  <p className="text-sm text-gray-600 mb-2">{course.detailedDescription}</p>
                  <p className="text-sm mb-1"><strong>Key Topics:</strong> {course.keyTopics.join(", ")}</p>
                  <p className="text-sm mb-1"><strong>Difficulty:</strong> {course.difficultyLevel}</p>
                  <p className="text-sm mb-1"><strong>Duration:</strong> {course.duration}</p>
                  <p className="text-sm mb-1"><strong>Features:</strong> {course.features.join(", ")}</p>
                  <p className="text-lg font-semibold mt-2">₹{course.price}</p>
                  <p className="text-sm mt-1"><strong>Category:</strong> {course.category}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handlePayment(course.id, course.price)} className="w-full">
                    Buy Course <ArrowRight className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


