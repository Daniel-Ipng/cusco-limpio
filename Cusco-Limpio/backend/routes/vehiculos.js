const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

router.get('/', async (req, res) => {
  try {
    const estado = req.query.estado ? String(req.query.estado) : null
    const params = []
    let where = ''

    if (estado) {
      params.push(estado)
      where = 'WHERE v.estado = $1'
    }

    const result = await pool.query(
      `
        SELECT
          v.id,
          v.placa,
          v.tipo,
          v.capacidad,
          v.km,
          v.estado,
          c.nombre AS conductor,
          z.nombre AS zona
        FROM vehiculos v
        LEFT JOIN conductores c ON v.conductor_id = c.id
        LEFT JOIN zonas z ON v.zona_id = z.id
        ${where}
        ORDER BY v.placa
      `,
      params,
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/:id/asignar', async (req, res) => {
  const vehiculoId = Number(req.params.id)
  const programacionId = req.body.programacionId ? Number(req.body.programacionId) : null

  if (!Number.isInteger(vehiculoId)) {
    return res.status(400).json({ error: 'Vehiculo invalido' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const vehiculoRes = await client.query(
      'SELECT id, estado FROM vehiculos WHERE id = $1 FOR UPDATE',
      [vehiculoId],
    )
    if (vehiculoRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Vehiculo no encontrado' })
    }
    if (vehiculoRes.rows[0].estado !== 'disponible') {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'Vehiculo no disponible' })
    }

    let programacionRes
    if (programacionId) {
      programacionRes = await client.query(
        `
          SELECT p.id, h.zona_id, p.conductor_id
          FROM programaciones p
          JOIN horarios h ON p.horario_id = h.id
          WHERE p.id = $1 AND p.vehiculo_id IS NULL
          FOR UPDATE
        `,
        [programacionId],
      )
    } else {
      programacionRes = await client.query(
        `
          SELECT p.id, h.zona_id, p.conductor_id
          FROM programaciones p
          JOIN horarios h ON p.horario_id = h.id
          WHERE p.vehiculo_id IS NULL
          ORDER BY p.id
          LIMIT 1
          FOR UPDATE
        `,
      )
    }

    if (programacionRes.rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(409).json({ error: 'No hay programaciones pendientes' })
    }

    const { id: progId, zona_id: zonaId, conductor_id: conductorId } = programacionRes.rows[0]

    await client.query(
      'UPDATE programaciones SET vehiculo_id = $1 WHERE id = $2',
      [vehiculoId, progId],
    )

    await client.query(
      'UPDATE vehiculos SET estado = $1, conductor_id = $2, zona_id = $3 WHERE id = $4',
      ['en_ruta', conductorId || null, zonaId || null, vehiculoId],
    )

    const updated = await client.query(
      `
        SELECT
          v.id,
          v.placa,
          v.tipo,
          v.capacidad,
          v.km,
          v.estado,
          c.nombre AS conductor,
          z.nombre AS zona
        FROM vehiculos v
        LEFT JOIN conductores c ON v.conductor_id = c.id
        LEFT JOIN zonas z ON v.zona_id = z.id
        WHERE v.id = $1
      `,
      [vehiculoId],
    )

    await client.query('COMMIT')
    res.json(updated.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: error.message })
  } finally {
    client.release()
  }
})

module.exports = router
