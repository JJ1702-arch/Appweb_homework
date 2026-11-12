import assert from "node:assert/strict";
import { test } from "node:test";
import { AppError } from "../middlewares/error.middleware.js";
import { validarDatosCita } from "./validacionesCita.js";

const datosValidos = {
  mascota: "Luna",
  cliente: "Ana",
  servicio: "Consulta general",
  fecha: "2026-11-11",
  hora: "10:00",
};

test("acepta una cita con todos los campos requeridos", () => {
  assert.doesNotThrow(() => validarDatosCita(datosValidos));
});

test("rechaza campos obligatorios vacíos o con espacios", () => {
  assert.throws(
    () => validarDatosCita({ ...datosValidos, cliente: "   " }),
    (error: unknown) => error instanceof AppError && error.status === 400,
  );
});

test("rechaza un estado que no está permitido", () => {
  assert.throws(
    () => validarDatosCita({ ...datosValidos, estado: "desconocido" }),
    (error: unknown) => error instanceof AppError && error.status === 400,
  );
});

test("rechaza cuerpos que no son objetos", () => {
  assert.throws(
    () => validarDatosCita(null),
    (error: unknown) => error instanceof AppError && error.status === 400,
  );
});
