import Header from "@/components/Header"
import { ReactNode } from "react"

export default function LandingPageLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container">
            <Header />
            {children}
        </div>
    )
}
