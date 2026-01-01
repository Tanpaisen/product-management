const express = require('express')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

const port = process.env.PORT;

const routes = require('./routes/index.route.js')

app.set('views', './views')
app.set('view engine', 'pug')

routes(app)

app.get('/products', (req, res) => {
  res.render('client/pages/products/index.pug')
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})