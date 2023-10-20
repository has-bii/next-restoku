import prisma from "@/lib/prisma"
import verifyToken from "@/utils/verifyToken"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const user = await verifyToken(req)

            if (user.role === "USER") return res.status(403).json({ message: "Permission denied!" })

            const data = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isVerified: true,
                    picture: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })

            return res.status(200).json({
                message: "Users data has been fetched successfully.",
                data,
            })
        } catch (error) {
            console.error("Failed to fetch Users data\nError: ", error)

            return res.status(500).json({
                message: "Failed to fetch Users data!",
                data: [],
            })
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}
