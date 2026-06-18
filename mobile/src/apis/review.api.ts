import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../store/token"

import BASE from "../config"

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/review`,
    prepareHeaders: (headers) => {
      const t = getToken()
      if (t) headers.set("Authorization", `Bearer ${t}`)
      return headers
    },
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<{ reviews: any[] }, void>({
      query: () => "/",
    }),
    createReview: builder.mutation<{ review: any }, { rating: number; text: string }>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Review"],
    }),
    checkReview: builder.query<{ hasReviewed: boolean; review: any | null }, void>({
      query: () => "/check",
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useCheckReviewQuery,
} = reviewApi
