const ProductCategory = require('../../models/product.category.model')

const createTreeHelper = require('../../helper/create-tree')

module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({ deleted: false });

    const newTree = createTreeHelper.tree(productsCategory)

    res.locals.productsCategory = newTree;
    next();
}