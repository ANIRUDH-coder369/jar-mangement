import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../store/token"

import BASE from "../config"

export const jarApi = createApi({
  reducerPath: "jarApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/jar-entry`,
    prepareHeaders: (headers) => {
      const t = getToken()
      if (t) headers.set("Authorization", `Bearer ${t}`)
      return headers
    },
  }),
  tagTypes: ["JarEntry"],
  endpoints: (builder) => ({
    getJarEntries: builder.query<{ entries: any[] }, string>({
      query: (customerId) => `/?customerId=${customerId}`,
      providesTags: ["JarEntry"],
    }),
    createJarEntry: builder.mutation<{ entry: any }, { customerId: string; date: string; noOfJars: number; pricing: number }>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["JarEntry"],
    }),
    updateJarEntry: builder.mutation<{ entry: any }, { _id: string; date: string; noOfJars: number; pricing: number }>({
      query: (body) => ({ url: `/${body._id}`, method: "PUT", body }),
      invalidatesTags: ["JarEntry"],
    }),
    deleteJarEntry: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["JarEntry"],
    }),
  }),
})

export const {
  useGetJarEntriesQuery,
  useCreateJarEntryMutation,
  useUpdateJarEntryMutation,
  useDeleteJarEntryMutation,
} = jarApi
