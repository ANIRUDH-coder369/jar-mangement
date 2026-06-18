export type MonthlySales = {
    month: string
    totalJars: number
    totalRevenue: number
}

export type MonthlySalesResponse = {
    data: MonthlySales[]
}

export type TodaySalesResponse = {
    totalJars: number
    totalRevenue: number
    date: string
}
