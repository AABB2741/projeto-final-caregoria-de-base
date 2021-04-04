document.querySelector("input.fb-search").addEventListener("focus", () => {
    lang.update("div.search-suggestions-space *")
    document.querySelector("div.search-suggestions-space").classList.remove("hidden")
})

document.querySelector("input.fb-search").addEventListener("blur", () => {
    setTimeout(() => {
        let focused = document.activeElement === document.querySelector("div.search-suggestions-space")
        if (focused)
            return document.querySelector("input.fb-search").focus()

        document.querySelector("div.search-suggestions-space").classList.add("hidden")
    }, 50)
})