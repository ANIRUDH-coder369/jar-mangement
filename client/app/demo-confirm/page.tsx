"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelectPlanMutation } from "@/redux/apis/vendor.apis"

type Plan = {
  id: string
  name: string
  price: number
  duration: string
  description: string
  features: string[]
  popular?: boolean
  free?: boolean
}

const plans: Plan[] = [
  {
    id: "onemin",
    name: "1 Minute",
    price: 0,
    duration: "1 Minute",
    description: "Quick peek",
    features: ["Full customer management", "JAR tracking & analytics", "Monthly sales charts", "Limited time preview"],
  },
  {
    id: "free",
    name: "Free Demo",
    price: 0,
    duration: "10 Days",
    description: "Try all features free",
    features: ["Full customer management", "JAR tracking & analytics", "Monthly sales charts", "Up to 50 customers"],
    free: true,
  },
  {
    id: "monthly",
    name: "1 Month",
    price: 500,
    duration: "30 Days",
    description: "Perfect for short term",
    features: ["Unlimited customers", "JAR tracking & analytics", "Monthly sales charts", "Priority email support"],
  },
  {
    id: "halfyearly",
    name: "6 Months",
    price: 2000,
    duration: "180 Days",
    description: "Best value",
    features: ["Unlimited customers", "JAR tracking & analytics", "Monthly sales charts", "Priority email support"],
    popular: true,
  },
  {
    id: "yearly",
    name: "1 Year",
    price: 5000,
    duration: "365 Days",
    description: "Full year access",
    features: ["Unlimited customers", "JAR tracking & analytics", "Monthly sales charts", "Premium support"],
  },
]

const DemoConfirmPage = () => {
  const router = useRouter()
  const [selectPlan, { isLoading }] = useSelectPlanMutation()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [hasUsedFree, setHasUsedFree] = useState(false)

  useEffect(() => {
    const planData = localStorage.getItem("plan")
    if (planData) {
      const plan = JSON.parse(planData)
      setHasUsedFree(plan.hasUsedFreePlan)
    }
  }, [])

  const handleConfirmPlan = async () => {
    if (!selectedPlan) return
    try {
      const res = await selectPlan({ plan: selectedPlan.id as any }).unwrap()
      localStorage.setItem("plan", JSON.stringify(res.plan))
      setSelectedPlan(null)
      if (selectedPlan.id === "free" || selectedPlan.id === "onemin") {
        router.push("/demo")
      } else {
        router.push("/vendordashboard")
      }
    } catch {
      // error handled below
    }
  }

  const availablePlans = hasUsedFree ? plans.filter(p => p.id !== "free") : plans

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
        <p className="mt-2 text-muted-foreground">Select a plan to get started with JAR Management</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {availablePlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex w-72 flex-col rounded-2xl border-2 bg-card p-6 shadow-lg transition-all hover:shadow-xl ${
              plan.popular ? "border-primary shadow-primary/10" : "border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
            )}

            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-6 text-center">
              {plan.free ? (
                <span className="text-3xl font-bold">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/{plan.duration.toLowerCase()}</span>
                </>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{plan.duration} access</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPlan(plan)}
              className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 text-sm font-medium shadow-xs transition-all hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                plan.free
                  ? "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {plan.free ? "Get Started Free" : `Choose ${plan.name}`}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-80 animate-in fade-in zoom-in-95 rounded-xl border bg-card p-6 shadow-xl duration-200">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Confirm {selectedPlan.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedPlan.free ? "Free trial activation" : `₹${selectedPlan.price} payment`}
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
              {selectedPlan.price === 0
                ? `Are you sure you want to start the ${selectedPlan.duration} ${selectedPlan.free ? "free demo" : "preview"}? You can explore all features during this period.`
                : `Are you sure you want to purchase the ${selectedPlan.name} plan for ₹${selectedPlan.price}? You'll get ${selectedPlan.duration} of access.`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                disabled={isLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlan}
                disabled={isLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
              >
                {isLoading ? "Please wait..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoConfirmPage
