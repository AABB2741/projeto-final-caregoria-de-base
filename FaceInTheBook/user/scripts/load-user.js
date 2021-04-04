var userPage = {
    update(elm) {
        if (elm) {
            if (typeof elm === "string") {

            } else if (Array.isArray(elm)) {

            }
        } else {
            document.querySelectorAll("*").forEach(elemento => {
                console.log(elemento.getAttribute("teste"))
            })
        }
    }
}