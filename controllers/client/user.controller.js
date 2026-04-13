const md5 = require('md5')

const User = require('../../models/user.model')

//[GET]/user/register
module.exports.register = (req, res) => {
    res.render('client/pages/auth/register', {
        pageTitle: 'Trang đăng ký',
    })
}

//[POST]/user/register
module.exports.registerPost = async (req, res) => {
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = md5(req.body.password);

    console.log(fullname, email, password)
    const existEmail = await User.findOne({email: email})
    if(existEmail){
        req.flash('error','Tài khoản đã tồn tại')
        res.redirect('back')
        return;
    }
    const userObject ={
        fullname: fullname,
        email: email,
        password: password,
    }
    const user = new User(userObject)
    user.save();
    res.cookie("tokenUser",user.tokenUser)

    res.redirect('/')
}

//[GET]/user/login
module.exports.login = (req, res) => {
    res.render('client/pages/auth/login', {
        pageTitle: 'Trang đăng nhập',
    })
}

//[POST]/user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        req.flash('error','Email không chính xác hoặc không tồn tại!')
        res.redirect('back')
        return;
    }
    if(md5(req.body.password) != user.password)
    {
        req.flash('error','Mật khẩu không chính xác!')
        res.redirect('back')
        return;
    }
    if(req.body.status == 'inactive')
    {
        req.flash('error','Tài khoản đã bị khóa!')
        res.redirect('back')
        return;
    }
    res.cookie('tokenUser', user.tokenUser)
    res.redirect('/')
}