export type JarEntry = {
    _id: string
    customerId: string
    date: string
    noOfJars: number
    pricing: number
    createdAt: string
}

export type JarEntryResponse = {
    entries: JarEntry[]
}

export type JarEntryRequest = {
    customerId: string
    date: string
    noOfJars: number
    pricing: number
}
