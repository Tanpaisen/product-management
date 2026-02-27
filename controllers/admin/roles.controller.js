//[GET] /admin/roles

module.exports.index = (req, res) => {
    res.render('admin/pages/roles/index',{
        pageTitle: "Trang quản trị nhóm quyền",
    })
    
}

//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create',{
        pageTitle: "Trang tạo nhóm quyền mới",
    })
    
}