"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function AboutTeam() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const teamMembers = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      bio: "Former IIT professor with 20+ years of experience in education.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Dr. Priya Sharma",
      role: "Academic Director",
      bio: "PhD in Physics with expertise in curriculum development.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Amit Patel",
      role: "CTO",
      bio: "Tech innovator with a passion for educational technology.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Dr. Neha Gupta",
      role: "Head of Biology",
      bio: "MBBS, MD with 10+ years of teaching experience for NEET.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Our team of dedicated educators and professionals is committed to providing the best learning experience.
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
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {teamMembers.map((member, index) => (
            <TeamMember key={index} member={member} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Join Our Team</h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We're always looking for talented educators and professionals to join our team. If you're passionate about
            education and want to make a difference, we'd love to hear from you.
          </p>
          <a
            href="/careers"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
          >
            View Open Positions
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function TeamMember({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: index * 0.1 },
        },
      }}
      className="bg-blue-50 dark:bg-blue-900/20 rounded-xl overflow-hidden"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{member.name}</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium">{member.role}</p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{member.bio}</p>
        <div className="mt-4 flex gap-3">
          <a
            href={member.social.linkedin}
            className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            aria-label={`${member.name}'s LinkedIn`}
          >
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
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={member.social.twitter}
            className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            aria-label={`${member.name}'s Twitter`}
          >
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
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

