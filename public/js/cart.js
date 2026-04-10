// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputsUpdateQuantity = document.querySelectorAll('.update-quantity')
for(const input of inputsUpdateQuantity){
    input.addEventListener('change', (e) => {
        const newQuantity = input.value;
        const productId = input.getAttribute('data-id')
        window.location.href = `/cart/update-quantity/${productId}/${newQuantity}`
    })
}
// End Cập nhật số lượng sản phẩm trong giỏ hàng
