import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Users,
  Briefcase,
  ArrowRight,
} from "lucide-react";

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

const LinkedinIcon = (props) => (
  <BrandSvg
    {...props}
    path="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"
  />
);

const TwitterIcon = (props) => (
  <BrandSvg
    {...props}
    path="M18.9 2H22l-7.4 8.4L23.3 22h-6.8l-5.3-6.9L4.9 22H1.8l7.9-9L1 2h6.9l4.8 6.4L18.9 2zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20z"
  />
);

const FacebookIcon = (props) => (
  <BrandSvg
    {...props}
    path="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"
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

/* ---------------------------------- Page ---------------------------------- */

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "hello@skillnest.com",
      href: "mailto:hello@skillnest.com",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "+1 (234) 567-890",
      href: "tel:+1234567890",
    },
    {
      icon: MapPin,
      label: "Visit Us",
      value: "123 Learning Street, Knowledge City",
      href: "#",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Fri · 9am to 6pm",
      href: "#",
    },
  ];

  const departments = [
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Questions about courses, payments, or your account.",
      email: "support@skillnest.com",
    },
    {
      icon: Briefcase,
      title: "Become an Instructor",
      description: "Interested in teaching on SkillNest? Let's talk.",
      email: "teach@skillnest.com",
    },
    {
      icon: Users,
      title: "Partnerships",
      description: "Business, media, and partnership inquiries.",
      email: "partners@skillnest.com",
    },
  ];

  const socials = [
    { icon: LinkedinIcon, label: "LinkedIn" },
    { icon: TwitterIcon, label: "Twitter" },
    { icon: FacebookIcon, label: "Facebook" },
    { icon: InstagramIcon, label: "Instagram" },
  ];

  return (
    <div className="bg-white text-black">

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-amber-950 to-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full border-2 border-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold tracking-widest uppercase text-amber-100 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Get in Touch
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            We'd Love to
            <br />
            <span className="text-amber-500">Hear From You.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Have a question, feedback, or want to partner with us? Send us a
            message and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* ===================== CONTACT INFO CARDS ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info) => (
              <a
                key={info.label}
                href={info.href}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-800 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <info.icon className="w-5 h-5 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  {info.label}
                </p>
                <p className="mt-1 text-sm font-bold text-black break-words">
                  {info.value}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FORM + SIDEBAR ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-5 gap-10">

          {/* Form (3 cols) */}
          <div className="lg:col-span-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Send a Message
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              How Can We Help?
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Fill in the form below and we'll get back to you as soon as possible.
            </p>

            {submitted && (
              <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-black">
                    Message sent successfully!
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-black mb-1.5"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Amina Wanjiru"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-black mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-black mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-black mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about what you need..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-900 text-white font-semibold text-sm rounded-lg hover:bg-amber-800 transition-colors duration-200"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Sidebar (2 cols) */}
          <aside className="lg:col-span-2 space-y-5">

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-base font-bold text-black">
                Contact the Right Team
              </h3>
              <div className="mt-5 space-y-5">
                {departments.map((d) => (
                  <div key={d.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <d.icon className="w-4 h-4 text-amber-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">{d.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                        {d.description}
                      </p>
                      <a
                        href={`mailto:${d.email}`}
                        className="text-xs font-semibold text-amber-800 hover:text-amber-900 mt-1 inline-block"
                      >
                        {d.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-xl p-6 text-white">
              <h3 className="text-base font-bold">Follow Us</h3>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Stay updated with new courses, tips, and community news.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-amber-800 hover:border-amber-800 hover:text-white transition-colors duration-200"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-800" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  Fast Response
                </p>
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                We typically respond to all inquiries within{" "}
                <span className="font-bold text-black">24 hours</span> on
                business days.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-gray-50 border-t border-gray-200 px-6 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-black rounded-2xl px-8 sm:px-12 lg:px-16 py-14 lg:py-16 text-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-10 w-64 h-64 rounded-full border-2 border-white" />
              <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full border-2 border-white" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Ready to Start Learning?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Browse our catalog and start building the skills that matter.
              </p>
              <Link
                to="/courses"
                className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-800 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;