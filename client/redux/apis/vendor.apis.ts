import { VendorLoginRequest, VendorLoginResponse, VendorRegisterRequest, SelectPlanRequest, SelectPlanResponse, PlanStatusResponse } from "@/types/vendor"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"
export const vendorApi = createApi({
    reducerPath: "vendorApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/vendor`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) headers.set("Authorization", `Bearer ${token}`)
            return headers
        },
    }),
    endpoints: (builder) => {
        return {
            vendorLogin: builder.mutation<VendorLoginResponse, VendorLoginRequest>({
                query: (userData) => {
                    return {
                        url: "/login",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            vendorRegister: builder.mutation<VendorLoginResponse, VendorRegisterRequest>({
                query: (userData) => {
                    return {
                        url: "/register",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            selectPlan: builder.mutation<SelectPlanResponse, SelectPlanRequest>({
                query: (data) => ({
                    url: "/select-plan",
                    method: "POST",
                    body: data,
                }),
            }),
            getPlanStatus: builder.query<PlanStatusResponse, void>({
                query: () => "/plan-status",
            }),
            expirePlan: builder.mutation<PlanStatusResponse, void>({
                query: () => ({
                    url: "/expire-plan",
                    method: "POST",
                }),
            }),
        }
    }
})

export const { useVendorLoginMutation, useVendorRegisterMutation, useSelectPlanMutation, useGetPlanStatusQuery, useExpirePlanMutation } = vendorApi
