"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  PlayCircle,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProtectedButtonLink from "./ProtectedButtonLink";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"jee" | "neet">("jee");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-16 md:pt-24">
      <div className="container relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Ace Your JEE & NEET Exams with <span className="text-yellow-700">Vidyastraa</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Comprehensive study materials, practice tests, and video courses
                to help you succeed in your competitive exams.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <ProtectedButtonLink target="/student/dashboard">
                Get Started <Rocket/>
              </ProtectedButtonLink>
              <Button className="p-5" size="sm" variant="outline" asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Expert educators with years of experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Comprehensive study materials and tests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Personalized learning experience</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg border bg-background p-4 shadow-xl">
              <div className="mb-4 flex gap-2 border-b pb-4">
                <Button
                  variant={activeTab === "jee" ? "default" : "outline"}
                  onClick={() => setActiveTab("jee")}
                  className="flex-1"
                >
                  JEE Preparation
                </Button>
                <Button
                  variant={activeTab === "neet" ? "default" : "outline"}
                  onClick={() => setActiveTab("neet")}
                  className="flex-1"
                >
                  NEET Preparation
                </Button>
              </div>

              <div
                className={cn(
                  "space-y-4",
                  activeTab === "jee" ? "block" : "hidden"
                )}
              >
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">JEE Study Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Physics, Chemistry & Mathematics
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">JEE Practice Tests</h3>
                    <p className="text-sm text-muted-foreground">
                      Chapter-wise & Full Syllabus
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">JEE Video Courses</h3>
                    <p className="text-sm text-muted-foreground">
                      Expert-led video lectures
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "space-y-4",
                  activeTab === "neet" ? "block" : "hidden"
                )}
              >
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">NEET Study Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Biology, Physics & Chemistry
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">NEET Practice Tests</h3>
                    <p className="text-sm text-muted-foreground">
                      Subject-wise & Full Tests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">NEET Video Courses</h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive video lectures
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-4 w-full">
                <Link href="/courses">Start Learning Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[200px] w-[200px] rounded-full bg-primary/20 blur-[100px]" />
      </div>
    </section>
  );
}
