"use client"

import { useEffect, useState } from "react"
import { useGetCustomersQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useBlockCustomerMutation, useUnblockCustomerMutation, useDeleteCustomerMutation } from "@/redux/apis/customer.apis"
import { useGetMonthlySalesQuery } from "@/redux/apis/chart.apis"
import { useExpirePlanMutation } from "@/redux/apis/vendor.apis"
import { Customer, CustomerCreateRequest } from "@/types/customer"
import { VendorPlan } from "@/types/vendor"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import JarPriceTable from "@/components/JarPriceTable"

const DemoPage = () => {
    const router = useRouter()
    const [vendor, setVendor] = useState<{ companyName: string; username: string; email: string } | null>(null)
    const [expirePlan] = useExpirePlanMutation()
    const [timeLeft, setTimeLeft] = useState<string | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("vendor")
        if (stored) setVendor(JSON.parse(stored))
    }, [])

    useEffect(() => {
        const planData = localStorage.getItem("plan")
        if (!planData) return

        const plan: VendorPlan = JSON.parse(planData)
        if (!plan.hasActivePlan || !plan.endDate) return

        const endTime = new Date(plan.endDate).getTime()
        const remaining = endTime - Date.now()

        if (remaining <= 0) {
            handleExpiry()
            return
        }

        if (remaining <= 60000) {
            const timer = setInterval(() => {
                const left = endTime - Date.now()
                if (left <= 0) {
                    clearInterval(timer)
                    handleExpiry()
                } else {
                    const secs = Math.ceil(left / 1000)
                    setTimeLeft(`${secs}s`)
                }
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [])

    const handleExpiry = async () => {
        try {
            await expirePlan().unwrap()
        } catch {
            // server error, proceed with local redirect
        }
        localStorage.removeItem("plan")
        router.push("/demo-confirm")
    }

    const { data, isLoading } = useGetCustomersQuery()
    const [create] = useCreateCustomerMutation()
    const [update] = useUpdateCustomerMutation()
    const [block] = useBlockCustomerMutation()
    const [unblock] = useUnblockCustomerMutation()
    const [remove] = useDeleteCustomerMutation()

    const customers = data?.customers ?? []

    const [showChart, setShowChart] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" })

    const resetForm = () => setForm({ name: "", email: "", phone: "", address: "" })

    const handleEdit = (c: Customer) => {
        setEditId(c._id)
        setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editId) {
                await update({ _id: editId, ...form }).unwrap()
            } else {
                await create(form).unwrap()
            }
            resetForm()
            setEditId(null)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        resetForm()
        setEditId(null)
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">J</div>
                        <span className="text-lg font-bold tracking-tight">JAR Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/vendordashboard")}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
                            </svg>
                            Dashboard
                        </button>
                        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {vendor?.username?.charAt(0).toUpperCase() || "V"}
                            </div>
                            <span className="text-sm font-medium">{vendor?.username || "Vendor"}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
                    {timeLeft && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/20 dark:text-amber-300">
                            <div className="flex items-center gap-2">
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span>Demo expires in <strong>{timeLeft}</strong></span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome, {vendor?.companyName || "Vendor"}
                            </h1>
                            <p className="text-sm text-muted-foreground">{vendor?.email}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {customers.length} customer{customers.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowChart(!showChart)}
                            className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98]"
                        >
                            <svg
                                className={`h-4 w-4 transition-transform duration-300 ${showChart ? "rotate-90" : ""}`}
                                fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span>Monthly Progress</span>
                            <svg
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${showChart ? "rotate-180" : ""}`}
                                fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>

                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showChart ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <MonthlyChart />
                    </div>

                    <div className="rounded-lg border bg-card p-6 shadow-xs">
                        <h2 className="mb-4 text-lg font-semibold">{editId ? "Edit Customer" : "Add Customer"}</h2>
                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Phone</label>
                                <input
                                    type="text"
                                    placeholder="+1 234 567 8900"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Address</label>
                                <input
                                    type="text"
                                    placeholder="123 Main St"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    {editId ? "Update" : "Create"}
                                </button>
                                {editId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="rounded-lg border bg-card shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Name</th>
                                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Email</th>
                                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Phone</th>
                                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Address</th>
                                        <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="h-10 px-4 text-right align-middle text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">Loading...</td>
                                        </tr>
                                    ) : customers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No customers yet. Create one above!</td>
                                        </tr>
                                    ) : (
                                        customers.map((c) => (
                                            <tr key={c._id} className="border-b border-border transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle text-sm font-medium">{c.name}</td>
                                                <td className="p-4 align-middle text-sm">{c.email}</td>
                                                <td className="p-4 align-middle text-sm">{c.phone}</td>
                                                <td className="p-4 align-middle text-sm text-muted-foreground">{c.address || "—"}</td>
                                                <td className="p-4 align-middle text-sm">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        c.isBlocked
                                                            ? "bg-destructive/10 text-destructive"
                                                            : "bg-emerald-500/10 text-emerald-600"
                                                    }`}>
                                                        {c.isBlocked ? "Blocked" : "Active"}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="inline-flex gap-2">
                                                        <button
                                                            onClick={() => router.push(`/customer/${c._id}`)}
                                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        >
                                                            Get Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        >
                                                            Edit
                                                        </button>
                                                        {c.isBlocked ? (
                                                            <button
                                                                onClick={() => unblock(c._id)}
                                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            >
                                                                Unblock
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => block(c._id)}
                                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            >
                                                                Block
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => remove(c._id)}
                                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <JarPriceTable />
        </div>
    )
}

const MonthlyChart = () => {
    const { data } = useGetMonthlySalesQuery()

    if (!data?.data || data.data.length === 0) return null

    return (
        <div className="rounded-lg border bg-card p-6 shadow-xs">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Monthly JAR Sales</h2>
                    <p className="text-sm text-muted-foreground">Overview of your monthly performance</p>
                </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.data} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '13px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                    />
                    <Bar
                        dataKey="totalJars"
                        fill="hsl(var(--primary))"
                        radius={[6, 6, 0, 0]}
                        name="JARs Sold"
                        animationDuration={800}
                        animationEasing="ease-out"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DemoPage
