// import fs from "fs"
// import path from "path"
import bcrypt from "bcrypt"

const salt = bcrypt.genSaltSync(10)

export default class KEY {
    static getSecret() {
        const SECRET_KEY = process.env.SECRET_KEY || "MY_53cR3t-K3Y"

        return SECRET_KEY
    }

    static getSalt() {
        // const SALT_KEY = process.env.SALT_KEY || "mY_54lt-K3y"
        const SALT_KEY = salt

        return SALT_KEY
    }
}
