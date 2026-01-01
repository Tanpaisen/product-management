const homePage = require('./client/index.home');
const productPage = require('./client/index.products')
module.exports = (app) => {
    app.use('/', homePage)

    app.use('/products', productPage);
}