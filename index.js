const express = require('express')
const path = require('path')

const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require("express-session");
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

dotenv.config()
const moment = require('moment');

// Socket IO
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected:'+ socket.id)
});
// End Socket IO

//config
const systemConfig = require('./config/system')
const database = require("./config/database.js")

database.connect()
//router
const routes = require('./routes/index.route.js')
const routeAdmin = require('./routes/admin/index.route.js')



const port = process.env.PORT;

//File tĩnh
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'));

//Body parse
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express flash
app.use(cookieParser('tanpaisen'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TinyMCE

//App Location Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment;

//Routes
routes(app);
routeAdmin(app)
app.use('*', (req, res) => {
  res.status(404).render('errors/404', {
    pageTitle: "Error",
  });
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})