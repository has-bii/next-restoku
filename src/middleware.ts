import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    try {
        if (request.nextUrl.pathname.startsWith("/api")) {
            if (request.nextUrl.pathname.startsWith("/api/auth")) return NextResponse.next()

            const cookie = request.cookies.get("user_access")

            if (!cookie) return NextResponse.json({ message: "Unauthorized!" }, { status: 401 })

            return NextResponse.next()
        }

        return NextResponse.next()
    } catch (error) {
        console.error("Error while verifying token: ", error)

        return NextResponse.json({ message: "Internal server error!" }, { status: 500 })
    }
}
