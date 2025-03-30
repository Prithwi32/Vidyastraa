import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, Lightbulb, PlayCircle, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CourseCategories } from "@/components/course-categories"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Everything you need to excel in JEE & NEET
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our comprehensive platform provides all the resources you need to succeed in your competitive exams.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Study Materials</CardTitle>
                <CardDescription>
                  Access comprehensive PDFs, notes, and eBooks for JEE & NEET preparation.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/materials" passHref>
                  <Button variant="ghost" className="w-full">
                    Explore Materials <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Test System</CardTitle>
                <CardDescription>
                  Practice with chapter-wise tests, past year papers, and full syllabus mock exams.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/tests" passHref>
                  <Button variant="ghost" className="w-full">
                    Take Tests <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <PlayCircle className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4">Video Courses</CardTitle>
                <CardDescription>Stream high-quality video lectures from expert educators.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/courses" passHref>
                  <Button variant="ghost" className="w-full">
                    Watch Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Course Categories Section */}
        <CourseCategories />

        {/* Why Choose Us Section */}
        <section className="container py-12 md:py-24 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Why Choose EduLearn?</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our platform is designed with students in mind, providing the best learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Expert Educators",
                description: "Learn from top educators with years of experience in JEE & NEET coaching.",
              },
              {
                title: "Comprehensive Content",
                description: "Access a vast library of study materials, tests, and video courses.",
              },
              {
                title: "Personalized Learning",
                description: "Track your progress and get personalized recommendations.",
              },
              {
                title: "Interactive Tests",
                description: "Practice with interactive tests and get instant feedback.",
              },
              {
                title: "Mobile Friendly",
                description: "Access your courses anytime, anywhere with our mobile-optimized platform.",
              },
              {
                title: "Regular Updates",
                description: "Stay updated with the latest exam patterns and syllabus changes.",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="mt-1 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exam Preparation Tabs */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Prepare for Your Exams</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Choose your exam and start your preparation journey with us.
            </p>
          </div>

          <div className="mx-auto max-w-4xl pt-12">
            <Tabs defaultValue="jee" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="jee">JEE Preparation</TabsTrigger>
                <TabsTrigger value="neet">NEET Preparation</TabsTrigger>
              </TabsList>
              <TabsContent value="jee" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>JEE Main & Advanced Preparation</CardTitle>
                    <CardDescription>Comprehensive preparation for JEE Main and Advanced exams.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        "Complete Physics, Chemistry & Mathematics coverage",
                        "Chapter-wise tests and solutions",
                        "Previous year papers with detailed solutions",
                        "Live doubt solving sessions",
                        "Mock tests with JEE pattern",
                        "Performance analytics and weak area identification",
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Start JEE Preparation <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="neet" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>NEET Preparation</CardTitle>
                    <CardDescription>Comprehensive preparation for NEET medical entrance exam.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[
                        "Complete Biology, Physics & Chemistry coverage",
                        "NCERT-based comprehensive study material",
                        "Previous year NEET papers with solutions",
                        "Subject-wise and topic-wise tests",
                        "Full-length NEET mock tests",
                        "Personalized study planner",
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Start NEET Preparation <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <section className="container py-12 md:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to Start Your Preparation?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join thousands of students who are already preparing with EduLearn.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg">Get Started for Free</Button>
              <Button size="lg" variant="outline">
                Explore Courses
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

