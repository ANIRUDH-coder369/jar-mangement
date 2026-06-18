import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../store/token"

import BASE from "../config"

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/vendor`,
    prepareHeaders: (headers) => {
      const t = getToken()
      if (t) headers.set("Authorization", `Bearer ${t}`)
      return headers
    },
  }),
  tagTypes: ["Plan"],
  endpoints: (builder) => ({
    vendorLogin: builder.mutation<{ message: string; token: string; vendor: any; plan: any }, { email: string; password: string }>({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    vendorRegister: builder.mutation<{ message: string; token: string; vendor: any; plan: any }, any>({
      query: (body) => ({ url: "/register", method: "POST", body }),
    }),
    selectPlan: builder.mutation<{ message: string; plan: any }, { plan: string }>({
      query: (body) => ({ url: "/select-plan", method: "POST", body }),
      invalidatesTags: ["Plan"],
    }),
    getPlanStatus: builder.query<{ plan: any }, void>({
      query: () => "/plan-status",
      providesTags: ["Plan"],
    }),
    expirePlan: builder.mutation<{ plan: any }, void>({
      query: () => ({ url: "/expire-plan", method: "POST" }),
      invalidatesTags: ["Plan"],
    }),
  }),
})

export const {
  useVendorLoginMutation,
  useVendorRegisterMutation,
  useSelectPlanMutation,
  useGetPlanStatusQuery,
  useExpirePlanMutation,
} = vendorApi
