"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">EduLearn</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Study Materials</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">Premium Study Materials</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Access comprehensive study materials prepared by expert educators.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/materials/physics" title="Physics">
                        Complete physics study materials for JEE & NEET
                      </ListItem>
                      <ListItem href="/materials/chemistry" title="Chemistry">
                        Comprehensive chemistry notes and resources
                      </ListItem>
                      <ListItem href="/materials/mathematics" title="Mathematics">
                        In-depth mathematics study materials for JEE
                      </ListItem>
                      <ListItem href="/materials/biology" title="Biology">
                        Complete biology study materials for NEET
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tests</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem href="/tests" title="JEE Tests">
                        Practice tests for JEE Main & Advanced
                      </ListItem>
                      <ListItem href="/tests" title="NEET Tests">
                        Practice tests for NEET preparation
                      </ListItem>
                      <ListItem href="/tests" title="Chapter-wise Tests">
                        Topic and chapter-wise practice tests
                      </ListItem>
                      <ListItem href="/tests" title="Previous Year Papers">
                        Solve previous year question papers
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem href="/courses/jee" title="JEE Courses">
                        Video courses for JEE preparation
                      </ListItem>
                      <ListItem href="/courses/neet" title="NEET Courses">
                        Video courses for NEET preparation
                      </ListItem>
                      <ListItem href="/courses/foundation" title="Foundation Courses">
                        Foundation courses for class 9-10 students
                      </ListItem>
                      <ListItem href="/courses/crash" title="Crash Courses">
                        Last-minute crash courses for quick revision
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>About Us</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contact</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden md:flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <Link href="/materials" className="px-4 py-2 text-lg hover:bg-muted rounded-md">
              Study Materials
            </Link>
            <Link href="/tests" className="px-4 py-2 text-lg hover:bg-muted rounded-md">
              Tests
            </Link>
            <Link href="/courses" className="px-4 py-2 text-lg hover:bg-muted rounded-md">
              Courses
            </Link>
            <Link href="/about" className="px-4 py-2 text-lg hover:bg-muted rounded-md">
              About Us
            </Link>
            <Link href="/contact" className="px-4 py-2 text-lg hover:bg-muted rounded-md">
              Contact
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

