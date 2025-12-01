import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/authService"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api"

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    try {
      const res = await authService.fetchWithAuth(`${API_BASE_URL}/auth/change-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json?.detail || "Error al cambiar contraseña")
        return
      }

      setSuccess(true)
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" })
    } catch (err) {
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md bg-white rounded-xl border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Acceso requerido</h2>
                  <p className="text-gray-600">Inicia sesión para ver tu perfil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Información de tu cuenta</p>
          </div>

          {/* Información Personal */}
          <Card className="bg-white rounded-xl border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Información Personal</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                  <p className="text-lg">{user?.nombre_completo || "No disponible"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{user?.email || "No disponible"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <p className="text-lg">{user?.rol || "No asignado"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Usuario</p>
                  <p className="text-lg">{user?.is_staff ? "Administrador" : "Usuario"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar Contraseña */}
          <Card className="bg-white rounded-xl border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Contraseña Actual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg p-2"
                    value={passwordData.old_password}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, old_password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Nueva Contraseña */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="w-full border rounded-lg p-2"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new_password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full border rounded-lg p-2"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirm_password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Mensajes */}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && (
                  <p className="text-green-600 text-sm">Contraseña cambiada exitosamente</p>
                )}

                {/* Botón Morado */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#671E75] hover:bg-[#5A1A68] text-white rounded-lg py-3 font-semibold"
                >
                  {loading ? "Actualizando..." : "Cambiar Contraseña"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
