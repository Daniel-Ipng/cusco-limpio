const express = require('express')
const router = express.Router()
const pool = require('../db/connection')

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