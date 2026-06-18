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

export type CustomerCreateRequest = {
    name: string
    email: string
    phone: string
    address?: string
}

export type CustomerUpdateRequest = {
    _id: string
    name: string
    email: string
    phone: string
    address?: string
}

export type CustomerResponse = {
    customers: Customer[]
}

export type SingleCustomerResponse = {
    customer: Customer
}
