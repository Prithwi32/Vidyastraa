"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import ProfileAvatar from "./profileAvatar";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const session = useSession();

  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session.status === "authenticated") {
      router.push(href);
    }
  };

  // Check if a link is active
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-110">
              <Image
                src="/logo.jpeg"
                alt="Vidyastraa Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-2xl text-yellow-700 group-hover:text-yellow-700 transition-colors">
              Vidyastraa
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isActive("/student/dashboard/materials") &&
                        "text-primary font-medium"
                    )}
                  >
                    Study Materials
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/student/dashboard/materials"
                            onClick={(e) =>
                              handleProtectedNavigation(
                                e,
                                "/student/dashboard/materials"
                              )
                            }
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Premium Study Materials
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Access comprehensive study materials prepared by
                              expert educators.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="/student/dashboard/materials"
                        title="Physics"
                        onClick={(e) =>
                          handleProtectedNavigation(
                            e,
                            "/student/dashboard/materials"
                          )
                        }
                      >
                        Complete physics study materials for JEE & NEET
                      </ListItem>
                      <ListItem
                        href="/student/dashboard/materials"
                        title="Chemistry"
                        onClick={(e) =>
                          handleProtectedNavigation(
                            e,
                            "/student/dashboard/materials"
                          )
                        }
                      >
                        Comprehensive chemistry notes and resources
                      </ListItem>
                      <ListItem
                        href="/student/dashboard/materials"
                        title="Mathematics"
                        onClick={(e) =>
                          handleProtectedNavigation(
                            e,
                            "/student/dashboard/materials"
                          )
                        }
                      >
                        In-depth mathematics study materials for JEE
                      </ListItem>
                      <ListItem
                        href="/student/dashboard/materials"
                        title="Biology"
                        onClick={(e) =>
                          handleProtectedNavigation(
                            e,
                            "/student/dashboard/materials"
                          )
                        }
                      >
                        Complete biology study materials for NEET
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isActive("/tests/all") && "text-primary font-medium"
                    )}
                  >
                    Tests
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem
                        href="/tests/all"
                        title="JEE Tests"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/tests/all")
                        }
                      >
                        Practice tests for JEE Main & Advanced
                      </ListItem>
                      <ListItem
                        href="/tests/all"
                        title="NEET Tests"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/tests/all")
                        }
                      >
                        Practice tests for NEET preparation
                      </ListItem>
                      <ListItem
                        href="/tests/all"
                        title="Chapter-wise Tests"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/tests/all")
                        }
                      >
                        Topic and chapter-wise practice tests
                      </ListItem>
                      <ListItem
                        href="/tests/all"
                        title="Previous Year Papers"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/tests/all")
                        }
                      >
                        Solve previous year question papers
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isActive("/courses") && "text-primary font-medium"
                    )}
                  >
                    Courses
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <ListItem
                        href="/courses/jee"
                        title="JEE Courses"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/courses/jee")
                        }
                      >
                        Video courses for JEE preparation
                      </ListItem>
                      <ListItem
                        href="/courses/neet"
                        title="NEET Courses"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/courses/neet")
                        }
                      >
                        Video courses for NEET preparation
                      </ListItem>
                      <ListItem
                        href="/courses/foundation"
                        title="Foundation Courses"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/courses/foundation")
                        }
                      >
                        Foundation courses for class 9-10 students
                      </ListItem>
                      <ListItem
                        href="/courses/crash"
                        title="Crash Courses"
                        onClick={(e) =>
                          handleProtectedNavigation(e, "/courses/crash")
                        }
                      >
                        Last-minute crash courses for quick revision
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/about") && "text-primary font-medium"
                      )}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/contact") && "text-primary font-medium"
                      )}
                    >
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session.status == "unauthenticated" && (
            <div className="hidden md:flex gap-2">
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          )}
          {session.status === "authenticated" && (
            <ProfileAvatar
              name={session.data?.user?.name || ""}
              email={session.data?.user?.email || ""}
              imageUrl={session.data?.user?.image || ""}
            />
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <Link
              href="/student/dashboard/materials"
              className={cn(
                "px-4 py-2 text-lg hover:bg-muted rounded-md",
                isActive("/student/dashboard/materials") &&
                  "text-primary font-medium"
              )}
              onClick={(e) => {
                if (session.status === "unauthenticated") {
                  e.preventDefault();
                  router.push("/auth/signin");
                }
              }}
            >
              Study Materials
            </Link>
            <Link
              href="/tests/all"
              className={cn(
                "px-4 py-2 text-lg hover:bg-muted rounded-md",
                isActive("/tests/all") && "text-primary font-medium"
              )}
              onClick={(e) => {
                if (session.status === "unauthenticated") {
                  e.preventDefault();
                  router.push("/auth/signin");
                }
              }}
            >
              Tests
            </Link>
            <Link
              href="/courses"
              className={cn(
                "px-4 py-2 text-lg hover:bg-muted rounded-md",
                isActive("/courses") && "text-primary font-medium"
              )}
              onClick={(e) => {
                if (session.status === "unauthenticated") {
                  e.preventDefault();
                  router.push("/auth/signin");
                }
              }}
            >
              Courses
            </Link>
            <Link
              href="/about"
              className={cn(
                "px-4 py-2 text-lg hover:bg-muted rounded-md",
                isActive("/about") && "text-primary font-medium"
              )}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={cn(
                "px-4 py-2 text-lg hover:bg-muted rounded-md",
                isActive("/contact") && "text-primary font-medium"
              )}
            >
              Contact
            </Link>
            {session.status == "unauthenticated" && (
              <Button className="w-full" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
