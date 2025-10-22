import { type Paciente } from "@/utils/pacienteMapper"

export function getEstadoGestionColor(estado: string) {
  if (!estado) return 'bg-gray-100 text-gray-800 rounded-full px-3 py-1'

  switch (estado.toUpperCase()) {
    case 'COMPLETADA':
      return 'bg-green-100 text-green-800 rounded-full px-3 py-1'
    case 'EN_PROGRESO':
      return 'bg-yellow-100 text-yellow-800 rounded-full px-3 py-1'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full px-3 py-1'
  }
}

export function getHospitalizacionColor(hospitalizado: Paciente['hospitalizado']) {
  switch (hospitalizado) {
    case true:
      return 'bg-blue-100 text-blue-800 rounded-full whitespace-nowrap'
    case false:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}