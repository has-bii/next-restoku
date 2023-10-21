import { TEditUsersBody } from "@/global/types"
import prisma from "@/lib/prisma"
import verifyToken from "@/utils/verifyToken"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            const body: TEditUsersBody = req.body

            const user = await verifyToken(req)

            if (user.role !== "ADMIN") {
                res.status(403).json({ message: "Permission denied!" })

                return
            }

            const IDs = body.id.map((data) => parseInt(data))

            await prisma.user.updateMany({
                where: { id: { in: IDs } },
                data: { role: body.role, updatedAt: new Date() },
            })

            res.status(200).json({ message: "Users have been updated" })
        } catch (error) {
            console.error("Failed to edit Users\nError: ", error)

            return res.status(500).json({
                message: "Failed to edit Users!",
            })
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}
