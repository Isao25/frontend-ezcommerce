"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

/* === DOCUMENTACIÓN AUTOMÁTICA AVANZADA ===
 * Archivo: use-toast.ts
 * Ruta: 
 * Tamaño: 3948 bytes
 * Líneas totales:      194
 * Líneas no vacías: 163
 * Caracteres:     3948
 * Última actualización: 26/06/2025 05:58:49
 * 
 * 📦 IMPORTS:
 *   - * as React from "react"
 * 
 * 📤 EXPORTS:
 *   - export const reducer = (state: State, action: Action): State => {
 *   - export { useToast, toast }
 * 
 * 📋 INTERFACES:
 *   - interface State {
 * 
 * 🔖 TIPOS:
 *   - type Action =
 *   - type ActionType = typeof actionTypes
 *   - type Toast = Omit<ToasterToast, "id">
 *   - type ToasterToast = ToastProps & {
 * 
 * ⚡ FUNCIONES:
 *   -   const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })()
 *   -   const update = (props: ToasterToast) =>()
 *   - const addToRemoveQueue = (toastId: string) => {()
 *   - function dispatch(action: Action) {()
 *   - function genId() {()
 *   - function toast({ ...props }: Toast) {()
 *   - function useToast() {()
 * 
 * 🔒 CONSTANTES:
 *   - const TOAST_LIMIT = 1
 *   - const TOAST_REMOVE_DELAY = 1000000
 * 
 * 🌐 ENDPOINTS/APIs:
 *   -     toastTimeouts.delete(toastId)
 * 
 * 🎣 REACT HOOKS:
 *   - function useToast() {
 *   - useEffect
 *   - useToast
 * 
 * ⚛️  COMPONENTES REACT:
 *   - State
 *   - ToasterToast
 * 
 * 🔀 MIDDLEWARES:
 *   - Express middleware functions: 0
 * 
 * 📊 ANÁLISIS DE DEPENDENCIAS:
 *   - React detectado
 * 
 * 📈 MÉTRICAS DE COMPLEJIDAD:
 *   - Puntuación de complejidad: 28
 *   - Ratio código/comentarios: 54.33
 * 
 * 🤖 Generado automáticamente por TypeScript Advanced Documenter
 */
