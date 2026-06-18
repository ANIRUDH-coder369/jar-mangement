"use client"

import { useVendorLoginMutation, useVendorRegisterMutation } from "@/redux/apis/vendor.apis"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z, { ZodType } from "zod"

const VendorLoginPage = () => {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [login, { isLoading: loginLoading, error: loginError }] = useVendorLoginMutation()
    const [register, { isLoading: regLoading, error: regError }] = useVendorRegisterMutation()

    const loginSchema = z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
    })

    const registerSchema = z.object({
        companyName: z.string().min(1, "Company name is required"),
        address: z.string().min(1, "Address is required"),
        contactNo: z.string().min(1, "Contact number is required"),
        email: z.string().email("Invalid email"),
        username: z.string().min(1, "Username is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })

    const { register: reg, formState: { errors }, handleSubmit, reset } = useForm<any>({
        defaultValues: isLogin
            ? { email: "", password: "" }
            : { companyName: "", address: "", contactNo: "", email: "", username: "", password: "" },
        resolver: zodResolver(isLogin ? loginSchema : registerSchema)
    })

    const handleVendorSubmit = async (data: any) => {
        try {
            const res = isLogin
                ? await login(data).unwrap()
                : await register(data).unwrap()
            localStorage.setItem("token", res.token)
            localStorage.setItem("vendor", JSON.stringify(res.vendor))
            localStorage.setItem("plan", JSON.stringify(res.plan))
            document.cookie = `token=${res.token}; path=/; max-age=604800`
            if (res.plan.hasActivePlan) {
                router.push("/vendordashboard")
            } else {
                router.push("/demo-confirm")
            }
        } catch {
            // error handled below
        }
    }

    const toggleMode = () => {
        setIsLogin(!isLogin)
        reset()
    }

    const isLoading = loginLoading || regLoading
    const error = isLogin ? loginError : regError

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-xs">
                <div className="space-y-1 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isLogin ? "Vendor Login" : "Vendor Registration"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {isLogin ? "Sign in to your vendor account" : "Create your vendor account"}
                    </p>
                </div>

                <form onSubmit={handleSubmit(handleVendorSubmit)} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Company Name</label>
                                <input
                                    type="text"
                                    {...reg("companyName")}
                                    placeholder="Acme Corp"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                                {errors.companyName && <p className="text-destructive text-xs">{errors.companyName.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Address</label>
                                <input
                                    type="text"
                                    {...reg("address")}
                                    placeholder="123 Main St, City"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                                {errors.address && <p className="text-destructive text-xs">{errors.address.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Contact No</label>
                                <input
                                    type="text"
                                    {...reg("contactNo")}
                                    placeholder="+1 234 567 8900"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                                {errors.contactNo && <p className="text-destructive text-xs">{errors.contactNo.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Username</label>
                                <input
                                    type="text"
                                    {...reg("username")}
                                    placeholder="vendor_user"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                />
                                {errors.username && <p className="text-destructive text-xs">{errors.username.message as string}</p>}
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <input
                            type="email"
                            {...reg("email")}
                            placeholder="vendor@company.com"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.email && <p className="text-destructive text-xs">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <input
                            type="password"
                            {...reg("password")}
                            placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.password && <p className="text-destructive text-xs">{errors.password.message as string}</p>}
                    </div>

                    {error && (
                        <p className="text-destructive text-sm">
                            {"data" in error ? (error.data as { message: string }).message : "Something went wrong"}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                    </button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    {isLogin ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button onClick={toggleMode} className="font-medium text-primary underline-offset-4 hover:underline">
                                Register here
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button onClick={toggleMode} className="font-medium text-primary underline-offset-4 hover:underline">
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VendorLoginPage
