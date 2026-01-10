//Button status
const buttonsStatus = document.querySelectorAll("[button-status]");

buttonsStatus.forEach((button) => {
  let url = new URL(window.location.href);
  button.addEventListener("click", () => {
    const status = button.getAttribute("button-status");

    if (window.location.href) {
      url.searchParams.set("status", status);
      window.location.href = url.href;
    } else {
      url.searchParams.delete("status");
    }
  });
});
//End button status

//Search form

const searchForm = document.querySelector("#form-search");

if (searchForm) {
  let url = new URL(window.location.href);
  searchForm.addEventListener("submit", (e) => {

    e.preventDefault();
    const keyword = e.target.elements.keyword.value

    if (window.location.href) {
      url.searchParams.set("keyword", keyword);
      window.location.href = url.href;
    } else {
      url.searchParams.delete("keyword");
    }
  });
}
//End search form

//Pagination
const paginationLinks = document.querySelectorAll("[page-link]")

if (paginationLinks) {
  paginationLinks.forEach((button) => {
    let url = new URL(window.location.href)
    button.addEventListener("click", () => {
      const page = button.getAttribute("page-link");
      if (window.location.href) {
        url.searchParams.set("page", page);
        console.log(url)
        window.location.href = url.href
      }
    })
  })
}
//End Pagination

//Change multi
const changeMulti = document.querySelector("[change-multi]");

if (changeMulti) {
  const inputCheckAll = changeMulti.querySelector("input[name='checkall']");
  const inputsCheck = changeMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsCheck.forEach(input => {
        input.checked = true;
      })
    } else {
      inputsCheck.forEach(input => {
        input.checked = false;
      })
    }
  })

  inputsCheck.forEach(input => {
    input.addEventListener("click", () => {
      const countCheckbox = changeMulti.querySelectorAll("input[name='id']:checked");

      if (countCheckbox.length == inputsCheck.length) {
        inputCheckAll.checked = true;
      }
      else {
        inputCheckAll.checked = false;
      }
    })
  })
}
//End change multi

//Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const changeMulti = document.querySelector("[change-multi]");
    const inputChecked = changeMulti.querySelectorAll("input[name='id']:checked");
    
    if (inputChecked.length>0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach(input => {
        const id = input.value;
        ids.push(id);
      })

      inputIds.value = ids.join(", ");
    }
    else{
      alert("Vui lòng chọn 1 bản ghi")
    }
    formChangeMulti.submit();
  })
}
//End Form change multi