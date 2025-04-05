"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutStats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-blue-50 dark:bg-blue-950">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-4xl">
            Our Impact in Numbers
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            We're proud of the impact we've made on students' lives across India.
          </p>
        </div>

        <motion.div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={100000}
            label="Students Enrolled"
            icon={
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            inView={inView}
            delay={0}
          />
          <StatCard
            value={500}
            label="Courses Created"
            icon={
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
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            }
            inView={inView}
            delay={0.2}
          />
          <StatCard
            value={50}
            label="Expert Educators"
            icon={
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
            }
            inView={inView}
            delay={0.4}
          />
          <StatCard
            value={95}
            label="Success Rate (%)"
            icon={
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
            inView={inView}
            delay={0.6}
          />
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Top Achievements</h3>
            <ul className="space-y-4">
              {[
                "Ranked #1 in EdTech for JEE & NEET preparation",
                "Over 1000 students in top 1000 JEE ranks",
                "95% success rate in medical entrance exams",
                "Featured in Forbes 30 Under 30 Education category",
              ].map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-slate-600 dark:text-slate-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Our Reach</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Cities", value: "500+" },
                { label: "States", value: "28" },
                { label: "Countries", value: "5" },
                { label: "Learning Centers", value: "25" },
              ].map((item, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatCard({
  value,
  label,
  icon,
  inView,
  delay,
}: {
  value: number
  label: string
  icon: React.ReactNode
  inView: boolean
  delay: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [inView, value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center shadow-lg"
    >
      <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
        {count.toLocaleString()}
        {label === "Success Rate (%)" && "%"}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mt-2">{label}</p>
    </motion.div>
  )
}

