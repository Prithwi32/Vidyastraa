"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What courses do you offer?",
      answer:
        "We offer comprehensive courses for JEE (Main & Advanced) and NEET preparation. Our courses include study materials, video lectures, practice tests, and doubt-solving sessions.",
    },
    {
      question: "How can I access the study materials?",
      answer:
        "Once you sign up, you can access all study materials through your dashboard. Materials are available in PDF format and can be downloaded for offline use.",
    },
    {
      question: "Are the video lectures available offline?",
      answer:
        "Yes, our video lectures can be downloaded for offline viewing through our mobile app. This allows you to study even without an internet connection.",
    },
    {
      question: "How are the practice tests structured?",
      answer:
        "Our practice tests are available in various formats: chapter-wise tests, subject-wise tests, previous year papers, and full-length mock tests. All tests follow the latest exam pattern and come with detailed solutions.",
    },
    {
      question: "How long do I have access to the courses?",
      answer:
        "Course access depends on your duration of courses. Once enroll into courses, you will access to courses until course duration.",
    },
  ]

  return (
    <section className="container py-12 md:py-24 bg-muted/50">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Frequently Asked Questions</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Find answers to common questions about our platform and courses.
        </p>
      </div>

      <div className="mx-auto max-w-3xl pt-12">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

