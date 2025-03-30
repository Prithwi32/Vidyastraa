import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "JEE Advanced 2023 - AIR 245",
      content:
        "EduLearn's comprehensive study materials and practice tests helped me secure a top rank in JEE Advanced. The video lectures were particularly helpful in understanding complex concepts.",
      avatar: "/testimonials-default-logo.avif?height=80&width=80",
    },
    {
      name: "Priya Patel",
      role: "NEET 2023 - AIR 156",
      content:
        "I owe my success in NEET to EduLearn's structured approach to learning. The biology section was exceptionally well-designed, and the mock tests were very similar to the actual exam.",
      avatar: "/testimonials-default-logo.avif?height=80&width=80",
    },
    {
      name: "Arjun Singh",
      role: "JEE Main 2023 - 99.8 percentile",
      content:
        "The quality of content on EduLearn is unmatched. The practice questions and video solutions helped me understand my mistakes and improve my problem-solving skills.",
      avatar: "/testimonials-default-logo.avif?height=80&width=80",
    },
    {
      name: "Neha Gupta",
      role: "NEET 2023 - AIR 320",
      content:
        "EduLearn's personalized learning approach helped me focus on my weak areas. The regular tests and performance analytics were crucial in my NEET preparation.",
      avatar: "/testimonials-default-logo.avif?height=80&width=80",
    },
  ]

  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Success Stories</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Hear from our students who achieved their dream ranks with EduLearn.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-0 bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Image
                src={testimonial.avatar || "/testimonials-default-logo.avif"}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="grid gap-1">
                <h3 className="text-sm font-medium">{testimonial.name}</h3>
                <CardDescription>{testimonial.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

