const express = require('express')
const cors = require('cors')
require('dotenv').config()

const horariosRouter = require('./routes/horarios')
const zonasRouter = require('./routes/zonas')
const conductoresRouter = require('./routes/conductores')
const ayudantesRouter = require('./routes/ayudantes')
const vehiculosRouter = require('./routes/vehiculos')
const programacionesRouter = require('./routes/programaciones')
const rutasRouter = require('./routes/rutas')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Cusco Limpio funcionando' })
})

app.use('/api/horarios', horariosRouter)
app.use('/api/zonas', zonasRouter)
app.use('/api/conductores', conductoresRouter)
app.use('/api/ayudantes', ayudantesRouter)
app.use('/api/vehiculos', vehiculosRouter)
app.use('/api/programaciones', programacionesRouter)
app.use('/api/rutas', rutasRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})