

//[GET] admin/blogs-category/
module.exports.index = async (req, res) => {

    res.render('admin/pages/blogs-category/index.pug', {
        pageTitle: 'Trang quản lý bài viết',
    })
}
