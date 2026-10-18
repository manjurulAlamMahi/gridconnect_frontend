import Logo from "@/components/shared/Logo";
import Instagram from "@/assets/Icons/instagram.svg";
import Facebook from "@/assets/Icons/facebook.svg";
import X from "@/assets/Icons/X.svg";
import Icon from "@/components/shared/Icon";
import { Link } from "react-router";

export default function Footer() {
  const columns = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about-us" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legals",
      links: [
        { label: "Terms & Conditions", href: "/terms-conditions" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
    {
      title: "Supports",
      links: [
        { label: "Help Centre", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="text-accent min-h-[300px]">
      <div className="container mx-auto px-6 py-16">
        <Logo />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 lg:col-span-4">
            <p className="mt-6 text-base text-accent/60 max-w-sm">
              Built for Motorsport Connections. Connecting verified drivers and
              teams worldwide.
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center rounded-full bg-[#191E27] p-2 shadow-sm"
              >
                <Icon src={Instagram} />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center justify-center rounded-full bg-[#191E27] p-2 shadow-sm"
              >
                <Icon src={Facebook} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X / Twitter"
                className="inline-flex items-center justify-center rounded-full bg-[#191E27] p-2 shadow-sm"
              >
                <Icon src={X} />
              </a>
            </div>
          </div>

          {/* Right columns */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="text-base font-medium text-accent mb-4">
                    {col.title}
                  </p>
                  <ul className="space-y-3 text-accent/60">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className="text-sm text-accent/60! hover:text-primary! transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t mt-10 pt-6">
          <div className="text-center text-xs text-accent/60">
            Copyright ©{new Date().getFullYear()} GridConnect. All rights
            reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
