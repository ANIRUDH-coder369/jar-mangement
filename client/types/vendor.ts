export type VendorPlan = {
    type: 'free' | 'onemin' | 'monthly' | 'halfyearly' | 'yearly' | null
    startDate: string | null
    endDate: string | null
    hasActivePlan: boolean
    hasUsedFreePlan: boolean
    isBlocked: boolean
}

export type VendorLoginRequest = {
    email: string
    password: string
}

export type VendorRegisterRequest = {
    companyName: string
    address: string
    contactNo: string
    email: string
    username: string
    password: string
}

export type VendorLoginResponse = {
    message: string
    token: string
    vendor: {
        id: string
        companyName: string
        email: string
        username: string
    }
    plan: VendorPlan
}

export type SelectPlanRequest = {
    plan: 'free' | 'monthly' | 'halfyearly' | 'yearly'
}

export type SelectPlanResponse = {
    message: string
    plan: VendorPlan
}

export type PlanStatusResponse = {
    plan: VendorPlan
}
