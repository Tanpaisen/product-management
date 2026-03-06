const md5 = require('md5')

const Role = require('../../models/roles.model')
const Account = require('../../models/account.model')

const systemConfig = require('../../config/system')


//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find();
    
    for(const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    }
    res.render('admin/pages/accounts/index', {
        pageTitle: "Trang quản trị tài khoản",
        records: records,
    })

}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find();
    res.render('admin/pages/accounts/create.pug', {
        pageTitle: "Trang tạo tài khoản",
        roles: roles,
    })

}

//[POST] /admin/accounts/create
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