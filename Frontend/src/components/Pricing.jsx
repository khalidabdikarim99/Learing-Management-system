import { Link } from "react-router-dom";
import {
  Check,
  X,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Rocket,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  RefreshCw,
} from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Rocket,
      price: "Free",
      period: "forever",
      description: "Perfect for exploring SkillNest and trying your first course.",
      cta: "Get Started Free",
      featured: false,
      features: [
        { text: "Access to 10 free courses", included: true },
        { text: "Community forum access", included: true },
        { text: "Basic progress tracking", included: true },
        { text: "Mobile & desktop access", included: true },
        { text: "Certificates", included: false },
        { text: "1-on-1 mentor sessions", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Pro Learner",
      icon: Zap,
      price: "$19",
      period: "per month",
      description: "Our most popular plan for serious learners building real skills.",
      cta: "Start Pro Plan",
      featured: true,
      features: [
        { text: "Unlimited access to all 100+ courses", included: true },
        { text: "Verified certificates", included: true },
        { text: "Downloadable resources", included: true },
        { text: "Advanced progress analytics", included: true },
        { text: "Monthly 1-on-1 mentor session", included: true },
        { text: "Priority email support", included: true },
        { text: "Career guidance", included: false },
      ],
    },
    {
      name: "Career",
      icon: Crown,
      price: "$49",
      period: "per month",
      description: "For professionals ready to accelerate their career with guidance.",
      cta: "Go Career",
      featured: false,
      features: [
        { text: "Everything in Pro Learner", included: true },
        { text: "Weekly 1-on-1 mentor sessions", included: true },
        { text: "Personalized learning path", included: true },
        { text: "Job-ready portfolio reviews", included: true },
        { text: "Resume & interview prep", included: true },
        { text: "Direct career coaching", included: true },
        { text: "Lifetime access to courses", included: true },
      ],
    },
  ];

  const faqs = [
    {
      q: "Can I switch plans anytime?",
      a: "Yes. You can upgrade, downgrade, or cancel your plan at any time from your Student Portal. Changes take effect on your next billing cycle.",
    },
    {
      q: "Do I get a certificate after finishing a course?",
      a: "Absolutely. All paid plans include verified certificates you can share on LinkedIn, your resume, or your portfolio.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes. We offer a 14-day money-back guarantee on all paid plans — no questions asked. If you're not satisfied, you get a full refund.",
    },
    {
      q: "Do you offer student discounts?",
      a: "Yes! Students with a valid .edu email address get 40% off all paid plans. Contact our support team to apply the discount.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards, PayPal, and mobile money. All payments are processed securely.",
    },
    {
      q: "Can I access courses on mobile?",
      a: "Yes. SkillNest is fully responsive and works on phones, tablets, and desktops. Your progress syncs across all devices.",
    },
  ];

  const guarantees = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "All transactions are encrypted and processed securely.",
    },
    {
      icon: RefreshCw,
      title: "14-Day Money Back",
      description: "Not satisfied? Get a full refund within 14 days.",
    },
    {
      icon: CreditCard,
      title: "Cancel Anytime",
      description: "No long-term contracts. Cancel whenever you want.",
    },
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
            Simple Pricing
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            Invest in Your
            <br />
            <span className="text-amber-500">Future Skills.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Choose the plan that fits your goals. Start free, upgrade anytime,
            and learn at your own pace — no hidden fees.
          </p>
        </div>
      </section>

      {/* ===================== PLANS ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-6">

            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white border rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                  plan.featured
                    ? "border-amber-800 shadow-xl lg:-translate-y-2"
                    : "border-gray-200 hover:border-amber-800 hover:shadow-lg"
                }`}
              >
                {/* Most popular badge */}
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 bg-amber-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    <Star className="w-3 h-3 fill-white" />
                    Most Popular
                  </span>
                )}

                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                      plan.featured ? "bg-amber-800" : "bg-amber-50"
                    }`}
                  >
                    <plan.icon
                      className={`w-5 h-5 ${
                        plan.featured ? "text-white" : "text-amber-800"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-gray-500">{plan.period}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-4xl font-bold text-black">
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className="text-sm text-gray-500 ml-1">
                      /{plan.period.split(" ")[1]}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {plan.description}
                </p>

                {/* CTA */}
                <Link
                  to={plan.price === "Free" ? "/courses" : "/student-portal"}
                  className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                    plan.featured
                      ? "bg-amber-800 text-white hover:bg-amber-700"
                      : "bg-black text-white hover:bg-amber-800"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Features */}
                <ul className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f.text}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      {f.included ? (
                        <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          f.included ? "text-gray-700" : "text-gray-400"
                        }
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GUARANTEES ===================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid sm:grid-cols-3 gap-5">
            {guarantees.map((g) => (
              <div
                key={g.title}
                className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <g.icon className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{g.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {g.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">

          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Everything you need to know about plans, payments, and access.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-amber-800 transition-colors duration-200"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-semibold text-sm text-black">
                  {faq.q}
                  <span className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0 group-open:bg-amber-800 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 text-amber-800 group-open:text-white group-open:rotate-45 transition-all duration-200"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
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
                Not Sure Which Plan?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Start with our free plan, or talk to us and we'll help you
                choose the best path for your goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-800 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  Browse Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-colors duration-200"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;