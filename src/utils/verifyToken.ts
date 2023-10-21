import jwt from "jsonwebtoken"
import prisma from "@/lib/prisma"
import { IUser } from "@/global/types"
import { NextApiRequest } from "next"
import { getSecretKey } from "./key"

export default async function verifyToken(req: NextApiRequest): Promise<IUser> {
    const tokenJWT = req.cookies["user_access"] as string

    // Verifying token
    const jwtPayload: any = jwt.verify(tokenJWT, await getSecretKey())
    // Find user
    const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
        select: { id: true, name: true, email: true, role: true, isVerified: true },
    })
    if (!user) throw new Error("Unauthorized. User has been removed!")

    // Find token
    const token = await prisma.token.findUnique({
        where: { userId: user.id, token: tokenJWT },
    })
    // Compare token
    if (!token || token.token !== tokenJWT) throw new Error("Token is invalid!")
    // Check token
    if (token.expire < new Date())
        // Validate Token
        throw new Error("Token is expired!")

    return user
}
