//[GET] /rooms-chat
module.exports.index = (req, res) => {
   res.render('client/pages/room-chats/index.pug',{
    pageTitle: 'Nhóm chat'
   })
}