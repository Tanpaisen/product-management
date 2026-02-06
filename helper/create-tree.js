let count = 0;
const createTree = (arr, parentId = "") => {
    let tree = [];
    arr.forEach((item) => {
        if (item.parentId === parentId) {
            count++;
            const newTree = item;
            newTree.index=count;
            const children = createTree(arr, item.id);
            if (children.length > 0) {
                newTree.children = children;
            }
            tree.push(newTree);
        }
    })
    return tree;
}
module.exports.tree = (arr, parentId = "") => {
     count=0;
    const tree = createTree(arr);
    return tree;
}