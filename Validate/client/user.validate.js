module.exports.register = (req, res, next) => {
    if (req.body.fullname == "") {
        req.flash('error', 'Vui lòng nhập tên!');
        res.redirect('back')
        return;
    }

    if (req.body.email == "") {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back')
        return;
    }

    if (req.body.password == "") {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect('back')
        return;
    }

    next();
}

module.exports.login = (req, res, next) => {

    if (req.body.email == "") {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back')
        return;
    }

    if (req.body.password == "") {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect('back')
        return;
    }

    next();
}

module.exports.forgotPassword = (req, res, next) => {

    if (req.body.email == "") {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back')
        return;
    }

    next();
}

module.exports.resetPassword = (req, res, next) => {

    if (req.body.password == "") {
        req.flash('error', 'Vui lòng nhập mật khẩu mới!');
        res.redirect('back')
        return;
    }

    if (req.body.passwordConfirm == "") {
        req.flash('error', 'Vui lòng nhập xác nhận mật khẩu mới!');
        res.redirect('back')
        return;
    }

    if (req.body.password !== req.body.passwordConfirm) {
        req.flash('error', 'Mật khẩu không khớp, vui lòng nhập lại!');
        res.redirect('back')
        return;
    }

    next();
}