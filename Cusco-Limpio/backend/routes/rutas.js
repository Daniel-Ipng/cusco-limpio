const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT
          r.id,
          r.nombre,
          r.descripcion,
          r.distancia_km,
          r.tiempo_estimado_min,
          z.nombre AS zona
        FROM rutas r
        LEFT JOIN zonas z ON r.zona_id = z.id
        ORDER BY r.nombre
      `,
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
