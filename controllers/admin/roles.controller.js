const Role = require('../../models/roles.model')

const systemConfig = require('../../config/system')

//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const role = await Role.find({ deleted: false })
    res.render('admin/pages/roles/index', {
        pageTitle: "Trang quản trị nhóm quyền",
        role: role,
    })

}

//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: "Trang tạo nhóm quyền mới",
    })
}

//[POST] /admin/roles/create
module.exports.createPost = (req, res) => {
    try {
        const role = new Role(req.body)
        role.save()

        req.flash('success', 'Tạo nhóm quyền thành công')
        const backUrl = `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);
    }
    catch (error) {
        req.flash('error', 'Tạo nhóm quyền thất bại')
        const backUrl = `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);
    }
}
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const find = {
        _id: id,
        deleted: false,
    }
    const data = await Role.findOne(find)
    res.render('admin/pages/roles/edit', {
        pageTitle: "Trang chỉnh sửa nhóm quyền",
        data: data
    })
}

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({ _id: id }, req.body);

        req.flash('success', 'Cập nhật nhóm quyền thành công')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);

    } catch (error) {
        req.flash('error', 'Cập nhật nhóm quyền thất bại')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);
    }
}

//[DELETE] /admin/roles/deleteOne/:id
module.exports.deleteOne = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.deleteOne({ _id: id })

        req.flash('success', 'Xóa nhóm quyền thành công')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);
    } catch (error) {
        req.flash('error', 'Xóa nhóm quyền thất bại')
        const backUrl = req.get('Referer') || `${systemConfig.prefixAdmin}/roles`
        res.redirect(backUrl);
    }
}

//[GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const data = await Role.findOne({ _id: id });
    res.render('admin/pages/roles/detail', {
        pageTitle: "Trang chi tiết nhóm quyền",
        data: data
    })
}

//[GET] /admin/roles/permissions
module.exports.permission = async (req, res) => {
    const data = await Role.find({ deleted: false })

    res.render('admin/pages/roles/permissions.pug', {
        pageTitle: "Trang quản lý quyền",
        data: data
    })
}

//[PATCH] /admin/roles/permissions
module.exports.permissionPatch = async (req, res) => {
    try {
        if (req.body.permissions) {
            const permissions = JSON.parse(req.body.permissions);
            for (permission of permissions) {
                const id = permission.id;
                const permissionList = permission.permission;
                await Role.updateOne({ _id: id }, { permissions: permissionList })
            } 
            req.flash('success', 'Cập nhật quyền thành công')
            const back = req.get("Referer") || `${systemConfig.prefixAdmin}/roles/permissions`
            res.redirect(back);
        }
    } catch (error) {
        req.flash('error', 'Cập nhật quyền thất bại')
        const back = req.get("Referer") || `${systemConfig.prefixAdmin}/roles/permissions`
        res.redirect(back);
    }

}