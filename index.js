// paths

var paths = require('./paths')()
paths.setPaths()

// express server

var express = require('express')
var app = express()

// file handling

var fs = require('fs')

// server data handling

var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use(cookieParser())

app.set('trust proxy', 1)

app.use(session({
  name: 'session',
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  rolling: true
}))

// setting up the view engine

app.use(express.static('./Design/assets'))
app.set('view engine', 'ejs')
app.set('views', global.paths.design)
app.use('/favicon.ico', express.static('./Design/assets/favicon.ico'))

// MVC

fs.readdirSync('./App/Controllers').forEach(function (file) {
  app.use('/' + file.slice(0, -3), require('./App/Controllers/' + file))
})

// default page : http(s)://.../Admin

app.use('/', require('./App/Controllers/Index'))

// not found page

app.use(function (req, res) {
  res.redirect('/404')
})

// configuration files
var config = require(global.paths.config)

// start the server

app.listen(config.port, config.server, function () {
  console.log('The server started on port : ' + config.port)
})
