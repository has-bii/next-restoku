import { ReactNode, useEffect } from "react"
import Logo from "@/components/Logo"
import Navigation from "@/components/Navigation"
import { useCookies } from "react-cookie"
import Image, { StaticImageData } from "next/image"
import { useRouter } from "next/router"

type Props = {
    children: ReactNode
    image: StaticImageData
}

export default function AuthLayout({ children, image }: Props) {
    const [cookies] = useCookies(["user_access"])
    const router = useRouter()

    useEffect(() => {
        if (cookies.user_access) {
            console.log("Token: ", cookies.user_access)
            router.push("/app")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="w-screen h-screen flex flex-row justify-center items-center">
            <div className="w-full lg:w-1/2 h-full relative p-6">
                <div className="flex justify-between items-center">
                    <Logo />
                    <Navigation />
                </div>
                <div className="flex w-full lg:w-3/4 flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {children}
                </div>
            </div>
            <div className="w-1/2 h-full p-6 lg:block hidden">
                <Image
                    src={image}
                    alt=""
                    className="w-full h-full object-cover rounded-3xl"
                    loading="eager"
                />
            </div>
        </div>
    )
}
