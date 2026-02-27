const Role = require('../../models/roles.model')

const systemConfig = require('../../config/system')

//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const role = await Role.find({deleted: false})
    res.render('admin/pages/roles/index',{
        pageTitle: "Trang quản trị nhóm quyền",
        role: role,
    })
    
}

//[GET] /admin/roles/create
module.exports.create =  (req, res) => {
    res.render('admin/pages/roles/create',{
        pageTitle: "Trang tạo nhóm quyền mới",
    })  
}

//[POST] /admin/roles/create
module.exports.createPost = (req, res) => {
    const role = new Role(req.body)
    role.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles/create`)
}

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const find = {
        _id: id,
        deleted: false,
    }
    const data = await Role.findOne(find)
    res.render('admin/pages/roles/edit',{
        pageTitle: "Trang chỉnh sửa nhóm quyền",
        data: data
    })  
}

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    
    await Role.updateOne({_id: id},req.body);

    const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/roles`
    res.redirect(backUrl);
}