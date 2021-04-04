var warning = {
    new: (content) => {
        if (!content)
            return console.error(`Não foi possível exibir aviso:\nElemento HTML não recebido`)

        navigator.vibrate([100, 50, 100])
        document.querySelector("div.warn-text-space").innerHTML = content
        document.querySelector("div.warn-space").classList.remove("hidden")
        setTimeout(() => {
            document.querySelector("div.warn-space").classList.remove("hidden-warn")
        }, 1)
        lang.update()
    },
    close: () => {
        document.querySelector("div.warn-space").classList.add("hidden-warn")
        setTimeout(() => {
            document.querySelector("div.warn-space").classList.add("hidden")
        }, 300)
    }
}