import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AuthLayout from "@/layouts/AuthLayout"
import { faCircleNotch, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FormEvent, useEffect, useState } from "react"
import image from "@/assets/images/register-img.jpg"
import { useToast } from "@/context/ToastContext"
import { useRouter } from "next/router"
import axios from "axios"
import Link from "next/link"

export default function Register() {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const { pushToast } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [aggree, setAggree] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [formValidation, setFormValidation] = useState({
        name: "",
        email: "",
        password: "",
        agree: false,
    })

    useEffect(() => {
        setFormValidation({ name: "", email: "", password: "", agree: false })
    }, [formData, aggree])

    const formHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const usernameRegex = /^[a-zA-Z0-9\s]+$/

        if (formData.name.length === 0) {
            setFormValidation({ ...formValidation, name: "Restaurant name is required!" })
            return
        }

        if (!usernameRegex.test(formData.name)) {
            setFormValidation({
                ...formValidation,
                name: "Restaurant name should only include letters and numbers!",
            })
            return
        }

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

        if (!aggree) {
            setFormValidation({ ...formValidation, agree: true })
            return
        }

        setLoading(true)

        await axios
            .post("/api/auth/register", formData)
            .then((res) => {
                pushToast(res.data.message, "success")
                router.push("/auth")
            })
            .catch((error) => {
                if (error?.response?.data?.message) pushToast(error.response.data.message, "error")
            })
            .finally(() => setLoading(false))
    }

    return (
        <AuthLayout image={image}>
            <div className="card-head">Join Us Today!</div>
            <div className="card-subhead">
                Register to unlock a world of exciting features and opportunities.
            </div>

            <form className="auth-form" onSubmit={formHandler}>
                <label htmlFor="fullname-input">Restaurant Name</label>
                <input
                    type="text"
                    id="fullname-input"
                    placeholder="Enter your Restaurant name"
                    className={`${formValidation.name.length !== 0 ? "error" : ""}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formValidation.name.length !== 0 && (
                    <span className="text-sm text-red-500 animate-shake">
                        {formValidation.name}
                    </span>
                )}
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
                <div
                    className={`text-sm font-semibold inline-flex my-2 gap-2 items-center ${
                        formValidation.agree ? "text-red-500 animate-shake" : "text-black"
                    }`}
                >
                    <input
                        type="checkbox"
                        id="save-input"
                        className="w-4 h-4 accent-orange-500"
                        checked={aggree}
                        onChange={() => setAggree(!aggree)}
                    />
                    I agree to the Terms and Conditions.
                </div>
                <button
                    className="inline-flex gap-2 justify-center items-center px-4 py-2 rounded-3xl bg-orange-500 text-white font-semibold hover:shadow-md hover:shadow-orange-500/50 transition-all duration-200 ease-in-out"
                    disabled={loading}
                >
                    Register
                    {loading && (
                        <FontAwesomeIcon icon={faCircleNotch} className="text-white animate-spin" />
                    )}
                </button>
                <div className="text-center text-neutral-400 mt-1">
                    Already have an account?{" "}
                    <Link
                        href="/auth"
                        className="font-semibold text-orange-500 hover:underline underline-offset-2"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
