import fs from "fs"
import crypto from "crypto"
import bcrypt from "bcrypt"
import path from "path"

const PATH1 = path.join(__dirname, "../../key/secret_key.text")
const secretKey = crypto.randomBytes(32).toString("hex")

const PATH2 = path.join(__dirname, "../../key/salt_key.text")
const salt = bcrypt.genSaltSync(10)

try {
    if (!fs.existsSync(PATH1)) {
        fs.writeFileSync(PATH1, secretKey, "utf-8")
        console.log("Secret Key generated successfully")
    }

    if (!fs.existsSync(path.join(__dirname, PATH2))) {
        fs.writeFileSync(PATH2, salt, "utf-8")
        console.log("Salt Key generated successfully")
    }
} catch (error) {
    console.error("Failed to generate Secret Key!", error)
}
