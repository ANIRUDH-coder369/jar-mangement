export type Vendor = {
  id: string
  companyName: string
  email: string
  username: string
}

export type VendorPlan = {
  type: "free" | "onemin" | "monthly" | "halfyearly" | "yearly" | null
  startDate: string | null
  endDate: string | null
  hasActivePlan: boolean
  hasUsedFreePlan: boolean
  isBlocked: boolean
}

export type Customer = {
  _id: string
  vendorId: string
  name: string
  email: string
  phone: string
  address: string
  isBlocked: boolean
  createdAt: string
  updatedAt: string
}

export type JarEntry = {
  _id: string
  customerId: string
  date: string
  noOfJars: number
  pricing: number
  createdAt: string
}

export type Review = {
  _id: string
  vendorId: string
  vendorName: string
  rating: number
  text: string
  createdAt: string
}

export type MonthlySales = {
  month: string
  totalJars: number
  totalRevenue: number
}

export type TodaySales = {
  totalJars: number
  totalRevenue: number
  date: string
}
