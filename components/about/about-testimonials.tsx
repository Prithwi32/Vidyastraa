"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutTestimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "JEE Advanced 2023 - AIR 245",
      content:
        "EduLearn's comprehensive study materials and practice tests helped me secure a top rank in JEE Advanced. The video lectures were particularly helpful in understanding complex concepts.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Priya Patel",
      role: "NEET 2023 - AIR 156",
      content:
        "I owe my success in NEET to EduLearn's structured approach to learning. The biology section was exceptionally well-designed, and the mock tests were very similar to the actual exam.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Arjun Singh",
      role: "JEE Main 2023 - 99.8 percentile",
      content:
        "The quality of content on EduLearn is unmatched. The practice questions and video solutions helped me understand my mistakes and improve my problem-solving skills.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-4xl">
            What Our Students Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Don't just take our word for it. Hear from our successful students.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-blue-200 dark:text-blue-800">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.3333 13.3333H13.3333C12.4167 13.3333 11.6667 14.0833 11.6667 15V20C11.6667 20.9167 12.4167 21.6667 13.3333 21.6667H16.6667C17.5833 21.6667 18.3333 22.4167 18.3333 23.3333V25C18.3333 26.8333 16.8333 28.3333 15 28.3333H14.1667C13.25 28.3333 12.5 27.5833 12.5 26.6667C12.5 25.75 13.25 25 14.1667 25H15C15.4583 25 15.8333 24.625 15.8333 24.1667V23.3333H13.3333C11.0833 23.3333 9.16666 21.4167 9.16666 19.1667V15.8333C9.16666 12.9167 11.5 10.8333 14.1667 10.8333H18.3333C19.25 10.8333 20 11.5833 20 12.5C20 13.4167 19.25 13.3333 18.3333 13.3333ZM30 13.3333H25C24.0833 13.3333 23.3333 14.0833 23.3333 15V20C23.3333 20.9167 24.0833 21.6667 25 21.6667H28.3333C29.25 21.6667 30 22.4167 30 23.3333V25C30 26.8333 28.5 28.3333 26.6667 28.3333H25.8333C24.9167 28.3333 24.1667 27.5833 24.1667 26.6667C24.1667 25.75 24.9167 25 25.8333 25H26.6667C27.125 25 27.5 24.625 27.5 24.1667V23.3333H25C22.75 23.3333 20.8333 21.4167 20.8333 19.1667V15.8333C20.8333 12.9167 23.1667 10.8333 25.8333 10.8333H30C30.9167 10.8333 31.6667 11.5833 31.6667 12.5C31.6667 13.4167 30.9167 13.3333 30 13.3333Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100">{testimonial.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{testimonial.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="/testimonials"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            View more success stories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

