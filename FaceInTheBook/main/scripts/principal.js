function showPopup() {
    if (!usuarioAtual || !usuarioAtual.nome) {

    }
}
showPopup()

var principal = {
    scrollAnimation: (pos) => {
        let lastMove = parseFloat(document.querySelector("body").getAttribute("scroll-position"))
        let newPos = pos - lastMove
        let stylePosition = parseFloat(document.querySelector("div.page-header-space").style.transform.replace("translateY(", "").replace("px)", ""))

        if (stylePosition > -50 && newPos > 0) {
            if (stylePosition - newPos < -50) {
                document.querySelector("div.fb-social-space").style.marginTop = "-50px"
            } else {
                document.querySelector("div.fb-social-space").style.marginTop = `${stylePosition - newPos}px`
            }
        } else if (stylePosition < 0 && newPos < 0) {
            if (stylePosition - newPos > 0) {
                document.querySelector("div.fb-social-space").style.marginTop = "0"
            } else {
                document.querySelector("div.fb-social-space").style.marginTop = `${stylePosition - newPos}px`
            }
        }
    }
}

var atualizar = {
    notLogged: {
        close: () => {
            param.set("logged", "hidden")
            return atualizar.notLogged.update()
        },
        update: () => {
            let is = param.get("logged")

            if (!is) {

                let isLog = backend.get.user.isLogged()
                param.set("logged", isLog.toString())
                return atualizar.notLogged.update()

            } else {

                if (is === "true") {
                    let isLog = backend.get.user.isLogged()
                    if (!isLog) {
                        param.set("logged", "false")
                        return atualizar.notLogged.update()
                    }

                    document.querySelector("div.not-logged-space").classList.add("hidden")
                } else if (is === "false") {
                    let isLog = backend.get.user.isLogged()
                    if (isLog) {
                        param.set("logged", "true")
                        return atualizar.notLogged.update()
                    }

                    document.querySelector("div.not-logged-space").classList.remove("hidden")
                } else if (is === "hidden") {
                    document.querySelector("div.not-logged-space").classList.add("hidden")
                }

            }
        }
    },
    filtroPost: (select) => {
        let selecionado = select.getAttribute("filter-value")
        document.querySelectorAll("div.filter-box").forEach(f => {
            f.classList.remove("selected")
        })
        select.classList.add("selected")
        document.querySelector("div.posts-filter-content").setAttribute("value", selecionado)
        document.querySelector("div.posts-filter-content").focus()
        param.set("filter", selecionado)
        post.load.all()
    },
    ordemPost: (select) => {
        let selecionado = select.getAttribute("order-value")
        document.querySelectorAll("div.order-box").forEach(o => {
            o.classList.remove("selected")
        })
        select.classList.add("selected")
        document.querySelector("div.posts-order-content").setAttribute("value", selecionado)
        document.querySelector("div.posts-order-content").focus()
        param.set("sort", selecionado)
        post.load.all()
    },
    ordemRespostas: (select) => {
        let selecionado = select.getAttribute("order-value")
        document.querySelectorAll("div.post-answers-order-box").forEach(o => {
            o.classList.remove("selected")
        })
        select.classList.add("selected")
        document.querySelector("div.post-answers-view-around").setAttribute("value", selecionado)
        document.querySelector("div.post-answers-view-around").focus()
        param.set("reply-sort", selecionado)
        let codigo = document.querySelector("div.post-answers-view-around").getAttribute("post-code")
        post.load.replies(codigo)
    },
    avisoPost: (opcao) => {
        let inp = document.querySelector(opcao)
        inp.checked = !inp.checked
    },
    guiaSocial: () => {
        let selected = param.get("social-tab")
        if (!selected) {
            selected = "social"
            param.set("social-tab", selected)
        }

        let tabs = document.querySelectorAll("div.fbs-tab")
        for (let t = 0; t < tabs.length; t++) {
            if (tabs[t].getAttribute("value") === selected) {
                selectTab(tabs[t])
                break
            }
        }
    },
    param: () => {
        let sort = param.get("sort") || "newest"
        param.set("sort", sort)
        document.querySelector("div.posts-order-content").setAttribute("value", sort)
        let sortBox = document.querySelectorAll("div.order-box")
        for (let f = 0; f < sortBox.length; f++) {
            if (sortBox[f].getAttribute("order-value") === sort) {
                sortBox[f].classList.add("selected")
            } else {
                sortBox[f].classList.remove("selected")
            }
        }

        let filter = param.get("filter") || "none"
        param.set("filter", filter)
        document.querySelector("div.posts-filter-content").setAttribute("value", filter)
        let filterBox = document.querySelectorAll("div.filter-box")
        for (let f = 0; f < filterBox.length; f++) {
            if (filterBox[f].getAttribute("filter-value") === filter) {
                filterBox[f].classList.add("selected")
            } else {
                filterBox[f].classList.remove("selected")
            }
        }
    }
}
atualizar.param()
atualizar.guiaSocial()

function carregar() {
    atualizar.notLogged.update()
    document.querySelectorAll("div.filter-box").forEach(f => {
        f.setAttribute("onclick", "atualizar.filtroPost(this)")
    })
    document.querySelectorAll("div.order-box").forEach(o => {
        o.setAttribute("onclick", "atualizar.ordemPost(this)")
    })
}
carregar()

var post = {
    options: () => {
        document.querySelector("div.post-options-space").focus()
    },
    clear: () => {
        document.querySelector("textarea.newpost-text").value = ""
        document.querySelector("textarea.newpost-text").focus()
        document.querySelector("i.newpost-clear").classList.add("hidden")
        post.watchText(document.querySelector("textarea.newpost-text"))
        document.querySelectorAll("input.post-options-box-checkbox").forEach(inp => {
            inp.checked = false
        })
    },
    visibleClearButton: (mensagem) => {
        mensagem = mensagem.trim()

        if (mensagem) {
            document.querySelector("i.newpost-clear").classList.remove("hidden")
        } else {
            document.querySelector("i.newpost-clear").classList.add("hidden")
        }
    },
    watchText: (textarea) => {
        let texto = textarea.value
        texto = texto.trim()

        post.visibleClearButton(texto)
        document.querySelector("span.newpost-counter").innerHTML = texto.length

        if (texto.length < 1 || texto.length > 1250) {
            document.querySelector("span.newpost-counter-around").classList.add("invalid-newpost-counter-around")
        } else {
            document.querySelector("span.newpost-counter-around").classList.remove("invalid-newpost-counter-around")
        }
    },
    changeType: (sel) => {
        let v = sel.value

        document.querySelector("span.newpost-type-text").classList.add("newpost-type-text-change")

        if (v === "public") {
            document.querySelector("span.newpost-type-text").setAttribute("en", "Anyone can see this post")
            document.querySelector("span.newpost-type-text").innerHTML = `Todos podem ver esta postagem`
        } else if (v === "private") {
            document.querySelector("span.newpost-type-text").setAttribute("en", "Only friends can see this post")
            document.querySelector("span.newpost-type-text").innerHTML = `Apenas amigos podem ver esta postagem`
        } else if (v === "unlisted") {
            document.querySelector("span.newpost-type-text").setAttribute("en", "Only you can see this post")
            document.querySelector("span.newpost-type-text").innerHTML = `Apenas você pode ver esta postagem`
        }

        lang.update("span.newpost-type-text")
        setTimeout(() => {
            document.querySelector("span.newpost-type-text").classList.remove("newpost-type-text-change")
        }, 0)
    },
    search: {
        searchInput: (inp) => {
            if (!inp)
                inp = document.querySelector("input.page-posts-search")

            let txt = inp.value


            if (!txt) {
                inp.classList.remove("no-radius")
                document.querySelector("button.page-posts-search-clear").classList.add("hidden")
            } else {
                inp.classList.add("no-radius")
                document.querySelector("button.page-posts-search-clear").classList.remove("hidden")
            }
        },
        clearInput: (btn) => {
            if (!btn)
                btn = document.querySelector("button.page-posts-search-clear")

            btn.classList.add("hidden")
            document.querySelector("input.page-posts-search").value = ""
            document.querySelector("input.page-posts-search").focus()
            post.search.searchInput()
        }
    },
    postTools: {
        open: (btn) => {
            btn.setAttribute("onclick", "post.postTools.close(this)")
            document.querySelector("div.posttools-tools-space").classList.remove("hidden")
        },
        close: (btn) => {
            btn.setAttribute("onclick", "post.postTools.open(this)")
            document.querySelector("div.posttools-tools-space").classList.add("hidden")
        },
        loadNames: () => {
            document.querySelectorAll("div.pttool").forEach(div => {
                div.addEventListener("mouseover", (e) => {
                    post.postTools.showName(e.target)
                })
                div.addEventListener("blur", () => {
                    post.postTools.hideName()
                })
            })
        },
        showName: (div) => {
            let texto = div.getAttribute("tool-name")
            div.focus()
            if (texto) {
                document.querySelector("span.posttool-name").innerHTML = texto
            }

            document.querySelector("span.posttool-name").classList.remove("no-transition")
            document.querySelector("span.posttool-name").classList.remove("posttool-name-hidden")

        },
        hideName: () => {
            document.querySelector("span.posttool-name").classList.add("no-transition")
            document.querySelector("span.posttool-name").classList.add("posttool-name-hidden")
        }
    },
    filter: {
        open: () => {
            document.querySelector("div.posts-filter-select").focus()
        }
    },
    order: {
        open: () => {
            document.querySelector("div.posts-order-select").focus()
        }
    },
    replies: {
        replyOrder: () => {
            document.querySelector("div.post-answers-select").focus()
        },
        like: (codigo, codigoPost) => {
            let icones = {}
            let likes = document.querySelectorAll("i.post-answer-like")
            for (let l = 0; l < likes.length; l++) {
                if (likes[l].getAttribute("resp-code") === codigo) {
                    icones.like = likes[l]
                    break
                }
            }

            let dislikes = document.querySelectorAll("i.post-answer-dislike")
            for (let d = 0; d < dislikes.length; d++) {
                if (dislikes[d].getAttribute("resp-code") === codigo) {
                    icones.dislike = dislikes[d]
                    break
                }
            }

            backend.request.post.rate.likeReply(codigo, codigoPost, icones)
        },
        dislike: (codigo, codigoPost) => {
            let icones = {}
            let likes = document.querySelectorAll("i.post-answer-like")
            for (let l = 0; l < likes.length; l++) {
                if (likes[l].getAttribute("resp-code") === codigo) {
                    icones.like = likes[l]
                    break
                }
            }

            let dislikes = document.querySelectorAll("i.post-answer-dislike")
            for (let d = 0; d < dislikes.length; d++) {
                if (dislikes[d].getAttribute("resp-code") === codigo) {
                    icones.dislike = dislikes[d]
                    break
                }
            }

            backend.request.post.rate.dislikeReply(codigo, codigoPost, icones)
        }
    },
    interact: {
        openComments: (icon) => {
            if (icon.getAttribute("status") === "open") {
                icon.removeAttribute("status")
                document.querySelector("div.post-answers-space")?.remove()
                // document.querySelector("html").scrollTop = icon.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.offsetTop - 65
                return
            }

            document.querySelectorAll("i.post-comments").forEach(i => {
                i.removeAttribute("status")
            })

            icon.setAttribute("status", "open")
            document.querySelector("div.post-answers-space")?.remove()
            let codigo = icon.getAttribute("post-code")
            let allPosts = document.querySelectorAll("div.post")
            let postagem
            for (let p = 0; p < allPosts.length; p++) {
                if (allPosts[p].getAttribute("post-code") === codigo) {
                    postagem = allPosts[p]
                    break
                }
            }

            try {
                let ordem = param.get("reply-sort")
                if (!ordem) {
                    ordem = "newest"
                    param.set("reply-sort", "newest")
                }

                let respostas = backend.get.postAnswers(codigo, { sort: ordem })

                let resp = {
                    getWord: () => {
                        if (respostas.length === 1) {
                            return `<span class="post-answers-counter-text" en="answer">resposta</span>`
                        } else {
                            return `<span class="post-answers-counter-text" en="answers">respostas</span>`
                        }
                    }
                }

                postagem.querySelector("div.post-bottom").innerHTML += `
                <div class="post-answers-space">
                    <div class="post-answers-content">
                        <div class="post-answers-top">
                            <div class="post-answers-top-content">
                                <span class="post-answers-counter-around">
                                    <span class="post-answers-counter">${respostas.length}</span>
                                    ${resp.getWord()}
                                </span>
                            </div>
                        </div>
                        <div class="post-answers-middle">
                            <div class="post-answers-middle-content">
                                <div class="post-answers-reply-space def-logged">
                                    <div class="post-answers-reply-space-content">
                                        <div class="post-reply-image-space">
                                            <img class="post-reply-image def-user-image">
                                        </div>
                                        <div class="post-reply-reply-space">
                                            <div class="post-reply-reply-name-space">
                                                <span class="post-reply-reply-add" en="Reply">Responder</span>
                                            </div>
                                            <div class="post-reply-isreplying-space def-title hidden" titulo="Clique para cancelar" en="Click to cancel" en-attr="titulo" onclick="post.interact.postReplies.cancelMention()">
                                                <span class="post-reply-isreplying">
                                                    <span en="Replying">Respondendo</span>
                                                    <span class="post-reply-isreplying-name">Ninguém</span>
                                                </span>
                                            </div>
                                            <div class="post-reply-reply-input-space">
                                                <div class="post-reply-reply-input-content">
                                                    <div class="post-reply-reply-textarea-space">
                                                        <textarea cols="30" rows="10" class="post-reply-reply-input" placeholder="Digite aqui a sua resposta" en="Type here your answer" en-attr="placeholder"></textarea>
                                                    </div>
                                                    <div class="post-reply-reply-send-space">
                                                        <button class="post-reply-reply-add-media def-ripple def-title" titulo="Adicionar mídia" en="Add media" en-attr="titulo" onclick="addRespMedia.select()">
                                                            <i class="fas fa-plus"></i>
                                                        </button>
                                                        <button class="post-reply-reply-send def-title def-ripple" titulo="Responder" en="Reply" en-attr="titulo" onclick="newReply.send('${codigo}')">
                                                            <i class="fas fa-paper-plane"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="post-reply-reply-media-space hidden">
                                                    <div class="post-reply-reply-media-content">
                                                        <div class="post-reply-reply-media-header">
                                                            <div class="post-reply-reply-media-title-space">
                                                                <span class="post-reply-reply-media-title" en="Media">Mídia</span>
                                                            </div>
                                                            <div class="post-reply-reply-media-clear-space">
                                                                <i class="fas fa-times post-reply-reply-media-clear def-title def-ripple" tabindex="0" titulo="Remover mídia" en="Remove media" en-attr="titulo" onclick="addRespMedia.clearImage()"></i>
                                                            </div>
                                                        </div>
                                                        <div class="post-reply-reply-media-body">
                                                            <img src="../files/logo.png" class="post-reply-reply-media">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="post-answers-view-space">
                                    <div class="post-answers-view-content">
                                        <div class="post-answers-view">
                                            <div class="post-answers-view-content">
                                                <div class="post-answers-view-around def-ripple" tabindex="0" onclick="post.replies.replyOrder()" post-code="${codigo}">
                                                    <div class="post-answers-view-icon-space">
                                                        <i class="fas fa-align-right rotate180 post-answers-view-icon"></i>
                                                    </div>
                                                    <div class="post-answers-view-text-space">
                                                        <span class="post-answers-view-text" en="Sort by">Ordenar por</span>
                                                    </div>
                                                    <div class="post-answers-view-arrow-space">
                                                        <i class="fas fa-caret-down post-answers-view-arrow"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="post-answers-select def-select" tabindex="0">
                                                <div class="post-answers-select-content">
                                                    <div class="post-answers-select-top def-select-title">
                                                        <span class="post-answers-select-title" en="Select the order">Selecione a ordem</span>
                                                    </div>
                                                    <div class="post-answers-select-body">
                                                        <div class="post-answers-select-list">
        
                                                            <div class="post-answers-order-box def-select-option" order-value="newest" onclick="atualizar.ordemRespostas(this)">
                                                                <div class="post-answers-order-box-content">
                                                                    <i class="fas fa-fire-alt def-select-option-icon"></i>
                                                                    <span class="post-answers-order-box-text def-select-option-text" en="Newest above">Mais recentes acima</span>
                                                                </div>
                                                            </div>
                                                            <div class="post-answers-order-box def-select-option" order-value="oldest" onclick="atualizar.ordemRespostas(this)">
                                                                <div class="post-answers-order-box-content">
                                                                    <i class="far fa-clock def-select-option-icon"></i>
                                                                    <span class="post-answers-order-box-text def-select-option-text" en="Oldest above">Mais antigas acima</span>
                                                                </div>
                                                            </div>
        
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="replies-reload-space">
                                                <button class="replies-reload def-ripple" onclick="post.load.replies('${codigo}')">
                                                    <i class="fas fa-redo"></i>
                                                    <span en="Reload">Recarregar</span>
                                                </button
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="post-answers-bottom">
                            <div class="post-answers-bottom-content">
                                <div class="post-answers-list">
                                    <h2 en="Loading answers... wait!">Carregando respostas... aguarde!</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `

                document.querySelector("div.post-answers-view-around")?.setAttribute("value", ordem)
                let selectOptions = document.querySelectorAll("div.post-answers-order-box")
                for (let s = 0; s < selectOptions.length; s++) {
                    if (selectOptions[s].getAttribute("order-value") === ordem) {
                        selectOptions[s].classList.add("selected")
                    } else {
                        selectOptions[s].classList.remove("selected")
                    }
                }

                // document.querySelector("html").scrollTop = document.querySelector("div.post-answers-space")?.offsetTop - 50
                post.load.replies(codigo)

            } catch (err) {
                console.error(`Ocorreu um erro ao abrir comentários:\n${err?.stack}`)
            } finally {
                lang.update("div.post-answers-space *")
                def.update()
            }

            activeAltIcons()
        },
        showPost: (codigo) => {
            let lista = document.querySelectorAll("div.post")
            for (let l in lista) {
                if (lista[l].getAttribute("post-code") === codigo) {
                    lista[l].querySelector("div.hidden-post").remove()
                    break
                }
            }
        },
        share: (codigo) => {

        },
        react: (codigo) => {

        },
        postReplies: {
            mention: (codigo) => {
                let respondendo = faceBackend.get.user.infos(codigo)
                if (respondendo) {
                    document.querySelector("div.post-reply-isreplying-space").classList.remove("hidden")
                    document.querySelector("div.post-reply-isreplying-space").setAttribute("replying", codigo)
                    document.querySelector("span.post-reply-isreplying-name").innerText = respondendo.nome
                    // document.querySelector("html").scrollTop = document.querySelector("textarea.post-reply-reply-input")?.offsetTop - 150
                    document.querySelector("textarea.post-reply-reply-input")?.focus()
                }
            },
            cancelMention: () => {
                document.querySelector("div.post-reply-isreplying-space").classList.add("hidden")
                document.querySelector("div.post-reply-isreplying-space").removeAttribute("replying")
            }
        }
    },
    load: {
        post: (pub, extra) => {
            let get = {
                user: (codigo) => {
                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigo)
                            return usuarios[u]
                    }
                },
                day: () => {
                    let data = getTime(pub.timestamp)
                    let hj = getTime()
                    if (data.dia == hj.dia && data.mes == hj.mes && data.ano == hj.ano)
                        return `
                            <span class="post-date" en="Today">Hoje</span>
                            <span class="post-time-at" en="at">às</span>
                            <span class="post-time-hour">${get.hour()}</span>
                        `

                    return data.string.data
                },
                hour: () => {
                    let data = getTime(pub.timestamp)
                    return data.string.hora.normal
                },
                postOwner: () => {
                    if (pub.por === usuarioAtual?.codigo)
                        return ""

                    return "hidden"
                },
                postText: () => {
                    return pub.conteudo.texto.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                },
                postMedia: () => {
                    if (!pub.conteudo.midia.url)
                        return ""

                    if (pub.conteudo.midia.tipo === "img") {
                        return `<img src="${pub.conteudo.midia?.url}" class="post-media" onclick="zoom.image('${pub.conteudo.midia?.url}', '${get.user(pub.por).nome}')">`
                    } else if (pub.conteudo.midia.tipo === "vid") {
                        return `
                            <video class="post-media" controls>
                                <source src="${pub.conteudo.midia?.url}" type="video/mp4">
                            </video>
                        `
                    }
                },
                postMediaClass: () => {
                    if (!pub.conteudo?.midia?.url)
                        return "hidden"

                    return ""
                },
                visiIcon: (vis) => {
                    if (vis === "public") {
                        return "fa-globe-americas"
                    } else if (vis === "private") {
                        return "fa-lock"
                    } else if (vis === "unlisted") {
                        return "fa-minus"
                    }
                },
                visiText: (vis) => {
                    // <span class="post-visibility-text"></span>
                    if (vis === "public") {
                        return `<span class="post-visibility-text" en="Public">Público</span>`
                    } else if (vis === "private") {
                        return `<span class="post-visibility-text" en="Private">Restrito</span>`
                    } else if (vis === "unlisted") {
                        return `<span class="post-visibility-text" en="Hidden">Escondido</span>`
                    }
                },
                likeVsDislike: () => {
                    return pub.avaliacoes.gostei?.length - pub.avaliacoes.naoGostei?.length
                },
                isLiked: (tipo) => {
                    let liked = false

                    for (let l = 0; l < pub.avaliacoes?.gostei?.length; l++) {
                        if (pub.avaliacoes?.gostei[l] === usuarioAtual?.codigo) {
                            liked = true
                            break
                        }
                    }

                    if (tipo === "class") {
                        if (liked) {
                            return "post-liked"
                        } else {
                            return ""
                        }
                    } else if (tipo === "icon") {
                        if (liked) {
                            return "s"
                        } else {
                            return "r"
                        }
                    }
                },
                isDisliked: (tipo) => {
                    let disliked = false

                    for (let d = 0; d < pub.avaliacoes.naoGostei?.length; d++) {
                        if (pub.avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                            disliked = true
                            break
                        }
                    }

                    if (tipo === "class") {
                        if (disliked) {
                            return "post-disliked"
                        } else {
                            return ""
                        }
                    } else if (tipo === "icon") {
                        if (disliked) {
                            return "s"
                        } else {
                            return "r"
                        }
                    }
                },
                isMentioning: (mencoes) => {
                    for (let m = 0; m < mencoes.length; m++) {
                        if (mencoes[m] === usuarioAtual?.codigo)
                            return ""
                    }
                    return "hidden"
                },
                getWarnings: (idioma, tipo) => {


                    if (pub.avisos.nsfw && pub.avisos.spoiler) {
                        if (tipo === "class")
                            return ""

                        if (idioma === "en") {
                            return `This post is marked as 'NSFW' and 'Spoiler'`
                        } else {
                            return `Esta postagem foi marcada como "Explícita" e "Spoiler"`
                        }
                    } else if (pub.avisos.nsfw) {
                        if (tipo === "class")
                            return ""

                        if (idioma === "en") {
                            return `This post is marked as 'NSFW'`
                        } else {
                            return `Esta postagem foi marcada como "Explícita"`
                        }
                    } else if (pub.avisos.spoiler) {
                        if (tipo === "class")
                            return ""

                        if (idioma === "en") {
                            return `This post is marked as 'Spoiler'`
                        } else {
                            return `Esta postagem foi marcada como "Spoiler"`
                        }
                    } else {
                        if (tipo === "class")
                            return "hidden"
                    }
                }
            }

            document.querySelector("div.post-list").innerHTML += `
            <div class="post" style="animation-delay: ${extra.delay}ms" post-code="${pub.codigo}">
                <div class="post-content">
                    <div class="hidden-post ${get.getWarnings("pt", "class")}">
                        <div class="hidden-post-text">
                            <span en="${get.getWarnings("en")}">
                                ${get.getWarnings("pt")}
                            </span>
                        </div>
                        <div class="hidden-post-options">
                            <button class="hidden-post-show def-ripple" onclick="post.interact.showPost('${pub.codigo}')">
                                <span en="Show anyway">Mostrar</span>
                            </button>
                        </div>
                    </div>
                    <div class="post-header">
                        <div class="post-header-content">
                            <div class="post-header-left">
                                <div class="post-header-user-space">
                                    <div class="post-user-photo-space">
                                        <img src="${get.user(pub.por).avatar}" class="post-user-photo" onclick="visit('${pub.por}')">
                                    </div>
                                    <div class="post-user-name-space">
                                        <span class="post-user-name-around">
                                            <span class="post-user-name" onclick="visit('${pub.por}')">${get.user(pub.por).nome}</span>
                                            <span class="post-user-badges">
                                                <span class="def-title" titulo="Beta tester">🅱</span>
                                                <span class="def-title" titulo="Detetive">🔎</span>
                                            </span>
                                        </span>
                                        <span class="post-time-around def-title" titulo="${getTime(pub.timestamp).string.default}">
                                            ${get.day()}
                                        </span>
                                        <span class="post-edited def-title" titulo="Esta postagem foi editada" en="This post has been edited" en-attr="titulo">
                                            <i class="fas fa-pen"></i>
                                        </span>
                                        <span class="post-mentioned def-title ${get.isMentioning(pub.mencoes)}" titulo="Você foi mencionado(a)" en="You were mentioned" en-attr="titulo">
                                            <i class="fas fa-at"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="post-header-right">
                                <div class="post-options" post-code="${pub.codigo}">
                                    <div class="post-option post-options-edit def-title ${get.postOwner()}" titulo="Editar postagem" en="Edit post" en-attr="titulo" onclick="edit.open('${pub.codigo}')">
                                        <i class="fas fa-pen"></i>
                                    </div>
                                    <div class="post-option post-options-del def-title ${get.postOwner()}" titulo="Excluir postagem" en="Delete post" en-attr="titulo" onclick="excluir.post('${pub.codigo}')">
                                        <i class="fas fa-trash"></i>
                                    </div>
                                    <div class="post-option post-options-fav def-title def-required-login def-logged" titulo="Marcar como favorito" en="Mark as favorite" en-attr="titulo">
                                        <i class="far fa-star"></i>
                                    </div>
                                    <div class="post-option post-options-more def-title" titulo="Mais opções" en="More options" en-attr="titulo" onclick="this.childNodes[3].focus()">
                                        <div class="post-options-more-icon-space">
                                            <i class="fas fa-ellipsis-v post-options-more-icon"></i>
                                        </div>
                                        <div class="post-options-more-select def-select" tabindex="0">
                                            <div class="post-options-more-select-content">
                                                <div class="post-options-more-title-space def-select-title">
                                                    <span class="post-options-more-title" en="More options">Mais opções</span>
                                                </div>
                                                <div class="post-more-body">
                                                    <div class="post-more-list">
                                                    
                                                        <div class="post-more-box def-select-option def-unavailable">
                                                            <div class="post-more-box-content">
                                                                <div class="post-more-icon-space def-select-option-icon">
                                                                    <i class="fas fa-info-circle"></i>
                                                                </div>
                                                                <div class="post-more-text-space def-select-option-text">
                                                                    <span class="post-more-icon" en="Post infos">Informações da postagem</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="post-more-box def-select-option def-required-login">
                                                            <div class="post-more-box-content">
                                                                <div class="post-more-icon-space def-select-option-icon">
                                                                    <i class="fas fa-flag"></i>
                                                                </div>
                                                                <div class="post-more-text-space def-select-option-text">
                                                                    <span class="post-more-icon" en="Report this post">Denunciar esta postagem</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="post-edit-options def-logged hidden" post-code="${pub.codigo}">
                                    <i class="fas fa-check post-edit-ok def-title" titulo="Concluído" en="Ok" en-attr="titulo"></i>
                                    <i class="fas fa-times post-edit-cancel def-title" titulo="Cancelar" en="Cancel" en-attr="titulo"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="post-body">
                        <div class="post-body-content">
                            <div class="post-text-space">
                                <div class="post-text">
                                    ${get.postText()}
                                </div>
                                <div class="long-post-gradient hidden">
                                    <span class="show-more" en="Show more">Ver mais</span>
                                </div>
                            </div>
                            <div class="post-media-space ${get.postMediaClass()}">
                                ${get.postMedia()}
                            </div>
                        </div>
                    </div>
                    <div class="post-bottom">
                        <div class="post-bottom-content">
                            <div class="post-bottom-left">
                                <div class="post-bottom-left-content">
                                    <div class="post-like-space">
                                        <i class="fa${get.isLiked("icon")} fa-arrow-alt-circle-up post-like post-bottom-option ${get.isLiked("class")} def-title def-required-login" titulo="Gostei" en="Like" en-attr="titulo" onclick="backend.request.post.rate.like(this)" post-code="${pub.codigo}"></i>
                                    </div>
                                    <div class="post-likesdislikes-space">
                                        <span class="post-likesdislikes def-title" titulo="Gostei x Não gostei" en="Like vs Dislike" en-attr="titulo" post-code="${pub.codigo}">${get.likeVsDislike()}</span>
                                    </div>
                                    <div class="post-dislikes-space">
                                        <i class="fa${get.isDisliked("icon")} fa-arrow-alt-circle-down post-dislike post-bottom-option def-title ${get.isDisliked("class")} def-required-login" titulo="Não gostei" en="Dislike" en-attr="titulo" onclick="backend.request.post.rate.dislike(this)" post-code="${pub.codigo}"></i>
                                    </div>
                                    <div class="post-comments-space">
                                        <div class="post-comments-icon-space">
                                            <i class="far fa-comment-alt post-comments post-bottom-option def-title" titulo="Respostas" en="Replies" en-attr="titulo" onclick="post.interact.openComments(this)" post-code="${pub.codigo}"></i>
                                        </div>
                                        <div class="post-comments-count-space">
                                            <span class="post-comments-counter" post-code="${pub.codigo}">${pub.respostas.length}</span>
                                        </div>
                                    </div>
                                    <div class="post-shares-space">
                                        <div class="post-shares-icon-space">
                                            <i class="fas fa-retweet post-shares post-bottom-option def-title def-required-login def-unavailable" titulo="Republicar" en="Republish" en-attr="titulo"></i>
                                        </div>
                                        <div class="post-shares-counter-space">
                                            <span class="post-shares-counter">0</span>
                                        </div>
                                    </div>
                                    <div class="post-reactions-space">
                                        <div class="reaction-add-space">
                                            <i class="far fa-smile reaction-add post-bottom-option def-title def-required-login def-unavailable" titulo="Adicionar reação" en="Add reaction" en-attr="titulo"></i>
                                        </div>
                                        <div class="reaction-list">
                                            <div class="reaction-box def-required-login">
                                                <div class="reaction-icon-space">
                                                    <span class="reaction-icon">💗</span>
                                                </div>
                                                <div class="reaction-counter-space">
                                                    <span class="reaction-counter">1</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="post-bottom-right">
                                <div class="post-bottom-right-content">
                                    <div class="post-visibility-space">
                                        <i class="fas ${get.visiIcon(pub.visibilidade)} post-visibility-${pub.visibilidade}"></i>
                                    </div>
                                    <div class="post-visibility-text-space">
                                        ${get.visiText(pub.visibilidade)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            activeAltIcons()
        },
        all: () => {
            document.querySelector("div.post-list").innerHTML = ""
            let filtros = {
                src: document.querySelector("input.page-posts-search").value,
                ordem: document.querySelector("div.posts-order-content").getAttribute("value"),
                filtro: document.querySelector("div.posts-filter-content").getAttribute("value")
            }

            let postagens = backend.get.posts(filtros)
            document.querySelector("span.page-posts-counter").innerHTML = postagens.length
            if (postagens.length === 1) {
                document.querySelector("span.page-posts-counter-after").innerHTML = "resultado"
                document.querySelector("span.page-posts-counter-after").setAttribute("en", "result")
            } else {
                document.querySelector("span.page-posts-counter-after").innerHTML = "resultados"
                document.querySelector("span.page-posts-counter-after").setAttribute("en", "results")
            }
            for (let p = 0; p < postagens.length; p++) {
                post.load.post(postagens[p], { delay: p * 50 })
            }
            lang.update(["div.post *", "span.page-posts-counter-after"])
            def.update()

            if (postagens.length < 1) {
                document.querySelector("div.post-list").innerHTML = `
                    <div class="no-posts">
                        <div class="no-posts-content">
                            <div class="no-posts-header">
                                <span class="no-posts-title" en="Quiet... too quiet"
                                    >Tudo quieto por enquanto...</span>
                            </div>
                            <div class="no-posts-body">
                                <div class="no-posts-body-top">
                                    <span class="no-posts-suggestion-title" en="Try:">Tente:</span>
                                </div>
                                <div class="no-post-body-middle">
                                    <div class="no-posts-suggestions-list">
                                        <span class="no-posts-suggestion" en="Check if you typed correctly"
                                            >Verificar se você digitou corretamente</span>
                                        <span class="no-posts-suggestion" en="Choose other post filter"
                                            >Escolher outro filtro de postagem</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                lang.update([".no-posts *"])
            }

            activeAltIcons()
        },
        replies: (codigo) => {
            let ordem = document.querySelector("div.post-answers-view-around").getAttribute("value")

            let respostas = backend.get.postAnswers(codigo, { sort: ordem })
            document.querySelector("div.post-answers-list").innerHTML = ""

            respostas.forEach(resp => {
                let infos = faceBackend.get.user.infos(resp.por)

                let get = {
                    isReplying: (tipo) => {
                        let rep = false
                        if (resp.respondendo)
                            rep = true

                        if (tipo === "class") {
                            if (rep) {
                                return ""
                            } else {
                                return "hidden"
                            }
                        } else if (tipo === "nome") {
                            let nome = faceBackend.get.user.infos(resp.respondendo)
                            if (rep) {
                                return nome.nome
                            } else {
                                return "Ninguém"
                            }
                        }
                    },
                    getText: () => {
                        return resp.conteudo.texto.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                    },
                    getMedia: () => {
                        if (!resp?.conteudo?.midia?.url)
                            return ""

                        if (resp.conteudo.midia.tipo === "img") {
                            let nm = faceBackend.get.user.infos(resp.por).nome
                            return `<img class="post-answer-media" src="${resp.conteudo.midia.url}" onclick="zoom.image('${resp.conteudo.midia.url}', '${nm}')">`
                        } else if (resp.conteudo.midia.tipo === "vid") {
                            return `
                                <video class="post-answer-media" controls>
                                    <source src="${resp.conteudo.midia.url}" type="video/mp4">
                                </video>
                            `
                        }
                    },
                    postDate: () => {
                        let data = getTime(resp.timestamp)
                        let hj = getTime()

                        if (data.dia == hj.dia && data.mes == hj.mes && data.ano == hj.ano) {
                            return `
                                <span class="post-answer-time-date" en="Today">Hoje</span>
                                <span class="post-answer-time-text-at" en="at">às</span>
                                <span class="post-answer-time">${data.string.hora.normal}</span>
                            `
                        }

                        return data.string.data
                    },
                    ownerDelete: () => {
                        if (resp.por === usuarioAtual?.codigo)
                            return ""

                        return "hidden"
                    },
                    isLiked: (tipo) => {
                        let is = false

                        for (let l = 0; l < resp.avaliacoes.gostei.length; l++) {
                            if (resp.avaliacoes.gostei[l] === usuarioAtual?.codigo) {
                                is = true
                                break
                            }
                        }

                        if (tipo === "title") {
                            if (is)
                                return `titulo="Remover gostei" en="Remove like" en-attr="titulo"`
                            return `titulo="Gostei" en="Like" en-attr="titulo"`
                        }

                        if (tipo === "icon") {
                            if (is)
                                return "s"

                            return "r"
                        }

                        if (is)
                            return "post-liked"

                        return ""
                    },
                    isDisliked: (tipo) => {
                        let is = false
                        for (let d = 0; d < resp.avaliacoes.naoGostei.length; d++) {
                            if (resp.avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                                is = true
                                break
                            }
                        }

                        if (tipo === "title") {
                            if (is)
                                return `titulo="Remover não gostei" en="Remove dislike" en-attr="titulo"`
                            return `titulo="Não gostei" en="Dislike" en-attr="titulo"`
                        }

                        if (tipo === "icon") {
                            if (is)
                                return "s"

                            return "r"
                        }

                        if (is)
                            return "post-disliked"
                        return ""
                    }
                }

                document.querySelector("div.post-answers-list").innerHTML += `
                    <div class="post-answer-box" resp-code="${resp.codigo}">
                        <div class="post-answer-options">
                            <i class="fas fa-trash def-title def-ripple ${get.ownerDelete()}" titulo="Excluir resposta" en="Delete answer" en-attr="titulo" owner="${resp.por}" onclick="excluir.resposta('${codigo}', '${resp.codigo}')"></i>
                            <i class="fas fa-flag def-title def-ripple def-unavailable" titulo="Denunciar resposta" en="Report answer" en-attr="titulo"></i>
                        </div>
                        <div class="post-answer-box-content">
                            <div class="post-answer-image-space">
                                <img class="post-answer-image" src="${infos.avatar}" onclick="visit('${resp.por}')">
                            </div>
                            <div class="post-answer-content-space">
                                <div class="post-answer-content">
                                    <div class="post-answer-name-space">
                                        <span class="post-answer-name-around" onclick="visit('${resp.por}')">
                                            <span class="post-answer-name">${infos.nome}</span>
                                            <span class="post-answer-badges">🅱🔎</span>
                                        </span>
                                        <span class="post-answer-time-around def-title" titulo="${getTime(resp.timestamp).string.default}">
                                            <span class="post-answer-split">∙</span>
                                            ${get.postDate()}
                                        </span>
                                    </div>
                                    <div class="post-answer-replying-space ${get.isReplying("class")}">
                                        <span class="post-answer-replying-around">
                                            <span class="post-answer-replying" en="Replying">Em resposta a</span>
                                            <span class="post-answer-replying-name">${get.isReplying("nome")}</span>
                                        </span>
                                    </div>
                                    <div class="post-answer-text-space">
                                        <span class="post-answer-text">${get.getText()}</span>
                                        <div class="post-answer-media-space">
                                            ${get.getMedia()}
                                        </div>
                                    </div>
                                    <div class="post-answer-reactions-space">
                                        <div class="post-answer-reactions">
                                            <div class="post-answer-reactions-content">
                                                <div class="post-answer-like-space">
                                                    <i class="fa${get.isLiked("icon")} fa-arrow-alt-circle-up post-answer-like def-title def-required-login ${get.isLiked()}" ${get.isLiked("title")} onclick="post.replies.like('${resp.codigo}', '${codigo}')" resp-code="${resp.codigo}"></i>
                                                </div>
                                                <div class="post-answer-counter-space">
                                                    <span class="post-answer-counter def-title" titulo="Gostei x Não gostei" en="Like vs Dislike" en-attr="titulo" resp-code="${resp.codigo}">${resp.avaliacoes?.gostei?.length - resp.avaliacoes?.naoGostei?.length}</span>
                                                </div>
                                                <div class="post-answer-dislike-space">
                                                    <i class="fa${get.isDisliked("icon")} fa-arrow-alt-circle-down post-answer-dislike def-title def-required-login ${get.isDisliked()}" ${get.isDisliked("title")} onclick="post.replies.dislike('${resp.codigo}', '${codigo}')" resp-code="${resp.codigo}"></i>
                                                </div>
                                                <div class="post-answer-mention-space" onclick="post.interact.postReplies.mention('${resp.por}')">
                                                    <i class="fas fa-reply post-answer-mention def-title def-required-login" titulo="Responder" en="Reply" en-attr="titulo"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `

                document.querySelector("span.post-answers-counter").innerText = respostas.length
                document.querySelector("span.post-answers-counter-text")?.remove()

                if (respostas.length === 1) {
                    document.querySelector("span.post-answers-counter-around").innerHTML += `<span class="post-answers-counter-text" en="answer">resposta</span>`
                } else {
                    document.querySelector("span.post-answers-counter-around").innerHTML += `<span class="post-answers-counter-text" en="answers">respostas</span>`
                }

                let counter = document.querySelectorAll("span.post-comments-counter")
                for (let c = 0; c < counter.length; c++) {
                    if (counter[c].getAttribute("post-code") === codigo) {
                        counter[c].innerHTML = respostas.length
                    }
                }

                lang.update(["div.post-answers-list *", "span.post-answers-counter-text"])
                def.update()
                activeAltIcons()
            })

            if (respostas.length < 1) {
                document.querySelector("div.post-answers-list").innerHTML = `
                    <div class="no-post-answers">
                        <p class="no-post-answers-title" en="Oops, looks like there's no answers here yet D:"
                            >Putz, parece que não tem nenhuma resposta aqui ainda D:</p>
                        <p class="no-post-answers-start" en="Start the discussion"
                            >Comece a discussão</p>
                    </div>
                `
                lang.update("div.no-post-answers *")
            }

        }
    }
}
post.load.all()
post.postTools.loadNames()

var newPost = {
    send: () => {
        let texto = document.querySelector("textarea.newpost-text").value
        texto = texto.trim()

        if (!texto || texto.length > 1250) {
            var midia = document.querySelector("div.newpost-media-body").getAttribute("media-url")
            if (!midia)
                return warning.new(`
                    <span en="Error in post creation:">Erro ao criar postagem:</span>
                    <br><br>
                    <span en="You must enter a media or a text with at least 1 character and a maximum of 1250."
                    >É necessário inserir uma mídia ou um texto com pelo menos 1 caractere e, no máximo, 1250.</span>
                `)
        }

        let novoPost = {
            por: usuarioAtual.codigo,
            visibilidade: document.querySelector("select.newpost-type").value,
            conteudo: {
                texto: texto,
                midia: {
                    url: document.querySelector("div.newpost-media-body").getAttribute("media-url"),
                    tipo: document.querySelector("div.newpost-media-body").getAttribute("media-type")
                }
            },
            avisos: {
                nsfw: document.querySelector("input.nsfw-marker").checked,
                spoiler: document.querySelector("input.spoiler-marker").checked
            }
        }

        newPost.removeMedia()
        let np = backend.request.post.new(novoPost)
        if (np) {
            post.load.all()
            newPost.clearBox()
        }
    },
    clearBox: () => {
        document.querySelector("textarea.newpost-text").value = ""
        document.querySelector("i.newpost-clear").classList.add("hidden")
        document.querySelector("div.newpost-media-body").removeAttribute("media-type")
        document.querySelector("div.newpost-media-body").removeAttribute("media-url")
    },
    removeMedia: () => {
        document.querySelector("div.newpost-media-space").classList.add("hidden")
        document.querySelector("div.newpost-media-body").removeAttribute("media-url")
        document.querySelector("div.newpost-media-body").removeAttribute("media-type")
        document.querySelector("div.newpost-media-body").innerHTML = ""
    },
    sczo: (codigo) => {
        conquista.nova("esquizofrenia", codigo)
    }
}

var newReply = {
    send: (postCode) => {
        let texto = document.querySelector("textarea.post-reply-reply-input").value.trim()
        let textLimit = 500

        if (!texto || texto > textLimit) {
            let md = document.querySelector("div.post-reply-reply-media-body").getAttribute("media-url")
            if (!md)
                return warning.new(`
                    <span en="Error while replying:">Erro ao responder:</span>
                    <br><br>
                    <span en="You must enter a media or a text with at least 1 character and a maximum of ${textLimit}."
                    >É necessário inserir uma mídia ou um texto com pelo menos 1 caractere e, no máximo, ${textLimit}.</span>
                `)
        }

        let novaResposta = {
            por: usuarioAtual.codigo,
            respondendo: document.querySelector("div.post-reply-isreplying-space").getAttribute("replying"),
            conteudo: {
                texto: texto,
                midia: {
                    url: document.querySelector("div.post-reply-reply-media-body").getAttribute("media-url"),
                    tipo: document.querySelector("div.post-reply-reply-media-body").getAttribute("media-type")
                }
            },
            avaliacoes: {
                gostei: [],
                naoGostei: []
            }
        }

        post.interact.postReplies.cancelMention()
        let nr = backend.request.post.reply(novaResposta, postCode)
        if (nr) {
            post.load.replies(postCode)
            newReply.clearBox()
        }
    },
    clearBox: () => {
        document.querySelector("textarea.post-reply-reply-input").value = ""
        document.querySelector("div.post-reply-reply-media-space").classList.add("hidden")
        document.querySelector("div.post-reply-reply-media-body").removeAttribute("media-url")
        document.querySelector("div.post-reply-reply-media-body").removeAttribute("media-type")
    }
}

var amigos = {
    carregar: {
        sugestoes: () => {
            let sugestoes = friends.suggestions(usuarioAtual?.codigo)
            let container = document.querySelector("div.social-sug-list")
            container.innerHTML = ""

            let get = {
                biografia: (biografia) => {
                    if (!biografia)
                        biografia = "Humm... nada aqui"
                    return biografia.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                }
            }

            for (let s = 0; s < sugestoes.length; s++) {
                container.innerHTML += `
                <div class="fbs-box" style="background: url('${sugestoes[s].banner}')">
                    <div class="fbs-box-content">
                        <div class="fbs-box-top">
                            <div class="fbs-box-user-space">
                                <div class="fbs-box-img-space">
                                    <img src="${sugestoes[s].avatar}" class="fbs-box-img" onclick="visit('${sugestoes[s].codigo}')">
                                </div>
                                <div class="fbs-info-space">
                                    <div class="fbs-box-name-space">
                                        <span class="fbs-box-name" title="${sugestoes[s].nome}" onclick="visit('${sugestoes[s].codigo}')">${sugestoes[s].nome}</span>
                                    </div>
                                    <div class="fbs-box-bio-space">
                                        <span class="fbs-box-bio">${get.biografia(sugestoes[s].biografia)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fbs-box-options-space">
                                <div class="fbs-box-option def-ripple" titulo="Adicionar aos favoritos" en="Add to favorites" en-attr="titulo">
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="fbs-box-option def-ripple" titulo="Opções" en="Options" en-attr="titulo">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <div class="fbs-box-option-select def-select">
                                        <div class="fbs-box-option-select-content">
                                            <div class="fbs-box-option-select-title-space def-select-title">
                                                <span en="User options">Opções do usuário</span>
                                            </div>
                                            <div class="fbs-box-option-select-options-space">
                                                
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-ban def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Block user">Bloquear usuário</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-flag def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Report user">Denunciar usuário</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fbs-box-bottom">
                            <div class="fbs-buttons-space">
                                <button class="fbs-button-add def-title def-button def-ripple" titulo="Enviar solicitação de amizade" en="Send friend request"
                                    en-attr="titulo" onclick="amigos.gerenciar.enviarSolicitacao('${sugestoes[s].codigo}')">
                                    <i class="fas fa-plus"></i>
                                    <span en="Request">Solicitação</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `

                def.update()
            }

            document.querySelector("span.social-sug-count").innerHTML = sugestoes.length
            if (sugestoes.length < 1) {
                container.innerHTML = `<span class="social-empty-list" en="Well... looks like here is empty."
                    >Humm... parece que aqui está vazio.</span>`
            }
            lang.update("div.social-topic-sug *")
        },
        amigos: () => {
            let amigs = friends.friends(usuarioAtual?.codigo)
            let container = document.querySelector("div.social-fri-list")
            container.innerHTML = ""
            document.querySelector("span.social-fri-count").innerHTML = amigs.length

            let get = {
                biografia: (biografia) => {
                    if (!biografia)
                        biografia = "Humm... nada aqui"
                    return biografia.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                }
            }


            for (let a = 0; a < amigs.length; a++) {
                container.innerHTML += `
                <div class="fbs-box" style="background: url('${amigs[a].banner}')">
                    <div class="fbs-box-content">
                        <div class="fbs-box-top">
                            <div class="fbs-box-user-space">
                                <div class="fbs-box-img-space">
                                    <img src="${amigs[a].avatar}" class="fbs-box-img" onclick="visit('${amigs[a].codigo}')">
                                </div>
                                <div class="fbs-info-space">
                                    <div class="fbs-box-name-space" onclick="visit('${amigs[a].codigo}')">
                                        <span class="fbs-box-name" title="${amigs[a].nome}">${amigs[a].nome}</span>
                                    </div>
                                    <div class="fbs-box-bio-space">
                                        <span class="fbs-box-bio">${get.biografia(amigs[a].biografia)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fbs-box-options-space">
                                <div class="fbs-box-option def-ripple" titulo="Adicionar aos favoritos" en="Add to favorites" en-attr="titulo">
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="fbs-box-option def-ripple" titulo="Opções" en="Options" en-attr="titulo">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <div class="fbs-box-option-select def-select">
                                        <div class="fbs-box-option-select-content">
                                            <div class="fbs-box-option-select-title-space def-select-title">
                                                <span en="User options">Opções do usuário</span>
                                            </div>
                                            <div class="fbs-box-option-select-options-space">
                                                
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-ban def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Block user">Bloquear usuário</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-flag def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Report user">Denunciar usuário</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fbs-box-bottom">
                            <div class="fbs-buttons-space">
                                <button class="fbs-button-remove def-title def-button def-ripple" titulo="Remover usuário da lista de amigos" en="Remove user from friend list" en-attr="titulo"
                                    en-attr="titulo" onclick="amigos.gerenciar.remover('${amigs[a].codigo}')">
                                    <i class="fas fa-minus"></i>
                                    <span en="Remove">Remover</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }

            if (amigs.length < 1) {
                container.innerHTML = `<span class="social-empty-list" en="Well... looks like here is empty."
                    >Humm... parece que aqui está vazio.</span>`
            }
            lang.update("div.social-topic-fri *")
            def.update()
        },
        solicitacoes: () => {
            let req = friends.requests(usuarioAtual?.codigo)
            let solicitacoes = []
            for (let s = 0; s < req.length; s++) {
                solicitacoes.push(faceBackend.get.user.infos(req[s]))
            }
            let container = document.querySelector("div.social-sol-list")
            container.innerHTML = ""
            document.querySelector("span.social-req-count").innerHTML = solicitacoes.length

            let get = {
                biografia: (biografia) => {
                    if (!biografia)
                        biografia = "Humm... nada aqui"
                    return biografia.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                }
            }

            for (let s = 0; s < solicitacoes.length; s++) {
                container.innerHTML += `
                <div class="fbs-box" style="background: url('${solicitacoes[s].banner}')">
                    <div class="fbs-box-content">
                        <div class="fbs-box-top">
                            <div class="fbs-box-user-space">
                                <div class="fbs-box-img-space">
                                    <img src="${solicitacoes[s].avatar}" class="fbs-box-img" onclick="visit('${solicitacoes[s].codigo}')">
                                </div>
                                <div class="fbs-info-space">
                                    <div class="fbs-box-name-space" onclick="visit('${solicitacoes[s].codigo}')">
                                        <span class="fbs-box-name" title="${solicitacoes[s].nome}">${solicitacoes[s].nome}</span>
                                    </div>
                                    <div class="fbs-box-bio-space">
                                        <span class="fbs-box-bio">${get.biografia(solicitacoes[s].biografia)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fbs-box-options-space">
                                <div class="fbs-box-option def-ripple" titulo="Adicionar aos favoritos" en="Add to favorites" en-attr="titulo">
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="fbs-box-option def-ripple" titulo="Opções" en="Options" en-attr="titulo">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <div class="fbs-box-option-select def-select">
                                        <div class="fbs-box-option-select-content">
                                            <div class="fbs-box-option-select-title-space def-select-title">
                                                <span en="User options">Opções do usuário</span>
                                            </div>
                                            <div class="fbs-box-option-select-options-space">
                                                
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-user-slash def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="No interest">Sem interesse</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-ban def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Block user">Bloquear usuário</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-flag def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Report user">Denunciar usuário</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fbs-box-bottom">
                            <div class="fbs-buttons-space">
                                <button class="fbs-button-add def-title def-ripple def-button" titulo="Adicionar como amigo" en="Add as friend"
                                    en-attr="titulo" onclick="amigos.gerenciar.aceitar('${solicitacoes[s].codigo}')">
                                    <i class="fas fa-plus"></i>
                                    <span en="Accept">Aceitar</span>
                                </button>
                                <button class="fbs-button-remove def-title def-ripple def-button" titulo="Rejeitar solicitação" en="Reject friend request"
                                    en-attr="titulo" onclick="amigos.gerenciar.rejeitar('${solicitacoes[s].codigo}')">
                                    <i class="fas fa-minus"></i>
                                    <span en="Reject">Recusar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `

                def.update()
            }

            if (solicitacoes.length < 1) {
                container.innerHTML = `<span class="social-empty-list" en="Well... looks like here is empty."
                    >Humm... parece que aqui está vazio.</span>`
            }
            lang.update("div.social-topic-req *")
        },
        enviadas: () => {
            let req = friends.sent(usuarioAtual?.codigo)
            let enviadas = []
            for (let e = 0; e < req.length; e++) {
                enviadas.push(faceBackend.get.user.infos(req[e]))
            }
            let container = document.querySelector("div.social-sole-list")
            container.innerHTML = ""
            document.querySelector("span.social-sent-count").innerHTML = enviadas.length

            let get = {
                biografia: (biografia) => {
                    if (!biografia)
                        biografia = "Humm... nada aqui"
                    return biografia.replace(/</g, "&#60;").replace(/>/g, "&#62;").split("\n").join("<br>")
                }
            }

            for (let e = 0; e < enviadas.length; e++) {
                container.innerHTML += `
                <div class="fbs-box" style="background: url('${enviadas[e].banner}')">
                    <div class="fbs-box-content">
                        <div class="fbs-box-top">
                            <div class="fbs-box-user-space">
                                <div class="fbs-box-img-space">
                                    <img src="${enviadas[e].avatar}" class="fbs-box-img" onclick="visit('${enviadas[e].codigo}')">
                                </div>
                                <div class="fbs-info-space">
                                    <div class="fbs-box-name-space" onclick="visit('${enviadas[e].codigo}')">
                                        <span class="fbs-box-name" title="${enviadas[e].nome}">${enviadas[e].nome}</span>
                                    </div>
                                    <div class="fbs-box-bio-space">
                                        <span class="fbs-box-bio">${get.biografia(enviadas[e].biografia)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fbs-box-options-space">
                                <div class="fbs-box-option def-ripple" titulo="Adicionar aos favoritos" en="Add to favorites" en-attr="titulo">
                                    <i class="far fa-star"></i>
                                </div>
                                <div class="fbs-box-option def-ripple" titulo="Opções" en="Options" en-attr="titulo">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <div class="fbs-box-option-select def-select">
                                        <div class="fbs-box-option-select-content">
                                            <div class="fbs-box-option-select-title-space def-select-title">
                                                <span en="User options">Opções do usuário</span>
                                            </div>
                                            <div class="fbs-box-option-select-options-space">
                                                
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-user-slash def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="No interest">Sem interesse</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-ban def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Block user">Bloquear usuário</span>
                                                    </div>
                                                </div>
                                                <div class="fbs-box-select-option def-select-option">
                                                    <div class="fbs-box-select-option-content">
                                                        <i class="fas fa-flag def-select-option-icon"></i>
                                                        <span class="def-select-option-text" en="Report user">Denunciar usuário</span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="fbs-box-bottom">
                            <div class="fbs-buttons-space">
                                <button class="fbs-button-cancel def-title def-ripple def-button" titulo="Adicionar como amigo" en="Add as friend"
                                    en-attr="titulo" onclick="amigos.gerenciar.cancelar('${enviadas[e].codigo}')">
                                    <i class="fas fa-times"></i>
                                    <span en="Cancel">Cancelar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `

                def.update()
            }

            if (enviadas.length < 1)
                container.innerHTML = `<span class="social-empty-list" en="Well... looks like here is empty."
                >Humm... parece que aqui está vazio.</span>`
            lang.update("div.social-topic-reqs *")
        }
    },
    gerenciar: {
        enviarSolicitacao: (codigoAmigo) => {
            if (!backend.get.user.isLogged()) {
                return alert("Você precisa estar conectado para fazer esta ação!")
            }

            let errorMessage = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    return "Hmmm, can't do that =/\n\nSorry, an error occurred while trying to add this user as friend. Try again!\nIf the problem persists, let us know via the feedback page."
                } else {
                    return "Eita, não dá pra fazer isso =/\n\nFoi mal, ocorreu um erro ao adicionar este usuário como amigo. Tente novamente!\nSe o problema persistir, avise-nos através da página de feedback."
                }
            }

            if (!codigoAmigo) {
                return alert(errorMessage())
            }

            let sucesso = faceBackend.request.friend.request.send(usuarioAtual?.codigo, codigoAmigo)
            if (!sucesso) {
                return alert(errorMessage())
            }
            amigos.carregar.amigos()
            amigos.carregar.solicitacoes()
            amigos.carregar.sugestoes()
            amigos.carregar.enviadas()
        },
        aceitar: (codigoAmigo) => {
            if (!backend.get.user.isLogged()) {
                return alert("Você precisa estar conectado para fazer esta ação!")
            }

            let errorMessage = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    return "Hmmm, can't do that =/\n\nSorry, an error occurred while trying to accept this user as friend. Try again!\nIf the problem persists, let us know via the feedback page."
                } else {
                    return "Eita, não dá pra fazer isso =/\n\nFoi mal, ocorreu um erro ao aceitar este usuário como amigo. Tente novamente!\nSe o problema persistir, avise-nos através da página de feedback."
                }
            }

            if (!codigoAmigo)
                return alert(errorMessage())

            let sucesso = faceBackend.request.friend.request.accept(usuarioAtual?.codigo, codigoAmigo)
            if (!sucesso)
                return alert(errorMessage())

            amigos.carregar.amigos()
            amigos.carregar.solicitacoes()
            amigos.carregar.sugestoes()
            amigos.carregar.enviadas()
            post.load.all()
        },
        rejeitar: (codigoAmigo) => {
            if (!backend.get.user.isLogged()) {
                return alert("Você precisa estar conectado para fazer esta ação!")
            }

            let errorMessage = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    return "Hmmm, can't do that =/\n\nSorry, an error occurred while trying to reject this user as friend. Try again!\nIf the problem persists, let us know via the feedback page."
                } else {
                    return "Eita, não dá pra fazer isso =/\n\nFoi mal, ocorreu um erro ao rejeitar este usuário como amigo. Tente novamente!\nSe o problema persistir, avise-nos através da página de feedback."
                }
            }

            if (!codigoAmigo)
                return alert(errorMessage())

            let sucesso = faceBackend.request.friend.request.reject(usuarioAtual?.codigo, codigoAmigo)
            if (!sucesso)
                return alert(errorMessage())

            amigos.carregar.amigos()
            amigos.carregar.solicitacoes()
            amigos.carregar.sugestoes()
            amigos.carregar.enviadas()
        },
        remover: (codigoAmigo) => {
            if (!backend.get.user.isLogged()) {
                return alert("Você precisa estar conectado para fazer esta ação!")
            }

            let errorMessage = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    return "Hmmm, can't do that =/\n\nSorry, an error occurred while trying to reject this user as friend. Try again!\nIf the problem persists, let us know via the feedback page."
                } else {
                    return "Eita, não dá pra fazer isso =/\n\nFoi mal, ocorreu um erro ao rejeitar este usuário como amigo. Tente novamente!\nSe o problema persistir, avise-nos através da página de feedback."
                }
            }

            if (!codigoAmigo)
                return alert(errorMessage())

            let sucesso = faceBackend.request.friend.remove(usuarioAtual?.codigo, codigoAmigo)
            if (!sucesso)
                return alert(errorMessage())

            amigos.carregar.amigos()
            amigos.carregar.solicitacoes()
            amigos.carregar.sugestoes()
            amigos.carregar.enviadas()
            post.load.all()
        },
        cancelar: (codigoAmigo) => {
            if (!backend.get.user.isLogged())
                return alert("Você precisa estar conectado para fazer esta ação!")

            let errorMessage = () => {
                let ln = lang.get.selected()
                if (ln === "en") {
                    return "Hmmm, can't do that =/\n\nSorry, an error occurred while trying to cancel friend request. Try again!\nIf the problem persists, let us know via the feedback page."
                } else {
                    return "Eita, não dá pra fazer isso =/\n\nFoi mal, ocorreu um erro ao cancelar solicitação de amizade. Tente novamente!\nSe o problema persistir, avise-nos através da página de feedback."
                }
            }

            if (!codigoAmigo)
                return alert(errorMessage())

            let sucesso = faceBackend.request.friend.request.cancel(usuarioAtual?.codigo, codigoAmigo)
            if (!sucesso)
                return alert(errorMessage())

            amigos.carregar.amigos()
            amigos.carregar.solicitacoes()
            amigos.carregar.sugestoes()
            amigos.carregar.enviadas()
        }
    }
}
amigos.carregar.amigos()
amigos.carregar.solicitacoes()
amigos.carregar.sugestoes()
amigos.carregar.enviadas()

var social = {
    actions: {
        closeTopic: (header) => {
            let lista = header.getAttribute("list")
            document.querySelector(lista).classList.add("hidden")
            header.setAttribute("onclick", "social.actions.openTopic(this)")
            header.classList.add("hidden-social-topic")
        },
        openTopic: (header) => {
            let lista = header.getAttribute("list")
            document.querySelector(lista).classList.remove("hidden")
            header.setAttribute("onclick", "social.actions.closeTopic(this)")
            header.classList.remove("hidden-social-topic")
        }
    }
}

var remoteControl = {
    likeAnimation: (icone) => {
        icone.classList.add("post-liked")
        icone.setAttribute("titulo", "Remover gostei")
        icone.setAttribute("en", "Remove like")
        icone.classList.remove("far")
        icone.classList.add("fas")
        lang.update(["i.post-like", "i.post-dislike"])
    },
    unlikeAnimation: (icone) => {
        icone.classList.remove("post-liked")
        icone.setAttribute("titulo", "Gostei")
        icone.setAttribute("en", "Like")
        icone.classList.remove("fas")
        icone.classList.add("far")
        lang.update(["i.post-like", "i.post-dislike"])
    },
    dislikeAnimation: (icone) => {
        icone.classList.add("post-disliked")
        icone.setAttribute("titulo", "Remover não gostei")
        icone.setAttribute("en", "Remove dislike")
        icone.classList.remove("far")
        icone.classList.add("fas")
        lang.update(["i.post-like", "i.post-dislike"])
    },
    undislikeAnimation: (icone) => {
        icone.classList.remove("post-disliked")
        icone.setAttribute("titulo", "Não gostei")
        icone.setAttribute("en", "Dislike")
        icone.classList.remove("fas")
        icone.classList.add("far")
        lang.update(["i.post-like", "i.post-dislike"])
    },
    recount: (postCode, postPosition) => {
        let likeVs = document.querySelectorAll("span.post-likesdislikes")
        for (let l = 0; l < likeVs.length; l++) {
            if (likeVs[l].getAttribute("post-code") === postCode) {
                likeVs[l].innerHTML = posts[postPosition].avaliacoes.gostei.length - posts[postPosition].avaliacoes.naoGostei.length
                break
            }
        }
    },
    showCounter: () => {
        let filtros = {
            src: document.querySelector("input.page-posts-search").value,
            ordem: document.querySelector("div.posts-order-content").getAttribute("value"),
            filtro: document.querySelector("div.posts-filter-content").getAttribute("value")
        }
        let postagens = backend.get.posts(filtros)
        document.querySelector("span.page-posts-counter").innerHTML = postagens.length
        if (postagens.length === 1) {
            document.querySelector("span.page-posts-counter-after").innerHTML = "resultado"
            document.querySelector("span.page-posts-counter-after").setAttribute("en", "result")
        } else {
            document.querySelector("span.page-posts-counter-after").innerHTML = "resultados"
            document.querySelector("span.page-posts-counter-after").setAttribute("en", "results")
        }
        lang.update("span.page-posts-counter-after")
    },
    removePost: (codigo) => {
        let postagens = document.querySelectorAll("div.post")
        for (let p = 0; p < postagens.length; p++) {
            if (postagens[p].getAttribute("post-code") === codigo) {
                postagens[p].remove()
                break
            }
        }
    },
    reply: {
        likeAnimation: (icone) => {
            icone.classList.add("post-liked")
            icone.setAttribute("titulo", "Remover gostei")
            icone.setAttribute("en", "Remove like")
            icone.classList.remove("far")
            icone.classList.add("fas")
            lang.update(["i.post-like", "i.post-dislike"])
        },
        unlikeAnimation: (icone) => {
            icone.classList.remove("post-liked")
            icone.setAttribute("titulo", "Gostei")
            icone.setAttribute("en", "Like")
            icone.classList.remove("fas")
            icone.classList.add("far")
            lang.update(["i.post-like", "i.post-dislike"])
        },
        dislikeAnimation: (icone) => {
            icone.classList.add("post-disliked")
            icone.setAttribute("titulo", "Remover não gostei")
            icone.setAttribute("en", "Remove dislike")
            icone.classList.remove("far")
            icone.classList.add("fas")
            lang.update(["i.post-like", "i.post-dislike"])
        },
        undislikeAnimation: (icone) => {
            icone.classList.remove("post-disliked")
            icone.setAttribute("titulo", "Não gostei")
            icone.setAttribute("en", "Dislike")
            icone.classList.remove("fas")
            icone.classList.add("far")
            lang.update(["i.post-like", "i.post-dislike"])
        },
        recount: (respCode, postPosition) => {
            let likeVs = document.querySelectorAll("span.post-answer-counter")
            let resp
            for (let r = 0; r < posts[postPosition].respostas.length; r++) {
                if (posts[postPosition].respostas[r].codigo === respCode) {
                    resp = posts[postPosition].respostas[r]
                    break
                }
            }
            for (let l = 0; l < likeVs.length; l++) {
                if (likeVs[l].getAttribute("resp-code") === respCode) {
                    likeVs[l].innerHTML = resp.avaliacoes.gostei.length - resp.avaliacoes.naoGostei.length
                    break
                }
            }
        },
        showCounter: (comprimento) => {
            document.querySelector("span.post-answers-counter").innerHTML = comprimento
            if (comprimento === 1) {
                document.querySelector("span.post-answers-counter-text").innerHTML = "resposta"
                document.querySelector("span.post-answers-counter-text").setAttribute("en", "answer")
            } else {
                document.querySelector("span.post-answers-counter-text").innerHTML = "respostas"
                document.querySelector("span.post-answers-counter-text").setAttribute("en", "answers")
            }
            lang.update("span.post-answers-counter-text")
        },
        removeReply: (codigoResp) => {
            let respostas = document.querySelectorAll("div.post-answer-box")
            for (let r = 0; r < respostas.length; r++) {
                if (respostas[r].getAttribute("resp-code") === codigoResp) {
                    respostas[r].remove()
                    break
                }
            }
        }
    }
}

var abrir = {
    newPost: {
        switcher: () => {
            document.querySelector("div.newpost-switch-account").focus()
        },
        addImage: () => {
            document.querySelector("input.add-image-link").value = ""
            addImage.inputClear()
            document.querySelector("div.add-image-preview-space").classList.add("hidden")
            document.querySelector("img.add-image-preview").removeAttribute("src")
            document.querySelector("div.add-image-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
            document.querySelector("input.add-image-link").focus()
        },
        addVideo: () => {
            document.querySelector("input.add-video-input").value = ""
            addVideo.inputClear()
            document.querySelector("div.add-video-preview-space").classList.add("hidden")
            document.querySelector("source.add-video-source").removeAttribute("src")
            document.querySelector("div.add-video-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
            document.querySelector("input.add-video-input").focus()
        },
        gallery: () => {
            let src = document.querySelector("input.gallery-send-search").value
            let container = document.querySelector("div.gallery-send-list")
            container.innerHTML = ""
            let itemList = faceBackend.get.user.gallery(usuarioAtual?.codigo, "img", src)
            for (let i = 0; i < itemList.length; i++) {
                container.innerHTML += `
                <div class="gallery-send-item def-ripple" title="${itemList[i].nome}" onclick="gallerySend.send('${itemList[i].url}')">
                    <img src="${itemList[i].url}" alt="Imagem não encontrada" en="Image not found" en-attr="alt">
                </div>`
            }

            if (itemList.length < 1)
                container.innerHTML = `<span class="gallery-send-nothing" en="No images =(">Sem imagens =(</span>`

            lang.update("div.gallery-send *")
            def.update()
            document.querySelector("div.gallery-send-space").classList.remove("hidden")
            document.querySelector("html").classList.add("no-scroll")
        }
    }
}

var fechar = {
    newPost: {
        addImage: () => {
            document.querySelector("div.add-image-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        },
        addVideo: () => {
            document.querySelector("div.add-video-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        },
        gallery: () => {
            document.querySelector("div.gallery-send-space").classList.add("hidden")
            document.querySelector("html").classList.remove("no-scroll")
        }
    }
}

var gallerySend = {
    send: (url) => {
        fechar.newPost.gallery()

        document.querySelector("div.newpost-media-body").setAttribute("media-url", url)
        document.querySelector("div.newpost-media-body").setAttribute("media-type", "img")
        document.querySelector("div.newpost-media-space").classList.remove("hidden")
        document.querySelector("div.newpost-media-body").innerHTML = `<img src="${url}" class="newpost-media">`
    }
}

var addImage = {
    inputLoad: (url) => {
        document.querySelector("input.add-image-link").value = url
        document.querySelector("input.add-image-link").classList.add("no-radius")
        document.querySelector("button.add-image-clear").classList.remove("hidden")
        document.querySelector("input.add-image-link").focus()
    },
    inputClear: (url) => {
        if (!url) {
            document.querySelector("input.add-image-link").classList.remove("no-radius")
            document.querySelector("button.add-image-clear").classList.add("hidden")
        } else {
            document.querySelector("input.add-image-link").classList.add("no-radius")
            document.querySelector("button.add-image-clear").classList.remove("hidden")
        }
    },
    clearInput: () => {
        document.querySelector("input.add-image-link").value = ""
        document.querySelector("input.add-image-link").classList.remove("no-radius")
        document.querySelector("button.add-image-clear").classList.add("hidden")
        document.querySelector("input.add-image-link").focus()
    },
    loadPreview: (url) => {
        if (!url) {
            document.querySelector("img.add-image-preview").removeAttribute("src")
            document.querySelector("div.add-image-preview-space").classList.add("hidden")
        } else {
            document.querySelector("img.add-image-preview").setAttribute("src", url)
            document.querySelector("div.add-image-preview-space").classList.remove("hidden")
        }
    },
    send: () => {
        let url = document.querySelector("input.add-image-link").value

        if (url) {
            document.querySelector("div.newpost-media-body").setAttribute("media-url", url)
            document.querySelector("div.newpost-media-body").setAttribute("media-type", "img")
            document.querySelector("div.newpost-media-space").classList.remove("hidden")
            document.querySelector("div.newpost-media-body").innerHTML = `<img src="${url}" class="newpost-media">`
        }

        fechar.newPost.addImage()
        addImage.clearInput()
    }
}

var addVideo = {
    inputLoad: (url) => {
        document.querySelector("input.add-video-input").value = url
        document.querySelector("input.add-video-input").classList.add("no-radius")
        document.querySelector("button.add-video-clear").classList.remove("hidden")
        document.querySelector("input.add-video-input").focus()
    },
    inputClear: (value) => {
        if (value) {
            document.querySelector("button.add-video-clear").classList.remove("hidden")
            document.querySelector("input.add-video-input").classList.add("no-radius")
        } else {
            document.querySelector("button.add-video-clear").classList.add("hidden")
            document.querySelector("input.add-video-input").classList.remove("no-radius")
        }
    },
    clearInput: () => {
        document.querySelector("input.add-video-input").value = ""
        document.querySelector("input.add-video-input").classList.remove("no-radius")
        document.querySelector("button.add-video-clear").classList.add("hidden")
        document.querySelector("input.add-video-input").focus()
    },
    loadPreview: (url) => {
        document.querySelector("div.add-video-preview-around").innerHTML = `
            <video class="add-video-preview" controls>
                <source src="${url}" class="add-video-source" type="video/mp4">
            </video>
        `
    },
    send: () => {
        let url = document.querySelector("input.add-video-input").value

        if (url) {
            document.querySelector("div.newpost-media-body").setAttribute("media-url", url)
            document.querySelector("div.newpost-media-body").setAttribute("media-type", "vid")
            document.querySelector("div.newpost-media-space").classList.remove("hidden")
            document.querySelector("div.newpost-media-body").innerHTML = `
                <video class="newpost-media" controls>
                    <source src="${url}" type="video/mp4">
                </video>
            `
        }

        fechar.newPost.addVideo()
        addVideo.clearInput()
    }
}

var addRespMedia = {
    select: () => {
        document.querySelector("div.resp-media-select-space").classList.remove("hidden")
        document.querySelector("html").classList.add("no-scroll")
    },
    closeSelect: () => {
        document.querySelector("div.resp-media-select-space").classList.add("hidden")
        document.querySelector("html").classList.remove("no-scroll")
    },
    setImage: (url) => {
        let validImage = () => {
            document.querySelector("div.post-reply-reply-media-body").innerHTML = `<img src="${url}" title="${url}" class="post-reply-reply-media">`
            document.querySelector("div.post-reply-reply-media-body").setAttribute("media-url", url)
            document.querySelector("div.post-reply-reply-media-body").setAttribute("media-type", "img")
            document.querySelector("div.post-reply-reply-media-space").classList.remove("hidden")
            addRespMedia.closeSelect()
        }

        let invalidImage = () => {
            warning.new(`
                <span en="The entered URL is invalid!"
                    >A URL inserida é inválida!</span>
            `)
        }

        let testImage = () => {
            let f = new Image()
            f.onload = validImage
            f.onerror = invalidImage
            f.src = url
        }
        testImage()
    },
    clearImage: () => {
        document.querySelector("div.post-reply-reply-media-space").classList.add("hidden")
        document.querySelector("div.post-reply-reply-media-body").removeAttribute("media-url")
        document.querySelector("div.post-reply-reply-media-body").removeAttribute("media-type")
    },
    image: {
        open: () => {
            document.querySelector("div.resp-img-space").classList.remove("hidden")
        },
        send: () => {
            let imagem = document.querySelector("input.resp-img-input").value

            if (!imagem)
                return warning.new(`
                    <span en="You need to enter a valid URL!"
                        >Você precisa inserir uma URL válida!</span>
                `)

            addRespMedia.setImage(imagem)
            addRespMedia.image.close()
        },
        close: () => {
            document.querySelector("div.resp-img-space").classList.add("hidden")
            document.querySelector("input.resp-img-input").value = ""
        }
    },
    setVideo: (url) => {
        document.querySelector("div.post-reply-reply-media-body").innerHTML = `
            <video class="post-reply-reply-media" controls>
                <source src="${url}" type="video/mp4">
            </video>
        `
        document.querySelector("div.post-reply-reply-media-body").setAttribute("media-url", url)
        document.querySelector("div.post-reply-reply-media-body").setAttribute("media-type", "vid")
        document.querySelector("div.post-reply-reply-media-space").classList.remove("hidden")
        addRespMedia.closeSelect()
    },
    video: {
        open: () => {
            document.querySelector("div.resp-vid-space").classList.remove("hidden")
        },
        send: () => {
            let url = document.querySelector("input.resp-vid-input").value

            if (!url)
                return warning.new(`
                    <span en="You need to enter a valid URL!"
                        >Você precisa inserir uma URL válida!</span>
                `)

            addRespMedia.setVideo(url)
            addRespMedia.video.close()
        },
        close: () => {
            document.querySelector("div.resp-vid-space").classList.add("hidden")
            document.querySelector("input.resp-vid-input").value = ""
        }
    },
    gallery: {
        open: () => {
            let src = document.querySelector("input.gallery-resp-search").value
            document.querySelector("div.gallery-resp-space").classList.remove("hidden")

            let imagens = faceBackend.get.user.gallery(usuarioAtual?.codigo, "img", src)
            let container = document.querySelector("div.gallery-resp-list")
            container.innerHTML = ""

            for (let i = 0; i < imagens.length; i++) {
                container.innerHTML += `
                <div class="gallery-resp-item def-ripple" title="${imagens[i].nome}" onclick="addRespMedia.gallery.send('${imagens[i].url}')">
                    <img src="${imagens[i].url}" alt="Imagem não encontrada.">
                </div>
                `
            }

            if (imagens.length < 1)
                container.innerHTML = `<span class="gallery-resp-nothing" en="No images =(">Sem imagens =(</span>`

            lang.update("div.gallery-resp-space *")
            def.update()
        },
        send: (url) => {
            addRespMedia.setImage(url)
            addRespMedia.gallery.close()
        },
        close: () => {
            document.querySelector("div.gallery-resp-space").classList.add("hidden")
        }
    }
}

var zoom = {
    image: (src, nome) => {
        document.querySelector("span.image-zoom-title-name").innerText = nome
        document.querySelector("div.page-content").classList.add("non-focused-content")
        document.querySelector("img.image-zoom-image").setAttribute("src", src)
        document.querySelector("div.image-zoom-option").setAttribute("image-url", src)
        document.querySelector("div.image-zoom-space").classList.remove("hidden")
        document.querySelector("html").classList.add("no-scroll")
        msg.new(
            {
                text:
                {
                    pt: "Dica: clique novamente sobre a imagem para uma visualização em tela cheia ;)",
                    en: "Hint: click again on the image for a fullscreen-view ;)"
                },
                time: 3
            }
        )
    },
    closeImage: () => {
        document.querySelector("div.page-content").classList.remove("non-focused-content")
        document.querySelector("div.image-zoom-space").classList.add("hidden")
        document.querySelector("html").classList.remove("no-scroll")
    }
}

var excluir = {
    post: (codigoPost) => {
        if (!usuarioAtual)
            return console.error(`Não é possível acessar esta opção sem fazer login!`)

        document.querySelector("button.delpost-confirm").setAttribute("post-code", codigoPost)
        document.querySelector("div.delpost-space").classList.remove("hidden")
        document.querySelector("html").classList.add("no-scroll")
    },
    resposta: (codigoPost, codigoResp) => {
        if (!usuarioAtual)
            return console.error("Não é possível acessar esta opção sem fazer login!")

        document.querySelector("button.delpost-confirm").setAttribute("post-code", codigoPost)
        document.querySelector("button.delpost-confirm").setAttribute("resp-code", codigoResp)
        document.querySelector("div.delpost-space").classList.remove("hidden")
        document.querySelector("html").classList.add("no-scroll")
    },
    cancel: () => {
        document.querySelector("button.delpost-confirm").removeAttribute("post-code")
        document.querySelector("button.delpost-confirm").removeAttribute("resp-code")
        document.querySelector("div.delpost-space").classList.add("hidden")
        document.querySelector("html").classList.remove("no-scroll")
    }
}

var loginPopup = {
    open: () => {
        document.querySelector("div.req-login-space").classList.remove("hidden")
        document.querySelector("html").classList.add("no-scroll")
    },
    close: () => {
        document.querySelector("div.req-login-space").classList.add("hidden")
        document.querySelector("html").classList.remove("no-scroll")
    }
}

var unavailable = {
    open: () => {
        document.querySelector("div.unavailable-space").classList.remove("hidden")
    },
    close: () => {
        document.querySelector("div.unavailable-space").classList.add("hidden")
    }
}

var edit = {
    open: (codigo) => {
        let editavel = backend.request.edit.isEditable(codigo)

        if (!editavel)
            return warning.new(`
                <span en="This post cannot be edited"
                    >Não é possível editar esta postagem!</span>
                <br>
                <span en="The post cannot have ratings and must be yours."
                    >Ela não pode ter avaliações e deve ser sua.</span>
            `)

        let editIcon = document.querySelectorAll("div.post-options")
        for (let e = 0; e < editIcon.length; e++) {
            if (editIcon[e].getAttribute("post-code") === codigo) {
                editIcon[e].classList.add("hidden")
                break
            }
        }

        let editOptions = document.querySelectorAll("div.post-edit-options")
        for (let e = 0; e < editOptions.length; e++) {
            if (editOptions[e].getAttribute("post-code") === codigo) {
                editOptions[e].classList.remove("hidden")
                break
            }
        }
    }
}

function selectTab(tab) {
    let value = tab.getAttribute("value")
    let titulo = tab.getAttribute("titulo")

    if (document.querySelector("div.fb-social-bottom").getAttribute("selected-tab") === value)
        return

    param.set("social-tab", value)
    document.querySelector("div.fb-social-bottom").setAttribute("selected-tab", value)
    document.querySelector("div.fbs-title-space").innerHTML = `<span class="fbs-title">${titulo}</span>`
    document.querySelectorAll("div.fbs-tab").forEach(tab => {
        tab.classList.remove("fbs-selected-tab")
    })
    tab.classList.add("fbs-selected-tab")

    document.querySelectorAll("div.fbs-tab-content").forEach(tab => {
        if (tab.getAttribute("tab") === value) {
            tab.classList.remove("hidden")
        } else {
            tab.classList.add("hidden")
        }
    })
}

var galeria = {
    abrir: () => {
        document.querySelector("div.gallery-space").classList.remove("hidden")
        let src = document.querySelector("input.gallery-search").value
        let imagens = faceBackend.get.user.gallery(usuarioAtual?.codigo, "img", src)
        let container = document.querySelector("div.gallery-images-space")
        container.innerHTML = ""

        for (let i = 0; i < imagens.length; i++) {
            container.innerHTML += `
            <div class="gallery-item def-ripple" onclick="galeria.info.abrir(this)" gl-name="${imagens[i].nome}" gl-url="${imagens[i].url}" gl-code="${imagens[i].codigo}" title="${imagens[i].nome}">
                <div class="gallery-item-content">
                    <div class="gallery-item-top">
                        <img src="${imagens[i].url}">
                    </div>
                    <div class="gallery-item-body">
                        <span class="gallery-item-name">${imagens[i].nome}</span>
                    </div>
                </div>
            </div>
            `
        }

        if (imagens.length < 1)
            container.innerHTML = `<span class="gallery-no-content" en="No images =(">Sem imagens =(</span>`

        document.querySelector("html").classList.add("no-scroll")
        lang.update("span.gallery-no-content")
        def.update()
    },
    fechar: () => {
        document.querySelector("div.gallery-space").classList.add("hidden")
        document.querySelector("html").classList.remove("no-scroll")
    },
    abrirInput: () => {
        document.querySelector("div.gallery-add-space").classList.remove("hidden")
    },
    fecharInput: () => {
        document.querySelector("div.gallery-add-space").classList.add("hidden")
        document.querySelector("div.gallery-add-alert").classList.add("hidden")
        document.querySelector("input.gallery-add-title").value = ""
        document.querySelector("input.gallery-add-url").value = ""
        galeria.preview()
    },
    addWarn: (aviso) => {
        let res = {}
        if (aviso === "empty") {
            res.pt = "<b>Ei!</b><br>Você precisa precisa preencher todos os campos para adicionar a imagem."
            res.en = "Hey!<br>You might fill all fields to add the image."
        }

        if (aviso === "notfound") {
            res.pt = "Não é possível adicionar esta imagem à galeria, pois ela não foi encontrada. :/"
            res.en = "Can't add this image to the gallery, because it was not found. :/"
        }

        if (aviso === "error") {
            res.pt = "Eita, ocorreu um erro desconhecido; não foi possível adicionar a imagem à galeria =(<br>Tente novamente mais tarde e se caso esse problema persistir, avise-nos através da página de feedback."
            res.en = "Something went wrong; we couldn't add the image to the gallery =(. Try again later and if the problem persists, warn us via the feedback page."
        }

        document.querySelector("span.gallery-add-alert-text").innerHTML = res.pt
        document.querySelector("span.gallery-add-alert-text").setAttribute("en", res.en)
        lang.update("span.gallery-add-alert-text")
        document.querySelector("div.gallery-add-alert").classList.remove("hidden")
    },
    adicionar: () => {
        let titulo = document.querySelector("input.gallery-add-title").value
        let url = document.querySelector("input.gallery-add-url").value

        if (!titulo || !url)
            return galeria.addWarn("empty")

        let invalidImage = () => {
            isValid = false
            galeria.addWarn("notfound")
        }

        let validImage = () => {
            let infos = {
                url: url,
                titulo: titulo
            }
            let push = faceBackend.request.gallery.add(infos, usuarioAtual?.codigo)
            if (push) {
                galeria.abrir()
                galeria.fecharInput()
                msg.new({ text: { pt: "Imagem adicionada à galeria", en: "Image added to gallery" }, time: 5 })
            } else {
                galeria.addWarn("error")
            }
        }

        let testImage = () => {
            let f = new Image()
            f.onload = validImage
            f.onerror = invalidImage
            f.src = url
        }
        testImage()
    },
    preview: (src) => {
        if (!src) {
            document.querySelector("div.gallery-add-bottom").classList.add("hidden")
        } else {
            document.querySelector("img.gallery-add-preview").setAttribute("src", src)
            document.querySelector("div.gallery-add-bottom").classList.remove("hidden")
        }
    },
    abrirRapido: (btn) => {
        let url = btn.getAttribute("image-url")
        galeria.abrirInput()
        document.querySelector("input.gallery-add-url").value = url
        document.querySelector("input.gallery-add-title").focus()
        document.querySelector("input.gallery-add-url").onblur()
    },
    keydown: () => {
        document.querySelector("input.gallery-search").addEventListener("keydown", e => {
            if (e.keyCode === 13)
                document.querySelector("button.gallery-search-send").onclick()
        })
    },
    info: {
        abrir: (item) => {
            document.querySelector("div.gallery-info-space").classList.remove("hidden")

            let nome = item.getAttribute("gl-name")
            let url = item.getAttribute("gl-url")
            let codigo = item.getAttribute("gl-code")

            document.querySelector("button.gallery-info-confirm").setAttribute("onclick", `galeria.info.confirm('${codigo}')`)
            document.querySelector("input.gallery-info-name").value = nome
            document.querySelector("input.gallery-info-url").value = url
            document.querySelector("div.gallery-info-pv img").setAttribute("src", url)
            document.querySelector("button.gallery-info-del").setAttribute("onclick", `galeria.delete.open('${codigo}')`)
            document.querySelector("input.gallery-info-name").focus()
        },
        fechar: () => {
            document.querySelector("div.gallery-info-space").classList.add("hidden")
            document.querySelector("input.gallery-info-name").value = ""
            document.querySelector("input.gallery-info-url").value = ""
            document.querySelector("div.gallery-info-pv img").removeAttribute("src")
        },
        copiarURL: () => {
            let url = document.querySelector("input.gallery-info-url").value
            navigator.clipboard.writeText(url)
            msg.new({ text: { pt: "Copiado para a área de transferência", en: "Copied to clipboard" }, time: 3 })
        },
        confirm: (codigo) => {
            let nome = document.querySelector("input.gallery-info-name").value
            let url = document.querySelector("input.gallery-info-url").value

            if (!nome || !url) {
                let ln = lang.get.selected()

                if (ln === "en") {
                    return alert("We coudn't edit the image infos. All fields may be filled.")
                } else {
                    return alert("Não foi possível editar informações da imagem. Todos os campos devem ser preenchidos.")
                }
            }

            let valid = () => {
                let infos = {
                    nome: nome,
                    url: url,
                    codigo: codigo
                }

                let conf = faceBackend.request.gallery.change(infos, usuarioAtual?.codigo)

                if (!conf) {
                    let ln = lang.get.selected()

                    if (ln === "en") {
                        alert("Oops... we couldn't change the image infos. Make sure that there's no other image with the same name or if the URL is valid.")
                    } else {
                        alert("Ops... não foi possível editar informações da imagem. Certifique-se de que não haja nenhuma outra imagem com o mesmo nome ou se a URL é valida.")
                    }
                    return
                }

                galeria.info.fechar()
                galeria.abrir()
                msg.new({ text: { pt: "Informações atualizadas", en: "Informations updated" }, time: 3 })
            }

            let invalid = () => {
                let ln = lang.get.selected()

                if (ln === "en") {
                    alert("We couldn't change the image infos. Make sure that the entered URL is valid.")
                } else {
                    alert("Não foi possível editar informações da imagem. Certifique-se de que a URL inserida é válida.")
                }
            }

            let testImage = () => {
                let f = new Image()
                f.onload = valid
                f.onerror = invalid
                f.src = url
            }
            testImage()
        }
    },
    delete: {
        open: (codigo) => {
            document.querySelector("div.gallery-delconfirm-space").classList.remove("hidden")
            document.querySelector("button.gallery-delconfirm-confirm").setAttribute("onclick", `galeria.delete.send('${codigo}')`)
        },
        close: () => {
            document.querySelector("div.gallery-delconfirm-space").classList.add("hidden")
        },
        send: (codigo) => {
            let rm = faceBackend.request.gallery.remove(codigo, usuarioAtual?.codigo)

            if (!rm)
                return alert("Não foi possível excluir a imagem :( tente novamente mais tarde")

            galeria.delete.close()
            galeria.info.fechar()
            galeria.abrir()
            msg.new({ text: { pt: "Imagem removida da galeria", en: "Image removed from gallery" }, time: 3 })
        }
    }
}
galeria.keydown()

async function visit(codigo) {
    if (!codigo)
        return console.error(`Não foi possível mover para página do usuário:\nCódigo não recebido`)

    await db.rede.save()
    param.set("visiting", codigo)

    let prms = param.list.select(["lang", "visiting"])
    local.set("../../user/pages/user.html", prms)
}

var fullScreenImage = {
    open: (img) => {
        img.setAttribute("onclick", "fullScreenImage.close(this)")
        img.webkitRequestFullScreen()
    },
    close: (img) => {
        img.setAttribute("onclick", "fullScreenImage.open(this)")
        document.exitFullscreen()
    }
}

var wallPaper = {
    auto: () => {
        let sel = usuarioAtual?.config.aparencia.fundo.selecionado
        if (!sel) {
            let url = usuarioAtual?.config.aparencia.fundo.url
            if (!url) {
                document.querySelector("div.page-background").innerHTML = ""
            } else {
                wallPaper.set(url)
            }
        } else {
            let lista = usuarioAtual?.config.aparencia.fundo.pacotes
            for (let l in lista) {
                if (lista[l].codigo === sel) {
                    wallPaper.setSlides(lista[l])
                    break
                }
            }
        }
    },
    set: (url) => {
        document.querySelector("div.page-background").innerHTML = `
            <img src="${url}" class="background">
        `
    },
    setSlides: (infos) => {
        let lista = infos.imagens
        let intervalo = infos.intervalo + "000"
        let opacidade = infos.opacidade
        let transicao = infos.transicao
        let container = document.querySelector("div.page-background")

        if (lista.length < 1)
            return container.innerHTML = ""

        let num = Math.round(rng(lista.length - 1))
        let fundo = document.createElement("img")
        fundo.src = lista[num].url
        fundo.style.filter = `brightness(${opacidade})`

        if (transicao) {
            fundo.classList.add(`background-${transicao}`)
        }

        container.appendChild(fundo)

        setTimeout(() => {
            wallPaper.setSlides(infos)
            setTimeout(() => {
                fundo.remove()
            }, intervalo)
        }, intervalo)
    }
}
wallPaper.auto()

function rng(max) {
    if (max <= 0)
        return 0

    let res = Math.random() * max
    if (res > max)
        return rng(max)
    return res
}