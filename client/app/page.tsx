'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useGetReviewsQuery } from "@/redux/apis/review.apis"

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
      </svg>
    ),
    title: "Organized Storage",
    desc: "Keep all your JAR files categorized and easily accessible with our structured storage system.",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: "Secure Access",
    desc: "Role-based authentication ensures only authorized users can manage and deploy JAR files.",
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: "Real-time Tracking",
    desc: "Monitor JAR deployment status and version history with live updates and detailed logs.",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
      </svg>
    ),
    title: "Sales Analytics",
    desc: "Comprehensive charts and reports to track monthly sales, customer trends, and revenue growth.",
    color: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: "Vendor Management",
    desc: "Multi-vendor support with individual dashboards, customer assignments, and performance tracking.",
    color: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    textColor: "text-pink-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "JAR Pricing",
    desc: "Flexible pricing tiers by liter volume with easy configuration and instant cost calculations.",
    color: "from-amber-500 to-yellow-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
  },
]

const stats = [
  { value: "10K+", label: "JARs Managed", color: "from-violet-500 to-purple-600" },
  { value: "500+", label: "Active Clients", color: "from-blue-500 to-cyan-500" },
  { value: "99.9%", label: "Uptime", color: "from-emerald-500 to-teal-500" },
  { value: "24/7", label: "Support", color: "from-orange-500 to-red-500" },
]

const steps = [
  {
    num: "01",
    title: "Register Your Account",
    desc: "Sign up as a vendor in seconds. Set up your company profile and get instant access to the dashboard.",
    color: "bg-violet-500",
  },
  {
    num: "02",
    title: "Add Your Customers",
    desc: "Create customer profiles with contact details. Assign and manage customers under your vendor account.",
    color: "bg-blue-500",
  },
  {
    num: "03",
    title: "Track JAR Entries",
    desc: "Log daily JAR usage per customer with date, quantity, and pricing. Edit or update entries anytime.",
    color: "bg-emerald-500",
  },
  {
    num: "04",
    title: "Analyze & Grow",
    desc: "View monthly sales charts, track revenue trends, and make data-driven decisions to scale your business.",
    color: "bg-orange-500",
  },
]

const staticReviews = [
  {
    name: "Rajesh Kumar",
    role: "Vendor Partner",
    avatar: "RK",
    avatarColor: "from-violet-500 to-purple-600",
    rating: 5,
    text: "This platform transformed how we manage JAR distributions. The customer tracking and monthly analytics are incredibly useful for our business operations.",
    isStatic: true,
  },
  {
    name: "Priya Sharma",
    role: "Operations Manager",
    avatar: "PS",
    avatarColor: "from-blue-500 to-cyan-500",
    rating: 5,
    text: "The vendor dashboard gives me real-time visibility into our JAR sales. The pricing configuration is flexible and the reports help us plan better.",
    isStatic: true,
  },
  {
    name: "Amit Verma",
    role: "Business Owner",
    avatar: "AV",
    avatarColor: "from-emerald-500 to-teal-500",
    rating: 4,
    text: "Excellent tool for managing JAR inventory across multiple customers. The role-based access ensures our data stays secure. Highly recommended!",
    isStatic: true,
  },
  {
    name: "Sneha Patel",
    role: "Supply Chain Lead",
    avatar: "SP",
    avatarColor: "from-orange-500 to-red-500",
    rating: 5,
    text: "The ease of adding daily entries and viewing historical data is fantastic. It has streamlined our entire JAR management process significantly.",
    isStatic: true,
  },
  {
    name: "Vikram Singh",
    role: "Vendor Coordinator",
    avatar: "VS",
    avatarColor: "from-pink-500 to-rose-500",
    rating: 5,
    text: "Love the clean interface and the monthly sales chart. It's helped us identify peak demand periods and optimize our supply chain accordingly.",
    isStatic: true,
  },
  {
    name: "Ananya Gupta",
    role: "Senior Manager",
    avatar: "AG",
    avatarColor: "from-amber-500 to-yellow-500",
    rating: 4,
    text: "Great platform for JAR lifecycle management. The ability to block/unblock customers and track pricing history gives us complete control.",
    isStatic: true,
  },
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-yellow-500",
]

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false)
  const { data: reviewData } = useGetReviewsQuery()
  const liveReviews = reviewData?.reviews ?? []

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100" : "bg-transparent"
      }`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-violet-200 group-hover:shadow-xl group-hover:shadow-violet-300 transition-shadow">
              J
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              JAR Management
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/vendorLogin"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-2 text-sm font-medium text-white shadow-md shadow-violet-200 transition-all hover:shadow-lg hover:shadow-violet-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Vendor Login
            </Link>

          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 pb-32 pt-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-300/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-300/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm mb-8 animate-slide-up">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Smart JAR management starts here
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl animate-slide-up animate-delay-100">
              Run Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                JAR
              </span>{" "}
              Business with Confidence
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100/80 animate-slide-up animate-delay-200">
              Your business deserves smart tools. Manage JARs effortlessly and focus on what matters most — growing your reach.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 animate-slide-up animate-delay-300">
              <Link
                href="/vendorLogin"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-violet-700 shadow-xl shadow-violet-900/20 transition-all hover:shadow-2xl hover:shadow-violet-900/30 hover:scale-105 active:scale-[0.98]"
              >
                Get Started Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        <section id="features" className="relative -mt-20 pb-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl hover:shadow-gray-200/80 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.bgLight} ${f.textColor} group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className={`text-4xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.value}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-600">Works</span>
              </h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Get started in four simple steps and take control of your JAR management workflow.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div key={i} className="relative animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-gray-300">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                  )}
                  <div className="relative flex flex-col items-center text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${s.color} text-white text-xl font-bold shadow-lg`}>
                      {s.num}
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-gray-900">{s.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 h-60 w-60 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-fuchsia-300/10 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
          </div>
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                What Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                  Vendors
                </span>{" "}
                Say
              </h2>
              <p className="mt-3 text-purple-100/70 max-w-xl mx-auto">
                Hear from vendors who trust us for their daily JAR management needs.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...liveReviews, ...staticReviews].map((r: any, i) => {
                const color = r.avatarColor || avatarColors[i % avatarColors.length]
                const initials = r.isStatic
                  ? r.avatar
                  : r.vendorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                const name = r.isStatic ? r.name : r.vendorName
                return (
                  <div
                    key={r._id || r.name}
                    className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 animate-slide-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white shadow-lg shadow-black/20`}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{name}</p>
                          {r.role && <p className="text-xs text-purple-200/60">{r.role}</p>}
                        </div>
                      </div>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="mt-4 text-sm text-purple-100/80 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-1">
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs text-purple-200/60 font-medium">{r.rating}.0</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm text-purple-100/80 backdrop-blur-sm border border-white/10">
                <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by vendors across the country
              </div>
            </div>
          </div>
        </section>
      </main>


    </div>
  )
}

export default HomePage
