const md5 = require('md5')

const Role = require('../../models/roles.model')
const Account = require('../../models/account.model')

const systemConfig = require('../../config/system')


//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find();
    
    res.render('admin/pages/accounts/index', {
        pageTitle: "Trang quản trị tài khoản",
        records: records,
    })

}

//[GET] /admin/accounts/crate
module.exports.create = async (req, res) => {
    const roles = await Role.find();
    res.render('admin/pages/accounts/create.pug', {
        pageTitle: "Trang tạo tài khoản",
    })

}

//[POST] /admin/accounts/crate
module.exports.createPost = async (req, res) => {
    if(req.body){
        req.body.password = md5(req.body.password)
        const account = new Account(req.body)
        await account.save();

        req.flash('success', 'Tạo tài khoản thành công')
        const back = req.get('referer') || `${systemConfig.prefixAdmin}/accounts`
        res.redirect(back);
    }
}