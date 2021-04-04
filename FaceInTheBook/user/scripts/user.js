var visitando = usrBackend.get.visiting(param.get("visiting"))

if (!visitando) {
    document.querySelector("div.usernotfound").classList.remove("hidden")
    document.querySelector("html").classList.add("no-scroll")
}

var animations = {
    background: (pos) => {
        document.querySelector("div.page-background img").style.transform = `translateY(-${0.15 * pos}px)`
        let opc = 1 - (pos / 4000)
        document.querySelector("div.page-background img").style.opacity = opc
    }
}
animations.background(document.querySelector("html").scrollTop)

function atualizar() {
    loadDefs()

    let dono = usuarioAtual?.codigo === visitando?.codigo

    if (!dono) {
        document.querySelectorAll(".usr-owner").forEach(ow => {
            ow.remove()
        })
    }

    if (!visitando.config.perfil.conquistas && usuarioAtual?.codigo !== visitando?.codigo) {
        document.querySelectorAll("div.user-page-topic-achievement").forEach(g => {
            g.remove()
        })
    }

    document.querySelector("div.page-background").innerHTML = `<img src="${visitando.banner}">`
    document.querySelector("span.user-page-name").innerText = visitando.nome
    document.querySelector("img.user-page-avatar").setAttribute("src", visitando.avatar)
    let last = usrBackend.get.user.lastAchievement(visitando.codigo)
    if (visitando.config.perfil.conquistas || usuarioAtual?.codigo === visitando?.codigo) {
        if (last) {
            let conq = achievement.get.list(last.codigo)
            document.querySelector("div.user-page-topic-last-achievement").innerHTML = `
            <div class="user-page-achievement user-page-achievement-${conq.tipo}">
                <div class="user-achievement">
                    <div class="user-achievement-content">
                        <div class="user-achievement-left">
                            <div class="user-achievement-icon-space">
                                <img src="${conq.foto}" class="user-achievement-icon">
                            </div>
                        </div>
                        <div class="user-achievement-right">
                            <div class="user-achievement-title-space">
                                <span class="user-achievement-title" en="${conq.titulo.en}">${conq.titulo.pt}</span>
                            </div>
                            <div class="user-achievement-desc-space">
                                <span class="user-achievement-desc" en="${conq.descricao.en}">${conq.descricao.pt}</span>
                            </div>
                            <div class="user-achievement-gettime-space">
                                <span en="Obtained on">Obtido em</span>
                                <span class="user-achievement-gettime">${getTime(last.horario).string.data}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        } else {
            document.querySelector("div.user-page-topic-last-achievement").innerHTML = `
                <span class="user-page-no-achievements" en="This user has no achievements to show :("
                    >Este usuário não tem conquistas para mostrar :(</span>
            `
        }
    }

    let isFriend = usrBackend.get.user.friendInfo()

    if (!isFriend) {
        document.querySelector("div.user-page-options").remove()
    } else {
        if (isFriend === "friend") {
            document.querySelector("button.user-page-add").classList.remove("friend")
            document.querySelector("button.user-page-add").classList.remove("sent")
            document.querySelector("button.user-page-add").classList.remove("received")
            document.querySelector("button.user-page-add").classList.remove("none")

            document.querySelector("button.user-page-add").innerHTML = `
                <i class="fas fa-user-check"></i>
                <span en="Friends">Amigos</span>
            `
            document.querySelector("button.user-page-add").setAttribute("onclick", "friendRequest.removeFriend()")
        } else if (isFriend === "sent") {
            document.querySelector("button.user-page-add").classList.remove("friend")
            document.querySelector("button.user-page-add").classList.remove("sent")
            document.querySelector("button.user-page-add").classList.remove("received")
            document.querySelector("button.user-page-add").classList.remove("none")

            document.querySelector("button.user-page-add").innerHTML = `
                <i class="fas fa-user-slash"></i>
                <span en="Cancel friend request">Cancelar solicitação de amizade</span>
            `
            document.querySelector("button.user-page-add").setAttribute("onclick", "friendRequest.cancelRequest()")
        } else if (isFriend === "received") {
            document.querySelector("button.user-page-add").classList.remove("friend")
            document.querySelector("button.user-page-add").classList.remove("sent")
            document.querySelector("button.user-page-add").classList.remove("received")
            document.querySelector("button.user-page-add").classList.remove("none")

            document.querySelector("button.user-page-add").innerHTML = `
                <i class="fas fa-user-plus"></i>
                <span en="Accept friend request">Aceitar solicitação de amizade</span>
            `
            document.querySelector("button.user-page-add").setAttribute("onclick", "friendRequest.acceptRequest()")
        } else if (isFriend === "none") {
            document.querySelector("button.user-page-add").classList.remove("friend")
            document.querySelector("button.user-page-add").classList.remove("sent")
            document.querySelector("button.user-page-add").classList.remove("received")
            document.querySelector("button.user-page-add").classList.remove("none")

            document.querySelector("button.user-page-add").innerHTML = `
                <i class="fas fa-paper-plane"></i>
                <span en="Send friend request">Enviar solicitação de amizade</span>
            `
            document.querySelector("button.user-page-add").setAttribute("onclick", "friendRequest.sendRequest()")
        }
        document.querySelector("button.user-page-add").classList.add(isFriend)

        lang.update("div.user-page-options *")
    }
    
    let biografia = visitando?.biografia?.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")

    if (!biografia) {
        document.querySelector("span.user-page-bio").innerHTML = `<span en="We don't know much about them, but we are sure that he is a cool person."
            >Não sabemos muito sobre este usuário, mas temos certeza de que ele é uma pessoa legal.</span>`
    } else {
        document.querySelector("span.user-page-bio").innerHTML = biografia
    }

    lang.update()
}
atualizar()

async function voltar() {
    await db.rede.save()
    local.set("../../main/pages/principal.html", param.list.select["lang"])
}

var friendRequest = {
    sendRequest: () => {
        faceBackend.request.friend.request.send(usuarioAtual?.codigo, visitando.codigo)
        atualizar()
    },
    cancelRequest: () => {
        faceBackend.request.friend.request.cancel(usuarioAtual?.codigo, visitando.codigo)
        atualizar()
    },
    acceptRequest: () => {
        faceBackend.request.friend.request.accept(usuarioAtual?.codigo, visitando.codigo)
        atualizar()
    },
    removeFriend: () => {
        faceBackend.request.friend.remove(usuarioAtual?.codigo, visitando.codigo)
        atualizar()
    }
}

function loadDefs() {
    document.querySelectorAll(".usr-name").forEach(elm => {
        elm.innerText = visitando?.nome
    })

    document.querySelectorAll("img.usr-avatar").forEach(img => {
        img.setAttribute("src", visitando?.avatar)
    })
}
loadDefs()

function showToolName(div) {
    let nome = div.getAttribute("tool-name")
    
    document.querySelector("span.user-page-npf-add-name").classList.add("hidden-upnpfan")
    document.querySelector("span.user-page-npf-add-name").innerText = nome
    setTimeout(() => {
        document.querySelector("span.user-page-npf-add-name").classList.remove("hidden-upnpfan")
    }, 10)
}

function focusFilter() {
    document.querySelector("div.uppl-post-filter-select").focus()
}

var newUsrPost = {
    clearText: () => {
        if (visitando?.codigo !== usuarioAtual?.codigo)
            return

        document.querySelector("textarea.user-page-npf-typing").value = ""
        document.querySelector("textarea.user-page-npf-typing").focus()
        newUsrPost.count()
    },
    count: () => {
        if (visitando?.codigo !== usuarioAtual?.codigo)
            return

        let length = document.querySelector("textarea.user-page-npf-typing").value.trim().length
        document.querySelector("span.user-page-np-form-keycount").innerHTML = length

        if (length < 1 || length > 1250) {
            document.querySelector("span.user-page-np-form-keycount-around").classList.add("user-page-np-wrong")
        } else {
            document.querySelector("span.user-page-np-form-keycount-around").classList.remove("user-page-np-wrong")
        }
    },
    toggleTools: (btn) => {
        let t = btn.getAttribute("view")

        if (t === "hidden") {
            document.querySelector("div.user-page-npf-add-body").classList.remove("hidden")
            btn.setAttribute("view", "visible")
        } else {
            document.querySelector("div.user-page-npf-add-body").classList.add("hidden")
            btn.setAttribute("view", "hidden")
        }
    },
    sendImage: (url) => {
        document.querySelector("div.user-page-npf-media-space").setAttribute("media-type", "img")
        document.querySelector("div.user-page-npf-media-space").setAttribute("media-url", url)
        document.querySelector("div.user-page-npf-media-space").classList.remove("hidden")
        document.querySelector("div.user-page-npf-media-body").innerHTML = `<img src="${url}" alt="Imagem não encontrada." en="Image not found" en-attr="alt" class="user-page-npf-md"></img>`
        document.querySelector("span.user-page-npf-media-url").innerText = url
        document.querySelector("span.user-page-npf-media-url").setAttribute("title", url)
    },
    sendVideo: (url) => {
        document.querySelector("div.user-page-npf-media-space").setAttribute("media-type", "vid")
        document.querySelector("div.user-page-npf-media-space").setAttribute("media-url", url)
        document.querySelector("div.user-page-npf-media-space").classList.remove("hidden")
        document.querySelector("div.user-page-npf-media-body").innerHTML = `
            <video class="user-page-npf-md" controls>
                <source src="${url}" type="video/mp4">
            </video>
        `
        document.querySelector("span.user-page-npf-media-url").innerText = url
        document.querySelector("span.user-page-npf-media-url").setAttribute("title", url)
    },
    removeMedia: () => {
        document.querySelector("div.user-page-npf-media-space").removeAttribute("media-type")
        document.querySelector("div.user-page-npf-media-space").removeAttribute("media-url")
        document.querySelector("div.user-page-npf-media-space").classList.add("hidden")
        document.querySelector("span.user-page-npf-media-url").innerText = "Mídia"
    },
    image: {
        open: () => {
            document.querySelector("div.post-image-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
        },
        close: () => {
            document.querySelector("div.post-image-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
            document.querySelector("input.post-image-input").value = ""
            document.querySelector("div.post-image-prev-space").classList.add("hidden")
        },
        confirm: () => {
            let url = document.querySelector("input.post-image-input").value
            newUsrPost.sendImage(url)
            newUsrPost.image.close()
        },
        loadPreview: (url) => {
            document.querySelector("div.post-image-prev-around img").setAttribute("src", url)

            if (url) {
                document.querySelector("div.post-image-prev-space").classList.remove("hidden")
            } else {
                document.querySelector("div.post-image-prev-space").classList.add("hidden")
            }
        }
    },
    gallery: {
        open: () => {
            document.querySelector("div.galsend-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")

            let container = document.querySelector("div.galsend-list")
            container.innerHTML = ""

            let lista = usuarioAtual?.galeria.imagem

            for (let l in lista) {
                container.innerHTML += `
                <div class="galsend-item def-ripple" title="${lista[l].nome}" onclick="newUsrPost.sendImage('${lista[l].url}'); newUsrPost.gallery.close()">
                    <img src="${lista[l].url}">
                </div>
                `
            }

            def.update()
        },
        close: () => {
            document.querySelector("div.galsend-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        }
    },
    video: {
        open: () => {
            document.querySelector("div.post-video-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
        },
        close: () => {
            document.querySelector("div.post-video-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        },
        confirm: () => {
            let url = document.querySelector("input.post-video-input").value
            newUsrPost.sendVideo(url)
            newUsrPost.video.close()
        }
    }
}
newUsrPost.count()

var userPosts = {
    load: () => {
        let postagens = usrBackend.get.user.posts(usuarioAtual?.codigo, visitando?.codigo)
        let container = document.querySelector("div.user-page-postlist")
        container.innerHTML = ""
        let res = postagens
        document.querySelector("span.user-page-post-count").innerHTML = res.length

        let get = {
            isToday: (timestamp) => {
                let ant = getTime(timestamp)
                let now = getTime()

                if (ant.dia === now.dia && ant.mes === now.mes && ant.ano === now.ano) {
                    return `
                        <span class="uppost-date" en="Today at">Hoje às</span>
                        <span class="uppost-time">${getTime(timestamp).string.hora.normal}</span>
                    `
                }

                return `
                    <span class="uppost-time">${getTime(ant.timestamp).string.data}</span>
                `
            },
            postMedia: (midiaObj) => {
                if (midiaObj.url) {
                    if (midiaObj.tipo === "img") {
                        return `<img src="${midiaObj.url}" class="uppost-media">`
                    } else if (midiaObj.tipo === "vid") {
                        return `
                            <video class="uppost-media" controls>
                                <source src="${midiaObj.url}" type="video/mp4">
                            </video>
                        `
                    }
                } else {
                    return ""
                }
            },
            isLiked: (likeList) => {

            },
            isDisliked: (dislikeList) => {}
        }

        for (let p = 0; p < res.length; p++) {
            let infos = faceBackend.get.user.infos(res[p].por)

            container.innerHTML += `
            <div class="uppost">
                <div class="uppost-content">
                    <div class="uppost-header">
                        <div class="uppost-header-content">
                            <div class="uppost-header-infos">
                                <div class="uppost-photo-space">
                                    <img src="${infos.avatar}" class="uppost-photo">
                                </div>
                                <div class="uppost-post-infos-space">
                                    <div class="uppost-name-space">
                                        <span class="uppost-name">${infos.nome}</span>
                                    </div>
                                    <div class="uppost-time-space">
                                        <span class="uppost-time-around def-title" titulo="${getTime(res[p].timestamp).string.default}">
                                            ${get.isToday(res[p].timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="uppost-post-options">
                                <i class="fas fa-trash uppost-delete def-title ${usuarioAtual?.codigo === visitando?.codigo ? "" : "hidden"}" titulo="Excluir postagem" en="Delete post" en-attr="titulo" onclick="userPosts.delete.open('${res[p].codigo}')"></i>
                            </div>
                        </div>
                    </div>
                    <div class="uppost-body">
                        <div class="uppost-body-content">
                            <div class="uppost-text-space">
                                ${res[p].conteudo.texto.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")}
                            </div>
                            <div class="uppost-media-space">
                                ${get.postMedia(res[p].conteudo.midia)}
                            </div>
                        </div>
                    </div>
                    <div class="uppost-bottom">
                        <div class="uppost-bottom-content">
                            <div class="uppost-rate">
                                <i class="far fa-arrow-alt-circle-up ${get.isLiked(res[p].avaliacoes.gostei)}"></i>
                                <span class="uppost-rate-count">${res[p].avaliacoes.gostei.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        if (res.length < 1) {
            container.innerHTML = `<span class="no-user-posts" en="Hmm... sorry, but this user didn't post yet or you don't have permission to see it."
                >Humm... foi mal, mas este usuário ainda não fez postagens ou você não tem permissão para vê-las.</span>`
        }

        lang.update("div.user-page-postlist *")
    },
    delete: {
        open: (codigo) => {
            if (usuarioAtual?.codigo !== visitando?.codigo)
                return

            document.querySelector("button.delpost-confirm").setAttribute("onclick", `userPosts.delete.confirm('${codigo}')`)
            document.querySelector("div.delpost-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
        },
        close: () => {
            document.querySelector("div.delpost-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        },
        confirm: (codigo) => {
            usrBackend.request.delPost(codigo)
            userPosts.delete.close()
            userPosts.load()
        }
    }
}
userPosts.load()

function sendPost() {
    let newPost = {
        por: usuarioAtual?.codigo,
        conteudo: {
            texto: document.querySelector("textarea.user-page-npf-typing").value.trim(),
            midia: {
                url: document.querySelector("div.user-page-npf-media-space").getAttribute("media-url"),
                tipo: document.querySelector("div.user-page-npf-media-space").getAttribute("media-type")
            }
        }
    }

    if (!newPost.conteudo.texto) {
        if (!newPost.conteudo.midia.url) {
            let ln = lang.get.selected()

            if (ln === "en") {
                alert("Can't make the post: No content.")
            } else {
                alert("Não foi possível fazer a postagem: Nenhum conteúdo inserido.")
            }
            return
        }
    }

    if (!newPost.conteudo.texto.length > 1250) {
        let ln = lang.get.selected()

        if (ln === "en") {
            alert("Can't make the post: Limit of 1250 characters reached.")
        } else {
            alert("Não foi possível fazer postagem: A postagem ultrapassa o limite de 1250 caracteres.")
        }
        return
    }

    let posting = usrBackend.request.post(newPost)
    if (!posting) {
        let ln = lang.get.selected()
        if (ln === "en") {
            alert("An error ocurred while posting. Try again later and if the problem persists, contact us via feedback page.")
        } else {
            alert("Ocorreu um erro ao fazer a postagem. Tente novamente mais tarde e se o problema persistir, contate-nos através da página de feedback.")
        }

        return
    }

    userPosts.load()
    newUsrPost.clearText()
    newUsrPost.removeMedia()
}