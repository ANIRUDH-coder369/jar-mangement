export type VendorInfo = {
    _id: string
    companyName: string
    email: string
    username: string
    contactNo: string
    address: string
    isBlocked: boolean
    plan: 'free' | 'onemin' | 'monthly' | 'halfyearly' | 'yearly' | null
    planStartDate: string | null
    planEndDate: string | null
    hasUsedFreePlan: boolean
    createdAt: string
    planStatus: 'active' | 'expired' | 'no_plan'
    planLabel: string | null
    planDaysRemaining: number | null
    planDaysExpired: number | null
}

export type VendorsResponse = {
    vendors: VendorInfo[]
}
