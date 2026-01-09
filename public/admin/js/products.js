const buttonsChangeStatus = document.querySelectorAll("[button-change-status]")
const formChange = document.querySelector("#form-change")
const path = formChange.getAttribute('data-path')
console.log(path)
if (buttonsChangeStatus.length > 0) {
    buttonsChangeStatus.forEach((button) => {
        button.addEventListener('click', () => {
            let currentStatus = button.getAttribute('data-status')
            const id = button.getAttribute('data-id');
            console.log(id)

            const changeStatus = currentStatus == "active" ? "inactive" : "active"

            const currentUrl = window.location.href;
            const action = `${path}/${changeStatus}/${id}?_method=PATCH&_origin=${encodeURIComponent(currentUrl)}`

            formChange.action = action;
            formChange.submit();
        })
    })
}