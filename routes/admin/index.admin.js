const dashboardAdmin = require('./dashboard.admin') 

module.exports = (app) => {
    app.use('/admin/dashboard', dashboardAdmin)
}
