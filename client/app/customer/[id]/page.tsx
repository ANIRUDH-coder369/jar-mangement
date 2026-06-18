"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { useGetCustomerByIdQuery } from "@/redux/apis/customer.apis"
import { useGetJarEntriesQuery, useCreateJarEntryMutation, useUpdateJarEntryMutation, useDeleteJarEntryMutation, useSendJarEmailMutation } from "@/redux/apis/jar.apis"
import { reloadEntries, selectJarPriceEntries } from "@/redux/slices/jarPriceSlice"
import { JarEntry } from "@/types/jar"
import type { JarPriceEntry } from "@/redux/slices/jarPriceSlice"

const CustomerDetailPage = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const router = useRouter()
    const customerId = id as string

    useEffect(() => { dispatch(reloadEntries()) }, [dispatch])

    const { data: custData, isLoading: custLoading } = useGetCustomerByIdQuery(customerId)
    const { data: jarData } = useGetJarEntriesQuery(customerId)
    const [create] = useCreateJarEntryMutation()
    const [update] = useUpdateJarEntryMutation()
    const [remove] = useDeleteJarEntryMutation()
    const [sendEmail, { isLoading: emailSending }] = useSendJarEmailMutation()

    const customer = custData?.customer
    const entries = jarData?.entries ?? []
    const pricePresets = useSelector(selectJarPriceEntries)

    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], noOfJars: "", pricing: "" })

    const resetForm = () => setForm({ date: new Date().toISOString().split("T")[0], noOfJars: "", pricing: "" })

    const handleEdit = (e: JarEntry) => {
        setEditId(e._id)
        setForm({ date: e.date, noOfJars: String(e.noOfJars), pricing: String(e.pricing) })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editId) {
                await update({ _id: editId, date: form.date, noOfJars: Number(form.noOfJars), pricing: Number(form.pricing) }).unwrap()
            } else {
                await create({ customerId, date: form.date, noOfJars: Number(form.noOfJars), pricing: Number(form.pricing) }).unwrap()
            }
            resetForm()
            setEditId(null)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">J</div>
                        <span className="text-lg font-bold tracking-tight">Customer Details</span>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Back
                    </button>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
                    {custLoading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : !customer ? (
                        <p className="text-sm text-muted-foreground">Customer not found</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
                                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                    {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card p-6 shadow-xs">
                                <h2 className="mb-4 text-lg font-semibold">{editId ? "Update Entry" : "Add Entry"}</h2>
                                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none">Date</label>
                                        <input
                                            type="date"
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                            required
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none">No. of JARs</label>
                                        <input
                                            type="number"
                                            placeholder="10"
                                            value={form.noOfJars}
                                            onChange={(e) => setForm({ ...form, noOfJars: e.target.value })}
                                            required
                                            min="1"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none">Pricing</label>
                                        <select
                                            value={form.pricing}
                                            onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                                            required
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                                        >
                                            <option value="">Select pricing</option>
                                            {pricePresets.map((p: JarPriceEntry) => (
                                                <option key={p.id} value={p.price}>{p.liter}L — ₹{p.price}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            type="submit"
                                            className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            {editId ? "Update" : "Add"}
                                        </button>
                                        {editId && (
                                            <button
                                                type="button"
                                                onClick={() => { resetForm(); setEditId(null) }}
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
                                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Date</th>
                                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">No. of JARs</th>
                                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Pricing</th>
                                                <th className="h-10 px-4 text-right align-middle text-sm font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">No entries yet.</td>
                                                </tr>
                                            ) : (
                                                entries.map((e) => (
                                                    <tr key={e._id} className="border-b border-border transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle text-sm">{e.date}</td>
                                                        <td className="p-4 align-middle text-sm">{e.noOfJars}</td>
                                                        <td className="p-4 align-middle text-sm font-medium">₹{e.pricing?.toFixed(2)}</td>
                                                        <td className="p-4 align-middle text-right">
                                                            <div className="inline-flex gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(e)}
                                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => sendEmail({ customerId, date: e.date, noOfJars: e.noOfJars, pricing: e.pricing })}
                                                                    disabled={emailSending}
                                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                                                                >
                                                                    {emailSending ? "..." : "Gmail"}
                                                                </button>
                                                                <button
                                                                    onClick={() => remove(e._id)}
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
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CustomerDetailPage
