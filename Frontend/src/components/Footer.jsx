import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

/* ---------------- Inline Brand Icons ---------------- */

const BrandSvg = ({ path, className = "", size = 24, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <path d={path} />
  </svg>
);

const FacebookIcon = (props) => (
  <BrandSvg
    {...props}
    path="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"
  />
);

const TwitterIcon = (props) => (
  <BrandSvg
    {...props}
    path="M18.9 2H22l-7.4 8.4L23.3 22h-6.8l-5.3-6.9L4.9 22H1.8l7.9-9L1 2h6.9l4.8 6.4L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"
  />
);

const InstagramIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props) => (
  <BrandSvg
    {...props}
    path="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
  />
);

/* ---------------------------------- Footer ---------------------------------- */

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Instructors", path: "/instructors" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  const studentLinks = [
    { name: "Student Portal", path: "/student-portal" },
    { name: "My Courses", path: "/student-portal" },
    { name: "Progress", path: "/student-portal" },
  ];

  const socials = [
    { icon: FacebookIcon, label: "Facebook" },
    { icon: TwitterIcon, label: "Twitter" },
    { icon: InstagramIcon, label: "Instagram" },
    { icon: LinkedinIcon, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white">
              Skill<span className="text-amber-700">Nest</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              A modern learning platform helping students build practical,
              job-ready skills through high-quality courses and expert
              instruction.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-800 hover:border-amber-800 transition-colors duration-200"
                >
                  <social.icon className="w-4 h-4 text-gray-300 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-amber-700 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Student
            </h3>
            <ul className="mt-5 space-y-3">
              {studentLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-amber-700 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">
              Get in Touch
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                <a
                  href="mailto:hello@skillnest.com"
                  className="hover:text-amber-700 transition-colors"
                >
                  hello@skillnest.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-amber-700 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
                <span>123 Learning Street, Knowledge City</span>
              </li>
            </ul>

            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-600 transition-colors"
            >
              Send us a message
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 SkillNest. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a href="#" className="hover:text-amber-700 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-700 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-amber-700 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;