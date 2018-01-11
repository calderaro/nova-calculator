import path from 'path'
import http from 'http'
import express from 'express'
import compress from 'compression'
import helmet from 'helmet'
import chalk from 'chalk'

const PORT = process.env.port || 3006
const log = console.log
const title = 'NOVA'
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()
const server = http.createServer(app)

app
  .use(helmet())
  .use(helmet.noCache())
  .use(compress())
  .use('/static', express.static(path.join(__dirname, '../static')))

  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('../webpack.config.dev')
  const compiler = webpack(webpackConfig)

  app
    .use(webpackDevMiddleware(compiler, {publicPath: webpackConfig.output.publicPath}))
    .use(webpackHotMiddleware(compiler))
    .get('*', (req, res) => res.sendFile(path.join(__dirname, '/index.html')))

server.listen(PORT, () =>
    log(chalk.green(`Listening at port ${PORT}`)))

process.on('uncaughtException', err =>
  err.code === 'EADDRINUSE' ? log(chalk.red(`Port ${PORT} in use`)) : log(chalk.red(err.code)))
