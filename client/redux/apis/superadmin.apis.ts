import { VendorsResponse } from "@/types/superadmin"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const superadminApi = createApi({
    reducerPath: "superadminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/superadmin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ["Vendor"],
    endpoints: (builder) => {
        return {
            getAllVendors: builder.query<VendorsResponse, void>({
                query: () => "/vendors",
                providesTags: ["Vendor"],
            }),
            blockVendor: builder.mutation<{ message: string }, string>({
                query: (id) => ({
                    url: `/vendors/${id}/block`,
                    method: "PATCH",
                }),
                invalidatesTags: ["Vendor"],
            }),
            unblockVendor: builder.mutation<{ message: string }, string>({
                query: (id) => ({
                    url: `/vendors/${id}/unblock`,
                    method: "PATCH",
                }),
                invalidatesTags: ["Vendor"],
            }),
        }
    }
})

export const { useGetAllVendorsQuery, useBlockVendorMutation, useUnblockVendorMutation } = superadminApi
