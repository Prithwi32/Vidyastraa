import type { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactInfo } from "@/components/contact/contact-info"
// import { ContactMap } from "@/components/contact/contact-map"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Contact Us - EduLearn",
  description: "Get in touch with the EduLearn team for any questions or inquiries",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <div className="container py-12 md:py-20">
            <ContactInfo />
        </div>
        {/* <ContactMap /> */}
      </main>
      <Footer />
    </div>
  )
}
