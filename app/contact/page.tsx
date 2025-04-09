import type { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactInfo } from "@/components/contact/contact-info"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Contact Us - EduLearn",
  description: "Get in touch with the EduLearn team for any questions or inquiries",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="flex-1">
        <section className="w-full">
          <ContactHero />
        </section>

        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <ContactInfo />
        </section>
      </main>

      <Footer />
    </div>
  )
}
