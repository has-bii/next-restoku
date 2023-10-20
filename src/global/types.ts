export type ToastStatus = "danger" | "error" | "normal" | "success"

export interface IToastContext {
    pushToast: (message: string, status: ToastStatus) => void
}

export type ToastData = {
    message: string
    status: ToastStatus
}
