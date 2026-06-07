//Gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll('button[btn-add-friend]');
if (listBtnAddFriend) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener('click', () => {
            const userID = button.getAttribute('btn-add-friend');
            const btnAddFriend = button.closest('.box-user')

            btnAddFriend.classList.add('add');

            // Gửi yêu cầu kết bạn đến server thời gian thực
            socket.emit('CLIENT_ADD_FRIEND', (userID))
        })
    })
}
// End Gửi yêu cầu kết bạn

// Hủy yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll('button[btn-cancel-friend]')
if (listBtnCancelFriend) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener('click', () => {
            const userID = button.getAttribute('btn-cancel-friend');
            const btnCancelFriend = button.closest('.box-user')
            btnCancelFriend.classList.remove('add');
            // Gửi yêu cầu hủy kết bạn đến server thời gian thực
            socket.emit('CLIENT_CANCEL_FRIEND', (userID))
        })
    })
}
// End Hủy yêu cầu kết bạn

// Từ chối lời mời kết bạn
const listBtnRefuseFriend = document.querySelectorAll('button[btn-refuse-friend]')
if (listBtnRefuseFriend) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener('click', () => {
            const userID = button.getAttribute('btn-refuse-friend');
            const btnRefuseFriend = button.closest('.box-user')
            btnRefuseFriend.classList.add('refuse');
            // Gửi yêu cầu hủy kết bạn đến server thời gian thực
            socket.emit('CLIENT_REFUSE_FRIEND', (userID))
        })
    })
}
// End Từ chối lời mời kết bạn

// Chấp nhận lời mời kết bạn
const listBtnAcceptFriend = document.querySelectorAll('button[btn-accept-friend]');
if (listBtnAcceptFriend) {
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener('click', () => {
            const userID = button.getAttribute('btn-accept-friend');
            const btnAcceptFriend = button.closest('.box-user')
            btnAcceptFriend.classList.add('accepted');

            // Gửi yêu cầu chấp nhận kết bạn đến server thời gian thực
            socket.emit('CLIENT_ACCEPT_FRIEND', (userID))
        })
    })
}
//End Chấp nhận lời mời kết bạn

// Hiển thị số lượng lời mời kết bạn khi A gửi yêu cầu kết bạn đến B
socket.on('SERVER_RETURN_REQUEST_LENGTH', (data) => {
    const dataBadgeRequest = document.querySelector('[badge-request-length]')
    const userID = dataBadgeRequest.getAttribute('badge-request-length');
    if (dataBadgeRequest) {
        if (userID === data.userId) {
            dataBadgeRequest.textContent = data.requestLength;
        }
    }
})
// End Hiển thị số lượng lời mời kết bạn khi A gửi yêu cầu kết bạn đến B