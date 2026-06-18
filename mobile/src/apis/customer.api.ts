import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getToken } from "../store/token"

import BASE from "../config"

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/customer`,
    prepareHeaders: (headers) => {
      const t = getToken()
      if (t) headers.set("Authorization", `Bearer ${t}`)
      return headers
    },
  }),
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query<{ customers: any[] }, void>({
      query: () => "/",
      providesTags: ["Customer"],
    }),
    getCustomerById: builder.query<{ customer: any }, string>({
      query: (id) => `/${id}`,
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<{ customer: any }, { name: string; email: string; phone: string; address?: string }>({
      query: (body) => ({ url: "/", method: "POST", body }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation<{ customer: any }, { _id: string; name: string; email: string; phone: string; address?: string }>({
      query: (body) => ({ url: `/${body._id}`, method: "PUT", body }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomer: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Customer"],
    }),
    blockCustomer: builder.mutation<{ customer: any }, string>({
      query: (id) => ({ url: `/${id}/block`, method: "PATCH" }),
      invalidatesTags: ["Customer"],
    }),
    unblockCustomer: builder.mutation<{ customer: any }, string>({
      query: (id) => ({ url: `/${id}/unblock`, method: "PATCH" }),
      invalidatesTags: ["Customer"],
    }),
  }),
})

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useBlockCustomerMutation,
  useUnblockCustomerMutation,
} = customerApi
