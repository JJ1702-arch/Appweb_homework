//Controlador para validar los datos, aplicar las reglas de
//negocio y llamar al repositorio y consultas http

import type { Request, Response } from "express";

import {
  actualizarCita, actualizarEstadoCita, buscarCitaPorId,
  crearCita, eliminarCita, horarioOcupado, listarCitas,
} from "../repositories/cita.repository.js";

import type { ActualizarCita } from "../types/cita.js";

import { AppError } from "../middlewares/error.middleware.js";
import {
  esEstadoValido, validarDatosCita,
} from "../utils/validacionesCita.js";

function obtenerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "El identificador no es válido.");
  }
  return id;
}

export async function obtenerCitas(req: Request, res: Response): Promise<void> {
  const estado = req.query.estado;
  if (estado !== undefined && !esEstadoValido(estado)) {
    throw new AppError(400, "El filtro de estado no es válido.");
  }
  res.json(await listarCitas(estado));
}

export async function obtenerCita(req: Request, res: Response): Promise<void> {
  const cita = await buscarCitaPorId(obtenerId(req));
  if (!cita) throw new AppError(404, "La cita no fue encontrada.");
  res.json(cita);
}

export async function registrarCita(req: Request, res: Response): Promise<void> {
  const datos: unknown = req.body;
  validarDatosCita(datos);
  if (await horarioOcupado(datos.fecha, datos.hora)) {
    throw new AppError(409, "Ya existe una cita activa en ese horario.");
  }
  const cita = await crearCita(datos);
  res.status(201).json({ mensaje: "Cita registrada correctamente.", cita });
}

export async function modificarCita(req: Request, res: Response): Promise<void> {
  const id = obtenerId(req);
  const datos: unknown = req.body;
  validarDatosCita(datos);
  const estado = datos.estado;
  if (!esEstadoValido(estado)) {
    throw new AppError(400, "El estado es obligatorio y debe ser válido.");
  }
  if (await horarioOcupado(datos.fecha, datos.hora, id)) {
    throw new AppError(409, "Ya existe otra cita activa en ese horario.");
  }
  const datosActualizados: ActualizarCita = { ...datos, estado };
  const cita = await actualizarCita(id, datosActualizados);
  if (!cita) throw new AppError(404, "La cita no fue encontrada.");
  res.json({ mensaje: "Cita actualizada correctamente.", cita });
}

export async function cambiarEstado(req: Request, res: Response): Promise<void> {
  const id = obtenerId(req);
  const estado: unknown = req.body.estado;
  if (!esEstadoValido(estado)) {
    throw new AppError(400, "El estado enviado no es válido.");
  }
  const actual = await buscarCitaPorId(id);
  if (!actual) throw new AppError(404, "La cita no fue encontrada.");
  if (actual.estado === "atendida" && estado === "cancelada") {
    throw new AppError(409, "Una cita atendida no puede cancelarse.");
  }
  const cita = await actualizarEstadoCita(id, estado);
  res.json({ mensaje: "Estado actualizado correctamente.", cita });
}

export async function borrarCita(req: Request, res: Response): Promise<void> {
  if (!await eliminarCita(obtenerId(req))) {
    throw new AppError(404, "La cita no fue encontrada.");
  }
  res.status(204).send();
}
