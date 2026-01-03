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
