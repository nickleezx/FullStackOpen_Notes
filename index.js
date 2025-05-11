const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.list(config.PORT, () => {
  logger.info(`Server starting on Port: ${config.PORT}`);
})