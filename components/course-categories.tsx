import Link from "next/link"
import { ArrowRight, Atom, BookOpen, Calculator, Dna, FlaskRoundIcon as Flask, Microscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function CourseCategories() {
  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Explore Our Course Categories</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Discover comprehensive courses designed to help you excel in your competitive exams.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Atom className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Physics</CardTitle>
            <CardDescription>
              Master physics concepts with comprehensive study materials and video lectures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Mechanics</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Electromagnetism</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Modern Physics</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/physics" passHref>
              <Button variant="outline" className="w-full">
                Explore Physics Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Flask className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Chemistry</CardTitle>
            <CardDescription>Learn chemistry concepts with interactive lessons and practice tests.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Organic Chemistry</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Inorganic Chemistry</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Physical Chemistry</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/chemistry" passHref>
              <Button variant="outline" className="w-full">
                Explore Chemistry Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Calculator className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Mathematics</CardTitle>
            <CardDescription>Build strong mathematical foundations with expert-led courses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Algebra</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Calculus</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Coordinate Geometry</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/mathematics" passHref>
              <Button variant="outline" className="w-full">
                Explore Mathematics Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Dna className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Biology</CardTitle>
            <CardDescription>Comprehensive biology courses for NEET preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Botany</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Zoology</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Human Physiology</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/biology" passHref>
              <Button variant="outline" className="w-full">
                Explore Biology Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Complete JEE Package</CardTitle>
            <CardDescription>All-in-one package for JEE Main and Advanced preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Physics, Chemistry & Mathematics</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Mock Tests & Previous Papers</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Live Doubt Solving</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/jee-package" passHref>
              <Button variant="outline" className="w-full">
                Explore JEE Package
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Microscope className="h-10 w-10 text-primary" />
            <CardTitle className="mt-4">Complete NEET Package</CardTitle>
            <CardDescription>Comprehensive package for NEET preparation.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>Biology, Physics & Chemistry</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>NEET Pattern Tests</span>
              </li>
              <li className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                <span>NCERT-based Study Material</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/courses/neet-package" passHref>
              <Button variant="outline" className="w-full">
                Explore NEET Package
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

