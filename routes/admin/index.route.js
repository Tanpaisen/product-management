const dashboardAdmin = require('./dashboard.route') 
const productsAdmin = require('./product.route') 
const productsCategoryAdmin = require('./product.category.route') 
const system = require('../../config/system')

const PATH_ADMIN = system.prefixAdmin
module.exports = (app) => {
    app.use(PATH_ADMIN + '/dashboard', dashboardAdmin)

    app.use(PATH_ADMIN + '/products', productsAdmin)

    app.use(PATH_ADMIN + '/products-category', productsCategoryAdmin)
}

