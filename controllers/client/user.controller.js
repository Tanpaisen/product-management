const md5 = require('md5')

const User = require('../../models/user.model')
const ForgotPassword = require('../../models/forgot-password.model')


const generateHelper = require('../../helper/generate')
const sendMailHelper = require('../../helper/sendMail')

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
 
    const email = req.body.email

    const existUser = await User.findOne({email: req.body.email})

    if(!existUser){
        req.flash('error','Email không đúng hoặc không tồn tại!')
        res.redirect('back')
        return;
    }
    else{
        const otp = generateHelper.generateRandomNumber(6)
        const objectForgot = {
            email: email,
            otp: otp,
            expireAt: new Date(Date.now())
        }
        const forgotPassword = new ForgotPassword(objectForgot)
        forgotPassword.save()
        

        //Neu lay duoc ma thi gui qua otp qua gmail
        const subject = "Mã OTP xác nhận mật khẩu"
        const html = `
           Mã OTP xác nhận của bạn là: <b> ${otp} </b>. Mã xác nhận có hiệu lực 3 phút. Vui lòng không chia sẻ mã với bất kỳ ai!
        `
        sendMailHelper.sendMail(email, subject, html)
    }
    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET]/user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email
    res.render('client/pages/auth/otp-password', {
        pageTitle: 'Xác nhận OTP',
        email: email
    })
}

//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const exitOTP = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!exitOTP){
        req.flash('error','OTP không hợp lệ!')
        res.redirect('back')
        return;
    }

    const user = await User.findOne({email: email})

    res.cookie('tokenUser',user.tokenUser)

    res.redirect('/user/password/reset')
}

//[GET]/user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render('client/pages/auth/reset-password', {
        pageTitle: 'Đổi mật khẩu',
    })
}

//[POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    console.log(req.body)
    const password = md5(req.body.password)

    await User.updateOne({tokenUser: req.cookies.tokenUser},{password: password})
    res.redirect('/')
}