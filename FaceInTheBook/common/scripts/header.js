var atualizarHeader = {
    header: {
        notificacoes: () => { },
        menu: () => {
            document.querySelector("img.menu-avatar").src = usuarioAtual?.avatar

            let meta = 100
            let levelP = (usuarioAtual?.exp?.xp / meta) * 100

            document.querySelector("div.menu-level-bar").style.width = levelP + "%"
            document.querySelector("span.menu-level").innerHTML = usuarioAtual?.exp?.nivel || "0"
            document.querySelector("span.menu-level-xp").innerHTML = usuarioAtual?.exp?.xp || "0"
            // Outros métodos: usuarioAtual ? usuarioAtual.exp.xp : "0"
        }
    },
}

var menu = {
    open: () => {
        notifications.close()
        document.querySelector("div.menu-space").classList.remove("hidden")
        document.querySelector("div.hr-content").setAttribute("onclick", "menu.close()")
        let src = document.querySelector("input.menu-list-search").value
        atualizarHeader.header.menu()

        let container = document.querySelector("div.menu-list")
        container.innerHTML = ""

        let configuracoes = menu.getConfigs(src)

        let get = {
            function: (funcao) => {
                if (funcao)
                    return `onclick="${funcao}; menu.close()"`
                return ""
            }
        }

        for (let c = 0; c < configuracoes.length; c++) {
            container.innerHTML += `
                <div class="mbox def-ripple" tabindex="0" ${get.function(configuracoes[c].funcao)}>
                    <div class="mbox-content">
                        <div class="mbox-left">
                            <div class="mbox-icon-space">
                                ${configuracoes[c].icone}
                            </div>
                            <div class="mbox-name-space">
                                <span class="mbox-name" en="${configuracoes[c].titulo.en}">${configuracoes[c].titulo.pt}</span>
                            </div>
                        </div>
                        <div class="mbox-right">
                            <div class="mbox-arrow-space">
                                <i class="fas fa-chevron-right mbox-arrow"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        lang.update("div.menu-space *")
        def.update()
    },
    close: () => {
        document.querySelector("div.menu-space").classList.add("hidden")
        document.querySelector("div.hr-content").setAttribute("onclick", "menu.open()")
    },
    getConfigs: () => {
        let configs = [
            {
                funcao: "",
                destino: "",
                icone: `<i class="fas fa-terminal mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Opções de desenvolvedor",
                    en: "Developer options"
                }
            },
            {
                function: "",
                destino: "",
                icone: `<i class="fas fa-user mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Meu perfil",
                    en: "My profile"
                }
            },
            {
                funcao: `visit('${usuarioAtual?.codigo}')`,
                destino: "",
                icone: `<i class="fas fa-pager mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Minha página",
                    en: "My page"
                }
            },
            {
                funcao: "galeria.abrir()",
                destino: "",
                icone: `<i class="fas fa-images mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Galeria",
                    en: "Gallery"
                }
            },
            {
                funcao: "",
                destino: "",
                icone: `<i class="fas fa-certificate mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Distintivos",
                    en: "Badges"
                }
            },
            {
                funcao: "db.rede.save()",
                destino: "",
                icone: `<i class="fas fa-save mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Salvar",
                    en: "Save"
                }
            },
            {
                funcao: "",
                destino: "",
                icone: `<i class="fas fa-sign-out-alt mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Sair",
                    en: "Sign out"
                }
            },
            {
                funcao: "",
                destino: "",
                icone: `<i class="far fa-play-circle mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Parquinho",
                    en: "Playground"
                }
            },
            {
                funcao: "",
                destino: "",
                icone: `<i class="fas fa-question-circle mbox-icon"></i>`,
                seta: "",
                titulo: {
                    pt: "Ajuda",
                    en: "Help"
                }
            }
        ]

        return configs
    }
}

var notifications = {
    open: () => {
        menu.close()
        document.querySelector("div.header-notification-around").innerHTML = `<i class="fas fa-bell header-notification"></i>`
        document.querySelector("div.notifications-space").classList.remove("hidden")
        document.querySelector("div.header-notification-space").setAttribute("onclick", "notifications.close()")
        activeAltIcons()
    },
    close: () => {
        document.querySelector("div.header-notification-around").innerHTML = `<i class="far fa-bell header-notification"></i>`
        document.querySelector("div.notifications-space").classList.add("hidden")
        document.querySelector("div.header-notification-space").setAttribute("onclick", "notifications.open()")
        activeAltIcons()
    },
    settings: {
        open: () => {
            document.querySelector("div.notification-settings-space").focus()
        }
    }
}

function headerText() {
    document.querySelector("h3.page-subtitle").classList.add("moved-page-subtitle")
    setTimeout(() => {
        let textos = [
            {
                textoPT: "Envie imagens aleatórias na caixa de ferramentas!",
                textoEN: "Send random images on the toolbox."
            },
            {
                textoPT: "Achou marcante a postagem de alguém? Republique-a!",
                textoEN: "Did you find a Felipe Neto's obvious post? Share it!"
            },
            {
                textoPT: "Procurando algo no site? Use a caixa de pesquisa no topo da página!",
                textoEN: "Looking for something? Use the search box at the top of the page!"
            },
            {
                textoPT: "Adicione distintivos para ficar estiloso!",
                textoEN: "Add badges to be stylish"
            },
            {
                textoPT: "Encontre segredos e ganhe EXP!",
                textoEN: "Find secrets and get XP"
            },
            {
                textoPT: "Achou algo muito engraçado? Adicione-o como favorito!",
                textoEN: "Did you find something funny? Mark it as favorite!"
            },
            {
                textoPT: "Faça seu próprio tema nas configurações",
                textoEN: "Make your own theme on settings"
            },
            {
                textoPT: "Mude sua foto, nome, banner e mais em sua página!",
                textoEN: "Change your photo, name, banner and more on your page!"
            },
            {
                textoPT: "Jogue minijogos no parquinho!",
                textoEN: "Play minigames in the playground"
            },
            {
                textoPT: "Compartilhe seus melhores momentos com amigos e outras pessoas.",
                textoEN: "Share your best moments with friends and other users"
            },
            {
                textoPT: "Compartilhe memes!",
                textoEN: "Share memes!"
            }
        ]

        let t = Math.round(Math.random() * 10)
        document.querySelector("h3.page-subtitle").innerHTML = textos[t].textoPT
        document.querySelector("h3.page-subtitle").setAttribute("en", textos[t].textoEN)
        lang.update("h3.page-subtitle")

        document.querySelector("h3.page-subtitle").classList.remove("moved-page-subtitle")
        setTimeout(headerText, 5000)
    }, 500)
}
setTimeout(headerText, 5000)

window.onscroll = () => {
    let pos = document.querySelector("html").scrollTop

    // Funções que serão chamadas
    if (typeof animations !== "undefined") {
        animations?.background(pos)
    }

    if (typeof principal !== "undefined") {
        principal?.scrollAnimation(pos)
    }


    let lastMove = parseFloat(document.querySelector("body").getAttribute("scroll-position"))
    let newPos = pos - lastMove
    document.querySelector("body").setAttribute("scroll-position", pos.toString())

    let stylePosition = parseFloat(document.querySelector("div.page-header-space").style.transform.replace("translateY(", "").replace("px)", ""))

    if (stylePosition > -50 && newPos > 0) {
        if (stylePosition - newPos < -50) {
            document.querySelector("div.page-header-space").style.transform = `translateY(-50px)`
            document.querySelector("div.notifications-space").style.marginTop = `-50px`
            document.querySelector("div.menu-space").style.marginTop = `-50px`
        } else {
            document.querySelector("div.page-header-space").style.transform = `translateY(${stylePosition - newPos}px)`
            document.querySelector("div.notifications-space").style.marginTop =  `${stylePosition - newPos}px`
            document.querySelector("div.menu-space").style.marginTop =  `${stylePosition - newPos}px`
        }
    } else if (stylePosition < 0 && newPos < 0) {
        if (stylePosition - newPos > 0) {
            document.querySelector("div.page-header-space").style.transform = "translateY(0)"
            document.querySelector("div.notifications-space").style.marginTop = "0"
            document.querySelector("div.menu-space").style.marginTop = "0"
        } else {
            document.querySelector("div.page-header-space").style.transform = `translateY(${stylePosition - newPos}px)`
            document.querySelector("div.notifications-space").style.marginTop = `${stylePosition - newPos}px`
            document.querySelector("div.menu-space").style.marginTop = `${stylePosition - newPos}px`
        }
    }
}

function setAttrs() {
    document.querySelector("body").setAttribute("scroll-position", document.querySelector("html").scrollTop.toString())
}
setAttrs()

var seg = {
    click: (logo) => {
        let vl = parseInt(logo.getAttribute("c"))

        if (!backend.get.user.isLogged()) {
            logo.removeAttribute("onclick")
            logo.removeAttribute("c")
            return
        }

        if (vl >= 100) {
            logo.removeAttribute("onclick")
            logo.removeAttribute("c")
            return conquista.nova("click", usuarioAtual?.codigo)
        }

        vl++
        logo.setAttribute("c", vl)
    }
}

async function confRedirect() {
    await db.rede.save()
    local.set("../../settings/pages/settings.html", param.list.select(["lang"]))
}

document.querySelector("span.menu-change-user").addEventListener("click", switchRedirect)

async function switchRedirect() {
    await db.rede.save()
    local.set("../../settings/pages/settings.html", param.string(param.list.select("lang")) + "&selected-tab=seguranca")
}