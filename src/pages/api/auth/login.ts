import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import KEY from "@/utils/key"
import jwt from "jsonwebtoken"
import { ICookieOptions, IUserReq } from "@/global/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const body: IUserReq = req.body

            // if email or password empty
            const missingField: string[] = []
            if (!body.email) missingField.push("email")
            if (!body.password) missingField.push("password")

            if (missingField.length > 0)
                return res.status(400).json({
                    message:
                        missingField.join(", ").toUpperCase() +
                        `${missingField.length === 1 ? " is" : " are"} required!`,
                })

            // Find user from database
            const data = await prisma.user.findUnique({ where: { email: body.email } })

            // Return response
            if (data === null) {
                res.status(401).json({ message: "Email is not registered!" })
                return
            }

            // Check Password
            const checkPW = bcrypt.compareSync(body.password, data.password)

            if (!checkPW) {
                res.status(401).json({ message: "Password is incorrect!" })
                return
            }

            // Create token
            const token = jwt.sign(
                { id: data.id, name: data.name, email: data.email },
                KEY.getSecret(),
                { algorithm: "HS256" }
            )

            // Create Token Option
            const cookieOptions: ICookieOptions = {
                secure: true,
                sameSite: true,
                httpOnly: true,
                path: "/",
            }

            // Add expire to the token
            if (req.body.save === true || req.body.save)
                cookieOptions.expires = new Date(Date.now() + 7 * 86400000)

            // Create or Update Token in DB
            await prisma.token.upsert({
                where: {
                    userId: data.id,
                },
                create: {
                    userId: data.id,
                    token: token,
                    expire: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                },
                update: {
                    token: token,
                    expire: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                },
            })

            // Parsing cookie options
            const cookOpts: string[] = []
            for (let key in cookieOptions) {
                cookOpts.push(`${key}=${cookieOptions[key]};`)
            }

            // Return response
            if (token) {
                res.status(200)
                    .setHeader("Set-Cookie", `user_access=${token}; ${cookOpts.join(" ")}`)
                    .json({ message: "Login successful" })
            } else {
                res.status(500).json({ message: "Failed to create token" })
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to login! Unexpected error has occurred." })

            console.error("Failed to login", error)
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "1mb",
        },
    },
    // Specifies the maximum allowed duration for this function to execute (in seconds)
    maxDuration: 5,
}
