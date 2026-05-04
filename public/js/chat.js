import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('.chat .inner-form');
if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content);
            e.target.elements.content.value = '';
        }
    })
}
//End CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const chatId = document.querySelector('[my-id]').getAttribute('my-id');
    const chatBody = document.querySelector('.chat .inner-body')

    let fullnameHTML = '';
    let contentHTML = '';
    const div = document.createElement('div');

    if (chatId == data.user_id) {
        div.classList.add('inner-outgoing')
    }
    else {
        div.classList.add('inner-incoming')
        fullnameHTML = `<div class='inner-name'>${data.fullname}</div>`
    }
    div.innerHTML = `
        ${fullnameHTML}
        <div class='inner-content'>${data.content}</div>
    `
    chatBody.appendChild(div);

    chatBody.scrollTop = chatBody.scrollHeight;
});
//End SERVER_RETURN_MESSAGE

//Scroll to bottom
const chatBody = document.querySelector('.chat .inner-body');
if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
}
//end Scroll to bottom

// Show Emoji Chat

const btnEmoji = document.querySelector('.emoji-icon');
if(btnEmoji) {
    const tooltip = document.querySelector('.tooltip');
    const inputChat = document.querySelector('.chat .inner-form input[name="content"]');
    const emojiPicker = document.querySelector('emoji-picker');

    Popper.createPopper(btnEmoji, tooltip);
    btnEmoji.onclick = () => {
        tooltip.classList.toggle('shown')
        emojiPicker.addEventListener('emoji-click', (event) => {
            const emoji = event.detail.unicode;
            inputChat.value = inputChat.value + emoji;
        });
    }
}
// End Show Emoji Chat