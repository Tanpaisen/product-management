const md5 = require('md5')

const Account = require('../../models/account.model')

module.exports.index = async (req, res) => {
    res.render('admin/pages/my-account/index.pug', {
        pageTitle: "Trang thông tin cá nhân",
    })
}

module.exports.edit = async (req, res) => {
    res.render('admin/pages/my-account/edit.pug', {
        pageTitle: "Trang thông tin cá nhân",
    })
}

module.exports.editPatch = async (req, res) => {
    console.log(req.body)

    const exitEmail = await Account.findOne({
        _id: { $ne: res.locals.user.id },
        email: req.body.email,
        deleted: false,
    })

    if (exitEmail) {
        req.flash('error', `Email ${req.body.email} đã tồn tại!`)
        res.redirect('back');
        return
    }
    else {
        if (req.body.password == '') {
            delete req.body.password;
        }
        else {
            req.body.password = md5(req.body.password)
        }
    }

    await Account.updateOne({ _id: res.locals.user.id }, req.body)
    res.redirect('back')
}
