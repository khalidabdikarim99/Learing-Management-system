import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Target,
  Heart,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Globe,
  CheckCircle2,
  ArrowRight,
  Quote,
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Active Students" },
    { icon: BookOpen, value: "100+", label: "Expert Courses" },
    { icon: GraduationCap, value: "50+", label: "Instructors" },
    { icon: Globe, value: "40+", label: "Countries" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To make high-quality, practical education accessible to everyone — empowering learners to build skills that truly matter in today's world.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description:
        "A world where anyone, anywhere can unlock their potential through structured, affordable, and career-focused learning.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "We believe in quality, accessibility, and real-world impact. Every course is crafted to help students grow with confidence.",
    },
    {
      icon: ShieldCheck,
      title: "Our Promise",
      description:
        "Verified instructors, structured paths, and lifetime access — you get everything you need to succeed, without compromise.",
    },
  ];

  const team = [
    {
      name: "David Carter",
      role: "Founder & CEO",
      bio: "Former software engineer turned educator, passionate about making tech skills accessible.",
    },
    {
      name: "Sarah Mitchell",
      role: "Head of Curriculum",
      bio: "Curriculum designer with 10+ years building learning programs for global tech companies.",
    },
    {
      name: "James Anderson",
      role: "Lead Instructor",
      bio: "Full-stack developer and mentor helping thousands of students launch their careers.",
    },
    {
      name: "Emily Roberts",
      role: "Head of Design",
      bio: "Product designer focused on crafting delightful, distraction-free learning experiences.",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "SkillNest Founded",
      description: "Started with a simple mission — make real skills learnable for everyone.",
    },
    {
      year: "2021",
      title: "1,000 Students",
      description: "Crossed our first thousand learners and launched the Student Portal.",
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Students from 40+ countries joined, with 50+ expert instructors onboarded.",
    },
    {
      year: "2026",
      title: "10,000+ Learners",
      description: "Now one of the fastest-growing practical skill platforms worldwide.",
    },
  ];

  return (
    <div className="bg-white text-black">

      {/* ===================== HERO (bg image) ===================== */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://digitalskillsforafrica.com/wp-content/uploads/2024/06/DSA-Sq-1-768x768.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 w-full">

          {/* Left: Content Card */}
          <div className="max-w-lg bg-white border border-gray-200 rounded-xl shadow-xl p-7 sm:p-8">

            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold tracking-wide uppercase text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
              About SkillNest
            </span>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-black">
              Empowering
              <br />
              <span className="text-amber-800">Lifelong Learners.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              SkillNest is a modern learning platform built to help students
              master practical, job-ready skills through expert-led courses,
              real projects, and structured learning paths.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-amber-900 text-white text-sm font-semibold rounded-lg hover:bg-amber-800 transition-colors duration-200"
              >
                Explore Courses
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-amber-800 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <stat.icon className="w-6 h-6 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-4 text-3xl sm:text-4xl font-bold text-black">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STORY ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Our Story
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Built by Learners, for Learners.
            </h2>
            <p className="mt-5 text-gray-700 leading-relaxed">
              SkillNest started in 2019 with a simple frustration — traditional
              online courses were either too expensive, too generic, or too
              disconnected from the real skills employers actually wanted.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              So we built something different. A platform where every course is
              designed by industry professionals, every learning path is
              structured for real career outcomes, and every student has access
              to the tools, mentors, and community they need to succeed.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Job-ready curriculum designed with industry experts",
                "Hands-on projects and real-world assignments",
                "Lifetime access and self-paced learning",
                "Certificates recognized by top employers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Visual block */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-900 to-black rounded-xl p-6 text-white aspect-square flex flex-col justify-between">
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                  <div>
                    <p className="text-3xl font-bold">10K+</p>
                    <p className="text-xs text-gray-300 mt-1">Students trained</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 aspect-square flex flex-col justify-between">
                  <TrendingUp className="w-8 h-8 text-amber-800" />
                  <div>
                    <p className="text-3xl font-bold text-black">95%</p>
                    <p className="text-xs text-gray-600 mt-1">Completion rate</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 aspect-square flex flex-col justify-between">
                  <Award className="w-8 h-8 text-amber-800" />
                  <div>
                    <p className="text-3xl font-bold text-black">100+</p>
                    <p className="text-xs text-gray-600 mt-1">Courses available</p>
                  </div>
                </div>
                <div className="bg-black rounded-xl p-6 text-white aspect-square flex flex-col justify-between">
                  <Users className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="text-3xl font-bold">50+</p>
                    <p className="text-xs text-gray-300 mt-1">Expert instructors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VALUES ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              What Drives Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Our Mission, Vision & Values
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Everything we build is guided by a simple belief — practical
              education should be accessible, structured, and life-changing.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <v.icon className="w-6 h-6 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-black">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== JOURNEY / MILESTONES ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Milestones Along the Way
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              From a small idea to a global learning community — here's how far
              we've come.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gray-200" />

            {milestones.map((m) => (
              <div key={m.year} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-amber-800">
                  <span className="text-sm font-bold text-amber-800">
                    {m.year}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-black">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TEAM ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Our Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Meet the People Behind SkillNest
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              A small, passionate team of educators, designers, and engineers
              building the future of practical learning.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-amber-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-800 flex items-center justify-center text-white font-bold text-xl">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="mt-5 text-base font-bold text-black">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mt-1">
                  {member.role}
                </p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== QUOTE / PHILOSOPHY ===================== */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center">
          <Quote className="w-12 h-12 mx-auto text-amber-800" />
          <p className="mt-6 text-xl sm:text-2xl lg:text-3xl font-medium text-black leading-relaxed tracking-tight">
            "We believe learning shouldn't be a luxury. It should be a path —
            structured, accessible, and built to help every student shape their
            own future."
          </p>
          <p className="mt-6 text-sm font-semibold text-amber-800 uppercase tracking-widest">
            — The SkillNest Team
          </p>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-white px-6 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-black rounded-2xl px-8 sm:px-12 lg:px-16 py-14 lg:py-20 text-center">

            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-10 w-64 h-64 rounded-full border-2 border-white" />
              <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full border-2 border-white" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Ready to Start Your Journey?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Join thousands of learners building real skills with SkillNest.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-800 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;