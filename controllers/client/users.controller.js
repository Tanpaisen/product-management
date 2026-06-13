const User = require('../../models/user.model')
const RoomChat = require('../../models/room.chat.model')

const usersSocker = require('../../socket/client/users.socket')

// [GET /users/not-friend]
module.exports.notFriend = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({ _id: myUserID })
    const requestsFriend = user.requestsFriend;
    const acceptsFriend = user.acceptsFriend;
    const listFriend = user.listFriend.map(friend => friend.userID);
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            { _id: { $ne: myUserID } },
            { _id: { $nin: requestsFriend } },
            { _id: { $nin: listFriend } },
            { _id: { $nin: acceptsFriend } },
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/not-friend', {
        pageTitle: 'Danh sách người dùng',
        users: users
    })
}

// [GET /users/requests]
module.exports.requests = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({ _id: myUserID })
    const requestsFriend = user.requestsFriend;
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            { _id: { $ne: myUserID } },
            { _id: { $in: requestsFriend } }
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/requests', {
        pageTitle: 'Lời mời đã gửi',
        users: users
    })
}

// [GET /users/accept]
module.exports.accept = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({ _id: myUserID })
    const acceptsFriend = user.acceptsFriend;
    const users = await User.find({
        //Cach 1
        // _id: {$nin: [myUserID, ...requestsFriend]},
        //Cach 2
        $and: [
            { _id: { $ne: myUserID } },
            { _id: { $in: acceptsFriend } }
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar')

    res.render('client/pages/users/accepts', {
        pageTitle: 'Lời mời kết bạn',
        users: users
    })
}


// [GET /users/friends]
module.exports.friends = async (req, res) => {
    usersSocker(res)
    const myUserID = res.locals.user.id;
    const user = await User.findOne({ _id: myUserID })
    const listFriend = user.listFriend;
    const listFriendID = listFriend.map(friend => friend.userID);
    const users = await User.find({
        $and: [
            { _id: { $ne: myUserID } },
            { _id: { $in: listFriendID } }
        ],
        deleted: false,
        status: 'active',
    }).select('id fullname avatar statusOnline')

    for (const user of users) {
        const infoFriend = listFriend.find(friend => friend.userID == user.id)
        user.infoFriend = infoFriend
    }

    res.render('client/pages/users/friends', {
        pageTitle: 'Danh sách bạn bè',
        users: users
    })
}