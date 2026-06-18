import { MonthlySalesResponse, TodaySalesResponse } from "@/types/chart"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"
export const chartApi = createApi({
    reducerPath: "chartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/chart`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    endpoints: (builder) => {
        return {
            getMonthlySales: builder.query<MonthlySalesResponse, void>({
                query: () => "/monthly-sales",
            }),
            getTodaySales: builder.query<TodaySalesResponse, string | void>({
                query: (date) => `/today-sales${date ? `?date=${date}` : ""}`,
            }),
        }
    }
})

export const { useGetMonthlySalesQuery, useGetTodaySalesQuery } = chartApi
