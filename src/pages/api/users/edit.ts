import prisma from "@/lib/prisma"
import verifyToken from "@/utils/verifyToken"
import { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import formidable from "formidable"
import fs, { existsSync, unlinkSync } from "fs"
import { getSaltKey } from "@/utils/key"
import { TEditBody } from "@/global/types"

export const config = {
    api: {
        bodyParser: false,
    },
}

const formOptions: formidable.Options = {
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024,
    uploadDir: __dirname,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            const user = await verifyToken(req)
            const body: TEditBody = {}
            const dirPath = "public/images/profile/"
            let uploadPath = ""
            let fileName = ""
            let image: formidable.File | null = null

            const form = formidable(formOptions)

            // Parse form data
            const [fields, files] = await form.parse(req)

            for (let key in fields) {
                body[key] = fields[key]?.toString()
            }

            if (files.image) {
                image = files.image[0]
            }

            // find user record
            const userRecord = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

            // Change password or email schema
            if (body.newPassword || body.email) {
                if (!body.password)
                    return res.status(400).json({ message: "Password is required!" })

                // Check password
                if (!bcrypt.compareSync(body.password, userRecord.password))
                    return res.status(400).json({ message: "Invalid password!" })
            }

            // Change picture schema
            if (image !== null) {
                const allowedMimeTypes = ["image/jpeg", "image/png"]

                // Check type of picture
                if (!allowedMimeTypes.includes(image.mimetype !== null ? image.mimetype : "")) {
                    return res
                        .status(400)
                        .json({ message: "Invalid file type. Allowed types are: JPEG & PNG" })
                }

                // Define uploading path
                fileName =
                    `${userRecord.id}_` + image.newFilename + image.mimetype?.replace("image/", ".")
                uploadPath = dirPath + fileName

                fs.rename(image.filepath, uploadPath, (err) => {
                    if (err) {
                        console.error("Error while moving file! ", err)
                        return res.status(500).json({ error: "File upload failed." })
                    }
                })

                if (existsSync("public" + userRecord.picture))
                    unlinkSync("public" + userRecord.picture)
            }

            // Change name user
            await prisma.user
                .update({
                    where: { id: user.id },
                    data: {
                        name: body.name ? body.name : userRecord.name,
                        email: body.email ? body.email : userRecord.email,
                        password: body.password
                            ? bcrypt.hashSync(body.password, await getSaltKey())
                            : userRecord.password,
                        picture: uploadPath ? uploadPath.replace("public", "") : userRecord.picture,
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
