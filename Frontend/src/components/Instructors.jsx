import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Star,
  ArrowRight,
  Globe,
  TrendingUp,
  CheckCircle2,
  Code2,
  Brain,
  ShieldCheck,
  Palette,
  Briefcase,
  Cpu,
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

const GithubIcon = (props) => (
  <BrandSvg
    {...props}
    path="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
  />
);

/* ---------------------------------- Page ---------------------------------- */

const Instructors = () => {
  const featured = [
    {
      name: "Amina Wanjiru",
      role: "Full-Stack Development Lead",
      bio: "10+ years building web apps for startups across East Africa.",
      courses: 12,
      students: "4.2K",
      rating: "4.9",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Abdirahman Hassan",
      role: "Data Science Instructor",
      bio: "Former data lead at a fintech unicorn. Teaches practical analytics.",
      courses: 9,
      students: "3.1K",
      rating: "4.8",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Grace Njeri",
      role: "UI/UX Design Mentor",
      bio: "Product designer with a decade crafting user-centered experiences.",
      courses: 7,
      students: "2.5K",
      rating: "4.9",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  const instructors = [
    {
      name: "Fatuma Ali",
      role: "Cybersecurity Instructor",
      bio: "Ethical hacking and network security specialist.",
      courses: 6,
      students: "1.8K",
      rating: "4.8",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      name: "Brian Otieno",
      role: "Backend Engineer Mentor",
      bio: "Python, Django, and scalable API design.",
      courses: 8,
      students: "2.2K",
      rating: "4.7",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Hodan Yusuf",
      role: "Business & Strategy",
      bio: "Product strategy and growth analytics for startups.",
      courses: 5,
      students: "1.4K",
      rating: "4.8",
      image: "https://randomuser.me/api/portraits/women/90.jpg",
    },
    {
      name: "Kevin Mwangi",
      role: "Mobile Development",
      bio: "React Native and Flutter for cross-platform apps.",
      courses: 7,
      students: "1.9K",
      rating: "4.9",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: "Yasmin Ibrahim",
      role: "AI & Machine Learning",
      bio: "Deep learning with TensorFlow and PyTorch.",
      courses: 6,
      students: "1.6K",
      rating: "4.9",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      name: "Peter Kamau",
      role: "DevOps Instructor",
      bio: "Docker, Kubernetes, and cloud infrastructure.",
      courses: 5,
      students: "1.3K",
      rating: "4.7",
      image: "https://randomuser.me/api/portraits/men/58.jpg",
    },
    {
      name: "Leyla Mohamed",
      role: "UX Research Instructor",
      bio: "User testing, interviews, and design research.",
      courses: 4,
      students: "980",
      rating: "4.8",
      image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
      name: "Daniel Kipchoge",
      role: "Cloud & Infrastructure",
      bio: "Azure, GCP, and Infrastructure-as-Code.",
      courses: 6,
      students: "1.5K",
      rating: "4.8",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Naima Abdullahi",
      role: "Frontend Instructor",
      bio: "JavaScript, Vue, and modern CSS patterns.",
      courses: 7,
      students: "2.0K",
      rating: "4.9",
      image: "https://randomuser.me/api/portraits/women/79.jpg",
    },
  ];

  const stats = [
    { icon: Users, value: "50+", label: "Expert Instructors" },
    { icon: BookOpen, value: "100+", label: "Courses Taught" },
    { icon: GraduationCap, value: "10K+", label: "Students Mentored" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  const specialties = [
    { icon: Code2, label: "Software Development" },
    { icon: Brain, label: "Data & AI" },
    { icon: ShieldCheck, label: "Cybersecurity" },
    { icon: Palette, label: "Design" },
    { icon: Briefcase, label: "Business" },
    { icon: Cpu, label: "IT & Cloud" },
  ];

  const socialIcons = [LinkedinIcon, TwitterIcon, GithubIcon];

  return (
    <div className="bg-white text-black">

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-amber-950 to-black">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full border-2 border-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold tracking-widest uppercase text-amber-100 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Our Instructors
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Learn From
            <br />
            <span className="text-amber-500">Industry Experts.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Practitioners first, teachers second — bringing real-world experience
            from top companies to every lesson.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              Browse Their Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
            >
              Become an Instructor
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-white border border-gray-200 rounded-xl p-5 text-center hover:border-amber-800 transition-all duration-300"
              >
                <div className="w-11 h-11 mx-auto rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-bold text-black">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Featured
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Top Instructors
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Hand-picked experts delivering the highest-rated learning experiences.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {featured.map((instructor) => (
              <div
                key={instructor.name}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-amber-800 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Top: avatar + info */}
                <div className="flex items-center gap-3">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-black group-hover:text-amber-800 transition-colors truncate">
                      {instructor.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-800 mt-0.5 truncate">
                      {instructor.role}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span className="text-[11px] font-bold text-black">
                        {instructor.rating}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        · {instructor.students} students
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-4 text-xs text-gray-600 leading-relaxed flex-1">
                  {instructor.bio}
                </p>

                {/* Stats + Socials */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                    <BookOpen className="w-3 h-3" />
                    {instructor.courses} courses
                  </span>
                  <div className="flex items-center gap-1">
                    {socialIcons.map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-800 transition-colors duration-200"
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ALL INSTRUCTORS ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                Our Team
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
                All Instructors
              </h2>
              <p className="mt-3 text-gray-600 text-sm">
                Practitioners and mentors from across tech, design, and business.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {instructors.length + featured.length} instructors total
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instructors.map((instructor) => (
              <div
                key={instructor.name}
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-800 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Top: avatar + name */}
                <div className="flex items-center gap-3">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-100 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-black group-hover:text-amber-800 transition-colors truncate">
                      {instructor.name}
                    </h3>
                    <p className="text-[11px] font-medium text-amber-800 mt-0.5 truncate">
                      {instructor.role}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-3 text-[11px] text-gray-600 leading-relaxed line-clamp-2">
                  {instructor.bio}
                </p>

                {/* Stats + Socials */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {instructor.courses}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {instructor.students}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                      <span className="font-semibold text-black">
                        {instructor.rating}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {socialIcons.map((Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-800 transition-colors duration-200"
                      >
                        <Icon className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SPECIALTIES ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Expertise Areas
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              What Our Instructors Teach
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {specialties.map((s) => (
              <div
                key={s.label}
                className="group bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-amber-800 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-800 transition-colors duration-300">
                  <s.icon className="w-4 h-4 text-amber-800 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-2.5 text-[11px] font-semibold text-black leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BECOME AN INSTRUCTOR ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
              Join the Team
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Become a SkillNest Instructor
            </h2>
            <p className="mt-5 text-gray-700 leading-relaxed">
              Share your expertise with thousands of motivated learners. We
              give you the tools, support, and platform to teach what you love.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Reach 10,000+ students worldwide",
                "Keep full control of your curriculum",
                "Get support from our production team",
                "Earn competitive revenue sharing",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-800 transition-colors duration-200"
              >
                Apply to Teach
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <div className="w-11 h-11 rounded-lg bg-amber-800 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">
                  Why instructors choose us
                </p>
                <p className="text-xs text-gray-500">Real impact, real support</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { icon: Users, label: "Avg. students per course", value: "1,400+" },
                { icon: TrendingUp, label: "Avg. course completion", value: "95%" },
                { icon: Award, label: "Instructor satisfaction", value: "4.9/5" },
                { icon: Globe, label: "Countries reached", value: "40+" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-amber-800" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-500">{item.label}</p>
                    <p className="text-sm font-bold text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-white px-6 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-black rounded-2xl px-8 sm:px-12 lg:px-16 py-14 lg:py-16 text-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-10 w-64 h-64 rounded-full border-2 border-white" />
              <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full border-2 border-white" />
            </div>

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Ready to Learn From the Best?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Browse courses taught by our expert instructors and start
                building the skills that matter.
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

export default Instructors;