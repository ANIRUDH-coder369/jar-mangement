import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type Review = {
    _id: string
    vendorId: string
    vendorName: string
    rating: number
    text: string
    createdAt: string
}

type ReviewResponse = {
    reviews: Review[]
}

type ReviewRequest = {
    rating: number
    text: string
}

type CheckResponse = {
    hasReviewed: boolean
    review: Review | null
}

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/review`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ["Review"],
    endpoints: (builder) => {
        return {
            getReviews: builder.query<ReviewResponse, void>({
                query: () => "/",
                providesTags: ["Review"],
            }),
            createReview: builder.mutation<{ message: string; review: Review }, ReviewRequest>({
                query: (data) => ({
                    url: "/",
                    method: "POST",
                    body: data,
                }),
                invalidatesTags: ["Review"],
            }),
            checkReview: builder.query<CheckResponse, void>({
                query: () => "/check",
            }),
        }
    }
})

export const {
    useGetReviewsQuery,
    useCreateReviewMutation,
    useCheckReviewQuery,
} = reviewApi
