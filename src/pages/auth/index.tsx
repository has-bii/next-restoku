import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AuthLayout from "@/layouts/AuthLayout"
import { faCircleNotch, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FormEvent, useEffect, useState } from "react"
import image from "@/assets/images/register-img.jpg"
import { NextRouter, useRouter } from "next/router"
import axios from "axios"
import Link from "next/link"
import { useToast } from "@/context/ToastContext"

type FormData = {
    email: string
    password: string
}

export default function Signin() {
    const router: NextRouter = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const { pushToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [save, setSave] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    })
    const [formValidation, setFormValidation] = useState<FormData>({
        email: "",
        password: "",
    })

    useEffect(() => {
        setFormValidation({ email: "", password: "" })
    }, [formData])

    async function submitHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (formData.email.length === 0) {
            setFormValidation({ ...formValidation, email: "Email is required!" })
            return
        }

        if (formData.password.length < 8) {
            setFormValidation({
                ...formValidation,
                password: "Password must contain at least 8 characters!",
            })
            return
        }

        setLoading(true)

        await axios
            .post("/api/auth/login", { ...formData, save })
            .then((res) => {
                pushToast(res.data.message, "success")
                router.push("/app")
            })
            .catch((error) => {
                if (error?.response?.data?.message) {
                    const message = error?.response?.data?.message

                    if (message === "Email is not registered!") {
                        return setFormValidation({ ...formValidation, email: message })
                    }

                    if (message === "Password is incorrect!") {
                        return setFormValidation({ ...formValidation, password: message })
                    }

                    pushToast(message, "error")
                } else pushToast("Could not reach the server!", "error")
            })
            .finally(() => setLoading(false))
    }

    return (
        <AuthLayout image={image}>
            <div className="card-head">Welcome Back!</div>
            <div className="card-subhead">
                Sign in to access your account and continue your journey with us.
            </div>

            <form onSubmit={submitHandler} className="auth-form">
                <label htmlFor="email-input">Email</label>
                <input
                    type="email"
                    id="email-input"
                    placeholder="Enter your email"
                    className={`${formValidation.email.length !== 0 ? "error" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formValidation.email.length !== 0 && (
                    <span className="text-sm text-red-500 animate-shake">
                        {formValidation.email}
                    </span>
                )}
                <label htmlFor="password-input">Password</label>
                <div className="input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password-input"
                        placeholder="Enter your password"
                        className={`bg-transparent w-full${
                            formValidation.password.length !== 0 ? " error" : ""
                        }`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                </div>
                {formValidation.password.length !== 0 && (
                    <span className="text-sm text-red-500 animate-shake">
                        {formValidation.password}
                    </span>
                )}
                <div className="inline-flex justify-between items-center">
                    <label className="font-semibold inline-flex gap-2 items-center hover:text-orange-500 transition-colors duration-200 ease-in">
                        <input
                            type="checkbox"
                            id="save-input"
                            className="w-4 h-4 accent-orange-500 text-white"
                            checked={save}
                            onChange={() => setSave(!save)}
                        />
                        Save me
                    </label>
                    <Link
                        href="/auth/forgot"
                        className="font-semibold hover:text-orange-500 transition-colors duration-200 ease-in"
                    >
                        Forgot password?
                    </Link>
                </div>
                <button
                    className="inline-flex gap-2 justify-center items-center px-4 py-2 rounded-3xl bg-orange-500 text-white font-semibold mt-2 hover:shadow-md hover:shadow-orange-500/50 transition-all duration-200 ease-in-out"
                    disabled={loading}
                >
                    Login
                    {loading && (
                        <FontAwesomeIcon icon={faCircleNotch} className="text-white animate-spin" />
                    )}
                </button>
                <div className="text-center text-neutral-400 mt-1">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        href="/auth/register"
                        className="font-semibold text-orange-500 hover:underline underline-offset-2"
                    >
                        Sign Up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
