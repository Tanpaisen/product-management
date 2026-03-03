//Permission for role
const tablePermission = document.querySelector('[table-permissions]');
if (tablePermission) {
    const btnSubmit = document.querySelector('[button-submit]');
    btnSubmit.addEventListener('click', () => {
        let permission = [];
        const row = tablePermission.querySelectorAll('[data-name]');
        row.forEach(item => {
            const name = item.getAttribute('data-name')
            const input = item.querySelectorAll("input")
            if (name === 'id') {
                input.forEach(item => {
                    const id = item.value;
                    permission.push({
                        id: id,
                        permission: [],
                    });

                })
            }
            else {
                input.forEach((item, index) => {
                    const checked = item.checked;
                    // console.log(name)
                    // console.log(index)
                    // console.log(checked)
                    // console.log('-----------------')
                    if (checked) {
                        permission[index].permission.push(name);
                    }
                })
            }
        });
        console.log(permission);
        if (permission.length > 0) {
            const formChangePermis = document.querySelector('#form-change-permissions')
            const inputChange = formChangePermis.querySelector('input[name="permissions"]')
            inputChange.value = JSON.stringify(permission)
            formChangePermis.submit()
        }
    });
}
//End permission for role

//Permission default data
const dataRecords = document.querySelector('[data-records]');
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute('data-records'))

    const tablePermission = document.querySelector('[table-permissions]')

    records.forEach((item, index) => {
        const permissions = item.permissions

        permissions.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name="${permission}"]`)
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })
    })
}
//End permission default data  