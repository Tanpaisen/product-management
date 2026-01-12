const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
const formChange = document.querySelector("#form-change")

if (buttonsChangeStatus.length > 0) {
    const path = formChange.getAttribute('data-path')
    console.log(path)
    buttonsChangeStatus.forEach((button) => {
        button.addEventListener('click', () => {
            let currentStatus = button.getAttribute('data-status')
            const id = button.getAttribute('data-id');
            console.log(id)

            const changeStatus = currentStatus == "active" ? "inactive" : "active"

            const action = `${path}/${changeStatus}/${id}?_method=PATCH`

            formChange.action = action;
            formChange.submit();
        })
    })
}

const buttonDelete = document.querySelectorAll('[button-delete]');
const formDelete = document.querySelector("#form-delete")
if (buttonDelete.length > 0) {
    const path = formDelete.getAttribute('data-path');
    console.log(path)
    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            
            const action = `${path}/${id}?_method=DELETE`;
            formDelete.action = action;
            formDelete.submit();
        })
    })
}

