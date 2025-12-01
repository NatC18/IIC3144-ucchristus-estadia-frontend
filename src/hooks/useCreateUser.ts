import { useState } from "react"
import { authService } from "@/services/authService"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api"

export interface NewUserPayload {
  email: string
  password: string
  confirm_password: string
  nombre: string
  apellido: string
  rut: string
  rol: "ADMIN" | "MEDICO" | "ENFERMERO"
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const createUser = async (userData: NewUserPayload) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await authService.fetchWithAuth(
        `${API_BASE_URL}/auth/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      )

      const json = await res.json()

      if (!res.ok) {
        let formatted = ""

        if (json && typeof json === "object") {
          formatted = Object.entries(json)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(", ")}`
              }
              return `${field}: ${messages}`
            })
            .join("\n")
        } else {
          formatted = "Error al crear usuario"
        }

        setError(formatted)
        return false
      }

      setSuccess(true)
      return true

    } catch (err) {
      console.error("Error creando usuario:", err)
      setError("Error al conectar con el servidor")
      return false

    } finally {
      setLoading(false)
    }
  }

  return {
    createUser,
    loading,
    error,
    success,
  }
}
