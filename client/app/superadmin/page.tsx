"use client"

import { useGetAllVendorsQuery, useBlockVendorMutation, useUnblockVendorMutation } from "@/redux/apis/superadmin.apis"
import type { VendorInfo } from "@/types/superadmin"
import { useRouter } from "next/navigation"

const planLabels: Record<string, string> = {
    free: "Free",
    monthly: "1 Month",
    halfyearly: "6 Months",
    yearly: "1 Year",
}

const VendorTable = ({ data, title, icon, onBlock, onUnblock }: { data: VendorInfo[]; title: string; icon: string; onBlock: (id: string) => void; onUnblock: (id: string) => void }) => (
    <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="text-xl">{icon}</span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className="ml-auto inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {data.length} vendor{data.length !== 1 ? "s" : ""}
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Company</th>
                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Email</th>
                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Contact</th>
                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Plan</th>
                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Status</th>
                        <th className="h-10 px-4 text-right align-middle text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No vendors found.</td>
                        </tr>
                    ) : (
                        data.map((v) => (
                            <tr key={v._id} className="border-b border-border transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{v.companyName.charAt(0).toUpperCase()}</div>
                                        <span>{v.companyName}</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle text-sm text-muted-foreground">{v.email}</td>
                                <td className="p-4 align-middle text-sm">{v.contactNo}</td>
                                <td className="p-4 align-middle">
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/5 text-primary border-primary/20">
                                        {planLabels[v.plan as keyof typeof planLabels] || v.plan || "—"}
                                    </span>
                                </td>
                                <td className="p-4 align-middle text-sm">
                                    {v.isBlocked ? (
                                        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">Blocked</span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                                    )}
                                </td>
                                <td className="p-4 align-middle text-right">
                                    {v.isBlocked ? (
                                        <button
                                            onClick={() => onUnblock(v._id)}
                                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Unblock
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onBlock(v._id)}
                                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground shadow-xs transition-all hover:bg-destructive/90"
                                        >
                                            Block
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
)

const SuperAdminPage = () => {
    const router = useRouter()
    const { data, isLoading } = useGetAllVendorsQuery()
    const [block] = useBlockVendorMutation()
    const [unblock] = useUnblockVendorMutation()

    const vendors = data?.vendors ?? []

    const freePlan = vendors.filter(v => v.plan === "free" && v.planStatus === "active")
    const monthlyPlan = vendors.filter(v => v.plan === "monthly" && v.planStatus === "active")
    const halfyearlyPlan = vendors.filter(v => v.plan === "halfyearly" && v.planStatus === "active")
    const yearlyPlan = vendors.filter(v => v.plan === "yearly" && v.planStatus === "active")
    const expiredPlan = vendors.filter(v => v.planStatus === "expired")

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                    <p className="text-sm text-muted-foreground">Loading vendors...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-lg">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-sm">A</div>
                        <span className="text-lg font-bold tracking-tight">Admin - Vendor Management</span>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                        Home
                    </button>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">All Vendors</h1>
                        <p className="text-sm text-muted-foreground">{vendors.length} vendor{vendors.length !== 1 ? "s" : ""} registered</p>
                    </div>

                    {freePlan.length > 0 && <VendorTable data={freePlan} title="Free Plan Vendors" icon="🎁" onBlock={block} onUnblock={unblock} />}

                    {monthlyPlan.length > 0 && <VendorTable data={monthlyPlan} title="1 Month Plan Vendors" icon="📅" onBlock={block} onUnblock={unblock} />}

                    {halfyearlyPlan.length > 0 && <VendorTable data={halfyearlyPlan} title="6 Months Plan Vendors" icon="📆" onBlock={block} onUnblock={unblock} />}

                    {yearlyPlan.length > 0 && <VendorTable data={yearlyPlan} title="1 Year Plan Vendors" icon="⭐" onBlock={block} onUnblock={unblock} />}

                    {expiredPlan.length > 0 && <VendorTable data={expiredPlan} title="Expired Plan Vendors" icon="⚠️" onBlock={block} onUnblock={unblock} />}
                </div>
            </main>
        </div>
    )
}

export default SuperAdminPage
