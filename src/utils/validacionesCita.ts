import { AppError } from "../middlewares/error.middleware.js";
import {
  estadosPermitidos,
  type EstadoCita,
  type NuevaCita,
} from "../types/cita.js";

const camposObligatorios = [
  "mascota",
  "cliente",
  "servicio",
  "fecha",
  "hora",
] as const;

export function esEstadoValido(valor: unknown): valor is EstadoCita {
  return typeof valor === "string" &&
    estadosPermitidos.some((estado) => estado === valor);
}

export function validarDatosCita(valor: unknown): asserts valor is NuevaCita {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    throw new AppError(400, "El cuerpo de la solicitud no es válido.");
  }

  const datos = valor as Record<string, unknown>;
  const existeVacio = camposObligatorios.some((campo) => {
    const campoValor = datos[campo];
    return typeof campoValor !== "string" || campoValor.trim() === "";
  });

  if (existeVacio) {
    throw new AppError(400, "Todos los campos son obligatorios.");
  }
  if (datos.estado !== undefined && !esEstadoValido(datos.estado)) {
    throw new AppError(400, "El estado de la cita no es válido.");
  }
}
