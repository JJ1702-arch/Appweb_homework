CREATE DATABASE IF NOT EXISTS BaseCitas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE BaseCitas;

CREATE TABLE IF NOT EXISTS citas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  mascota VARCHAR(150) NOT NULL,
  cliente VARCHAR(150) NOT NULL,
  servicio VARCHAR(150) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM(
    'solicitada',
    'confirmada',
    'atendida',
    'rechazada',
    'cancelada'
  ) NOT NULL DEFAULT 'solicitada',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_citas_fecha_hora_estado (fecha, hora, estado)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
