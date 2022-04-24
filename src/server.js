const express = require('express')
const app = express()
const PORT = process.env.PORT || 3333
const routes = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const Logger = require('./config/logger')
const morgan = require('./config/morgan')


app.use(express.json())
app.use(morgan)
app.use(routes)
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.listen(PORT, () => Logger.info(`Executando na porta ${PORT}`))
