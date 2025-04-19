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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: April 19, 2025
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm">
            <strong>Summary:</strong> We respect your privacy and are committed
            to protecting your personal data. This privacy policy will inform
            you about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law
            protects you.
          </p>
        </div>

        <Tabs defaultValue="full" className="mt-6">
          <TabsList>
            <TabsTrigger value="full">Full Policy</TabsTrigger>
            <TabsTrigger value="simplified">Simplified Version</TabsTrigger>
          </TabsList>
          <TabsContent value="full" className="mt-6">
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <h2 className="text-xl font-semibold mt-8">Table of Contents</h2>
              <ul className="mt-4 space-y-1">
                <li>
                  <a
                    href="#information-collect"
                    className="text-blue-600 hover:underline"
                  >
                    1. Information We Collect
                  </a>
                </li>
                <li>
                  <a
                    href="#how-we-use"
                    className="text-blue-600 hover:underline"
                  >
                    2. How We Use Your Information
                  </a>
                </li>
                <li>
                  <a
                    href="#information-sharing"
                    className="text-blue-600 hover:underline"
                  >
                    3. Information Sharing and Disclosure
                  </a>
                </li>
                <li>
                  <a
                    href="#data-security"
                    className="text-blue-600 hover:underline"
                  >
                    4. Data Security
                  </a>
                </li>
                <li>
                  <a
                    href="#your-rights"
                    className="text-blue-600 hover:underline"
                  >
                    5. Your Rights
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="text-blue-600 hover:underline">
                    6. Cookies and Tracking Technologies
                  </a>
                </li>
                <li>
                  <a href="#children" className="text-blue-600 hover:underline">
                    7. Children's Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#international"
                    className="text-blue-600 hover:underline"
                  >
                    8. International Data Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#changes-policy"
                    className="text-blue-600 hover:underline"
                  >
                    9. Changes to This Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#contact-us"
                    className="text-blue-600 hover:underline"
                  >
                    10. Contact Us
                  </a>
                </li>
              </ul>

              <section id="information-collect" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  1. Information We Collect
                </h2>
                <p className="mt-4">
                  We collect several different types of information for various
                  purposes to provide and improve our service to you.
                </p>

                <h3 className="text-xl font-medium mt-6">Personal Data</h3>
                <p className="mt-2">
                  While using our service, we may ask you to provide us with
                  certain personally identifiable information that can be used
                  to contact or identify you ("Personal Data"). Personally
                  identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Cookies and Usage Data</li>
                </ul>

                <h3 className="text-xl font-medium mt-6">Usage Data</h3>
                <p className="mt-2">
                  We may also collect information on how the service is accessed
                  and used ("Usage Data"). This Usage Data may include
                  information such as your computer's Internet Protocol address
                  (e.g. IP address), browser type, browser version, the pages of
                  our service that you visit, the time and date of your visit,
                  the time spent on those pages, unique device identifiers and
                  other diagnostic data.
                </p>
              </section>

              <section id="how-we-use" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  2. How We Use Your Information
                </h2>
                <p className="mt-4">
                  We use the collected data for various purposes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>
                    To allow you to participate in interactive features of our
                    service when you choose to do so
                  </li>
                  <li>To provide customer support</li>
                  <li>
                    To gather analysis or valuable information so that we can
                    improve our service
                  </li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>
                    To provide you with news, special offers and general
                    information about other goods, services and events which we
                    offer that are similar to those that you have already
                    purchased or enquired about unless you have opted not to
                    receive such information
                  </li>
                </ul>
              </section>

              <section id="information-sharing" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  3. Information Sharing and Disclosure
                </h2>
                <p className="mt-4">
                  We may disclose your Personal Data in the good faith belief
                  that such action is necessary to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>To comply with a legal obligation</li>
                  <li>
                    To protect and defend the rights or property of our company
                  </li>
                  <li>
                    To prevent or investigate possible wrongdoing in connection
                    with the service
                  </li>
                  <li>
                    To protect the personal safety of users of the service or
                    the public
                  </li>
                  <li>To protect against legal liability</li>
                </ul>
              </section>

              <section id="data-security" className="mt-10">
                <h2 className="text-2xl font-semibold">4. Data Security</h2>
                <p className="mt-4">
                  The security of your data is important to us, but remember
                  that no method of transmission over the Internet, or method of
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your Personal Data,
                  we cannot guarantee its absolute security.
                </p>
              </section>

              <section id="your-rights" className="mt-10">
                <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                <p className="mt-4">
                  Depending on your location, you may have certain rights
                  regarding your personal information, such as:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>
                    The right to access, update or delete the information we
                    have on you
                  </li>
                  <li>
                    The right of rectification - the right to have your
                    information corrected if that information is inaccurate or
                    incomplete
                  </li>
                  <li>
                    The right to object - the right to object to our processing
                    of your Personal Data
                  </li>
                  <li>
                    The right of restriction - the right to request that we
                    restrict the processing of your personal information
                  </li>
                  <li>
                    The right to data portability - the right to be provided
                    with a copy of the information we have on you in a
                    structured, machine-readable and commonly used format
                  </li>
                  <li>
                    The right to withdraw consent - the right to withdraw your
                    consent at any time where we relied on your consent to
                    process your personal information
                  </li>
                </ul>
                <p className="mt-4">
                  Please note that we may ask you to verify your identity before
                  responding to such requests.
                </p>
              </section>

              <section id="cookies" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  6. Cookies and Tracking Technologies
                </h2>
                <p className="mt-4">
                  We use cookies and similar tracking technologies to track the
                  activity on our service and hold certain information.
                </p>
                <p className="mt-4">
                  Cookies are files with small amount of data which may include
                  an anonymous unique identifier. Cookies are sent to your
                  browser from a website and stored on your device. Tracking
                  technologies also used are beacons, tags, and scripts to
                  collect and track information and to improve and analyze our
                  service.
                </p>
                <p className="mt-4">
                  You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent. However, if you do not
                  accept cookies, you may not be able to use some portions of
                  our service.
                </p>
                <p className="mt-4">Examples of Cookies we use:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <strong>Session Cookies:</strong> We use Session Cookies to
                    operate our service.
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> We use Preference
                    Cookies to remember your preferences and various settings.
                  </li>
                  <li>
                    <strong>Security Cookies:</strong> We use Security Cookies
                    for security purposes.
                  </li>
                </ul>
              </section>

              <section id="children" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  7. Children's Privacy
                </h2>
                <p className="mt-4">
                  Our service does not address anyone under the age of 18
                  ("Children").
                </p>
                <p className="mt-4">
                  We do not knowingly collect personally identifiable
                  information from anyone under the age of 18. If you are a
                  parent or guardian and you are aware that your Children has
                  provided us with Personal Data, please contact us. If we
                  become aware that we have collected Personal Data from
                  children without verification of parental consent, we take
                  steps to remove that information from our servers.
                </p>
              </section>

              <section id="international" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  8. International Data Transfers
                </h2>
                <p className="mt-4">
                  Your information, including Personal Data, may be transferred
                  to — and maintained on — computers located outside of your
                  state, province, country or other governmental jurisdiction
                  where the data protection laws may differ from those of your
                  jurisdiction.
                </p>
                <p className="mt-4">
                  If you are located outside the United States and choose to
                  provide information to us, please note that we transfer the
                  data, including Personal Data, to the United States and
                  process it there.
                </p>
                <p className="mt-4">
                  Your consent to this Privacy Policy followed by your
                  submission of such information represents your agreement to
                  that transfer.
                </p>
              </section>

              <section id="changes-policy" className="mt-10">
                <h2 className="text-2xl font-semibold">
                  9. Changes to This Privacy Policy
                </h2>
                <p className="mt-4">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page.
                </p>
                <p className="mt-4">
                  We will let you know via email and/or a prominent notice on
                  our service, prior to the change becoming effective and update
                  the "effective date" at the top of this Privacy Policy.
                </p>
                <p className="mt-4">
                  You are advised to review this Privacy Policy periodically for
                  any changes. Changes to this Privacy Policy are effective when
                  they are posted on this page.
                </p>
              </section>

              <section id="contact-us" className="mt-10">
                <h2 className="text-2xl font-semibold">10. Contact Us</h2>
                <p className="mt-4">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>By email: Info.vidyastraa@gmail.com</li>
                  <li>
                    By visiting this page on our website:
                    https://vidyastraa-jeeneet.vercel.app/contact
                  </li>
                </ul>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="simplified" className="mt-6">
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  This simplified version is provided for your convenience but
                  is not a substitute for the full Privacy Policy.
                </p>
              </div>

              <h3 className="text-xl font-medium mt-6">
                What information do we collect?
              </h3>
              <p>
                We collect information you provide directly to us, such as your
                name, email address, and payment information.
              </p>

              <h3 className="text-xl font-medium mt-6">
                How do we use your information?
              </h3>
              <p>
                We use your information to provide and improve our services,
                communicate with you, process payments, and comply with legal
                obligations.
              </p>



              <h3 className="text-xl font-medium mt-6">Your choices</h3>
              <p>
                You can update your account information, opt out of marketing
                communications, and request deletion of your data in certain
                circumstances.
              </p>

              <h3 className="text-xl font-medium mt-6">Cookies</h3>
              <p>
                We use cookies to enhance your experience, understand site
                usage, and assist in our marketing efforts. You can manage
                cookies through your browser settings.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between border-t pt-8">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/terms">
              Terms of Service
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
