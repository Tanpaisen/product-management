const User = require('../../models/user.model')

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        req.flash("error", "Bạn chưa đăng nhập!")
        res.redirect(`/user/login`)
    }
    else {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select("-password");
        if (!user) {
            req.flash("error", "Bạn chưa đăng nhập!")
            res.redirect(`/user/login`)
        }

        res.locals.user = user;
        next();
    }

}