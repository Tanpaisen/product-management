//Gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll('button[btn-add-friend]');
if(listBtnAddFriend){
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
if(listBtnCancelFriend){
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
if(listBtnRefuseFriend){
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


