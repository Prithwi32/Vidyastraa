import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-2xl text-yellow-700">
                Vidyastraa
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering students to achieve their dreams through quality
              education and comprehensive exam preparation.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/materials"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Study Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/tests/all"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Contact Us
            </h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              {/* <p>123 Education Street</p>
              <p>New Delhi, India 110001</p> */}
              <p>Email: info@vidyastraa.com</p>
              <p>Phone: +91 98765 43210</p>
            </address>
          </div>
        </div>
          <div className="mt-12 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-center sm:text-left text-sm text-muted-foreground">
              © {new Date().getFullYear()} Vidyastraa. All rights reserved.
            </p>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Developed by:</span>
              <div className="flex gap-2">
                <a
                  href="mailto:prithwi.online11@gmail.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  Developer 1
                </a>
                <span>&</span>
                <a
                  href="mailto:nirmith10@gmail.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  Developer 2
                </a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
}
