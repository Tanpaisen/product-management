import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import { FileUploadWithPreview } from 'https://esm.run/file-upload-with-preview';

var timeOut;
// file-upload-with-preview
const upload = new FileUploadWithPreview('upload-preview',{
    multiple: true,
    maxFileCount: 5,
});

// End file-upload-with-preview

// Viewerjs
const gallery = new Viewer(document.getElementById('inner-images'));
// End Viewerjs

const socketTyping = () => {
    socket.emit('CLIENT_SEND_TYPING', 'show');
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', 'hidden')
    }, 3000)
}
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('.chat .inner-form');
if (formSendData) {
    formSendData.addEventListener('submit', (e) => {
        e.preventDefault();
        const images = upload.cachedFileArray;
        const content = e.target.elements.content.value;

        const data = {
            content: content,
            images: images,
        }
        console.log(data)
        if (content || images.length > 0) {
            socket.emit('CLIENT_SEND_MESSAGE', data);
            e.target.elements.content.value = '';
            upload.resetPreviewPanel(); 
            clearTimeout(timeOut);
            socket.emit('CLIENT_SEND_TYPING', 'hidden')

        }

    })
}
//End CLIENT_SEND_MESSAGE

//SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const chatId = document.querySelector('[my-id]').getAttribute('my-id');
    const chatBody = document.querySelector('.chat .inner-body')
    const elementTyping = document.querySelector('.chat .inner-body .inner-typing-list');

    let fullnameHTML = '';
    let contentHTML = '';
    let imageHTML = '';

    const div = document.createElement('div');

    if (chatId == data.user_id) {
        div.classList.add('inner-outgoing')
    }
    else {
        div.classList.add('inner-incoming')
        fullnameHTML = `<div class='inner-name'>${data.fullname}</div>`
    }
 
    if(data.content) {
        contentHTML = `<div class='inner-content'>${data.content}</div>`
    }

    if(data.images.length > 0) {
        imageHTML += `<div class='inner-images'>`

        for(const image of data.images) {
            imageHTML += `<img src="${image}"  alt="Ảnh đính kèm" class="image-preview"/>`
        }

        imageHTML += `</div>`
    }

    div.innerHTML = `
        ${fullnameHTML}
        ${contentHTML}
        ${imageHTML}
    `
    chatBody.insertBefore(div, elementTyping);

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
if (btnEmoji) {
    const tooltip = document.querySelector('.tooltip');
    const inputChat = document.querySelector('.chat .inner-form input[name="content"]');
    const emojiPicker = document.querySelector('emoji-picker');

    Popper.createPopper(btnEmoji, tooltip);
    btnEmoji.onclick = () => {
        tooltip.classList.toggle('shown')
        emojiPicker.addEventListener('emoji-click', (event) => {
            const emoji = event.detail.unicode;
            inputChat.value = inputChat.value + emoji;

            socketTyping();
            selectText();
        });


    }
    const selectText = () => {
        const length = inputChat.value.length;
        inputChat.focus();
        inputChat.setSelectionRange(length, length);
    }


    //send typing
    inputChat.addEventListener('input', (e) => {
        socketTyping();
    });
}
// End Show Emoji Chat


//SERVER_RETURN_TYPING
socket.on('SERVER_RETURN_TYPING', (data) => {
    const elementTyping = document.querySelector('.chat .inner-body .inner-typing-list');
    const type = data.type;
    if (elementTyping) {

        if (type == 'show') {
            const existTyping = elementTyping.querySelector(`.box-typing[typing-user-id="${data.user_id}"]`);
            if (!existTyping) {

                const div = document.createElement('div');
                div.classList.add('box-typing');
                div.setAttribute('typing-user-id', data.user_id);
                div.innerHTML = `
                <div class="inner-name"> ${data.fullname} </div>
                <div class="inner-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
            `
                elementTyping.appendChild(div);
            }

        } else {
            const boxTyping = elementTyping.querySelector(`[typing-user-id="${data.user_id}"]`);
            if (boxTyping) {
                elementTyping.removeChild(boxTyping)
            }
        }

    }
});
//End SERVER_RETURN_TYPING