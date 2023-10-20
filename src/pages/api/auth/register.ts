import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import KEY from "@/utils/key"

interface IUserReq {
    email: string
    password: string
}

interface IUserRegister extends IUserReq {
    name: string
}

interface ICookieOptions {
    secure: boolean
    domain: string
    expires?: Date
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const body: IUserRegister = req.body

            // if name, email, password empty
            const missingField: string[] = []
            if (!body.name) missingField.push("name")
            if (!body.email) missingField.push("email")
            if (!body.password) missingField.push("password")

            if (missingField.length > 0)
                return res.status(400).json({
                    message:
                        missingField.join(", ").toUpperCase() +
                        `${missingField.length === 1 ? " is" : " are"} required!`,
                })

            // Check if the email exists
            const isExist = await prisma.user.findUnique({ where: { email: body.email } })
            if (isExist) return res.status(400).json({ message: "Email is already in use!" })

            // Create user
            await prisma.user
                .create({
                    data: {
                        name: body.name,
                        email: body.email,
                        password: bcrypt.hashSync(body.password, KEY.getSalt()),
                    },
                })
                .catch((error: any) => {
                    throw new Error(`Failed to create new user\nError: ${error}`)
                })

            // return response
            return res.status(201).json({ message: "User has been created." })
        } catch (error) {
            return res.status(500).json({ message: "Server error!" })
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}
