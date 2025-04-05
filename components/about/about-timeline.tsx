"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutTimeline() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const timelineEvents = [
    {
      year: "2018",
      title: "Foundation",
      description: "EduLearn was founded with a mission to provide quality education for competitive exams.",
    },
    {
      year: "2019",
      title: "First Learning Center",
      description: "Opened our first physical learning center in Delhi with 100 students.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched our online platform to reach students across India during the pandemic.",
    },
    {
      year: "2021",
      title: "Expansion",
      description: "Expanded our team to 50+ educators and reached 50,000 students nationwide.",
    },
    {
      year: "2022",
      title: "Recognition",
      description: "Recognized as one of the top EdTech startups by Education World magazine.",
    },
    {
      year: "2023",
      title: "Global Reach",
      description: "Expanded to international markets with students from 5 countries.",
    },
  ]

  return (
    <section className="py-20 bg-blue-50 dark:bg-blue-950">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-4xl">
            Our Journey
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            From a small startup to a leading educational platform, here's how we've grown over the years.
          </p>
        </div>

        <div ref={ref} className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-800" />

          {/* Timeline events */}
          {timelineEvents.map((event, index) => (
            <TimelineEvent
              key={index}
              event={event}
              index={index}
              inView={inView}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEvent({
  event,
  index,
  inView,
  isLast,
}: {
  event: any
  index: number
  inView: boolean
  isLast: boolean
}) {
  const isEven = index % 2 === 0

  return (
    <div className={`relative ${!isLast ? "mb-12" : ""}`}>
      {/* Year bubble */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10"
      >
        {event.year}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className={`relative ${isEven ? "mr-auto pr-12 text-right" : "ml-auto pl-12"} w-5/12`}
      >
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{event.title}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{event.description}</p>
        </div>
      </motion.div>
    </div>
  )
}

