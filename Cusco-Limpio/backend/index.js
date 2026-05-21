const express = require('express')
const cors = require('cors')
require('dotenv').config()

const horariosRouter = require('./routes/horarios')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend Cusco Limpio funcionando' })
})

app.use('/api/horarios', horariosRouter)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})