import { IToastContext } from "@/global/types"
import { createContext, useContext } from "react"

export const ToastContext = createContext<IToastContext>({ pushToast: () => {} })

export const useToast = () => useContext(ToastContext)
