const homePage = require('./client/home.route');
const productPage = require('./client/products.route')

const categoryMiddleware = require('../middlewares/client/category.middlewre')

module.exports = (app) => {

    app.use(categoryMiddleware.category)

    app.use('/', homePage)

    app.use('/products', productPage);

}