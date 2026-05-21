const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

router.get('/', async (req, res) => {
  try {
    const zonaId = req.query.zonaId ? Number(req.query.zonaId) : null
    const params = []
    let where = ''

    if (zonaId) {
      params.push(zonaId)
      where = 'WHERE h.zona_id = $1'
    }

    const result = await pool.query(
      `
        SELECT
          p.id,
          z.nombre AS zona,
          h.turno,
          h.hora_inicio,
          h.hora_fin,
          h.dias,
          c.nombre AS conductor,
          v.placa AS vehiculo,
          COALESCE(
            json_agg(
              json_build_object('id', a.id, 'nombre', a.nombre)
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS ayudantes
        FROM programaciones p
        JOIN horarios h ON p.horario_id = h.id
        JOIN zonas z ON h.zona_id = z.id
        LEFT JOIN conductores c ON p.conductor_id = c.id
        LEFT JOIN vehiculos v ON p.vehiculo_id = v.id
        LEFT JOIN programacion_ayudantes pa ON pa.programacion_id = p.id
        LEFT JOIN ayudantes a ON a.id = pa.ayudante_id
        ${where}
        GROUP BY p.id, z.nombre, h.turno, h.hora_inicio, h.hora_fin, h.dias, c.nombre, v.placa
        ORDER BY p.id DESC
      `,
      params,
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const horarioId = Number(req.body.horarioId)
  const conductorId = Number(req.body.conductorId)
  const rawAyudantes = Array.isArray(req.body.ayudanteIds) ? req.body.ayudanteIds : []
  const ayudanteIds = [...new Set(rawAyudantes.map(Number))].filter(id => Number.isInteger(id))

  if (!Number.isInteger(horarioId) || !Number.isInteger(conductorId)) {
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  if (ayudanteIds.length > 2) {
    return res.status(400).json({ error: 'Maximo 2 ayudantes' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const horarioRes = await client.query('SELECT id FROM horarios WHERE id = $1', [horarioId])
    if (horarioRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Horario no encontrado' })
    }

    const conductorRes = await client.query(
      'SELECT disponible FROM conductores WHERE id = $1',
      [conductorId],
    )
    if (conductorRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Conductor no encontrado' })
    }
    if (!conductorRes.rows[0].disponible) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Conductor no disponible' })
    }

    if (ayudanteIds.length > 0) {
      const ayudantesRes = await client.query(
        'SELECT id, disponible FROM ayudantes WHERE id = ANY($1::int[])',
        [ayudanteIds],
      )

      const ayudantesMap = new Map(ayudantesRes.rows.map(row => [row.id, row.disponible]))
      const faltantes = ayudanteIds.filter(id => !ayudantesMap.has(id))

      if (faltantes.length > 0) {
        await client.query('ROLLBACK')
        return res.status(404).json({ error: 'Ayudante no encontrado' })
      }

      const noDisponibles = ayudanteIds.filter(id => !ayudantesMap.get(id))
      if (noDisponibles.length > 0) {
        await client.query('ROLLBACK')
        return res.status(409).json({ error: 'Ayudante no disponible' })
      }
    }

    const programacionRes = await client.query(
      'INSERT INTO programaciones (horario_id, conductor_id) VALUES ($1, $2) RETURNING id',
      [horarioId, conductorId],
    )

    const programacionId = programacionRes.rows[0].id

    if (ayudanteIds.length > 0) {
      await client.query(
        'INSERT INTO programacion_ayudantes (programacion_id, ayudante_id) SELECT $1, unnest($2::int[])',
        [programacionId, ayudanteIds],
      )
    }

    await client.query('COMMIT')
    res.status(201).json({ id: programacionId })
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
})

module.exports = router
