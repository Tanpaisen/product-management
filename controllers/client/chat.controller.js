
//[GET]/chat/index
module.exports.index = (req, res) => {
    res.render('client/pages/chats/index', {
        pageTitle: 'Chat',
    })
}