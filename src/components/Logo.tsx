import { faBowlRice } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

type Props = {
    className?: string
    show?: boolean
}

export default function Logo({ className, show = true }: Props) {
    return (
        <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
            <span className="w-8 h-8 relative rounded-lg bg-orange-500">
                <FontAwesomeIcon
                    icon={faBowlRice}
                    className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
            {show && <span className="font-bold text-black text-base">RESTOKU</span>}
        </Link>
    )
}
