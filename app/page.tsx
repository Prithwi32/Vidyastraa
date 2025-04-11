// import Link from "next/link";
// import {
//   BookOpen,
//   CheckCircle,
//   Lightbulb,
//   PlayCircle,
//   Rocket,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Testimonials } from "@/components/testimonials";
// import { FAQ } from "@/components/faq";
// import { CourseCategories } from "@/components/course-categories";
// import { HeroSection } from "@/components/hero-section";
// import { Footer } from "@/components/footer";
// import { Navbar } from "@/components/navbar";
// import ProtectedButtonLink from "@/components/ProtectedButtonLink";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <HeroSection />

//         {/* Features Section */}
//         <section className="container py-12 md:py-24">
//           <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
//             <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
//               Everything you need to excel in JEE & NEET
//             </h2>
//             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               Our comprehensive platform provides all the resources you need to
//               succeed in your competitive exams.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <BookOpen className="h-10 w-10 text-primary" />
//                 <CardTitle className="mt-4">Study Materials</CardTitle>
//                 <CardDescription>
//                   Access comprehensive PDFs, notes, and eBooks for JEE & NEET
//                   preparation.
//                 </CardDescription>
//               </CardHeader>
//               <CardFooter>
//                 <ProtectedButtonLink target="/student/dashboard/materials">
//                   Explore Materials
//                 </ProtectedButtonLink>
//               </CardFooter>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <Lightbulb className="h-10 w-10 text-primary" />
//                 <CardTitle className="mt-4">Test System</CardTitle>
//                 <CardDescription>
//                   Practice with chapter-wise tests, past year papers, and full
//                   syllabus mock exams.
//                 </CardDescription>
//               </CardHeader>
//               <CardFooter>
//                 <ProtectedButtonLink target="/student/dashboard/tests">
//                   Take Tests
//                 </ProtectedButtonLink>
//               </CardFooter>
//             </Card>
//             <Card>
//               <CardHeader>
//                 <PlayCircle className="h-10 w-10 text-primary" />
//                 <CardTitle className="mt-4">Video Courses</CardTitle>
//                 <CardDescription>
//                   Stream high-quality video lectures from expert educators.
//                 </CardDescription>
//               </CardHeader>
//               <CardFooter>
//                 <ProtectedButtonLink target="/student/dashboard/videos">
//                   Watch Videos
//                 </ProtectedButtonLink>
//               </CardFooter>
//             </Card>
//           </div>
//         </section>

//         {/* Course Categories Section */}
//         <CourseCategories />

//         {/* Why Choose Us Section */}
//         <section className="container py-12 md:py-24 bg-muted/50">
//           <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
//             <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
//               Why Choose Vidyastraa?
//             </h2>
//             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               Our platform is designed with students in mind, providing the best
//               learning experience.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
//             {[
//               {
//                 title: "Expert Educators",
//                 description:
//                   "Learn from top educators with years of experience in JEE & NEET coaching.",
//               },
//               {
//                 title: "Comprehensive Content",
//                 description:
//                   "Access a vast library of study materials, tests, and video courses.",
//               },
//               {
//                 title: "Personalized Learning",
//                 description:
//                   "Track your progress and get personalized recommendations.",
//               },
//               {
//                 title: "Interactive Tests",
//                 description:
//                   "Practice with interactive tests and get instant feedback.",
//               },
//               {
//                 title: "Mobile Friendly",
//                 description:
//                   "Access your courses anytime, anywhere with our mobile-optimized platform.",
//               },
//               {
//                 title: "Regular Updates",
//                 description:
//                   "Stay updated with the latest exam patterns and syllabus changes.",
//               },
//             ].map((item, index) => (
//               <div key={index} className="flex items-start gap-4">
//                 <CheckCircle className="mt-1 h-6 w-6 text-primary" />
//                 <div>
//                   <h3 className="font-semibold">{item.title}</h3>
//                   <p className="text-muted-foreground">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Testimonials Section */}
//         <Testimonials />

//         {/* FAQ Section */}
//         <FAQ />

//         {/* CTA Section */}
//         <section className="container py-12 md:py-24">
//           <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
//             <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
//               Ready to Start Your Preparation?
//             </h2>
//             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               Join thousands of students who are already preparing with
//               Vidyastraa.
//             </p>
//             <div className="flex flex-col gap-4 sm:flex-row">
//               <ProtectedButtonLink target="/student/dashboard">
//                 Get Started for Free
//               </ProtectedButtonLink>
//               <Button size="lg" variant="outline">
//                 <Link href="/courses">Explore Courses</Link>
//                 <Rocket />
//               </Button>
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  Lightbulb,
  PlayCircle,
  Rocket,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import { CourseCategories } from "@/components/course-categories";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import ProtectedButtonLink from "@/components/ProtectedButtonLink";

export default function Home() {
  // Refs for scroll animations
  const featuresRef = useRef(null);
  const whyChooseRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if elements are in view
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const whyChooseInView = useInView(whyChooseRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute bottom-0 right-20 h-80 w-80 rounded-full bg-blue-100 dark:bg-blue-900/20 blur-3xl"
        />
      </div>

      <Navbar />
      <main className="flex-1">
        <HeroSection />

        {/* Features Section */}
        <section className="container py-12 md:py-24 relative">
          <motion.div
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Everything you need to excel in JEE & NEET
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            >
              Our comprehensive platform provides all the resources you need to
              succeed in your competitive exams.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-3"
          >
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Study Materials"
              description="Access comprehensive PDFs, notes, and eBooks for JEE & NEET preparation."
              buttonText="Explore Materials"
              buttonTarget="/student/dashboard/materials"
              variants={itemVariants}
            />
            <FeatureCard
              icon={<Lightbulb className="h-10 w-10 text-primary" />}
              title="Test System"
              description="Practice with chapter-wise tests, past year papers, and full syllabus mock exams."
              buttonText="Take Tests"
              buttonTarget="/student/dashboard/tests"
              variants={itemVariants}
            />
            <FeatureCard
              icon={<PlayCircle className="h-10 w-10 text-primary" />}
              title="Video Courses"
              description="Stream high-quality video lectures from expert educators."
              buttonText="Watch Videos"
              buttonTarget="/student/dashboard/videos"
              variants={itemVariants}
            />
          </motion.div>
        </section>

        {/* Course Categories Section */}
        <CourseCategories />

        {/* Why Choose Us Section */}
        <section className="container py-12 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30 rounded-3xl my-8">
          <motion.div
            ref={whyChooseRef}
            initial="hidden"
            animate={whyChooseInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" />
              <span>Why Students Love Us</span>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Why Choose Vidyastraa?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            >
              Our platform is designed with students in mind, providing the best
              learning experience.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={whyChooseInView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Expert Educators",
                description:
                  "Learn from top educators with years of experience in JEE & NEET coaching.",
              },
              {
                title: "Comprehensive Content",
                description:
                  "Access a vast library of study materials, tests, and video courses.",
              },
              {
                title: "Personalized Learning",
                description:
                  "Track your progress and get personalized recommendations.",
              },
              {
                title: "Interactive Tests",
                description:
                  "Practice with interactive tests and get instant feedback.",
              },
              {
                title: "Mobile Friendly",
                description:
                  "Access your courses anytime, anywhere with our mobile-optimized platform.",
              },
              {
                title: "Regular Updates",
                description:
                  "Stay updated with the latest exam patterns and syllabus changes.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <section className="container py-12 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl -z-10"></div>

          <motion.div
            ref={ctaRef}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4"
            >
              <Star className="h-4 w-4 fill-blue-500" />
              <span>Join Thousands of Successful Students</span>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              Ready to Start Your Preparation?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
            >
              Join thousands of students who are already preparing with
              Vidyastraa.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-4 sm:flex-row mt-6"
            >
              <AnimatedProtectedButtonLink
                target="/student/dashboard"
                className="px-6 py-3 text-base font-medium h-12 w-full bg-blue-600"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </AnimatedProtectedButtonLink>
              <AnimatedButton
                variant="outline"
                className="px-6 py-3 text-base font-medium h-12"
              >
                <Link href="/courses" className="flex items-center">
                  Explore Courses
                  <Rocket className="ml-2 h-4 w-4" />
                </Link>
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Animated feature card component
function FeatureCard({
  icon,
  title,
  description,
  buttonText,
  buttonTarget,
  variants,
}) {
  return (
    <motion.div variants={variants} whileHover={{ y: -5 }} className="group">
      <Card className="h-full border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="mt-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <AnimatedProtectedButtonLink
            target={buttonTarget}
            className="px-4 py-2 text-sm font-medium w-full h-10 justify-between"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </AnimatedProtectedButtonLink>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Animated protected button link
function AnimatedProtectedButtonLink({
  children,
  target,
  className = "",
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full ${className.includes("h-") ? "" : "h-10"}`}
    >
      <ProtectedButtonLink
        target={target}
        className={`w-full flex items-center ${className}`}
        {...props}
      >
        {children}
      </ProtectedButtonLink>
    </motion.div>
  );
}

// Animated button
function AnimatedButton({ children, className = "", ...props }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${className.includes("h-") ? "" : "h-10"}`}
    >
      <Button size="lg" className={`flex items-center ${className}`} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
