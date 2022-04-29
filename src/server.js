const express = require('express')
const app = express()
const PORT = process.env.PORT || 3333
const routes = require('./routes')
require('./database')
const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')
const morgan = require('./config/morgan')
const Logger = require('./config/logger')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({
        app,
      }),
    ],
    tracesSampleRate: 1.0,
  });

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())
app.use(express.json())
app.use(morgan)
app.use(routes)
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile))
app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        if (error.status === 404 || error.status === 500) {
          return true;
        }
        return false;
      },
    })
  );

app.listen(PORT, () => Logger.info(`Server running on port ${PORT}`));