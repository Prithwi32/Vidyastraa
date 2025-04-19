"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function ContactMap() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-12 bg-blue-50 dark:bg-blue-950">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
            Visit Our Learning Centers
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            We have learning centers across major cities in India. Find the one
            nearest to you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          {/* In a real app, this would be a Google Maps or similar integration */}
          <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-800 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Interactive map would be displayed here
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              city: "New Delhi",
              address: "123 Education Street, New Delhi, 110001",
              phone: "+91 9632405325",
            },
            {
              city: "Mumbai",
              address: "456 Learning Avenue, Mumbai, 400001",
              phone: "+91 98765 43211",
            },
            {
              city: "Bangalore",
              address: "789 Knowledge Road, Bangalore, 560001",
              phone: "+91 98765 43212",
            },
          ].map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md"
            >
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                {location.city}
              </h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 shrink-0"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{location.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{location.phone}</span>
                </p>
              </div>
              <button className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
                Get Directions
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
                  <path d="M18 8L22 12L18 16" />
                  <path d="M2 12H22" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
