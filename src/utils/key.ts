import fs from "fs"
// import path from "path"

export default class KEY {
    static getSecret() {
        try {
            // const SECRET_KEY_PATH = path.join(__dirname, "../../../key/secret_key.text")
            const SECRET_KEY_PATH = "key/secret_key.text"

            if (!fs.existsSync(SECRET_KEY_PATH)) throw new Error("secret_key.txt does not exist!")

            const secretKey = fs.readFileSync(SECRET_KEY_PATH, "utf-8")

            if (secretKey.length > 0) return secretKey

            throw new Error("secret_key.txt is empty!")
        } catch (error) {
            console.error("Error while getting Secret Key\n", error)

            throw error
        }
    }

    static getSalt() {
        try {
            // const SALT_KEY_PATH = path.join(__dirname, "../../../key/salt_key.text")
            const SALT_KEY_PATH = "key/salt_key.text"

            console.log(SALT_KEY_PATH)

            if (!fs.existsSync(SALT_KEY_PATH)) throw new Error("salt_key.txt does not exist!")

            const saltKey = fs.readFileSync(SALT_KEY_PATH, "utf-8")

            if (saltKey.length > 0) return saltKey

            throw new Error("salt_key.txt is empty!")
        } catch (error) {
            console.error("Error while getting Salt Key\n", error)

            throw error
        }
    }
}
