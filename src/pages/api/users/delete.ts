import prisma from "@/lib/prisma"
import verifyToken from "@/utils/verifyToken"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "DELETE") {
        try {
            const user = await verifyToken(req)
            const IDs: string[] = req.body.id
            const password: string = req.body.password

            // Check single (the user itself) or multiple (as admin)
            if (IDs) {
                // Check role
                if (user.role !== "ADMIN") {
                    res.status(403).json({ message: "Permission denied!" })

                    return
                }

                // Delete multiple records
                await prisma.user.deleteMany({
                    where: { id: { in: IDs.map((id) => parseInt(id)) } },
                })
            } else {
                // Find user itself
                const data = await prisma.user.findUnique({ where: { id: user.id } })

                // Res error if not found
                if (!data) return res.status(404).json({ message: "User not found!" })

                // Check password
                if (!password) return res.status(400).json({ message: "Password is required!" })

                // Compare password
                if (!bcrypt.compareSync(password, data.password))
                    return res.status(400).json({ message: "Password is invalid!" })

                // Delete the user itself
                await prisma.user.delete({ where: { id: user.id } })
            }

            res.status(200).json({ message: "User has been deleted" })
        } catch (error) {
            console.error("Failed to delete user\nError: ", error)

            return res.status(500).json({
                message: "Failed to delete!",
            })
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}
