import fs from "fs"
import crypto from "crypto"
// import path from "path"
import bcrypt from "bcrypt"

// const SECRET_KEY_PATH = path.join(__dirname, "../../key/secret_key.text")
const SECRET_KEY_PATH = "key/secret_key.text"

export async function getSecretKey() {
    try {
        if (!fs.existsSync(SECRET_KEY_PATH)) {
            const secretKey = crypto.randomBytes(32).toString("hex")
            fs.writeFileSync(SECRET_KEY_PATH, secretKey, "utf-8")
            console.log("Secret Key generated successfully")
            return secretKey
        }

        const secretKey = fs.readFileSync(SECRET_KEY_PATH, "utf-8")

        if (secretKey.length > 0) return secretKey

        throw new Error("secret_key.txt is empty!")
    } catch (error) {
        console.error("Failed to generate Secret Key!", error)

        throw error
    }
}

export async function getSaltKey() {
    const SALT_KEY = bcrypt.genSaltSync(10)

    return SALT_KEY
}
