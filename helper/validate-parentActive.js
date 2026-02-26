module.exports.validateParentActive =  (parentId, records) =>{
    if(!parentId || parentId == "") return true;
    const parentCategory = records.find(item => item._id.toString() === parentId.toString());

    if(!parentCategory || parentCategory.status !== "active" || parentCategory.deleted === true) return false
    return this.validateParentActive(parentCategory.parentId, records);
}