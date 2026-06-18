import { CustomerCreateRequest, CustomerResponse, CustomerUpdateRequest, SingleCustomerResponse } from "@/types/customer"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
const API_URL =
    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const customerApi = createApi({
    reducerPath: "customerApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/customer`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    tagTypes: ["Customer"],
    endpoints: (builder) => {
        return {
            getCustomers: builder.query<CustomerResponse, void>({
                query: () => "/",
                providesTags: ["Customer"],
            }),
            getCustomerById: builder.query<SingleCustomerResponse, string>({
                query: (id) => `/${id}`,
                providesTags: ["Customer"],
            }),
            createCustomer: builder.mutation<SingleCustomerResponse, CustomerCreateRequest>({
                query: (data) => ({
                    url: "/",
                    method: "POST",
                    body: data,
                }),
                invalidatesTags: ["Customer"],
            }),
            updateCustomer: builder.mutation<SingleCustomerResponse, CustomerUpdateRequest>({
                query: (data) => ({
                    url: `/${data._id}`,
                    method: "PUT",
                    body: data,
                }),
                invalidatesTags: ["Customer"],
            }),
            deleteCustomer: builder.mutation<{ message: string }, string>({
                query: (id) => ({
                    url: `/${id}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["Customer"],
            }),
            blockCustomer: builder.mutation<SingleCustomerResponse, string>({
                query: (id) => ({
                    url: `/${id}/block`,
                    method: "PATCH",
                }),
                invalidatesTags: ["Customer"],
            }),
            unblockCustomer: builder.mutation<SingleCustomerResponse, string>({
                query: (id) => ({
                    url: `/${id}/unblock`,
                    method: "PATCH",
                }),
                invalidatesTags: ["Customer"],
            }),
        }
    }
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
