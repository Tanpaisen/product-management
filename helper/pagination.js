module.exports = (query, countProducts, objectPage) => {

    if(query.page){
        objectPage.curentPage=parseInt(query.page);
    }

    objectPage.skipPage = (objectPage.curentPage-1)*objectPage.limitPage;

    objectPage.totalPage = Math.ceil(countProducts/objectPage.limitPage);

    return objectPage;
}