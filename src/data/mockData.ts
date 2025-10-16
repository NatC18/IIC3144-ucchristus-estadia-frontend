export interface TareaPendiente {
  episodio: string;
  tipoBarrera: string;
  descripcion: string;
  estado: 'Abierta' | 'En proceso' | 'Cerrada';
}

export interface ExtensionCritica {
  episodio: string;
  paciente: string;
  pasoEstadia: string;
}

export interface AlertaPredicha {
  episodio: string;
  tipoBarrera: string;
  descripcion: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  score: number;
  rut: string;
  prevision: string;
  edad: number;
  sexo: 'M' | 'F';
  hospitalizado: boolean;
}

export const tareasPendientes: TareaPendiente[] = [
  {
    episodio: "126823993",
    tipoBarrera: "Social",
    descripcion: "Contactar familia para coordinación de alta",
    estado: "Abierta"
  },
  {
    episodio: "234797327",
    tipoBarrera: "Administrativa",
    descripcion: "Llamar a médico tratante para autorización",
    estado: "En proceso"
  },
  {
    episodio: "345678901",
    tipoBarrera: "Clínica",
    descripcion: "Evaluar estado clínico para alta médica",
    estado: "Abierta"
  },
  {
    episodio: "456789012",
    tipoBarrera: "Social",
    descripcion: "Coordinar transporte para paciente",
    estado: "En proceso"
  }
];

export const extensionesCriticas: ExtensionCritica[] = [
  {
    episodio: "126823993",
    paciente: "Juan Pérez",
    pasoEstadia: "34 días"
  },
  {
    episodio: "234797327",
    paciente: "María Fernández",
    pasoEstadia: "13 días"
  },
  {
    episodio: "345678901",
    paciente: "Carlos Rodríguez",
    pasoEstadia: "28 días"
  },
  {
    episodio: "456789012",
    paciente: "Ana González",
    pasoEstadia: "45 días"
  },
  {
    episodio: "567890123",
    paciente: "Luis Martínez",
    pasoEstadia: "22 días"
  }
];

export const alertasPredichas: AlertaPredicha[] = [
  {
    episodio: "126823993",
    tipoBarrera: "Social",
    descripcion: "Riesgo de prolongación por barreras familiares"
  },
  {
    episodio: "234797327",
    tipoBarrera: "Administrativa",
    descripcion: "Pendiente autorización de seguro médico"
  },
  {
    episodio: "345678901",
    tipoBarrera: "Clínica",
    descripcion: "Posible complicación post-quirúrgica"
  }
];

export const pacientes: Paciente[] = [
  {
    id: 0,
    nombre: "Juan Pérez",
    score: 85,
    rut: "12.345.678-9",
    prevision: "Isapre",
    edad: 45,
    sexo: "M",
    hospitalizado: true
  },
  {
    id: 1,
    nombre: "María Fernández",
    score: 92,
    rut: "8.765.432-1",
    prevision: "Fonasa",
    edad: 60,
    sexo: "F",
    hospitalizado: false
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    score: 78,
    rut: "11.223.344-5",
    prevision: "Isapre",
    edad: 50,
    sexo: "M",
    hospitalizado: true
  }
];

// Datos para gráficos
export const estadisticasTareas = [
  { tipo: "Abierta", cantidad: 15 },
  { tipo: "En proceso", cantidad: 8 },
  { tipo: "Cerrada", cantidad: 32 }
];

export const estadisticasBarreras = [
  { barrera: "Social", cantidad: 12 },
  { barrera: "Admin", cantidad: 18 },
  { barrera: "Clínica", cantidad: 8 },
  { barrera: "Técnica", cantidad: 5 }
];

export const tendenciaEstadia = [
  { dia: "Ene", pacientes: 24 },
  { dia: "Feb", pacientes: 28 },
  { dia: "Mar", pacientes: 31 },
  { dia: "Abr", pacientes: 26 },
  { dia: "Jun", pacientes: 29 },
  { dia: "Jul", pacientes: 22 },
  { dia: "Ago", pacientes: 18 }
];
