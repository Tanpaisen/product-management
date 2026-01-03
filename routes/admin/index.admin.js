const dashboardAdmin = require('./dashboard.admin') 
const productsAdmin = require('./product.admin') 
const system = require('../../config/system')

const PATH_ADMIN = system.prefixAdmin
module.exports = (app) => {
    app.use(PATH_ADMIN + '/dashboard', dashboardAdmin)

    app.use(PATH_ADMIN + '/products', productsAdmin)
}

