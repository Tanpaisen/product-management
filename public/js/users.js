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