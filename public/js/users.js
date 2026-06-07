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
const refuseFriend = (button) => {
    button.addEventListener('click', () => {
        const userID = button.getAttribute('btn-refuse-friend');
        const btnRefuseFriend = button.closest('.box-user')
        btnRefuseFriend.classList.add('refuse');
        // Gửi yêu cầu hủy kết bạn đến server thời gian thực
        socket.emit('CLIENT_REFUSE_FRIEND', (userID))
    })
}
const listBtnRefuseFriend = document.querySelectorAll('button[btn-refuse-friend]')
if (listBtnRefuseFriend) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    })
}
// End Từ chối lời mời kết bạn

// Chấp nhận lời mời kết bạn
const acceptFriend = (button) => {
    button.addEventListener('click', () => {
        const userID = button.getAttribute('btn-accept-friend');
        const btnAcceptFriend = button.closest('.box-user')
        btnAcceptFriend.classList.add('accepted');

        // Gửi yêu cầu chấp nhận kết bạn đến server thời gian thực
        socket.emit('CLIENT_ACCEPT_FRIEND', (userID))
    })
}
const listBtnAcceptFriend = document.querySelectorAll('button[btn-accept-friend]');
if (listBtnAcceptFriend) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button);
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

// Cập nhật danh sách lời mời kết bạn mới khi A gửi yêu cầu kết bạn đến B
socket.on('SERVER_RETURN_LIST_REQUEST_FRIEND', (data) => {
    const dataListRequest = document.querySelector('[data-list-accept-friend]')
    const userID = dataListRequest.getAttribute('data-list-accept-friend');

    const div = document.createElement('div');
    div.classList.add('col-6');
    div.innerHTML = `
        <div class="box-user">
            <div class="inner-avatar">
                <img src="${data.infoUserA.avatar || '/images/avatar.png'}" alt="${data.infoUserA.fullname}">
            </div>
            <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullname}</div>
                <div class="inner-buttons">
                    <button class="btn btn-primary" btn-accept-friend="${data.infoUserA._id}">
                       Chấp nhận
                    </button>
                    <button class="btn btn-secondary ms-2" btn-refuse-friend="${data.infoUserA._id}">
                       Xóa
                    </button>
                    <button class="btn btn-secondary ms-2 disabled" btn-deleted-friend="">
                       Đã xóa
                    </button>
                    <button class="btn btn-secondary ms-2 disabled" btn-accepted-friend="">
                       Đã chấp nhận
                    </button>
                </div>
            </div>
        </div>     
    `
    if (dataListRequest) {
        if (userID === data.userId) {
            dataListRequest.appendChild(div);

            const zeroAccept = document.querySelector('p[zero-accept]');
            if (zeroAccept) {
                zeroAccept.style.display = 'none';
            }

            const btnRefuseFriend = div.querySelector('button[btn-refuse-friend]');
            refuseFriend(btnRefuseFriend);

            const btnAcceptFriend = div.querySelector('button[btn-accept-friend]');
            acceptFriend(btnAcceptFriend);
        }
    }
})
// End Cập nhật danh sách lời mời kết bạn mới khi A gửi yêu cầu kết bạn đến B