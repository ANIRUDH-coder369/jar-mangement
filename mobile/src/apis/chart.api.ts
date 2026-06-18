import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../store/token"

import BASE from "../config"

export const chartApi = createApi({
  reducerPath: "chartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/chart`,
    prepareHeaders: (headers) => {
      const t = getToken()
      if (t) headers.set("Authorization", `Bearer ${t}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getMonthlySales: builder.query<{ data: any[] }, void>({
      query: () => "/monthly-sales",
    }),
    getTodaySales: builder.query<any, string | void>({
      query: (date) => `/today-sales${date ? `?date=${date}` : ""}`,
    }),
  }),
})

export const {
  useGetMonthlySalesQuery,
  useGetTodaySalesQuery,
} = chartApi
