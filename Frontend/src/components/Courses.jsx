import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Star,
  ArrowRight,
  Search,
  GraduationCap,
  Clock,
  Award,
} from "lucide-react";

const Courses = () => {
  const courses = [
    {
      title: "Full-Stack Web Development",
      category: "Development",
      description:
        "Master front-end and back-end development with modern frameworks and tools.",
      instructor: "David Carter",
      students: "2,340",
      rating: "4.9",
      price: "$89",
    },
    {
      title: "Python Programming",
      category: "Programming",
      description:
        "From basics to advanced concepts — build real applications with Python.",
      instructor: "Sarah Mitchell",
      students: "1,980",
      rating: "4.8",
      price: "$69",
    },
    {
      title: "React Development",
      category: "Frontend",
      description:
        "Build modern, interactive user interfaces with React and best practices.",
      instructor: "James Anderson",
      students: "1,540",
      rating: "4.9",
      price: "$79",
    },
    {
      title: "UI/UX Design",
      category: "Design",
      description:
        "Design beautiful, user-centered digital experiences from concept to prototype.",
      instructor: "Emily Roberts",
      students: "1,260",
      rating: "4.7",
      price: "$74",
    },
    {
      title: "Data Analysis",
      category: "Data Science",
      description:
        "Turn raw data into actionable insights using modern analytics tools.",
      instructor: "Michael Brown",
      students: "1,120",
      rating: "4.8",
      price: "$84",
    },
    {
      title: "Cybersecurity Fundamentals",
      category: "Security",
      description:
        "Understand threats, secure systems, and build a foundation in cybersecurity.",
      instructor: "Olivia Turner",
      students: "980",
      rating: "4.7",
      price: "$94",
    },
  ];

  const highlights = [
    { icon: BookOpen, label: "100+ Courses" },
    { icon: GraduationCap, label: "Expert Instructors" },
    { icon: Clock, label: "Learn Anytime" },
    { icon: Award, label: "Certificates" },
  ];

  return (
    <div className="bg-white text-black">

      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-amber-950 to-black">
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full border-2 border-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 text-center">

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold tracking-widest uppercase text-amber-100 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Our Catalog
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Explore Our
            <br />
            <span className="text-amber-500">Courses</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Discover hand-picked courses designed to help you master in-demand
            skills, build real projects, and advance your career with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/student-portal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#catalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
              Browse Catalog
            </a>
          </div>

          {/* Highlights */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 max-w-3xl mx-auto">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-2 px-3 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
              >
                <item.icon className="w-4 h-4 text-amber-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COURSES GRID ===================== */}
      <section id="catalog" className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                All Courses
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
                Browse the Catalog
              </h2>
              <p className="mt-3 text-gray-600">
                {courses.length} courses available · Updated weekly
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Sort by: <span className="font-semibold text-black">Popular</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <article
                key={course.title}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Image header */}
                <div className="relative h-24 bg-gradient-to-br from-amber-900 to-black flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-2 border-white" />
                    <div className="absolute bottom-3 right-3 w-14 h-14 rounded-full border-2 border-white" />
                  </div>
                  <BookOpen className="w-7 h-7 text-white/90 relative z-10" />
                  <span className="absolute top-2 left-2 bg-white/95 text-amber-900 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                    {course.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-xs font-bold text-black group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-600 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-gray-500">
                    <div className="w-4 h-4 rounded-full bg-amber-800 flex items-center justify-center text-white text-[8px] font-bold">
                      {course.instructor.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700 truncate">
                      {course.instructor}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3 text-[10px] text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      {course.students}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                      <span className="font-semibold text-black">
                        {course.rating}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-black">
                      {course.price}
                    </span>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[10px] font-semibold rounded-md hover:bg-amber-800 transition-colors duration-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="bg-white px-6 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-black rounded-2xl px-8 sm:px-12 lg:px-16 py-12 lg:py-16 text-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-0 left-10 w-56 h-56 rounded-full border-2 border-white" />
              <div className="absolute bottom-0 right-10 w-72 h-72 rounded-full border-2 border-white" />
            </div>

            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Can't Find the Right Course?
              </h2>
              <p className="mt-4 text-base text-gray-300 leading-relaxed">
                Tell us what you'd like to learn and we'll help you find the
                perfect path.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-amber-800 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Courses;