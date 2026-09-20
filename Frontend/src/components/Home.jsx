import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  UserPlus,
  Search,
  Laptop,
  Trophy,
  Code2,
  Brain,
  ShieldCheck,
  Briefcase,
  Palette,
  Cpu,
  Star,
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  LayoutDashboard,
  TrendingUp,
  Bell,
  Settings,
  PlayCircle,
  BarChart3,
  Calendar,
  Flame,
} from "lucide-react";

/* ---------------- Inline Brand Icons (lucide removed brand icons) ---------------- */

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

/* ---------------------------------- Home ---------------------------------- */

function Home() {
  const stats = [
    { icon: Users, value: "10K+", label: "Students" },
    { icon: BookOpen, value: "100+", label: "Courses" },
    { icon: GraduationCap, value: "50+", label: "Instructors" },
    { icon: Award, value: "95%", label: "Completion Rate" },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience in their fields.",
    },
    {
      icon: Laptop,
      title: "Practical Learning",
      description:
        "Hands-on projects and assignments designed to build job-ready skills you can apply immediately.",
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description:
        "Study at your own pace, anytime and anywhere, with lifetime access to all your courses.",
    },
    {
      icon: CheckCircle2,
      title: "Track Your Progress",
      description:
        "Monitor your learning journey with detailed progress tracking and achievement milestones.",
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your personal learning profile.",
    },
    {
      icon: Search,
      title: "Choose a Course",
      description: "Browse our catalog and pick the course that fits your goals.",
    },
    {
      icon: Laptop,
      title: "Learn & Practice",
      description: "Watch lessons, complete assignments, and build real projects.",
    },
    {
      icon: Trophy,
      title: "Earn Your Certificate",
      description: "Finish the course and receive a certificate to showcase your skills.",
    },
  ];

  const categories = [
    { icon: Code2, name: "Software Development", courses: "45 Courses" },
    { icon: Brain, name: "Data & AI", courses: "32 Courses" },
    { icon: ShieldCheck, name: "Cybersecurity", courses: "18 Courses" },
    { icon: Briefcase, name: "Business", courses: "27 Courses" },
    { icon: Palette, name: "Design", courses: "24 Courses" },
    { icon: Cpu, name: "IT & Technology", courses: "36 Courses" },
  ];

  const testimonials = [
    {
      name: "Rachel Adams",
      role: "Frontend Developer",
      rating: 5,
      text: "SkillNest completely changed my career path. The instructors are knowledgeable and the projects gave me a portfolio I'm proud of.",
    },
    {
      name: "Daniel Foster",
      role: "Data Analyst",
      rating: 5,
      text: "The structure of the courses is incredible. I went from zero to landing my first data analyst role in just six months.",
    },
    {
      name: "Sophia Bennett",
      role: "UI/UX Designer",
      rating: 5,
      text: "Practical, flexible, and well-designed. SkillNest made it easy to learn while working full-time. Highly recommended!",
    },
  ];

  const footerLinks = {
    quick: [
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
      { name: "About", path: "/about" },
      { name: "Instructors", path: "/instructors" },
      { name: "Pricing", path: "/pricing" },
      { name: "Contact", path: "/contact" },
    ],
    student: [
      { name: "Student Portal", path: "/student-portal" },
      { name: "My Courses", path: "/student-portal" },
      { name: "Progress", path: "/student-portal" },
    ],
  };

  const socials = [
    { icon: FacebookIcon, label: "Facebook" },
    { icon: TwitterIcon, label: "Twitter" },
    { icon: InstagramIcon, label: "Instagram" },
    { icon: LinkedinIcon, label: "LinkedIn" },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BookOpen, label: "My Courses" },
    { icon: BarChart3, label: "Progress" },
    { icon: Award, label: "Certificates" },
    { icon: Calendar, label: "Schedule" },
    { icon: Settings, label: "Settings" },
  ];

  const activeCourses = [
    { title: "React Development", progress: 75 },
    { title: "Python Programming", progress: 45 },
    { title: "UI/UX Design", progress: 90 },
  ];

  return (
    <div className="bg-white text-black">

      {/* ===================== 1. HERO ===================== */}
      <section className="relative overflow-hidden bg-white min-h-[80vh]">

        {/* Background Image (full, no overlay, no opacity) */}
        <div className="absolute inset-0">
          <img
            src="https://www.speexx.com/wp-content/uploads/digitalskilltraining_fi.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-14 lg:py-16 w-full">

          {/* Left: Compact Content Card */}
          <div className="max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-7">

            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-semibold tracking-wide uppercase text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-800" />
              Learn. Build. Grow.
            </span>

            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-black">
              Build Skills.
              <br />
              <span className="text-amber-800">Shape Your Future.</span>
            </h1>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              SkillNest helps students learn practical, job-ready skills through
              high-quality courses, expert instructors, and structured learning
              paths designed for success.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-900 text-white text-sm font-semibold rounded-lg hover:bg-amber-800 transition-colors duration-200"
              >
                Explore Courses
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/student-portal"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Student Portal
              </Link>
            </div>

            {/* Trust row */}
            <div className="mt-6 flex items-center gap-3 pt-5 border-t border-gray-100">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-amber-800 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-amber-700 text-amber-700"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Trusted by <span className="font-semibold text-black">10,000+</span> students
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 2. STATS ===================== */}
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

      {/* ===================== 3. WHY CHOOSE ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Why Learn With SkillNest?
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Everything you need to build real skills and advance your career,
              all in one structured platform.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-black">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 4. DASHBOARD BANNER ===================== */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold tracking-widest uppercase text-amber-100">
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
              Student Dashboard
            </span>

            <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Your Learning,
              <br />
              <span className="text-amber-500">All in One Place.</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
              Track your progress, manage enrolled courses, watch lessons, and
              unlock certificates — all from a beautifully organized dashboard
              built for students.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-3">
              {[
                "Real-time progress tracking",
                "Personalized course recommendations",
                "Streaks, achievements & certificates",
                "Learn on any device, anytime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span className="text-sm sm:text-base text-gray-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to="/student-portal"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              Go to Student Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            {/* Soft glow behind the dashboard */}
            <div className="absolute -inset-4 bg-amber-700/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">

              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-800 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-black">SkillNest</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <div className="w-7 h-7 rounded-full bg-amber-800 flex items-center justify-center text-white text-[10px] font-bold">
                    RA
                  </div>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="grid grid-cols-12">

                {/* Sidebar */}
                <aside className="hidden sm:block col-span-3 bg-gray-50 border-r border-gray-200 p-3">
                  <ul className="space-y-1">
                    {sidebarItems.map((item) => (
                      <li key={item.label}>
                        <div
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium ${
                            item.active
                              ? "bg-amber-800 text-white"
                              : "text-gray-600"
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          {item.label}
                        </div>
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* Main content */}
                <div className="col-span-12 sm:col-span-9 p-4 space-y-3">

                  {/* Welcome + streak */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-gray-500">Welcome back,</p>
                      <p className="text-sm font-bold text-black">Rachel Adams</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
                      <Flame className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-[11px] font-bold text-amber-900">
                        12-day streak
                      </span>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: BookOpen, label: "Courses", value: "6" },
                      { icon: Award, label: "Certs", value: "3" },
                      { icon: TrendingUp, label: "Avg. Score", value: "92%" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2.5"
                      >
                        <s.icon className="w-3.5 h-3.5 text-amber-800" />
                        <p className="mt-1.5 text-base font-bold text-black leading-none">
                          {s.value}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Continue learning */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-bold text-black">
                        Continue Learning
                      </p>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        View all
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeCourses.map((c) => (
                        <div
                          key={c.title}
                          className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg p-2"
                        >
                          <div className="w-8 h-8 rounded-md bg-amber-800 flex items-center justify-center shrink-0">
                            <PlayCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-black truncate">
                              {c.title}
                            </p>
                            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-800 rounded-full"
                                style={{ width: `${c.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500">
                            {c.progress}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly activity bar */}
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-black mb-1.5">
                      Weekly Activity
                    </p>
                    <div className="flex items-end justify-between gap-1 h-12">
                      {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-amber-800/80 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] text-gray-400">
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                        <span key={i} className="flex-1 text-center">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 5. HOW IT WORKS ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Simple Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              How SkillNest Works
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Getting started is easy. Follow four simple steps to begin your
              learning journey.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gray-200" />

            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-amber-800 text-amber-800">
                  <step.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-800 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-black">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 6. CATEGORIES ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Browse by Topic
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Explore Learning Categories
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Find the right path for your goals across our most popular fields.
            </p>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/courses"
                className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-800 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-800 transition-colors duration-300">
                  <cat.icon className="w-6 h-6 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-black group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.courses}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 7. TESTIMONIALS ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              What Our Students Say
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Real stories from learners who transformed their careers with SkillNest.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-700 text-amber-700"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  "{t.text}"
                </p>

                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-800 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 8. CTA ===================== */}
      <section className="bg-white px-6 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-black rounded-2xl px-8 sm:px-12 lg:px-16 py-14 lg:py-20 text-center">

            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-10 w-64 h-64 rounded-full border-2 border-white" />
              <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full border-2 border-white" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Start Learning. Start Growing.
              </h2>
              <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Join SkillNest and build the practical skills you need for your future.
              </p>
              <Link
                to="/courses"
                className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-700 transition-colors duration-200"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;