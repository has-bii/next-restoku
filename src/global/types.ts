import { Role } from "@prisma/client"

export type ToastStatus = "danger" | "error" | "normal" | "success"

export interface IToastContext {
    pushToast: (message: string, status: ToastStatus) => void
}

export type ToastData = {
    message: string
    status: ToastStatus
}

export interface IUserReq {
    email: string
    password: string
}

export interface IUserRegister extends IUserReq {
    name: string
}

export interface ICookieOptions {
    secure: boolean
    sameSite: boolean
    httpOnly: boolean
    path: string
    expires?: Date
    [key: string]: any
}

export interface IUser {
    id: number
    name: string
    email: string
    role: string
    isVerified: boolean
}

export type TEditBody = {
    name?: string
    email?: string
    password?: string
    newPassword?: string
    [key: string]: any
}

export type TEditUsersBody = TEditBody & {
    id: string[]
    role: Role
}
