import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { useCreateUser } from "@/hooks/useCreateUser"

export default function AdminPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { createUser, loading, error, success } = useCreateUser()

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    nombre: "",
    apellido: "",
    rut: "",
    rol: "MEDICO" as "ADMIN" | "MEDICO" | "ENFERMERO",
  })

  if (user.rol != "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <main className="container mx-auto px-6 py-10">
          <Card className="max-w-xl mx-auto bg-white rounded-xl border-0 shadow-sm p-6">
            <CardHeader>
              <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                No tienes permisos para acceder a esta sección.
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await createUser(form)

    if (ok) {
      setForm({
        email: "",
        password: "",
        confirm_password: "",
        nombre: "",
        apellido: "",
        rut: "",
        rol: "MEDICO",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Título principal (TAL CUAL LO PEDISTE) */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administración de Usuarios
            </h1>
            <p className="text-gray-600">
              Crea cuentas y gestiona accesos del sistema UC Christus.
            </p>
          </div>

          <Card className="max-w-3xl mx-auto bg-white rounded-xl border-0 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                Crear nuevo usuario
              </h2>
              <p className="text-gray-600 text-sm">
                Completa los datos para registrar un nuevo usuario.
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Nombre / Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={form.apellido}
                      onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* RUT / Rol */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">RUT</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={form.rut}
                      onChange={(e) => setForm({ ...form, rut: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <select
                      className="w-full border rounded-lg p-2 bg-white"
                      value={form.rol}
                      onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}
                    >
                      <option value="MEDICO">Médico</option>
                      <option value="ENFERMERO">Enfermero</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg p-2"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      className="w-full border rounded-lg p-2"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="w-full border rounded-lg p-2"
                      value={form.confirm_password}
                      onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Mensajes de error (estilo ProfilePage) */}
                {error && (
                  <p className="text-red-600 text-sm">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="text-green-600 text-sm">
                    Usuario creado exitosamente
                  </p>
                )}

                {/* Botón morado */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#671E75] hover:bg-[#5A1A68] text-white rounded-lg py-3 font-semibold"
                >
                  {loading ? "Creando usuario..." : "Crear Usuario"}
                </Button>

              </form>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
