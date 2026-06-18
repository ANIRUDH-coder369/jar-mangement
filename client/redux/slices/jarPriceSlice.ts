import { createSlice, nanoid } from "@reduxjs/toolkit"

export interface JarPriceEntry {
    id: string
    liter: number
    price: number
}

interface JarPriceState {
    entries: JarPriceEntry[]
}

const storageKey = () => {
    if (typeof window === "undefined") return "jarPriceEntries"
    try {
        const vendor = JSON.parse(localStorage.getItem("vendor") || "{}")
        return `jarPriceEntries_${vendor.id || "default"}`
    } catch {
        return "jarPriceEntries"
    }
}

const loadFromStorage = (): JarPriceEntry[] => {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(storageKey())
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const saveToStorage = (entries: JarPriceEntry[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(storageKey(), JSON.stringify(entries))
}

const initialState: JarPriceState = {
    entries: loadFromStorage()
}

const jarPriceSlice = createSlice({
    name: "jarPrice",
    initialState,
    reducers: {
        addEntry: {
            reducer: (state, action: { payload: JarPriceEntry }) => {
                state.entries.push(action.payload)
                saveToStorage(state.entries)
            },
            prepare: (liter: number, price: number) => ({
                payload: { id: nanoid(), liter, price }
            })
        },
        updateEntry: (state, action: { payload: { id: string; liter: number; price: number } }) => {
            const index = state.entries.findIndex(e => e.id === action.payload.id)
            if (index !== -1) {
                state.entries[index] = { ...state.entries[index], ...action.payload }
                saveToStorage(state.entries)
            }
        },
        deleteEntry: (state, action: { payload: string }) => {
            state.entries = state.entries.filter(e => e.id !== action.payload)
            saveToStorage(state.entries)
        },
        reloadEntries: (state) => {
            state.entries = loadFromStorage()
        }
    }
})

export const { addEntry, updateEntry, deleteEntry, reloadEntries } = jarPriceSlice.actions

export const selectJarPriceEntries = (state: { jarPrice: { entries: JarPriceEntry[] } }): JarPriceEntry[] => state.jarPrice.entries
export default jarPriceSlice.reducer
