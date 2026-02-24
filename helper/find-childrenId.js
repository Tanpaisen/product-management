const ProductCategory = require('../models/product.category.model');

module.exports.findAllChildrenIds = async (parentId, isRestore = false) => {
    const allList = await ProductCategory.find({ deleted: isRestore });

    const getIds = (list, id) => {
        const ids = [id];
        for (const item of list) {
            if (item.parentId == id) {
                ids.push(...getIds(list, item._id));
            }
        }
        return ids;
    }

    return getIds(allList, parentId);
}