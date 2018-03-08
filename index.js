const express = require('express')
const next = require('next')
const prettyError = require('pretty-error')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

// console.log('process env: ', process.env.NODE_ENV);
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
global.navigator = global.navigator || {};

//console.log('is it works?');

const handler = routes.getRequestHandler(app, ({req, res, route, query}) => {
  navigator.userAgent = req.headers['user-agent'] || navigator.userAgent;
  app.render(req, res, route.page, query)
})

app.prepare()
.then(() => {
  const pretty = new prettyError()
  pretty.start()
  const server = express()
  server.disable('x-powered-by')
  server.use(cookieParser())
  server.use(handler)

  server.listen(3000, (err) => {
    if (err) {
      //console.log(pretty.render(err))
      console.log(err)
      throw err
    }
    console.log('> Ready on http://localhost:3000')
  })
})
