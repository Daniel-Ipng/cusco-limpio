ROLLBACK;
BEGIN;

-- Si quieres limpiar todo antes de sembrar, descomenta:
-- TRUNCATE programacion_ayudantes, programaciones, horarios, rutas, vehiculos, conductores, ayudantes, zonas RESTART IDENTITY CASCADE;

INSERT INTO zonas (nombre)
SELECT v.nombre
FROM (VALUES
  ('Wanchaq - Zona A'),
  ('Santiago - Zona B'),
  ('Cusco - Zona C')
) AS v(nombre)
WHERE NOT EXISTS (SELECT 1 FROM zonas z WHERE z.nombre = v.nombre);

INSERT INTO horarios (zona_id, turno, hora_inicio, hora_fin, dias)
SELECT z.id, h.turno, h.hora_inicio, h.hora_fin, h.dias
FROM (VALUES
  ('Wanchaq - Zona A', 'Madrugada', TIME '04:00', TIME '08:00', 'Lun, Mie, Vie'),
  ('Wanchaq - Zona A', 'Tarde', TIME '14:00', TIME '18:00', 'Mar, Jue, Sab'),
  ('Santiago - Zona B', 'Mañana', TIME '06:00', TIME '10:00', 'Lun, Mie, Vie'),
  ('Santiago - Zona B', 'Noche', TIME '19:00', TIME '22:00', 'Mar, Jue, Sab'),
  ('Cusco - Zona C', 'Mañana', TIME '06:00', TIME '10:00', 'Lun, Jue, Sab'),
  ('Cusco - Zona C', 'Tarde', TIME '14:00', TIME '18:00', 'Mar, Vie, Dom')
) AS h(zona, turno, hora_inicio, hora_fin, dias)
JOIN zonas z ON z.nombre = h.zona
WHERE NOT EXISTS (
  SELECT 1
  FROM horarios hx
  WHERE hx.zona_id = z.id
    AND hx.turno = h.turno
    AND hx.hora_inicio = h.hora_inicio
    AND hx.hora_fin = h.hora_fin
);

INSERT INTO conductores (nombre, disponible, activo)
SELECT v.nombre, v.disponible, TRUE
FROM (VALUES
  ('Maria Garcia', TRUE),
  ('Carlos Mendoza', TRUE),
  ('Juan Lopez', FALSE),
  ('Ana Quispe', TRUE)
) AS v(nombre, disponible)
WHERE NOT EXISTS (SELECT 1 FROM conductores c WHERE c.nombre = v.nombre);

INSERT INTO ayudantes (nombre, disponible, activo)
SELECT v.nombre, v.disponible, TRUE
FROM (VALUES
  ('Rosa Huaman', TRUE),
  ('Luis Flores', TRUE),
  ('Diego Quispe', TRUE),
  ('Sofia Ramos', FALSE)
) AS v(nombre, disponible)
WHERE NOT EXISTS (SELECT 1 FROM ayudantes a WHERE a.nombre = v.nombre);

INSERT INTO vehiculos (placa, tipo, capacidad, km, estado, conductor_id, zona_id)
SELECT v.placa, v.tipo, v.capacidad, v.km, v.estado,
  (SELECT id FROM conductores WHERE nombre = v.conductor),
  (SELECT id FROM zonas WHERE nombre = v.zona)
FROM (VALUES
  ('ABC-123', 'Compactador', '12 ton', 45230, 'disponible', NULL, NULL),
  ('DEF-456', 'Compactador', '12 ton', 52430, 'en_ruta', 'Carlos Mendoza', 'Santiago - Zona B'),
  ('JKL-012', 'Reciclador', '8 ton', 78900, 'mantenimiento', NULL, NULL),
  ('MNO-345', 'Compactador', '12 ton', 32100, 'fuera_servicio', NULL, NULL)
) AS v(placa, tipo, capacidad, km, estado, conductor, zona)
WHERE NOT EXISTS (SELECT 1 FROM vehiculos x WHERE x.placa = v.placa);

INSERT INTO rutas (nombre, zona_id, descripcion, distancia_km, tiempo_estimado_min)
SELECT r.nombre, z.id, r.descripcion, r.distancia, r.tiempo
FROM (VALUES
  ('Ruta Centro', 'Cusco - Zona C', 'Centro historico', 8.5, 45),
  ('Ruta Norte', 'Santiago - Zona B', 'Eje principal', 11.2, 55)
) AS r(nombre, zona, descripcion, distancia, tiempo)
JOIN zonas z ON z.nombre = r.zona
WHERE NOT EXISTS (SELECT 1 FROM rutas x WHERE x.nombre = r.nombre);

COMMIT;