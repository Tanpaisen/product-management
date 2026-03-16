const md5 = require('md5');

const Account = require('../../models/account.model')

const systemConfig = require('../../config/system')

//[GET]admin/auth/login
module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: "Trang đăng nhập"
    })
}

//[POST]admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const find = {
        email: email,
        deleted: false,
    }
    const user = await Account.findOne(find);
    if(!user){
        req.flash('error','Tài khoản không tồn tại!')
        res.redirect('back')
        return
    }
    if(password != user.password){
        req.flash('error','Mật khẩu không chính xác!')
        res.redirect('back')
        return
    }
    if( user.status == 'inactive'){
        req.flash('error','Tài khoản đã bị khóa!')
        res.redirect('back')
        return
    }

    res.cookie('token', user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}