const buttonsStatus = document.querySelectorAll("[button-status]")

buttonsStatus.forEach(button => {
    let url = new URL(window.location.href)
    button.addEventListener("click", () => {
        const status = button.getAttribute("button-status")
        
        if(window.location.href){
            url.searchParams.set('status', status);
            window.location.href = url.href;
        }
        else{
            url.searchParams.delete("status");
        }
    })
})