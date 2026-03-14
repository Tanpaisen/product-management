const md5 = require('md5')

const Role = require('../../models/roles.model')
const Account = require('../../models/account.model')

const systemConfig = require('../../config/system')


//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find();

    for (const record of records) {
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
    if (req.body) {
        req.body.password = md5(req.body.password)
        const account = new Account(req.body)
        await account.save();

        req.flash('success', 'Tạo tài khoản thành công')
        const back = req.get('referer') || `${systemConfig.prefixAdmin}/accounts`
        res.redirect(back);
    }
}

//[GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const find = {
            _id: id,
            deleted: false,
        }

        const data = await Account.findOne(find);
        const roles = await Role.find();
        res.render('admin/pages/accounts/edit.pug', {
            pageTitle: "Trang tạo tài khoản",
            roles: roles,
            data: data
        })
    } catch {
        req.flash("error", "Tài khoản không tồn tại");
        const back = req.get('referer') || `${systemConfig.prefixAdmin}/accounts`
        res.rederect(back)
    }
}

//[GET] /admin/accounts/create
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Account.updateOne({ _id: id }, req.body);

        req.flash('success', 'Cập nhật tai khoan thành công')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`
        res.redirect(backUrl);

    } catch (error) {
        req.flash('error', 'Cập nhật tai khoan thất bại')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/accounts`
        res.redirect(backUrl);
    }
}