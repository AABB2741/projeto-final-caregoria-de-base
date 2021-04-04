var lang = {
    set: (idioma) => {
        if (!idioma)
            return console.error(`Nâo foi possível definir novo idioma:\nIdioma não definido`)

        idioma = idioma.split("-")[0]
        param.set("lang", idioma)

        let isValid = false
        for (let v = 0; v < lang.validLanguages.length; v++) {
            if (lang.validLanguages[v] === idioma) {
                isValid = true
                break
            }
        }

        if (!isValid)
            return console.log(isValid, idioma)

        document.querySelectorAll("*").forEach(elm => {
            let attr = elm.getAttribute(`${idioma}-attr`)
            let trad = elm.getAttribute(idioma)

            if (attr) {
                elm.setAttribute(attr, trad)
            } else {
                if (trad) {
                    elm.innerText = trad
                }
            }
        })
    },
    auto: () => {
        let ln = usuarioAtual?.config.preferencias.idioma
        if (!ln || ln === "auto")
            ln = lang.get.selected()

        if (!ln)
            ln = lang.get.navigator()

        lang.set(ln)
    },
    get: {
        navigator: (full) => {
            if (full)
                return navigator.language

            return navigator.language.split("-")[0]
        },
        selected: () => {
            return param.get("lang")
        }
    },
    update: (element, ln) => {
        if (!ln)
            ln = lang.get.selected()

        if (!element) {
            lang.set(ln)
        } else {
            if (typeof element === "string") {
                document.querySelectorAll(element).forEach(el => {
                    let t = el.getAttribute(ln)
                    let attr = el.getAttribute(ln + "-attr")

                    let isValid = false
                    for (let v = 0; v < lang.validLanguages.length; v++) {
                        if (lang.validLanguages[v] === ln) {
                            isValid = true
                            break
                        }
                    }

                    if (isValid) {
                        if (t) {
                            if (attr) {
                                el.setAttribute(attr, t)
                            } else {
                                el.innerText = t
                            }
                        }
                    }
                })


            } else if (Array.isArray(element)) {
                for (let l = 0; l < element.length; l++) {
                    document.querySelectorAll(element[l]).forEach(el => {
                        let t = el.getAttribute(ln)
                        let attr = el.getAttribute(ln + "-attr")

                        let isValid = false
                        for (let v = 0; v < lang.validLanguages.length; v++) {
                            if (lang.validLanguages[v] === ln) {
                                isValid = true
                                break
                            }
                        }

                        if (isValid) {
                            if (t) {
                                if (attr) {
                                    el.setAttribute(attr, t)
                                } else {
                                    el.innerText = t
                                }
                            }
                        }
                    })
                }
            }
        }
    },
    validLanguages: [
        "pt",
        "en"
    ]
}
lang.auto()