"use client"

import { useLoginMutation } from "@/redux/apis/auth.apis"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z, { ZodType } from "zod"
import { LoginRequest } from "@/types/auth"

const LoginPage = () => {
    const router = useRouter()
    const [login, { isLoading, error }] = useLoginMutation()

    const loginSchema = z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
    }) satisfies ZodType<LoginRequest>

    const { register, formState: { errors }, handleSubmit } = useForm<LoginRequest>({
        defaultValues: { email: "", password: "" },
        resolver: zodResolver(loginSchema)
    })

    const handleLogin = async (data: LoginRequest) => {
        try {
            const res = await login(data).unwrap()
            localStorage.setItem("token", res.token)
            document.cookie = `token=${res.token}; path=/; max-age=604800`
            router.push("/superadmin")
        } catch {
            // error handled below
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-xs">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
                    <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="admin@example.com"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
                    </div>

                    {error && (
                        <p className="text-destructive text-sm">
                            {"data" in error ? (error.data as { message: string }).message : "Login failed"}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
