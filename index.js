const express = require('express')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const systemConfig = require('./config/system')
const database =require("./config/database.js")

dotenv.config()
database.connect()

const port = process.env.PORT;


const routes = require('./routes/index.route.js')
const routeAdmin = require('./routes/admin/index.admin.js')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded())

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'));

app.locals.prefixAdmin = systemConfig.prefixAdmin

routes(app);
routeAdmin(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})