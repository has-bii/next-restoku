import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import Logo from "./Logo"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Header() {
    const router = useRouter()
    const [showNav, setShowNav] = useState(false)

    return (
        <div className="flex flex-row items-center gap-4 justify-between py-6 px-4 lg:px-0 overflow-hidden">
            {/* Logo */}
            <Logo />

            {/* header */}
            <ul className={`header ${showNav ? "show-nav" : ""}`}>
                <li className="block lg:hidden text-white">
                    <button onClick={() => setShowNav(!showNav)}>
                        <FontAwesomeIcon icon={faBars} size="xl" />
                    </button>
                </li>
                <li>
                    <Link
                        href="/"
                        className={`header-item ${router.pathname === "/" ? "active" : ""}`}
                    >
                        <span>home</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/#feature"
                        className={`header-item ${router.pathname === "/feature" ? "active" : ""}`}
                    >
                        <span>feature</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/#pricing"
                        className={`header-item ${router.pathname === "/pricing" ? "active" : ""}`}
                    >
                        <span>pricing</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/#developer"
                        className={`header-item ${
                            router.pathname === "/developer" ? "active" : ""
                        }`}
                    >
                        <span>developer</span>
                    </Link>
                </li>
                <li className="block lg:hidden">
                    <Link
                        href="/auth"
                        className="capitalize px-4 py-2 rounded-full font-semibold border border-white text-white hover:bg-white hover:text-orange-500 transition-colors duration-150 ease-in"
                    >
                        sign in
                    </Link>
                </li>
            </ul>

            <button className="lg:hidden block" onClick={() => setShowNav(!showNav)}>
                <FontAwesomeIcon icon={faBars} size="xl" />
            </button>

            {/* Signin */}
            <Link
                href="/auth"
                className="capitalize hidden lg:block px-4 py-2 rounded-full font-semibold border border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 transition-colors duration-150 ease-in"
            >
                sign in
            </Link>
        </div>
    )
}
