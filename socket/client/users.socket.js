const User = require('../../models/user.model');

module.exports = (res) => {

    _io.once('connection', async (socket) => {
        // Khi gui yêu cầu kết bạn cho B
        socket.on('CLIENT_ADD_FRIEND', async (userID) => {
            const myUserID = res.locals.user.id; //ID của A
            const userId = userID; //ID của B

            const exitsUser = await User.findOne({ requestsFriend: userId })
            if (!exitsUser) {
                //Thêm id của A vào acceptsFriend của B
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptsFriend: myUserID }
                })

                //Thêm id của B vào requestsFriend của A
                await User.updateOne({
                    _id: myUserID
                }, {
                    $push: { requestsFriend: userId }
                })
            }
        })
        // End Khi gui yêu cầu kết bạn cho B
    });
}