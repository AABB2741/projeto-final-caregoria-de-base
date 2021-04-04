var defFunctions = {
    ripple: (e) => {
        let x = e.clientX - e.target.getBoundingClientRect().left
        let y = e.clientY - e.target.getBoundingClientRect().top

        let ripples = document.createElement("span")
        ripples.style.left = x + "px"
        ripples.style.top = y + "px"
        ripples.classList.add("-def-ripple-effect-")
        e.target.appendChild(ripples)

        setTimeout(() => {
            ripples.remove()
        }, 700)
    },
    select: (e) => {
        let target = e.target.getAttribute("target")
        if (target)
            document.querySelector(target).focus()
    },
    toggler: (tog) => {
        let value = tog.getAttribute("active")
        if (!value)
            return tog.setAttribute("active", "false")

        if (value === "true") {
            tog.setAttribute("active", "false")
            tog.classList.remove("def-active-toggle")
        } else if (value === "false") {
            tog.setAttribute("active", "true")
            tog.classList.add("def-active-toggle")
        }
    }
}

var def = {
    update: () => {
        // Resetadores
        document.querySelectorAll(".def-select-trigger").forEach(tr => {
            tr.removeEventListener("click", defFunctions.select)
        })

        document.querySelectorAll(".def-mult").forEach(mult => {
            let original = mult.getAttribute("mult-original")

            if (original !== null) {
                let attr = mult.getAttribute("mult-attr")

                if (attr) {
                    mult.setAttribute(attr, original)
                } else {
                    mult.innerText = original
                }
            }
        })

        document.querySelectorAll(".def-ripple").forEach(r => {
            r.removeEventListener("mousedown", defFunctions.ripple)
        })

        // Funções abaixo

        document.querySelectorAll(".drag").forEach(elm => {
            elm.setAttribute("draggable", "false")
        })

        // Informações da conta
        document.querySelectorAll(".def-user-name").forEach(elm => {
            if (usuarioAtual) {
                elm.innerHTML = usuarioAtual?.nome
            } else {
                elm.innerHTML = "Usuário"
                elm.setAttribute("en", "User")
                lang.update("def-user-name")
            }
        })

        document.querySelectorAll("img.def-user-image").forEach(img => {
            if (usuarioAtual) {
                img.src = usuarioAtual?.avatar
            } else {
                img.src = `../files/default-avatar.png`
            }
        })

        if (typeof backend !== "undefined")
            var connected = backend?.get?.user?.isLogged()

        document.querySelectorAll(".def-logged").forEach(elm => {
            if (!connected)
                elm.remove()
        })

        document.querySelectorAll(".def-notlogged").forEach(elm => {
            if (!connected)
                elm.classList.remove("hidden")
        })

        document.querySelectorAll(".def-context").forEach(elm => {
            elm.addEventListener("contextmenu", event => event.preventDefault())
        })

        document.querySelectorAll(".def-required-login").forEach(elm => {
            if (!connected)
                elm.setAttribute("onclick", "loginPopup.open()")
        })

        document.querySelectorAll(".def-unavailable").forEach(un => {
            un.setAttribute("onclick", "unavailable.open()")
        })

        document.querySelectorAll(".def-select").forEach(sel => {
            if (sel.getAttribute("tabindex") === null)
                sel.setAttribute("tabindex", "0")
        })

        document.querySelectorAll(".def-ripple").forEach(r => {
            r.addEventListener("mousedown", defFunctions.ripple)
        })

        document.querySelectorAll(".def-mult").forEach(mult => {
            let attr = mult.getAttribute("mult-attr")
            mult.setAttribute("mult-original", attr)
            let v = mult.getAttribute("mult")
            if (!v)
                v = 1

            if (attr) {
                let res = ""
                for (let c = 0; c < v; c++) {
                    res += mult.getAttribute(attr)
                }
                mult.setAttribute(attr, res)
            } else {
                let content = mult.innerText
                let res = ""
                for (let c = 0; c < v; c++) {
                    res += content
                }
                mult.innerText = res
            }
        })

        document.querySelectorAll(".def-select-trigger").forEach(tr => {
            tr.addEventListener("click", defFunctions.select)
        })

        document.querySelectorAll(".def-toggle").forEach(tg => {
            let bef = String(tg.getAttribute("onclick"))
            tg.setAttribute("onclick", `defFunctions.toggler(this); ${bef.replace("defFunctions.toggler(this); ", "")}`)
            let isAct = tg.getAttribute("active")
            if (isAct === "true")
                tg.classList.add("def-active-toggle")
            tg.innerHTML = `<div class="-toggler-ball-"></div>`
        })

        document.querySelectorAll(".def-counter").forEach(counter => {
            // count-time (ms)
            // count-max
            // count-value
            // count-initial
    
            let attr = counter.getAttribute("counter-attr")
            let tempo = parseInt(counter.getAttribute("count-time"))
            let max = parseFloat(counter.getAttribute("count-max"))
            let inicial = parseFloat(counter.getAttribute("count-initial"))
            let add = parseFloat(counter.getAttribute("count-value"))
            let maximo = max
            let res = 0
    
            if (inicial) {
                maximo = max - inicial
                res = inicial
            }
    
            let delay = tempo / (maximo / add)
    
            let addCount = () => {
                if (res > maximo)
                    return
                if (attr) {
                    counter.setAttribute(attr, res)
                } else {
                    counter.innerText = res
                }
                res += add
                setTimeout(addCount, delay)
            }
            addCount()
        })
    }
}
def.update()

function activeAltIcons(init, script) {
    if (init) {
        script.setAttribute("error", "true")
        
        if (lang.get.selected() === "en") {
            console.warn("Warning: An error has occurred during the loading of the Font Awesome v5, so it has been changed to v4.\nThis means that some icons may are being incorrectly displayed.")
            alert("Hey! An error occurred during the loading of the icons, so it has been changed to an older version. This means that some icons can be incorrectly displayed.")
        } else {
            console.warn("Aviso: Ocorreu um erro durante o carregamento do Font Awesome na versão 5, então ela foi alterada para a versão 4.\nIsso significa que alguns ícones podem estar sendo exibidos de maneira incorreta.")
            alert("Ei! Ocorreu um erro durante o carregamento dos ícones, portanto ela foi alterada para uma versão mais antiga. Isso significa que alguns ícones podem estar sendo exibidos de maneira incorreta.")
        }
    } else {
        if (document.querySelector("script.font-awesome-script")?.getAttribute("error") != "true")
            return
    }

    document.querySelector("div.alt-icons").innerHTML = `<link rel="stylesheet" href="../../common/styles/font-awesome-4.7.0/css/font-awesome.min.css">`
    let change = [
        {
            antigo: "fa-comment-alt",
            novo: "fa-comment"
        },
        {
            antigo: "fa-arrow-alt-circle-up",
            novo: "fa-arrow-circle-up"
        },
        {
            antigo: "fa-arrow-alt-circle-down",
            novo: "fa-arrow-circle-down"
        },
        {
            antigo: "fa-comment-slash",
            novo: "fa-comment"
        },
        {
            antigo: "fa-user-friends",
            novo: "fa-user"
        },
        {
            antigo: "fa-crown",
            novo: "fa-asterisk"
        },
        {
            antigo: "fa-clock",
            novo: "fa-clock-o"
        },
        {
            antigo: "fa-surprise",
            novo: "fa-smile-o"
        },
        {
            antigo: "fa-fire-alt",
            novo: "fa-fire"
        },
        {
            antigo: "fa-user-slash",
            novo: "fa-minus"
        },
        {
            antigo: "fa-redo",
            novo: "fa-repeat"
        },
        {
            antigo: "fa-globe-americas",
            novo: "fa-globe"
        },
        {
            antigo: "fa-image",
            novo: "fa-file-photo-o"
        },
        {
            antigo: "fa-images",
            novo: "fa-image"
        },
        {
            antigo: "fa-poll-h",
            novo: "fa-bars"
        },
        {
            antigo: "fa-video",
            novo: "fa-video-camera"
        },
        {
            antigo: "fa-smile",
            novo: "fa-smile-o"
        }
    ]
    document.querySelectorAll("i.fas").forEach(icon => {
        icon.classList.remove("fas")
        icon.classList.add("fa")
    })
    document.querySelectorAll("i.far").forEach(icon => {
        icon.classList.remove("far")
        icon.classList.add("fa")
    })
    document.querySelectorAll("i.fab").forEach(icon => {
        icon.classList.remove("fab")
        icon.classList.add("fa")
    })
    for (let c = 0; c < change.length; c++) {
        if (change[c].antigo && change[c].novo) {
            document.querySelectorAll("i." + change[c].antigo).forEach(icon => {
                icon.classList.remove(change[c].antigo)
                icon.classList.add(change[c].novo)
            })
        }
    }
}

document.querySelector("div.page-fonts").innerHTML = `
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Viga&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Passion+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lalezar&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Rubik&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
`

// Adicionar para as classes dev-option