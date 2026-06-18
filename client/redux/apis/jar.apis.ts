import { JarEntryRequest, JarEntryResponse } from "@/types/jar"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const jarApi = createApi({
    reducerPath: "jarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/jar-entry`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ["JarEntry"],
    endpoints: (builder) => {
        return {
            getJarEntries: builder.query<JarEntryResponse, string>({
                query: (customerId) => `/?customerId=${customerId}`,
                providesTags: ["JarEntry"],
            }),
            createJarEntry: builder.mutation<{ message: string; entry: any }, JarEntryRequest>({
                query: (data) => ({
                    url: "/",
                    method: "POST",
                    body: data,
                }),
                invalidatesTags: ["JarEntry"],
            }),
            updateJarEntry: builder.mutation<{ message: string; entry: any }, { _id: string; date: string; noOfJars: number; pricing: number }>({
                query: (data) => ({
                    url: `/${data._id}`,
                    method: "PUT",
                    body: data,
                }),
                invalidatesTags: ["JarEntry"],
            }),
            deleteJarEntry: builder.mutation<{ message: string }, string>({
                query: (id) => ({
                    url: `/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["JarEntry"],
            }),
            sendJarEmail: builder.mutation<{ message: string }, { customerId: string; date: string; noOfJars: number; pricing: number }>({
                query: (data) => ({
                    url: `${API_URL}/send-email`,
                    method: "POST",
                    body: data,
                }),
            }),
        }
    }
})

export const {
    useGetJarEntriesQuery,
    useCreateJarEntryMutation,
    useUpdateJarEntryMutation,
    useDeleteJarEntryMutation,
    useSendJarEmailMutation,
} = jarApi
