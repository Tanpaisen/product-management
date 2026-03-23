const homePage = require('./client/index.home');
const productPage = require('./client/index.products')

const categoryMiddleware = require('../middlewares/client/category.middlewre')

module.exports = (app) => {

    app.use(categoryMiddleware.category)

    app.use('/', homePage)

    app.use('/products', productPage);

}