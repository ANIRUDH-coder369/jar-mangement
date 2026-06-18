export type LoginRequest = {
    email: string
    password: string
}

export type LoginResponse = {
    message: string
    token: string
    user: {
        id: string
        email: string
        role: string
    }
}
