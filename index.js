const express = require('express')
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require("express-session");

//config
const systemConfig = require('./config/system')
const database =require("./config/database.js")

//router
const routes = require('./routes/index.route.js')
const routeAdmin = require('./routes/admin/index.admin.js')

dotenv.config()
database.connect()

const port = process.env.PORT;


//Body parse
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express flash
app.use(cookieParser('tanpaisen'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//File tĩnh
app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('public'));

//App Location Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin

//Routes
routes(app);
routeAdmin(app)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})