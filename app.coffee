express = require 'express'
routes = require './routes'

app = module.exports = express.createServer()

app.register '.html', require('jinjs')

app.configure ->
    app.use(express.bodyParser())
    app.set('dirname', __dirname)
    app.set('view options', { layout: false });
    app.use(app.router)
    app.use(express.static(__dirname + "/public"))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
    app.set('views',__dirname + "/views")

app.configure 'development', () ->
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))

app.configure 'production', () ->
    app.use(express.errorHandler())

app.get('/', routes.index)
app.get('/timeline', routes.timeline)
app.get('/algorithms', routes.algorithms)

app.listen(22026)
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
