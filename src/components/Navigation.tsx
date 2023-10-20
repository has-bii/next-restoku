import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"

export default function Navigation() {
    const router = useRouter()

    return (
        <div className="inline-flex gap-2 items-center">
            <button
                onClick={() => router.back()}
                className="w-8 h-8 border rounded-full border-neutral-500"
            >
                <FontAwesomeIcon icon={faAngleLeft} size="1x" />
            </button>
            <button
                onClick={() => router.forward()}
                className="w-8 h-8 border rounded-full border-neutral-500"
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    )
}
