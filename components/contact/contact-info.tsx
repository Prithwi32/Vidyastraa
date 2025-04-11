"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function ContactInfo() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const contactInfo = [
    {
      title: "Email",
      value: "info@Vidyastraa.com",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      ),
    },
    {
      title: "Phone",
      value: "+91 98765 43210",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    // {
    //   title: "Address",
    //   value: "123 Education Street, New Delhi, India",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    //       <circle cx="12" cy="10" r="3" />
    //     </svg>
    //   ),
    // },
    {
      title: "Working Hours",
      value: "Monday - Saturday: 9:00 AM - 7:00 PM",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M21.8 8.001a2.73 2.73 0 0 0-1.91-1.92C18.14 6 12 6 12 6s-6.14 0-7.89.081a2.73 2.73 0 0 0-1.91 1.92A28.87 28.87 0 0 0 2 12a28.87 28.87 0 0 0 .2 3.999 2.73 2.73 0 0 0 1.91 1.92C5.86 18 12 18 12 18s6.14 0 7.89-.081a2.73 2.73 0 0 0 1.91-1.92A28.87 28.87 0 0 0 22 12a28.87 28.87 0 0 0-.2-3.999zM10 15V9l5 3-5 3z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Contact Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">
          Contact Information
        </h2>
        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">
          Connect With Us
        </h2>

        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Join Our Community
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Follow us on social media to stay updated with the latest news,
            events, and educational resources.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
