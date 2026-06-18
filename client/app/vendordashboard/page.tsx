"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetTodaySalesQuery } from "@/redux/apis/chart.apis"
import { useCreateReviewMutation, useCheckReviewQuery } from "@/redux/apis/review.apis"
import ThemeToggle from "@/components/ThemeToggle"

const VendorDashboard = () => {
    const router = useRouter()
    const [vendor, setVendor] = useState<{ companyName: string; username: string; email: string } | null>(null)
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0])
    const { data: todayData, isFetching } = useGetTodaySalesQuery(selectedDate)
    const [submitReview] = useCreateReviewMutation()
    const { data: checkData } = useCheckReviewQuery()
    const [reviewRating, setReviewRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [reviewText, setReviewText] = useState("")
    const [reviewSubmitted, setReviewSubmitted] = useState(false)
    const hasReviewed = checkData?.hasReviewed

    useEffect(() => {
        const stored = localStorage.getItem("vendor")
        if (stored) setVendor(JSON.parse(stored))
    }, [])

    const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">J</div>
                        <span className="text-lg font-bold tracking-tight">JAR Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {vendor?.username?.charAt(0).toUpperCase() || "V"}
                            </div>
                            <div className="text-sm">
                                <p className="font-medium leading-tight">{vendor?.username || "Vendor"}</p>
                                <p className="text-xs text-muted-foreground">{vendor?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome, {vendor?.companyName || "Vendor"}
                            </h1>
                            <p className="text-sm text-muted-foreground">{formattedDate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium">Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-lg border bg-card p-6 shadow-xs">
                            <p className="text-sm text-muted-foreground">JARs Sold on {selectedDate}</p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">
                                {isFetching ? "—" : (todayData?.totalJars ?? 0)}
                            </p>
                        </div>
                        <div className="rounded-lg border bg-card p-6 shadow-xs">
                            <p className="text-sm text-muted-foreground">Revenue on {selectedDate}</p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">
                                {isFetching ? "—" : `₹${todayData?.totalRevenue?.toFixed(2) ?? "0.00"}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push("/demo")}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Create Customer
                        </button>
                    </div>

                    {!hasReviewed && (
                        <div className="rounded-lg border bg-card p-6 shadow-xs">
                            <h2 className="text-lg font-semibold">Share Your Experience</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tell us how JAR Management has helped your business.
                            </p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`p-0.5 transition-colors ${
                                                (hoverRating || reviewRating) >= star
                                                    ? "text-amber-400"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your thoughts about our platform..."
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                />
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {vendor?.username || "Vendor"}
                                    </p>
                                    <button
                                        onClick={async () => {
                                            if (!reviewRating || !reviewText.trim()) return
                                            try {
                                                await submitReview({ rating: reviewRating, text: reviewText }).unwrap()
                                                setReviewSubmitted(true)
                                                setReviewRating(0)
                                                setReviewText("")
                                                setTimeout(() => setReviewSubmitted(false), 3000)
                                            } catch (err) {
                                                console.log(err)
                                            }
                                        }}
                                        disabled={!reviewRating || !reviewText.trim()}
                                        className="ml-auto rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {reviewSubmitted ? "Submitted!" : "Submit Review"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default VendorDashboard
