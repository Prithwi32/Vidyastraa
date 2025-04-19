import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using our service",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: April 19, 2025
          </p>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service")
            carefully before using our website and services.
          </p>

          <h2 className="text-xl font-semibold mt-8">Table of Contents</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <a href="#agreement" className="text-blue-600 hover:underline">
                1. Agreement to Terms
              </a>
            </li>
            <li>
              <a
                href="#intellectual-property"
                className="text-blue-600 hover:underline"
              >
                2. Intellectual Property Rights
              </a>
            </li>
            <li>
              <a
                href="#user-accounts"
                className="text-blue-600 hover:underline"
              >
                3. User Accounts
              </a>
            </li>
            <li>
              <a
                href="#prohibited-activities"
                className="text-blue-600 hover:underline"
              >
                4. Prohibited Activities
              </a>
            </li>
            <li>
              <a
                href="#limitation-liability"
                className="text-blue-600 hover:underline"
              >
                5. Limitation of Liability
              </a>
            </li>
            <li>
              <a href="#termination" className="text-blue-600 hover:underline">
                6. Termination
              </a>
            </li>
            <li>
              <a
                href="#governing-law"
                className="text-blue-600 hover:underline"
              >
                7. Governing Law
              </a>
            </li>
            <li>
              <a href="#changes" className="text-blue-600 hover:underline">
                8. Changes to Terms
              </a>
            </li>
            <li>
              <a href="#contact" className="text-blue-600 hover:underline">
                9. Contact Us
              </a>
            </li>
          </ul>

          <section id="agreement" className="mt-10">
            <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
            <p className="mt-4">
              By accessing or using our service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, then you may
              not access the service.
            </p>
          </section>

          <section id="intellectual-property" className="mt-10">
            <h2 className="text-2xl font-semibold">
              2. Intellectual Property Rights
            </h2>
            <p className="mt-4">
              Our service and its original content, features, and functionality
              are and will remain the exclusive property of our company and its
              licensors. The service is protected by copyright, trademark, and
              other laws of both the United States and foreign countries. Our
              trademarks and trade dress may not be used in connection with any
              product or service without the prior written consent of our
              company.
            </p>
          </section>

          <section id="user-accounts" className="mt-10">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p className="mt-4">
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. Failure to
              do so constitutes a breach of the Terms, which may result in
              immediate termination of your account on our service.
            </p>
            <p className="mt-4">
              You are responsible for safeguarding the password that you use to
              access the service and for any activities or actions under your
              password, whether your password is with our service or a
              third-party service.
            </p>
            <p className="mt-4">
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account.
            </p>
          </section>

          <section id="prohibited-activities" className="mt-10">
            <h2 className="text-2xl font-semibold">4. Prohibited Activities</h2>
            <p className="mt-4">
              You may not access or use the service for any purpose other than
              that for which we make the service available. The service may not
              be used in connection with any commercial endeavors except those
              that are specifically endorsed or approved by us.
            </p>
            <p className="mt-4">As a user of the service, you agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Systematically retrieve data or other content from the service
                to create or compile, directly or indirectly, a collection,
                compilation, database, or directory without written permission
                from us.
              </li>
              <li>
                Make any unauthorized use of the service, including collecting
                usernames and/or email addresses of users by electronic or other
                means for the purpose of sending unsolicited email, or creating
                user accounts by automated means or under false pretenses.
              </li>
              <li>
                Use the service to advertise or offer to sell goods and
                services.
              </li>
              <li>
                Circumvent, disable, or otherwise interfere with
                security-related features of the service.
              </li>
              <li>
                Engage in unauthorized framing of or linking to the service.
              </li>
              <li>
                Trick, defraud, or mislead us and other users, especially in any
                attempt to learn sensitive account information such as user
                passwords.
              </li>
            </ul>
          </section>

          <section id="limitation-liability" className="mt-10">
            <h2 className="text-2xl font-semibold">
              5. Limitation of Liability
            </h2>
            <p className="mt-4">
              In no event shall we, nor our directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from (i) your access to or use of or
              inability to access or use the service; (ii) any conduct or
              content of any third party on the service; (iii) any content
              obtained from the service; and (iv) unauthorized access, use or
              alteration of your transmissions or content, whether based on
              warranty, contract, tort (including negligence) or any other legal
              theory, whether or not we have been informed of the possibility of
              such damage.
            </p>
          </section>

          <section id="termination" className="mt-10">
            <h2 className="text-2xl font-semibold">6. Termination</h2>
            <p className="mt-4">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
            <p className="mt-4">
              Upon termination, your right to use the service will immediately
              cease. If you wish to terminate your account, you may simply
              discontinue using the service.
            </p>
          </section>

          <section id="governing-law" className="mt-10">
            <h2 className="text-2xl font-semibold">7. Governing Law</h2>
            <p className="mt-4">
              These Terms shall be governed and construed in accordance with the
              laws of the United States, without regard to its conflict of law
              provisions.
            </p>
            <p className="mt-4">
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          <section id="changes" className="mt-10">
            <h2 className="text-2xl font-semibold">8. Changes to Terms</h2>
            <p className="mt-4">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p className="mt-4">
              By continuing to access or use our service after those revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, please stop using the service.
            </p>
          </section>

          <section id="contact" className="mt-10">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p className="mt-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> Info.vidyastraa@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-8 flex justify-between border-t pt-8">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/privacy">
              Privacy Policy
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
