const md5 = require('md5')

const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')


const generateHelper = require('../../helper/generate')

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

//[GET]/user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser')
    res.redirect('/user/login')
}

//[GET]/user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render('client/pages/auth/forgot-password', {
        pageTitle: 'Trang quên mật khẩu',
    })
}

//[POST]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const existUser = await User.findOne({email: req.body.email})

    if(!existUser){
        req.flash('error','Email không đúng hoặc không tồn tại!')
        res.redirect('back')
        return;
    }
    else{
        const otp = generateHelper.generateRandomNumber(6)
        const objectForgot = {
            email: req.body.email,
            otp: otp,
            expireAt: Date.now()
        }
        const forgotPassword = new ForgotPassword(objectForgot)
        forgotPassword.save()
        

        //Neu lay duoc ma thi lam gi do
    }
    res.send('ok')
}