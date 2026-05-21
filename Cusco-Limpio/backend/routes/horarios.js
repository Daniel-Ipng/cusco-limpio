const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

// Obtener horarios por zona (admin)
router.get('/zona/:zonaId', async (req, res) => {
  try {
    const zonaId = Number(req.params.zonaId)
    if (!Number.isInteger(zonaId)) {
      return res.status(400).json({ error: 'Zona invalida' })
    }

    const result = await pool.query(
      `
        SELECT id, turno, hora_inicio, hora_fin, dias
        FROM horarios
        WHERE zona_id = $1
        ORDER BY hora_inicio
      `,
      [zonaId],
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener horarios por zona
router.get('/:zona', async (req, res) => {
  try {
    const { zona } = req.params
    const result = await pool.query(`
      SELECT h.turno, h.hora_inicio, h.hora_fin, h.dias
      FROM horarios h
      JOIN zonas z ON h.zona_id = z.id
      WHERE LOWER(z.nombre) LIKE LOWER($1)
    `, [`%${zona}%`])

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Zona no encontrada' })
    }

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener todas las zonas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM zonas ORDER BY nombre')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router