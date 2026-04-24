const User = require('../../models/user.model')

//[GET] /admin/users
module.exports.index = async (req, res) => {
    const records = await User.find({deleted: false})
    res.render('admin/pages/users/index', {
        title: 'Quản lý tài khoản khách hàng',
        records: records
    })
}