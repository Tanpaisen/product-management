// const buttonPlus = document.querySelector(".btn--card__plus");
// const buttonMinus = document.querySelector(".btn--card__minus");
// const inputElement = document.querySelector("#amount");

// const minAttributeValue = parseInt(inputElement.getAttribute("min"));

// const maxAttributeValue = parseInt(inputElement.getAttribute("max"));

// console.log(maxAttributeValue);

// let counterValue = parseInt(inputElement.value);
// buttonPlus.addEventListener("click", () => {
//   if (counterValue < maxAttributeValue) counterValue++;
//   else alert("Vượt quá số lượng mặt hàng còn !");
//   inputElement.value = counterValue;
// });

// buttonMinus.addEventListener("click", () => {
//   if (counterValue > minAttributeValue) counterValue--;
//   inputElement.value = counterValue;
// });

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// upload image
const uploadImg = document.querySelector("[upload-image]");
if (uploadImg) {
  const uploadImgInput = document.querySelector("[upload-image-input]");
  const uploadImgPreview = document.querySelector("[upload-image-preview]");

  uploadImgInput.addEventListener("change", (e) => {
    
    const file = e.target.files[0];
    if (file) {
      uploadImgPreview.src = URL.createObjectURL(file);
    }
  });
}
//end upload image
