"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ContactFAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const faqs = [
    {
      question: "How can I enroll in a course?",
      answer:
        "You can enroll in a course by creating an account on our platform, browsing the available courses, and clicking on the 'Enroll' button. You can pay using various payment methods including credit/debit cards and UPI.",
    },
    {
      question: "What are the payment options available?",
      answer:
        "We accept payments through credit/debit cards, net banking, UPI, and various digital wallets. All payments are processed securely through our payment partners.",
    },
    {
      question: "Can I get a refund if I'm not satisfied with the course?",
      answer:
        "Yes, we offer a 7-day money-back guarantee for all our courses. If you're not satisfied with the course content, you can request a refund within 7 days of purchase.",
    },
    {
      question: "How do I access the study materials?",
      answer:
        "Once you enroll in a course, you can access all study materials through your dashboard. Materials are available in PDF format and can be downloaded for offline use.",
    },
    {
      question: "Are the video lectures available offline?",
      answer:
        "Yes, our video lectures can be downloaded for offline viewing through our mobile app. This allows you to study even without an internet connection.",
    },
    {
      question: "Do you provide doubt-solving support?",
      answer:
        "Yes, we offer doubt-solving support through our dedicated forum and scheduled live sessions with educators. Premium subscribers also get access to one-on-one doubt-solving sessions.",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Find answers to common questions about our platform and courses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 dark:text-slate-300">Still have questions? Feel free to contact us directly.</p>
          <a
            href="mailto:info@edulearn.com"
            className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
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
              className="mr-2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            info@edulearn.com
          </a>
        </motion.div>
      </div>
    </section>
  )
}

