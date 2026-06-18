"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addEntry, updateEntry, deleteEntry, reloadEntries, selectJarPriceEntries, JarPriceEntry } from "@/redux/slices/jarPriceSlice"

export default function JarPriceTable() {
    const dispatch = useDispatch()
    const entries = useSelector(selectJarPriceEntries)

    useEffect(() => { dispatch(reloadEntries()) }, [dispatch])

    const [liter, setLiter] = useState("")
    const [price, setPrice] = useState("")
    const [editId, setEditId] = useState<string | null>(null)
    const [editLiter, setEditLiter] = useState("")
    const [editPrice, setEditPrice] = useState("")

    const handleAdd = () => {
        if (!liter || !price) return
        dispatch(addEntry(Number(liter), Number(price)))
        setLiter("")
        setPrice("")
    }

    const startEdit = (e: JarPriceEntry) => {
        setEditId(e.id)
        setEditLiter(String(e.liter))
        setEditPrice(String(e.price))
    }

    const handleUpdate = () => {
        if (!editId || !editLiter || !editPrice) return
        dispatch(updateEntry({ id: editId, liter: Number(editLiter), price: Number(editPrice) }))
        setEditId(null)
        setEditLiter("")
        setEditPrice("")
    }

    const handleDelete = (id: string) => {
        dispatch(deleteEntry(id))
        if (editId === id) {
            setEditId(null)
            setEditLiter("")
            setEditPrice("")
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-72 rounded-lg border bg-card shadow-lg">
            <div className="border-b border-border px-3 py-2">
                <h3 className="text-sm font-semibold">Jar Price</h3>
            </div>
            <div className="p-3 space-y-2">
                {!editId && (
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Liter"
                            value={liter}
                            onChange={e => setLiter(e.target.value)}
                            className="flex h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="flex h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <button
                            onClick={handleAdd}
                            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                        >
                            Add
                        </button>
                    </div>
                )}
                {entries.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">No entries yet</p>
                ) : (
                    <div className="max-h-48 overflow-y-auto space-y-1">
                        {entries.map((e: JarPriceEntry) => (
                            <div key={e.id} className="flex items-center gap-1 rounded-md border border-border p-1.5">
                                {editId === e.id ? (
                                    <>
                                        <input
                                            type="number"
                                            value={editLiter}
                                            onChange={e => setEditLiter(e.target.value)}
                                            className="flex h-7 w-full min-w-0 rounded-md border border-input bg-transparent px-1.5 py-0.5 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                        <input
                                            type="number"
                                            value={editPrice}
                                            onChange={e => setEditPrice(e.target.value)}
                                            className="flex h-7 w-full min-w-0 rounded-md border border-input bg-transparent px-1.5 py-0.5 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                        <button
                                            onClick={handleUpdate}
                                            className="inline-flex h-7 shrink-0 items-center justify-center rounded-md bg-primary px-1.5 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => { setEditId(null); setEditLiter(""); setEditPrice("") }}
                                            className="inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-input bg-background px-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-accent"
                                        >
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="min-w-0 flex-1 truncate text-xs">
                                            {e.liter}L — ₹{e.price}
                                        </span>
                                        <button
                                            onClick={() => startEdit(e)}
                                            className="inline-flex h-6 shrink-0 items-center justify-center rounded-md border border-input bg-background px-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-accent"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(e.id)}
                                            className="inline-flex h-6 shrink-0 items-center justify-center rounded-md bg-destructive px-1.5 text-xs font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90"
                                        >
                                            Del
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
