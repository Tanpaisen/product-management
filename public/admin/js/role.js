const btnDeleted = document.querySelectorAll('[button-delete]');
const formDeleted = document.querySelector('#form-delete');
console.log(formDeleted)
if (btnDeleted.length > 0) {
    btnDeleted.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id')
            const isCfm = confirm('Bạn có chắc chắn muốn xóa nhóm quyền này?');
            if (!isCfm) {
                return;
            }
            const path = formDeleted.getAttribute('data-path')
            const action = `${path}/${id}?_method=DELETE`;
            formDeleted.action = action;
            formDeleted.submit();
        })
    })
}