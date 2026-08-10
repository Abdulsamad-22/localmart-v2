"use client";

import {
  EnvelopeSimple,
  Phone,
  LinkedinLogo,
  XLogo,
  InstagramLogo,
} from "@phosphor-icons/react";

const footerLinks = [
  {
    header: "Company",
    links: ["About Us", "Blog", "Contact Us", "Career"],
  },
  {
    header: "Customer Services",
    links: ["My Account", "Track Your Order", "Return", "FAQ"],
  },
  {
    header: "Our Information",
    links: [
      "Privacy",
      "User terms & Condition",
      "Help & Support",
      "Return Policy",
    ],
  },
  {
    header: "Contact Info",
    links: [
      { link: "+234 (0) 812-4771-846", icon: <Phone size={24} /> },
      {
        link: "abdulsamadhussaini001@gmail.com",
        icon: <EnvelopeSimple size={24} />,
      },
    ],
  },
];
export default function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-[#005349] px-4 py-10 text-white sm:px-6 lg:px-12 lg:py-12">
      <div className="mx-auto">
        {/* <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:gap-16">
          <div className="min-w-0">
            <h4 className="mb-3 text-2xl font-semibold">LocalMart</h4>

            <p className="max-w-sm break-words text-sm leading-6 text-gray-300">
              LocalMart connects you with vendors in your neighbourhood, find
              everyday essentials, and unique products from local sellers near
              you. Supporting local businesses has never been easier.
            </p>

            <ul className="mt-6 flex items-center gap-3">
              <li>
                <a
                  href="https://www.linkedin.com/in/abdulsamad-hussaini-481657283/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LocalMart on LinkedIn"
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <LinkedinLogo size={24} />
                </a>
              </li>

              <li>
                <a
                  href="https://x.com/_Hoossayn"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LocalMart on X"
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <XLogo size={24} />
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/hoosayn_10?igsh=MWQzNDRlaHVnaTJqOA=="
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LocalMart on Instagram"
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <InstagramLogo size={24} />
                </a>
              </li>

              <li>
                <a
                  href="mailto:abdulsamadhussaini@outlook.com"
                  aria-label="Email LocalMart"
                  className="text-white transition-opacity hover:opacity-75"
                >
                  <EnvelopeSimple size={24} />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-12">
            {footerLinks.map((section) => (
              <div key={section.header} className="min-w-0">
                <h5 className="mb-4 text-base font-semibold">
                  {section.header}
                </h5>

                <ul className="space-y-3">
                  {section.links.map((item, index) => (
                    <li
                      key={typeof item === "string" ? item : index}
                      className="break-words text-sm text-[#E4E1FB]"
                    >
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <div className="flex min-w-0 items-start gap-2">
                          <span className="shrink-0">{item.icon}</span>
                          <span className="break-words">{item.link}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div> */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-16">
          {/* Left: LocalMart and socials */}
          <div className="min-w-0 md:max-w-[18rem] lg:max-w-sm">
            <h4 className="mb-3 text-2xl font-semibold">LocalMart</h4>

            <p className="break-words text-sm leading-6 text-gray-300">
              LocalMart connects you with vendors in your neighbourhood, find
              everyday essentials, and unique products from local sellers near
              you. Supporting local businesses has never been easier.
            </p>

            {/* Social links */}
          </div>

          {/* Right: one wrapper for all link groups */}
          <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-10 md:flex-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
            {footerLinks.map((section) => (
              <div key={section.header} className="min-w-0 md:flex-1">
                <h5 className="mb-4 text-base font-semibold">
                  {section.header}
                </h5>

                <ul className="space-y-3">
                  {section.links.map((item, index) => (
                    <li
                      key={typeof item === "string" ? item : index}
                      className="break-words text-sm text-[#E4E1FB]"
                    >
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <div className="flex min-w-0 items-start gap-2">
                          <span className="shrink-0">{item.icon}</span>
                          <span className="min-w-0 break-all">
                            {item.link}
                          </span>{" "}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="flex items-center justify-center gap-2 text-center text-sm text-white sm:text-base">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#c4c4c4] text-xs"
            >
              C
            </span>
            LocalMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
