import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import LandingPageLayout from "@/layouts/LandingPageLayout"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import macbook from "@/assets/images/macbook.png"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
    return (
        <LandingPageLayout>
            {/* Hero */}
            <div className="w-full h-[calc(100vh-80px)] lg:h-[calc(100vh-90px)] flex flex-col items-center gap-4 lg:gap-8 relative overflow-hidden">
                <div className="h-1/2 w-full flex flex-col justify-end items-center px-4 lg:px-0">
                    <h1 className="text-4xl lg:text-8xl text-center font-bold lg:font-semibold">
                        Effortless Online Menus <br className="hidden lg:block" /> for Your
                        Restaurant
                    </h1>
                    <h4 className="text-xl lg:text-2xl text-center font-light text-neutral-400">
                        Create, Update, and Showcase Your Delicious Dishes with Ease
                    </h4>
                    <Link
                        href="/auth"
                        className="capitalize w-fit inline-flex items-center gap-6 pl-6 pr-2 py-2 mt-4 text-lg text-white font-semibold bg-orange-500 rounded-full"
                    >
                        get started
                        <span className="w-10 h-10 bg-white text-orange-500 rounded-full relative">
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                size="lg"
                                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                            />
                        </span>
                    </Link>
                </div>
                <div className="h-1/2 w-full">
                    <Image
                        src={macbook}
                        alt=""
                        className="w-full h-full object-cover object-top "
                        loading="eager"
                        priority
                    />
                </div>
            </div>
        </LandingPageLayout>
    )
}
