import { LoginRequest, LoginResponse } from "@/types/auth"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/auth`,
        credentials: "include"
    }),
    endpoints: (builder) => {
        return {
            login: builder.mutation<LoginResponse, LoginRequest>({
                query: (userData) => {
                    return {
                        url: "/login",
                        method: "POST",
                        body: userData
                    }
                },
            }),
        }
    }
})

export const { useLoginMutation } = authApi
