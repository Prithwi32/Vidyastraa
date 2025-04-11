import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMission } from "@/components/about/about-mission";
import { AboutStats } from "@/components/about/about-stats";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "About Us - Vidyastraa",
  description:
    "Learn more about Vidyastraa's mission, team, and journey in educational excellence",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <AboutMission />
        <AboutStats />
      </main>
      <Footer />
    </div>
  );
}
