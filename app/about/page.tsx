import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { AboutMission } from "@/components/about/about-mission"
import { AboutTeam } from "@/components/about/about-team"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutStats } from "@/components/about/about-stats"
import { AboutTestimonials } from "@/components/about/about-testimonials"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "About Us - EduLearn",
  description: "Learn more about EduLearn's mission, team, and journey in educational excellence",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <AboutMission />
        <AboutStats />
        <AboutTeam />
        <AboutTimeline />
        <AboutTestimonials />
      </main>
      <Footer />
    </div>
  )
}

