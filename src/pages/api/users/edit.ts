import prisma from "@/lib/prisma"
import verifyToken from "@/utils/verifyToken"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import KEY from "@/utils/key"
import formidable from "formidable"

type TEditBody = {
    name?: string
    email?: string
    password?: string
    newPassword?: string
    [key: string]: any
}

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            const user = await verifyToken(req)
            const body: TEditBody = {}

            const form = formidable({ maxFiles: 1, maxFileSize: 5 * 1024 * 1024 })

            form.parse(req, (err, fields, files) => {
                if (err) return res.status(500).json({ message: "Error while parsing data!" })

                for (let key in fields) {
                    body[key] = fields[key]?.toString()
                }

                console.log("files: ", files)
            })

            // const picture = req.files?.picture as UploadedFile

            const publicPath = "public"
            let uploadPath = ""

            const userRecord = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

            // Change password or email schema
            if (body.newPassword || body.email) {
                if (!body.password)
                    return res.status(400).json({ message: "Password is required!" })

                // Check password
                if (!bcrypt.compareSync(body.password, userRecord.password))
                    return res.status(400).json({ message: "Invalid password!" })
            }

            // // Change picture schema
            // if (picture) {
            //     const allowedMimeTypes = ["image/jpeg", "image/png"]

            //     // Check type of picture
            //     if (!allowedMimeTypes.includes(picture.mimetype)) {
            //         return res
            //             .status(400)
            //             .json({ message: "Invalid file type. Allowed types are: JPEG & PNG" })
            //     }

            //     // Define uploading path
            //     uploadPath = "/photos/" + `${user.id}_photo.${picture.mimetype.split("/")[1]}`

            //     // Move file to public/picture
            //     picture.mv(publicPath + uploadPath, (err: any) => {
            //         if (err) {
            //             return res.status(500).json({ message: "Error uploading file." })
            //         }
            //     })

            //     if (userRecord.picture && existsSync(publicPath + userRecord.picture))
            //         unlinkSync(publicPath + userRecord.picture)
            // }

            // Change name user
            await prisma.user
                .update({
                    where: { id: user.id },
                    data: {
                        name: body.name ? body.name : userRecord.name,
                        email: body.email ? body.email : userRecord.email,
                        password: body.password
                            ? bcrypt.hashSync(body.password, KEY.getSalt())
                            : userRecord.password,
                        picture: uploadPath ? uploadPath : userRecord.picture,
                        updatedAt: new Date(),
                    },
                })
                .then(() => {
                    return res.status(200).json({ message: "User has been updated" })
                })
                .catch((error: any) => {
                    console.error("Failed to update user!", error)
                    return res.status(500).json({ message: "Failed to updated user!" })
                })
        } catch (error) {
            console.error("Failed to edit User\nError: ", error)

            return res.status(500).json({
                message: "Failed to edit User!",
            })
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed!" })
    }
}
