var theme = {
    set: () => {
        let tema = usuarioAtual?.config.aparencia.temas.selecionado
        let root = document.querySelector(":root")

        if (tema === "light") {
            let lista = faceBackend.get.whiteTheme()
            for (let t in lista) {
                root.style.setProperty(lista[t].codigo, lista[t].valor)
            }
        } else if (tema === "dark") {
            let lista = faceBackend.get.themeList()
            for (let t in lista) {
                root.style.setProperty(lista[t].codigo, lista[t].valor)
            }
        } else {
            let backList = faceBackend.get.themeList()
            for (let t in backList) {
                root.style.setProperty(backList[t].codigo, backList[t].valor)
            }

            let lista = usuarioAtual?.config.aparencia.temas.lista
            for (let l in lista) {
                if (lista[l].codigo === tema) {
                    for (let t in lista[l].lista) {
                        root.style.setProperty(lista[l].lista[t].codigo, lista[l].lista[t].valor)
                    }
                    return
                }
            }
        }
    }
}
theme.set()