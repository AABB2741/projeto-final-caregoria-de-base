// Funções das guias
// Usar como padrão o início "tabfun" (tab function)
var tabfunGeral = {
    galeria: {
        abrirPopup: () => {
            document.querySelector("div.cleargal-space").classList.remove("hidden")
        },
        fecharPopup: () => {
            document.querySelector("div.cleargal-space").classList.add("hidden")
        },
        limpar: () => {
            usuarioAtual.galeria = {
                imagem: [],
                video: []
            }
            isDifferent()
            tabfunGeral.galeria.fecharPopup()
        }
    },
    nome: {
        definir: (nome) => {
            if (!nome) {
                tabfunGeral.nome.redef()
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("Enter your name!")
                } else {
                    alert("Insira o seu nome!")
                }
                return
            }

            usuarioAtual.nomeReal = nome
            isDifferent()
        },
        redef: () => {
            let nome = sBackend.get.originals(usuarioAtual?.codigo).nomeReal
            usuarioAtual.nomeReal = nome
            document.querySelector("input.general-real-name-input").value = nome
            isDifferent()
        }
    },
    data: {
        set: () => {
            let dia = document.querySelector("input#birth-day").valueAsNumber
            let mes = document.querySelector("input#birth-month").valueAsNumber
            let ano = document.querySelector("input#birth-year").valueAsNumber
            let now = getTime().ano

            if (!dia)
                return tabfunGeral.data.reset.dia()

            if (!mes)
                return tabfunGeral.data.reset.mes()

            if (!ano)
                return tabfunGeral.data.reset.ano()

                // dia
            if (dia < 1) {
                return tabfunGeral.data.reset.dia()
            }

            if (dia > 31)
                if (mes == 2) {
                    return tabfunGeral.data.reset.dia(29)
                } else {
                    return tabfunGeral.data.reset.dia()
                }

                // mes
            if (mes < 1)
                return tabfunGeral.data.reset.mes()

            if (mes > 12)
                return tabfunGeral.data.reset.mes()

            if (mes == 2) {
                if (dia > 29)
                    return tabfunGeral.data.reset.dia(29)
            }

                // ano
            if (ano.toString().length !== 4)
                return tabfunGeral.data.reset.ano()

            if (ano > now)
                return tabfunGeral.data.reset.ano()

            usuarioAtual.nascimento.dia = dia
            usuarioAtual.nascimento.mes = mes
            usuarioAtual.nascimento.ano = ano
            isDifferent()
        },
        reset: {
            dia: (dia) => {
                if (dia) {
                    document.querySelector("input#birth-day").value = dia
                } else {
                    document.querySelector("input#birth-day").value = usuarioAtual?.nascimento.dia
                }
            },
            mes: () => {
                document.querySelector("input#birth-month").value = usuarioAtual?.nascimento.mes
            },
            ano: () => {
                document.querySelector("input#birth-year").value = usuarioAtual?.nascimento.ano
            }
        }
    },
    carregar: () => {
        let nome = usuarioAtual?.nomeReal
        document.querySelector("input.general-real-name-input").value = nome

        document.querySelector("input#birth-day").value = usuarioAtual.nascimento.dia
        document.querySelector("input#birth-month").value = usuarioAtual.nascimento.mes
        document.querySelector("input#birth-year").value = usuarioAtual.nascimento.ano
    }
}

var tabfunPerfil = {
    showAchievements: (btn) => {
        let v = JSON.parse(btn.getAttribute("active"))
        usuarioAtual.config.perfil.conquistas = v
        isDifferent()
    },
    showBadges: (btn) => {
        let v = JSON.parse(btn.getAttribute("active"))
        usuarioAtual.config.perfil.distintivos = v
        isDifferent()
    },
    showPosts: (selected) => {
        document.querySelectorAll("div.set-select-post-visibility div.def-select-option").forEach(op => {
            op.classList.remove("selected")
        })
        if (!selected) {
            let org = usuarioAtual?.config.perfil.postagens
            let boxes = document.querySelectorAll("div.set-select-post-visibility div.def-select-option")
            for (let b in boxes) {
                if (boxes[b].getAttribute("optionvalue") === org) {
                    boxes[b].classList.add("selected")
                    document.querySelector("div.set-post-visibility-button span").innerText = boxes[b].getAttribute("optionname")
                    break
                }
            }
            return
        }

        let v = selected.getAttribute("optionvalue")
        document.querySelector("span.set-post-visibility-select-text").innerText = selected.getAttribute("optionname")
        selected.classList.add("selected")

        usuarioAtual.config.perfil.postagens = v

        document.querySelector("div.set-select-post-visibility").blur()
        isDifferent()
    },
    showBio: (selected) => {
        document.querySelectorAll("div.set-bioview-select div.def-select-option").forEach(op => {
            op.classList.remove("selected")
        })
        if (!selected) {
            let org = usuarioAtual?.config.perfil.sobre
            let boxes = document.querySelectorAll("div.set-bioview-select div.def-select-option")
            for (let b in boxes) {
                if (boxes[b].getAttribute("optionvalue") === org) {
                    boxes[b].classList.add("selected")
                    document.querySelector("div.set-bioview-select-button span").innerText = boxes[b].getAttribute("optionname")
                    break
                }
            }
            return
        }

        let v = selected.getAttribute("optionvalue")
        document.querySelector("span.set-bio-visibility-text").innerText = selected.getAttribute("optionname")
        selected.classList.add("selected")

        usuarioAtual.config.perfil.sobre = v

        document.querySelector("div.set-bioview-select").blur()
        isDifferent()
    },
    countChars: () => {
        let texto = document.querySelector("textarea.set-profile-custom-bio-type").value.length
        document.querySelector("span.set-profile-custom-bio-count").innerText = texto

        if (texto < 1 || texto > 1000) {
            document.querySelector("div.set-profile-custom-bio-count-space").classList.add("warn-color")
        } else {
            document.querySelector("div.set-profile-custom-bio-count-space").classList.remove("warn-color")
        }
    },
    clearBio: () => {
        document.querySelector("textarea.set-profile-custom-bio-type").value = ""
        document.querySelector("textarea.set-profile-custom-bio-type").focus()
        tabfunPerfil.countChars()
        isDifferent()
    },
    setBio: () => {
        let texto = document.querySelector("textarea.set-profile-custom-bio-type").value
        usuarioAtual.biografia = texto
        isDifferent()
    },
    resetBio: () => {
        let original = sBackend.get.originals(usuarioAtual?.codigo)
        usuarioAtual.biografia = original.biografia
        document.querySelector("textarea.set-profile-custom-bio-type").value = original.biografia
        document.querySelector("textarea.set-profile-custom-bio-type").focus()
        tabfunPerfil.countChars()
        isDifferent()
    },
    resetName: async () => {
        let original = await sBackend.get.originals(usuarioAtual?.codigo)
        document.querySelector("input.set-profile-name-input").value = original.nome
        usuarioAtual.nome = original.nome
        isDifferent()
    },
    setName: (nome) => {
        nome = nome.replace(/ /g, "_")
        let acceptableChars = `0123456789abcdefghijklmnopqrstuvwxyz-_!`
        let res = ""
        for (let n = 0; n < nome.length; n++) {
            let existe = false
            for (let c = 0; c < acceptableChars.length; c++) {
                if (nome[n].toLowerCase() === acceptableChars[c].toLowerCase()) {
                    existe = true
                    break
                }
            }
            if (existe)
                res += nome[n]
        }
        if (res.length > 24)
            res = res.slice(0, 24)

        if (!nome) {
            tabfunPerfil.resetName()
            let ln = lang.get.selected()

            if (ln === "en") {
                alert("Please, enter an username with at least 4 characters and a maximum of 24 characters!")
            } else {
                alert("Por favor, insira um nome de usuário com pelo menos 4 caracteres e, no máximo, 24!")
            }
            return
        }

        let existe = faceBackend.verify.username(usuarioAtual?.nome, usuarioAtual?.codigo)
        if (existe) {
            tabfunPerfil.resetName()
            let ln = lang.get.selected()

            if (ln === "en") {
                alert("This name is already in use. Please, enter another name!")
            } else {
                alert("Este nome já está em uso. Por favor, insira outro nome!")
            }
            return
        }

        document.querySelector("input.set-profile-name-input").value = res
        usuarioAtual.nome = res
        isDifferent()
    },
    changeAvatar: {
        openPopup: () => {
            tabfunPerfil.changeAvatar.loadGalleryImages()
            document.querySelector("div.page-popup-perfil-space").classList.remove("hidden")
        },
        closePopup: () => {
            document.querySelector("div.page-popup-perfil-space").classList.add("hidden")
            document.querySelector("input.page-popup-perfil-input").value = ""
        },
        loadGalleryImages: () => {
            let imagens = usuarioAtual?.galeria.imagem
            let container = document.querySelector("div.page-popup-perfil-gallery")
            container.innerHTML = ""

            for (let i in imagens) {
                container.innerHTML += `
                <div class="page-popup-perfil-gallery-item def-ripple" title="${imagens[i].nome}" onclick="tabfunPerfil.changeAvatar.selectFromGallery('${imagens[i].url}')">
                    <img src="${imagens[i].url}">
                </div>
                `
            }

            if (imagens.length < 1) {
                container.innerHTML = `
                <div class="page-popup-perfil-gallery-noitems">
                    <span en="You don't have any images in gallery =(">Você não tem imagens na galeria =(</span>
                </div>
                `
                lang.update("div.page-popup-perfil-gallery *")
            }

            def.update()
        },
        selectFromGallery: (url) => {
            document.querySelector("input.page-popup-perfil-input").value = url
            document.querySelector("input.page-popup-perfil-input").focus()
        },
        setAvatar: () => {
            let url = document.querySelector("input.page-popup-perfil-input").value

            let valid = () => {
                usuarioAtual.avatar = url
                document.querySelector("img.stpc-image").setAttribute("src", url)
                isDifferent()
                tabfunPerfil.changeAvatar.closePopup()
            }

            let invalid = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    alert("Can't set this photo as profile photo: the image wasn't found :(")
                } else {
                    alert("Não foi possível definir esta foto como perfil, pois ela não foi encontrada :(")
                }
            }

            let test = () => {
                let f = new Image()
                f.onload = valid
                f.onerror = invalid
                f.src = url
            }
            test()
        },
        removeAvatar: () => {
            let url = "../../common/files/default-avatar.png"
            usuarioAtual.avatar = url
            document.querySelector("img.stpc-image").setAttribute("src", url)
            isDifferent()
        }
    },
    changeBanner: {
        openPopup: () => {
            document.querySelector("div.perfil-banner-space").classList.remove("hidden")
            tabfunPerfil.changeBanner.loadGalleryImages()
        },
        closePopup: () => {
            document.querySelector("div.perfil-banner-space").classList.add("hidden")
            document.querySelector("input.perfil-banner-input").value = ""
        },
        loadGalleryImages: () => {
            let imagens = usuarioAtual?.galeria.imagem
            let container = document.querySelector("div.perfil-banner-gallery")
            container.innerHTML = ""

            for (let i in imagens) {
                container.innerHTML += `
                <div class="perfil-banner-gallery-item def-ripple" title="}${imagens[i].nome}" onclick="tabfunPerfil.changeBanner.selectFromGallery('${imagens[i].url}')">
                    <img src="${imagens[i].url}">
                </div>
                `
            }

            if (imagens.length < 1) {
                container.innerHTML = `
                <div class="page-popup-perfil-gallery-noitems">
                    <span en="You don't have any images in gallery =(">Você não tem imagens na galeria =(</span>
                </div>
                `
                lang.update("div.perfil-banner-space *")
            }

            def.update()
        },
        selectFromGallery: (url) => {
            document.querySelector("input.perfil-banner-input").value = url
            document.querySelector("input.perfil-banner-input").focus()
        },
        setBanner: () => {
            let url = document.querySelector("input.perfil-banner-input").value

            if (!url) {
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("Can't set new banner: URL not specified.")
                } else {
                    alert("Não foi possível adicionar novo banner: URL não especificada.")
                }
                return
            }

            let valid = () => {
                usuarioAtual.banner = url
                document.querySelector("img.stcb-image").setAttribute("src", url)
                isDifferent()
                tabfunPerfil.changeBanner.closePopup()
            }

            let invalid = () => {
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("Can't set new banner: Image not found.")
                } else {
                    alert("Não foi possível adicionar novo banner: Imagem não encontrada.")
                }
            }

            let test = () => {
                let f = new Image()
                f.onload = valid
                f.onerror = invalid
                f.src = url
            }
            test()
        },
        removeBanner: () => {
            let url = "../../common/files/default-banner.png"

            usuarioAtual.banner = url
            document.querySelector("img.stcb-image").setAttribute("src", url)
            isDifferent()
        }
    }
}

var tabfunSeg = {
    load: () => {
        document.querySelector("input.security-password-input").value = usuarioAtual?.senha
        tabfunSeg.alts.load()
    },
    passwordView: (btn) => {
        let v = btn.getAttribute("view")

        if (v === "p") {
            btn.setAttribute("view", "t")
            document.querySelector("input.security-password-input").setAttribute("type", "text")
            document.querySelector("button.security-password-view").innerHTML = `<i class="fas fa-eye-slash"></i>`
        } else {
            btn.setAttribute("view", "p")
            document.querySelector("input.security-password-input").setAttribute("type", "password")
            document.querySelector("button.security-password-view").innerHTML = `<i class="fas fa-eye"></i>`
        }
    },
    setPassword: (inp) => {
        let senha = inp.value
        
        if (!senha)
            inp.value = usuarioAtual?.senha

        if (senha.length < 4 || senha.length > 24)
            inp.value = usuarioAtual?.senha

        usuarioAtual.senha = senha
        isDifferent()
    },
    resetPassword: () => {
        let senhaOriginal = sBackend.get.originals(usuarioAtual?.codigo).senha
        document.querySelector("input.security-password-input").value = senhaOriginal
        usuarioAtual.senha = senhaOriginal
        isDifferent()
    },
    alts: {
        load: () => {
            let lista = faceBackend.any.alt.list()
            let container = document.querySelector("div.sec-alt-account")
            container.innerHTML = ""

            let get = {
                bio: (texto) => {
                    if (!texto)
                        return `<span en="Nothing about this user">Nada sobre este usuário</span>`

                    return texto.replace(/</g, "&#60;").replace(/>/g, "&#62;")
                },
                time: (timestamp) => {
                    return getTime(timestamp).string.data
                }
            }

            for (let l in lista) {
                let infos = faceBackend.get.user.infos(lista[l].codigo)
                container.innerHTML += `
                <div class="sec-alt-account-box" style="background: url('${infos.banner}')">
                    <div class="sec-alt-account-box-content">
                        <div class="sec-alt-account-box-header">
                            <div class="sec-alt-account-box-header-content">
                                <div class="sec-alt-account-box-image-space">
                                    <img src="${infos.avatar}" class="sec-alt-account-box-image">
                                </div>
                                <div class="sec-alt-account-box-infos-space">
                                    <div class="sec-alt-account-box-name-space">
                                        <span>${infos.nome}</span>
                                    </div>
                                    <div class="sec-alt-account-box-desc-space">
                                        <span>${get.bio(infos.biografia)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sec-alt-account-box-body">
                            <span en="Added at">Adicionado em</span>
                            <span class="sec-alt-account-added-time">${get.time(lista[l].timestamp)}</span>
                        </div>
                        <div class="sec-alt-account-box-bottom">
                            <button class="sec-alt-account-connect def-great-button def-ripple" onclick="tabfunSeg.alts.login('${lista[l].codigo}')">
                                <i class="fas fa-sign-in-alt"></i>
                                <span en="Log in">Conectar-se</span>
                            </button>
                            <button class="sec-alt-account-remove-select def-warn-button def-ripple" onclick="tabfunSeg.alts.remove('${lista[l].codigo}')">
                                <i class="fas fa-times"></i>
                                <span en="Remove">Remover</span>
                            </button>
                        </div>
                    </div>
                </div>
                `
            }

            if (lista.length < 1) {
                container.innerHTML = `
                    <div class="security-alt-list-noaccounts">
                        <span en="No alternative accounts found. Click on '+ Add an account' to add one."
                            >Sem contas alternativas adicionadas. Clique em "+ Adicionar uma conta" para adicionar uma.</span>
                    </div>
                `
            }

            lang.update("div.sec-alt-account *")
            def.update()
        },
        open: () => {
            document.querySelector("div.altadd-space").classList.remove("hidden")
        },
        close: () => {
            document.querySelector("div.altadd-space").classList.add("hidden")
            document.querySelector("input.altadd-username").value = ""
            document.querySelector("input.altadd-password").value = ""
        },
        add: () => {
            let nome = document.querySelector("input.altadd-username").value
            let senha = document.querySelector("input.altadd-password").value

            if (!nome || !senha) {
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("Psst, you need to enter a valid username and password!")
                } else {
                    alert("Psiu, você precisa inserir um nome e uma senha válidas!")
                }
                return
            }

            let adding = faceBackend.any.alt.add(nome, senha)

            if (!adding) {
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("An error occurred when trying to add this account. Check if the username and password was correctly entered and try again.")
                } else {
                    alert("Ocorreu um erro ao adicionar esta conta. Verifique se o nome e a senha foram inseridos corretamente e tente novamente.")
                }

                return
            }

            tabfunSeg.alts.load()
            tabfunSeg.alts.close()
        },
        remove: (codigo) => {
            if (!codigo)
                return console.error(`Código não recebido para remover.`)

            faceBackend.any.alt.remove(codigo)
            tabfunSeg.alts.load()
        },
        removeAll: () => {
            faceBackend.any.alt.clear()
            tabfunSeg.alts.load()
        },
        login: (codigo) => {
            let mods = sBackend.compare(usuarioAtual)
            if (mods.length > 0) {
                let ln = lang.get.selected()

                if (ln === "en") {
                    var c = confirm("There are some unsaved changes. Do you want to cancel the changes and return?")
                } else {
                    var c = confirm("Algumas modificações ainda não foram salvas. Tem certeza de que deseja descartar alterações e sair?")
                }

                if (!c)
                    return
            }

            let lgn = faceBackend.request.switchAccount(codigo)
            if (!lgn) {
                let ln = lang.get.selected()
                if (ln === "en") {
                    alert("Can't switch account. Try again later.")
                } else {
                    alert("Não foi possível trocar de conta. Tente novamente mais tarde")
                }
                return
            }

            local.set("../../main/pages/principal.html", param.list.select(["lang"]))
        },
        passView: (btn) => {
            let v = btn.getAttribute("view")

            if (v === "p") {
                btn.setAttribute("view", "t")
                document.querySelector("input.altadd-password").setAttribute("type", "text")
                btn.innerHTML = `<i class="fas fa-eye-slash"></i>`
            } else {
                btn.setAttribute("view", "p")
                document.querySelector("input.altadd-password").setAttribute("type", "password")
                btn.innerHTML = `<i class="fas fa-eye"></i>`
            }
        }
    },
    delAccount: {
        open: () => {
            document.querySelector("div.delacc-space").classList.remove("hidden")
        },
        close: () => {
            document.querySelector("div.delacc-space").classList.add("hidden")
            document.querySelector("input.delacc-password").value = ""
        },
        confirm: () => {
            let senha = document.querySelector("input.delacc-password").value
            let codigo = usuarioAtual?.codigo
            let del = faceBackend.request.delAccount(codigo, senha)
            if (!del) {
                let ln = lang.get.selected()
                if (ln === "en") {
                    alert("Failed to delete account. Check if the password was correctly entered and try again.")
                } else {
                    alert("Não foi possível excluir conta. Certifique-se de que a senha foi inserida corretamente e tente novamente.")
                }
                return
            }
            local.set("../../home/pages/inicio.html", param.list.select("lang"))
        }
    }
}

var tabfunPref = {
    load: () => {
        let idioma = usuarioAtual?.config.preferencias.idioma
        document.querySelectorAll("div.pref-lang-option").forEach(div => {
            let ln = div.getAttribute("optionvalue")

            if (ln === idioma) {
                div.classList.add("selected")
                document.querySelector("div.pref-lang-select-button span").innerText = div.getAttribute("optionname")
            } else {
                div.classList.remove("selected")
            }
        })
    },
    idioma: {
        set: (box) => {
            let ln = box.getAttribute("optionvalue")
            document.querySelectorAll("div.pref-lang-option").forEach(div => {
                div.classList.remove("selected")
            })
            document.querySelector("div.pref-lang-select-button span").innerText = box.getAttribute("optionname")
            box.classList.add("selected")
            document.querySelector("div.pref-lang-select").blur()
            usuarioAtual.config.preferencias.idioma = ln
            param.set("lang", ln)
            isDifferent()
        }
    }
}

var tabfunApp = {
    loadThemes: () => {
        let container = document.querySelector("div.app-mytheme-list")
        container.innerHTML = ""

        let get = {
            desc: (texto) => {
                if (!texto) {
                    return `
                        <span en="No description">Sem descrição</span>
                    `
                }

                return texto.replace(/</g, "&#60;").replace(/>/g, "&#62;")
            }
        }

        let lista = usuarioAtual?.config.aparencia.temas.lista
        for (let l in lista) {
            container.innerHTML += `
            <div class="app-theme-box">
                <div class="app-theme-box-content">
                    <div class="app-theme-box-left">
                        <div class="app-theme-box-infos">
                            <div class="app-theme-box-icon-space">
                                <i class="fas fa-paint-brush"></i>
                            </div>
                            <div class="app-theme-box-info-space">
                                <span class="apptheme-box-name def-ellipsis">${lista[l].nome.replace(/</g, "&#60;").replace(/>/g, "&#62;")}</span>
                                <span class="app-theme-box-desc def-ellipsis">${get.desc(lista[l].desc)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="app-theme-box-right">
                        <i class="far fa-check-square app-theme-box-select" onclick="tabfunApp.selectTheme('${lista[l].codigo}')" theme="${lista[l].codigo}"></i>
                        <i class="fas fa-trash app-theme-box-delete warn-color" onclick="tabfunApp.themeDelOpen('${lista[l].codigo}')"></i>
                    </div>
                </div>
            </div>
            `
        }

        if (lista.length < 1) {
            container.innerHTML = `
                <div class="app-theme-no-themes">
                    <span en="You don't have themes :(">Você não tem temas :(</span>
                    <br>
                    <span en="Create a new theme by clicking '+ New theme'">Crie um novo tema em "+ Novo tema"</span>
                </div>
            `
        }

        lang.update("div.app-mytheme-list *")
    },
    openThemePopup: () => {
        usuarioAtual.config.aparencia.temas.novo = {
            nome: "",
            descricao: "",
            props: []
        }
        // nome"", descricao"", props[]
        document.querySelector("div.app-newtheme-space").classList.remove("hidden")
        tabfunApp.loadSelecteds()
    },
    closeThemePopup: () => {
        delete usuarioAtual.config.aparencia.temas.novo
        document.querySelector("input.app-newtheme-name-input").value = ""
        document.querySelector("textarea.app-newtheme-desc").value = ""
        document.querySelector("div.app-newtheme-space").classList.add("hidden")
    },
    loadProperties: async () => {
        let container = document.querySelector("div.app-newprop-list")
        container.innerHTML = ""
        let adicionado = []
        for (let t in usuarioAtual?.config.aparencia.temas.novo.props) {
            adicionado.push(usuarioAtual?.config.aparencia.temas.novo.props[t].codigo)
        }
        let list = await faceBackend.get.apiThemeList({ not: adicionado }, true) // Adicionar um not com todas as propriedades que já foram

        for (let l in list) {
            container.innerHTML += `
            <div class="app-newprop-option def-select-option" onclick="tabfunApp.newProperty('${list[l].codigo}')">
                <div class="app-newprop-option-content">
                    <span en="${list[l].nome.en}">${list[l].nome.pt}</span>
                </div>
            </div>
            `
        }

        if (list.length < 1) {
            container.innerHTML = `
                <div class="app-newprop-nooptions">
                    <span en="No properties">Sem propriedades</span>
                </div>
            `
        }

        lang.update("div.app-newprop *")
    },
    newProperty: (prop) => {
        let res = faceBackend.get.themeList(prop)
        let obj = {
            codigo: res.codigo,
            valor: res.valor
        }
        usuarioAtual.config.aparencia.temas.novo.props.push(obj)
        document.querySelector("div.app-newprop").blur()
        tabfunApp.loadSelecteds()
    },
    loadSelecteds: () => {
        let container = document.querySelector("div.app-newtheme-property-list")
        let lista = usuarioAtual.config.aparencia.temas.novo.props
        container.innerHTML = ""

        for (let l in lista) {
            let infos = faceBackend.get.themeList(lista[l].codigo)
            container.innerHTML += `
            <div class="app-newtheme-box">
                <div class="app-newtheme-box-content">
                    <div class="app-newtheme-box-top">
                        <span en="${infos.nome.en}">${infos.nome.pt}</span>
                    </div>
                    <div class="app-newtheme-box-bottom">
                        <label for="appnewthemeselector${l}" class="app-newtheme-color" tabindex="0" color="${lista[l].valor}">
                            <input type="color" id="appnewthemeselector${l}" class="hidden" value="${lista[l].valor}" oninput="tabfunApp.setColor(${l})" onchange="tabfunApp.defineColor('${lista[l].codigo}', this.value)">
                            <span en="Color:">Cor:</span>
                            <span class="app-newtheme-box-color" onmouseover="tabfunApp.previewColor(this)" onmouseout="tabfunApp.noPreview(this)" color="${lista[l].valor}">${lista[l].valor}</span>
                        </label>
                        <button class="app-newtheme-remove def-nwarn-button def-ripple" onclick="tabfunApp.removeColor('${lista[l].codigo}')">
                            <i class="fas fa-times"></i>
                            <span en="Remove">Remover</span>
                        </button>
                    </div>
                </div>
            </div>
            `
        }

        if (lista.length < 1) {
            container.innerHTML = `
            <div class="app-newtheme-noprops">
                <span en="You don't have selected any properties. Start by clicking on '+ New property'"
                    >Você não tem propriedades adicionadas. Comece clicando em "+ Nova propriedade"</span>
            </div>
            `
        }

        document.querySelector("span.app-theme-prop-count").innerText = lista.length
        lang.update("div.app-newtheme-property-list *")
        def.update()
    },
    setColor: (num) => {
        let inp = document.activeElement.querySelector("input#appnewthemeselector" + num)
        let valor = inp.value
        document.activeElement.querySelector("span.app-newtheme-box-color").innerText = valor
        document.activeElement.querySelector("span.app-newtheme-box-color").setAttribute("color", valor)
    },
    previewColor: (span) => {
        let valor = span.getAttribute("color")
        span.style.color = valor
    },
    noPreview: (span) => {
        span.style.color = "var(--cor)"
    },
    defineColor: (codigo, valor) => {
        let lista = usuarioAtual?.config.aparencia.temas.novo.props
        for (let l in lista) {
            if (lista[l].codigo === codigo) {
                lista[l].valor = valor
                break
            }
        }
    },
    removeColor: (codigo) => {
        let lista = usuarioAtual?.config.aparencia.temas.novo.props
        for (let l in lista) {
            if (lista[l].codigo === codigo) {
                lista.splice(l, 1)
                tabfunApp.loadSelecteds()
                break
            }
        }
    },
    getAll: (onlyCode) => {
        if (!usuarioAtual?.config.aparencia.temas.novo)
            return []

        let lista = usuarioAtual?.config.aparencia.temas.novo.props
        let res = []

        for (let l in lista) {
            if (onlyCode) {
                res.push(lista[l].codigo)
            } else {
                let obj = {
                    codigo: lista[l].codigo,
                    valor: lista[l].valor
                }
                res.push(obj)
            }
        }

        return res
    },
    selectAll: () => {
        if (!usuarioAtual?.config.aparencia.temas.novo)
            return false

        let lista = tabfunApp.getAll(true)
        let res = faceBackend.get.themeList({ not: lista })
        for (let r in res) {
            usuarioAtual.config.aparencia.temas.novo.props.push(
                {
                    codigo: res[r].codigo,
                    valor: res[r].valor
                }
            )
        }

        tabfunApp.loadSelecteds()
        document.querySelector("div.app-newtheme-select").blur()
        return true
    },
    removeAllDefaults: () => {
        if (!usuarioAtual?.config.aparencia.temas.novo)
            return false

        let lista = tabfunApp.getAll()
        let originals = faceBackend.get.themeList()

        for (let o in originals) {
            for (let l in lista) {
                if (originals[o].codigo === lista[l].codigo) {
                    if (originals[o].valor === lista[l].valor) {
                        lista.splice(l, 1)
                        usuarioAtual.config.aparencia.temas.novo.props = lista
                    }
                    break
                }
            }
        }

        tabfunApp.loadSelecteds()
        document.querySelector("div.app-newtheme-select").blur()
    },
    resetAll: () => {
        if (!usuarioAtual?.config.aparencia.temas.novo)
            return false

        let lista = tabfunApp.getAll()
        let originals = faceBackend.get.themeList()

        for (let l in lista) {
            for (let o in originals) {
                if (lista[l].codigo === originals[o].codigo) {
                    lista[l].valor = originals[o].valor
                    break
                }
            }
        }

        usuarioAtual.config.aparencia.temas.novo.props = lista
        tabfunApp.loadSelecteds()
        document.querySelector("div.app-newtheme-select").blur()
    },
    newTheme: () => {
        let name = document.querySelector("input.app-newtheme-name-input").value
        let desc = document.querySelector("textarea.app-newtheme-desc").value

        if (!name) {
            let ln = lang.get.selected()

            if (ln === "en") {
                alert("Enter a name to create a new theme!")
            } else {
                alert("Insira um nome para criar um novo tema!")
            }

            return
        }

        let infos = {
            nome: name,
            desc: desc,
            lista: usuarioAtual?.config.aparencia.temas.novo.props,
            codigo: code.new(16)
        }

        usuarioAtual.config.aparencia.temas.lista.push(infos)
        tabfunApp.closeThemePopup()
        tabfunApp.loadThemes()
        isDifferent()
    },
    selectTheme: (tema) => {
        if (!tema) {
            // Apenas carregar qual está selecionado
            let selecionado = usuarioAtual?.config.aparencia.temas.selecionado
            document.querySelectorAll("i.app-theme-box-select").forEach(i => {
                let v = i.getAttribute("theme")
                if (v === selecionado) {
                    i.classList.add("app-theme-selected")
                    i.classList.remove("far")
                    i.classList.add("fas")
                } else {
                    i.classList.remove("app-theme-selected")
                    i.classList.add("far")
                    i.classList.remove("fas")
                }
            })
        } else {
            usuarioAtual.config.aparencia.temas.selecionado = tema
            document.querySelectorAll("i.app-theme-box-select").forEach(i => {
                let v = i.getAttribute("theme")
                if (v === tema) {
                    i.classList.add("app-theme-selected")
                    i.classList.remove("far")
                    i.classList.add("fas")
                } else {
                    i.classList.remove("app-theme-selected")
                    i.classList.add("far")
                    i.classList.remove("fas")
                }
            })
        }

        isDifferent()
    },
    themeDelOpen: (codigo) => {
        document.querySelector("div.app-deltheme-space").classList.remove("hidden")
        document.querySelector("button.app-deltheme-confirm").setAttribute("onclick", `tabfunApp.themeDelConfirm('${codigo}')`)
    },
    themeDelConfirm: (codigo) => {
        if (usuarioAtual?.config.aparencia.temas.selecionado === codigo)
            usuarioAtual.config.aparencia.temas.selecionado = "dark"

        let lista = usuarioAtual?.config.aparencia.temas.lista
        for (let l in lista) {
            if (lista[l].codigo === codigo) {
                lista.splice(l, 1)
                break
            }
        }

        isDifferent()
        tabfunApp.loadThemes()
        tabfunApp.themeDelCancel()
        theme.set()
        tabfunApp.selectTheme()
    },
    themeDelCancel: () => {
        document.querySelector("div.app-deltheme-space").classList.add("hidden")
    },
    wall: {
        openPopup: () => {
            tabfunApp.wall.loadGallery()
            document.querySelector("div.set-wall-space").classList.remove("hidden")
        },
        closePopup: () => {
            document.querySelector("div.set-wall-space").classList.add("hidden")
            document.querySelector("input.set-wall-input").value = ""
        },
        loadGallery: () => {
            let container = document.querySelector("div.set-wall-gallery")
            container.innerHTML = ""
            let imagens = usuarioAtual?.galeria.imagem
            for (let i in imagens) {
                container.innerHTML += `
                <div class="set-wall-gallery-item def-ripple" title="${imagens[i].nome}" onclick="tabfunApp.wall.set('${imagens[i].url}')">
                    <img src="${imagens[i].url}" alt="Imagem não encontrada." en="Image not found." en-attr="alt">
                </div>
                `
            }

            if (imagens.length < 1) {
                container.innerHTML = `
                <div class="set-wall-gallery-noitems">
                    <span en="No images :(">Sem imagens na galeria :(</span>
                </div>
                `
            }

            def.update()
            lang.update("div.set-wall-gallery *")
        },
        load: () => {
            let url = usuarioAtual?.config.aparencia.fundo.url
            document.querySelector("div.app-setwall-left img").setAttribute("src", url)
        },
        set: (url) => {
            document.querySelector("input.set-wall-input").value = url
            document.querySelector("input.set-wall-input").focus()
        },
        confirm: () => {
            let url = document.querySelector("input.set-wall-input").value
            usuarioAtual.config.aparencia.fundo.url = url
            document.querySelector("div.app-setwall-left img").setAttribute("src", url)
            isDifferent()
            tabfunApp.wall.closePopup()
        },
        clear: () => {
            usuarioAtual.config.aparencia.fundo.url = ""
            document.querySelector("div.app-setwall-left img").setAttribute("src", "")
            isDifferent()
        },
        select: (selecionado, icon) => {
            if (!selecionado)
                selecionado = ""

            usuarioAtual.config.aparencia.fundo.selecionado = selecionado
            document.querySelectorAll("i.app-wall-box-select").forEach(i => {
                i.classList.remove("app-checked")
                i.classList.remove("fas")
                i.classList.add("far")
            })

            icon.classList.add("fas")
            icon.classList.remove("far")
            icon.classList.add("app-checked")

            isDifferent()
        },
        getSelected: () => {
            let selecionado = usuarioAtual?.config.aparencia.fundo.selecionado
            document.querySelectorAll("i.app-wall-box-select").forEach(i => {
                let codigo = i.getAttribute("codigo")

                if (codigo === selecionado) {
                    i.classList.add("app-checked")
                    i.classList.add("fas")
                    i.classList.remove("far")
                } else {
                    i.classList.remove("app-checked")
                    i.classList.remove("fas")
                    i.classList.add("far")
                }
            })
        },
        pack: {
            edit: {
                openPopup: () => {
                    usuarioAtual.config.aparencia.fundo.novo = {
                        imagens: [],
                        nome: "",
                        intervalo: 15,
                        opacidade: 1,
                        transicao: "fade"
                    }
                    document.querySelector("div.wallpack-space").classList.remove("hidden")
                    tabfunApp.wall.pack.edit.loadImages()
                    lang.update("div.wallpack-space *")
                },
                closePopup: () => {
                    delete usuarioAtual?.config.aparencia.fundo.novo
                    document.querySelector("input.wallpack-aditional-time-input").value = 15
                    document.querySelector("div.wallpack-aditional-transition-selector span").innerText = "Desaparecer"
                    document.querySelector("div.wallpack-aditional-transition-selector span").setAttribute("en", "Fade")
                    document.querySelector("input.wallpaper-opacity-slider").value = 100
                    document.querySelector("span.wallpaper-opacity-counter").innerText = 100
                    document.querySelector("div.wallpack-space").classList.add("hidden")
                    document.querySelectorAll("div.def-select-option").forEach(box => {
                        let v = box.getAttribute("optionvalue")
                        if (v === "fade") {
                            box.classList.add("selected")
                        } else {
                            box.classList.remove("selected")
                        }
                    })
                    tabfunApp.wall.pack.loadPacks()
                    tabfunApp.wall.getSelected()
                },
                confirm: () => {
                    let nome = document.querySelector("input.wallpack-name-input").value
                    if (!nome) {
                        let ln = lang.get.selected()

                        if (ln === "en") {
                            alert("Enter a name for the pack!")
                        } else {
                            alert("Insira um nome para o pacote!")
                        }
                        return
                    }

                    let intervalo = document.querySelector("input.wallpack-aditional-time-input").valueAsNumber
                    intervalo = parseInt(intervalo)
                    if (intervalo < 2)
                        intervalo = 2
                    let res = usuarioAtual?.config.aparencia.fundo.novo
                    res.codigo = code.new(14)
                    res.intervalo = intervalo
                    res.timestamp = getTime().timestamp
                    res.nome = nome
                    usuarioAtual.config.aparencia.fundo.pacotes.push(res)
                    tabfunApp.wall.pack.loadPacks()
                    tabfunApp.wall.pack.edit.closePopup()
                    isDifferent()
                },
                setOpacity: (o) => {
                    usuarioAtual.config.aparencia.fundo.novo.opacidade = o / 100
                },
                showOpacity: (v) => {
                    document.querySelector("span.wallpaper-opacity-counter").innerText = v
                },
                loadImages: () => {
                    let lista = usuarioAtual?.config.aparencia.fundo.novo.imagens
                    let container = document.querySelector("div.wallpack-list")
                    container.innerHTML = ""

                    for (let l in lista) {
                        container.innerHTML += `
                        <div class="walli-box">
                            <div class="walli-box-content">
                                <div class="walli-img-space">
                                    <img src="${lista[l].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt">
                                </div>
                                <div class="walli-info-space def-ellipsis">
                                    <div class="walli-title-space def-ellipsis" title="${lista[l].url}">
                                        <span>${lista[l].url}</span>
                                    </div>
                                    <div class="walli-option-space">
                                        <button class="walli-remove def-nwarn-button def-ripple" onclick="tabfunApp.wall.pack.edit.removeImage('${lista[l].id}')">
                                            <i class="fas fa-times"></i>
                                            <span en="Remove">Remover</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    }

                    if (lista.length < 1) {
                        container.innerHTML = `
                        <div class="wallpack-noitems">
                            <span en="No images added. Click on '+ New image' to add one."
                                >Sem imagens adicionadas. Clique em "+ Nova imagem" para adicionar uma.</span>
                        </div>
                        `
                    }

                    document.querySelector("span.wallpack-image-count").innerText = lista.length
                    lang.update("div.wallpack-list *")
                    def.update()
                },
                removeImage: (id) => {
                    let lista = usuarioAtual?.config.aparencia.fundo.novo.imagens
                    for (let l in lista) {
                        if (lista[l].id === id) {
                            lista.splice(l, 1)
                            break
                        }
                    }

                    tabfunApp.wall.pack.edit.loadImages()
                },
                setTransition: (box) => {
                    let value = box.getAttribute("optionvalue")
                    document.querySelectorAll("div.def-select-option").forEach(div => {
                        div.classList.remove("selected")
                    })
                    box.classList.add("selected")
                    document.querySelector("div.wallpack-aditional-transition-select").blur()
                    usuarioAtual.config.aparencia.fundo.novo.transicao = value
                    document.querySelector("div.wallpack-aditional-transition-selector span").innerText = box.getAttribute("optionname")
                }
            },
            newItem: () => {
                document.querySelector("div.addpack-space").classList.remove("hidden")
                tabfunApp.wall.pack.loadGalleryNewItem()
            },
            closeNewItem: () => {
                document.querySelector("div.addpack-space").classList.add("hidden")
                document.querySelector("input.addpack-image").value = ""
            },
            confirmNewItem: () => {
                let url = document.querySelector("input.addpack-image").value

                if (!url) {
                    let ln = lang.get.selected()

                    if (ln === "en") {
                        console.log("Enter a valid URL!")
                    } else {
                        console.log("Insira uma URL válida!")
                    }

                    return
                }

                let valid = () => {
                    let obj = {
                        url: url,
                        id: code.new(10)
                    }

                    usuarioAtual.config.aparencia.fundo.novo.imagens.push(obj)
                    tabfunApp.wall.pack.closeNewItem()
                    tabfunApp.wall.pack.edit.loadImages()
                }
    
                let invalid = () => {
                    let ln = lang.get.selected()
    
                    if (ln === "en") {
                        alert("Image not found. Verify if the entered URL is valid.")
                    } else {
                        alert("Imagem não encontrada. Verifique se a URL inserida é válida!")
                    }
                }
    
                let test = () => {
                    let f = new Image()
                    f.onload = valid
                    f.onerror = invalid
                    f.src = url
                }
                test()
            },
            loadGalleryNewItem: () => {
                let container = document.querySelector("div.addpack-gallery")
                container.innerHTML = ""
                let imagens = usuarioAtual?.galeria.imagem
                for (let i in imagens) {
                    container.innerHTML += `
                    <div class="addpack-item def-ripple" title="${imagens[i].nome}" onclick="tabfunApp.wall.pack.setNewItem('${imagens[i].url}')">
                        <img src="${imagens[i].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt">
                    </div>
                    `
                }

                if (imagens.length < 1) {
                    container.innerHTML = `
                    <div class="addpack-noitems">
                        <span en="No gallery images :(">Sem imagens na galeria :(</span>
                    </div>
                    `
                }

                lang.update("div.addpack-gallery *")
                def.update()
            },
            setNewItem: (url) => {
                document.querySelector("input.addpack-image").value = url
                document.querySelector("input.addpack-image").focus()
            },
            loadPacks: () => {
                let lista = usuarioAtual?.config.aparencia.fundo.pacotes
                let container = document.querySelector("div.app-walls-list")
                container.innerText = ""
                let get = {
                    packPreview: (l) => {
                        if (lista[l].imagens.length >= 2) {
                            return `
                                <img src="${lista[l].imagens[0].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt" class="app-wall-thumb app-wall-box-image-1">
                                <img src="${lista[l].imagens[1].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt" class="app-wall-thumb app-wall-box-image-2">
                            `
                        } else if (lista[l].imagens.length === 1) {
                            return `
                                <img src="${lista[l].imagens[0].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt" class="app-wall-thumb app-wall-box-image-1">
                            `
                        } else {
                            return `<i class="fas fa-brush"></i>`
                        }
                    },
                    createdTime: (timestamp) => {
                        return getTime(timestamp).string.data
                    }
                }
                for (let l in lista) {
                    container.innerHTML += `
                    <div class="app-wall-box">
                        <div class="app-wall-box-content">
                            <div class="app-wall-box-top">
                                <div class="app-wall-box-left">
                                    <div class="app-wall-box-infos">
                                        <div class="app-wall-box-infos-image-space">
                                            ${get.packPreview(l)}
                                        </div>
                                        <div class="app-wall-box-infos-info-space">
                                            <div class="app-wall-box-name">
                                                <span>${lista[l].nome}</span>
                                            </div>
                                            <div class="app-wall-box-count-space">
                                                <span class="app-wall-box-count-around">
                                                    <span class="app-wall-box-count">${lista[l].imagens.length}</span>
                                                    <span class="app-wall-box-count-after" en="images">imagens</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="app-wall-box-right">
                                    <i class="fas fa-trash app-wall-box-remove def-ripple warn-color" onclick="tabfunApp.wall.delPack.open('${lista[l].codigo}')"></i>
                                    <i class="far fa-check-square app-wall-box-select" onclick="tabfunApp.wall.select('${lista[l].codigo}', this)" codigo="${lista[l].codigo}"></i>
                                </div>
                            </div>
                            <div class="app-wall-box-bottom">
                                <span class="app-wall-box-created-around">
                                    <span class="app-wall-box-created-before" en="Created at">Criado em</span>
                                    <span class="app-wall-box-created">${get.createdTime(lista[l].timestamp)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    `
                }

                if (lista.length < 1) {
                    container.innerHTML = `
                        <div class="wallpack-noitems">
                            <span en="You don't have wallpaper packs."
                                >Você não tem pacotes de papel de parede.</span>
                        </div>
                    `
                }

                lang.update("div.app-walls-list *")
                def.update()
            }
        },
        delPack: {
            open: (codigo) => {
                document.querySelector("div.delpack-space").classList.remove("hidden")
                document.querySelector("button.delpack-confirm").setAttribute("onclick", `tabfunApp.wall.delPack.confirm('${codigo}')`)
            },
            close: () => {
                document.querySelector("div.delpack-space").classList.add("hidden")
            },
            confirm: (codigo) => {
                let lista = usuarioAtual?.config.aparencia.fundo.pacotes
                for (let l in lista) {
                    if (lista[l].codigo === codigo) {
                        lista.splice(l, 1)
                        break
                    }
                }
                if (usuarioAtual?.config.aparencia.fundo.selecionado === codigo)
                    usuarioAtual.config.aparencia.fundo.selecionado = ""
                isDifferent()
                tabfunApp.wall.pack.loadPacks()
                tabfunApp.wall.getSelected()
                tabfunApp.wall.delPack.close()
            }
        }
    }
}


// FUNÇÕES DA PÁGINA
function toggle(toggler) {
    let ativo = false
    for (let t = 0; t < toggler.classList.length; t++) {
        if (toggler.classList[t].toString() === "def-active-toggle") {
            ativo = true
            break
        }
    }
    if (!ativo) {
        toggler.classList.add("def-active-toggle")
    } else {
        toggler.classList.remove("def-active-toggle")
    }
}

var tabs = {
    load: () => {
        let tabList = sBackend.get.settingsList()
        let container = document.querySelector("div.page-tab-list")
        container.innerHTML = ""
        for (let t = 0; t < tabList.length; t++) {
            container.innerHTML += `
            <div class="settings-tab def-tab def-ripple" tab-id="${tabList[t].codigo}" onclick="tabs.select('${tabList[t].codigo}')">
                <div class="settings-tabicon def-tab-icon">
                    <i class="${tabList[t].icone}"></i>
                </div>
                <div class="settings-tabname def-tab-name">
                    <span en="${tabList[t].nome.en}">${tabList[t].nome.pt}</span>
                </div>
            </div>
            `
        }

        lang.update("div.page-tab-list *")
    },
    select: (codigo) => {
        if (!codigo) {
            codigo = param.get("selected-tab")
            if (!codigo) {
                codigo = "geral"
            }
        }

        let lista = tabs.list
        let existe = false
        for (let l = 0; l < lista.length; l++) {
            if (lista[l].codigo === codigo) {
                existe = true
                break
            }
        }
        if (!existe) {
            codigo = "geral"
        }

        param.set("selected-tab", codigo)

        document.querySelectorAll("div.settings-tab").forEach(tab => {
            let code = tab.getAttribute("tab-id")
            if (code === codigo) {
                tab.classList.add("def-sel-tab")
            } else {
                tab.classList.remove("def-sel-tab")
            }
        })

        let selected
        for (let l = 0; l < lista.length; l++) {
            if (lista[l].codigo === codigo) {
                selected = lista[l]
                break
            }
        }

        document.querySelectorAll("div.set-tab-content").forEach(tb => {
            let id = tb.getAttribute("tab-name")
            if (id === codigo) {
                tb.classList.remove("hidden")
            } else {
                tb.classList.add("hidden")
            }
        })

        document.querySelector("div.page-right-header-title").innerHTML = `<h1 en="${selected.nome.en}">${selected.nome.pt}</h1>`
        document.querySelector("div.page-right-header-subtitle").innerHTML = `<span en="${selected.descricao.en}">${selected.descricao.pt}</span>`

        // Carregar informações da guia
        if (codigo === "geral") {
            tabfunGeral.carregar()
        }

        if (codigo === "perfil") {
            document.querySelector("input.set-profile-name-input").value = usuarioAtual?.nome
            document.querySelector("img.stpc-image").setAttribute("src", usuarioAtual?.avatar)
            document.querySelector("img.stcb-image").setAttribute("src", usuarioAtual?.banner)
            document.querySelector("textarea.set-profile-custom-bio-type").value = usuarioAtual?.biografia

            let viewAchievements = !usuarioAtual?.config.perfil.conquistas
            let tg1 = document.querySelector("div.show-achievements-toggler")
            tg1.setAttribute("active", viewAchievements)
            defFunctions.toggler(tg1)

            let viewBadges = !usuarioAtual?.config.perfil.distintivos
            let tg2 = document.querySelector("div.show-badges-toggler")
            tg2.setAttribute("active", viewBadges)
            defFunctions.toggler(tg2)

            tabfunPerfil.countChars()
            tabfunPerfil.showPosts()
            tabfunPerfil.showBio()
        }

        if (codigo === "seguranca") {
            tabfunSeg.load()
        }

        if (codigo === "preferencias") {
            tabfunPref.load()
        }

        if (codigo === "aparencia") {
            tabfunApp.loadThemes()
            tabfunApp.selectTheme()
            theme.set()
            tabfunApp.wall.load()
            tabfunApp.wall.pack.loadPacks()
            tabfunApp.wall.getSelected()
        }

        lang.update("div.page-right *")
        def.update()
    },
    list: sBackend.get.settingsList()
}
tabs.load()
tabs.select()

async function voltar(lugar) {
    // Verificar se existem alterações
    let diferente = await sBackend.compare(usuarioAtual)

    if (diferente.length > 0) {
        let ln = lang.get.selected()
        if (ln === "en") {
            var c = confirm("Hey! You have unsaved changes yet. Are you sure you want to continue?")
        } else {
            var c = confirm("Ei! Você ainda tem alterações que não foram salvas. Tem certeza de que deseja continuar?")
        }

        if (!c)
            return

        let original = sBackend.get.originals(usuarioAtual?.codigo)
        usuarioAtual = original
    }
    await db.rede.save()
    local.set(lugar, param.list.select(["lang"]))
}

var botaoVoltar = {
    mover: () => {
        document.querySelector("div.page-left-back").classList.add("moved-page-left-back")
    },
    desmover: () => {
        document.querySelector("div.page-left-back").classList.remove("moved-page-left-back")
    }
}

function isDifferent() {
    let dif = sBackend.compare(usuarioAtual)

    if (dif.length > 0) {
        document.querySelector("div.not-saved").classList.remove("hidden")
    } else {
        document.querySelector("div.not-saved").classList.add("hidden")
    }
}

async function saveChanges() {
    let infos = faceBackend.get.user.infos(usuarioAtual?.codigo).nome
    if (infos !== usuarioAtual?.nome) {
        conquista.nova("identidade", usuarioAtual?.codigo)
    }
    let saving = await sBackend.request.saveChanges(usuarioAtual)
    db.set("usuarioAtual", usuarioAtual)
    if (!saving) {
        let ln = lang.get.selected()
        if (ln === "en") {
            alert("We couldn't save changes. If the problem persists, contact us via feedback page.")
        } else {
            alert("Não foi possível salvar alterações. Se o problema persistir, contate-nos através da página de feedback.")
        }

        return
    }

    // Carregar
    theme.set()
    lang.update()
    isDifferent()
}

function cancelChanges() {
    usuarioAtual = sBackend.get.revert(usuarioAtual?.codigo)
    let page = param.get("selected-tab")
    tabs.select(page)
    isDifferent()
}