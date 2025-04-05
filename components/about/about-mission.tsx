"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutMission() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-4xl"
          >
            Our Mission & Vision
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            We're on a mission to revolutionize education and empower the next generation of leaders.
          </motion.p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">Quality Education</h3>
            <p className="text-slate-600 dark:text-slate-300">
              We believe in providing high-quality education that is accessible to all students, regardless of their
              background or location.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
                <path d="M10 9H8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">Innovative Learning</h3>
            <p className="text-slate-600 dark:text-slate-300">
              We leverage technology to create innovative learning experiences that engage students and make learning
              enjoyable.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-100 dark:border-blue-800"
          >
            <div className="h-12 w-12 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3">Student Success</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Our ultimate goal is student success. We measure our achievements by the accomplishments of our students.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-blue-50 text-lg">
              "To create a world where quality education is accessible to every student, empowering them to achieve
              their dreams and contribute positively to society."
            </p>
            <p className="mt-4 text-blue-100 italic">— Dr. Rajesh Kumar, Founder & CEO</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

