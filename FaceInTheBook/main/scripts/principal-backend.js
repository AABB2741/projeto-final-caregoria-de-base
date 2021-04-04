var usuarioAtual = db.rede.usuarioAtual()
var usuarios = db.rede.usuarios()
var posts = db.get("posts") || []

var sync = {
    users: () => {
        if (!usuarioAtual)
            return

        for (let u = 0; u < usuarios.length; u++) {
            if (usuarios[u].codigo === usuarioAtual?.codigo) {
                usuarios[u] = usuarioAtual
                break
            }
        }
    }
}

backend = {
    get: {
        user: {
            isLogged: () => {
                let is = db.rede.usuarioAtual()

                if (!is)
                    return false

                if (!is.nome)
                    return false

                return true
            }
        },
        posts: (filters) => {
            if (!filters)
                return posts

            let visivel = []
            let almost = []
            let res = []

            for (let t = 0; t < posts.length; t++) {
                if (posts[t].conteudo.texto.toLowerCase().includes(filters.src.toLowerCase())) {
                    visivel.push(posts[t])
                }
            }

            for (let v = 0; v < visivel.length; v++) {
                if (visivel[v].visibilidade === "private") {
                    if (visivel[v].por === usuarioAtual?.codigo) {
                        almost.push(visivel[v])
                    } else {
                        for (let a = 0; a < usuarioAtual?.amigos?.length; a++) {
                            if (usuarioAtual.amigos[a].codigo === visivel[v].por) {
                                almost.push(visivel[v])
                                break
                            }
                        }
                    }

                } else if (visivel[v].visibilidade === "unlisted") {
                    if (visivel[v].por === usuarioAtual?.codigo) {
                        almost.push(visivel[v])
                    }
                } else if (visivel[v].visibilidade === "public") {
                    almost.push(visivel[v])
                }
            }

            // Filtros
            if (filters.filtro === "none") {
                res = almost
            }

            if (filters.filtro === "friends") {
                for (let a = 0; a < almost.length; a++) {
                    for (let f = 0; f < usuarioAtual.amigos.length; f++) {
                        if (almost[a].por === usuarioAtual.amigos[f].codigo) {
                            res.push(almost[a])
                            break
                        }
                    }
                }
            }

            if (filters.filtro === "restricted") {
                for (let a = 0; a < almost.length; a++) {
                    if (almost[a].visibilidade === "private") {
                        res.push(almost[a])
                    }
                }
            }

            if (filters.filtro === "media") {
                for (let a = 0; a < almost.length; a++) {
                    if (almost[a].conteudo.midia.url) {
                        res.push(almost[a])
                    }
                }
            }

            if (filters.filtro === "mention") {
                for (let a = 0; a < almost.length; a++) {
                    for (let m = 0; m < almost[a].mencoes.length; m++) {
                        if (almost[a].mencoes[m] === usuarioAtual.codigo) {
                            res.push(almost[a])
                            break
                        }
                    }
                }
            }

            if (filters.filtro === "favorites") {
                for (let a = 0; a < almost.length; a++) {
                    for (let f = 0; f < usuarioAtual.favoritos.postagens.length; f++) {
                        if (almost[a].codigo === usuarioAtual.favoritos.postagens[f]) {
                            res.push(almost[a])
                            break
                        }
                    }
                }
            }

            if (filters.filtro === "mine") {
                for (let a = 0; a < almost.length; a++) {
                    if (almost[a].por === usuarioAtual.codigo) {
                        res.push(almost[a])
                    }
                }
            }

            if (filters.filtro === "spoiler") {
                for (let a = 0; a < almost.length; a++) {
                    if (!almost[a].avisos.spoiler && !almost[a].avisos.nsfw) {
                        res.push(almost[a])
                    }
                }
            }

            if (filters.filtro === "dev") { // Terminar depois

            }

            // Ordem
            if (filters.ordem === "newest") {
                res.sort((a, b) => {
                    return b.timestamp - a.timestamp
                })
            }

            if (filters.ordem === "oldest") {
                res.sort((a, b) => {
                    return a.timestamp - b.timestamp
                })
            }

            if (filters.ordem === "likes") {
                res.sort((a, b) => {
                    return (b.avaliacoes.gostei.length - b.avaliacoes.naoGostei.length) - (a.avaliacoes.gostei.length - a.avaliacoes.naoGostei.length)
                })
            }

            if (filters.ordem === "reactions") {
                res.sort((a, b) => {
                    return b.reacoes.length - a.reacoes.length
                })
            }

            return res
        },
        postAnswers: (codigo, filters) => {
            for (let p = 0; p < posts.length; p++) {
                if (posts[p].codigo === codigo) {
                    if (filters?.sort === "newest") {
                        return posts[p].respostas.slice().reverse()
                    }

                    if (filters?.sort === "oldest") {
                        return posts[p].respostas
                    }
                }
            }
        },
        post: (codigo) => {
            if (!codigo) {
                console.error(`Não foi possível obter postagem:\nCódigo não recebido`)
                return false
            }

            try {
                for (let p = 0; p < posts.length; p++) {
                    if (posts[p].codigo === codigo)
                        return posts[p]
                }
            } catch (err) {
                console.error(`Não foi possível obter postagem:\n${err.stack}`)
                return false
            }
        },
        social: {
            friends: {
                
            }
        }
    },
    request: {
        post: {
            new: (postagem) => {
                if (typeof postagem !== "object")
                    return warning.new(`Ocorreu um erro durante a postagem. Tente novamente mais tarde.`)

                try {
                    if (!postagem.por)
                        return console.error("ID Não recebido.")

                    let createCode = () => {
                        let chars = "abcdefghijklmnopqrstuvwxyz0123456789+$#@!"
                        let res = ""

                        for (let c = 0; c < 24; c++) {
                            let char = chars[Math.round(Math.random() * (chars.length - 1))]

                            if (Math.random() > 0.5)
                                char = char.toUpperCase()

                            res += char
                        }

                        return `${usuarioAtual.codigo}-${res}`
                    }

                    let getMentions = () => {
                        let noSpaced = postagem.conteudo.texto.split(" ")
                        let res = []
                        for (let m = 0; m < noSpaced.length; m++) {
                            if (noSpaced[m].startsWith("@")) {
                                let name = noSpaced[m].replace(/@/g, "")
                                for (let u = 0; u < usuarios.length; u++) {
                                    if (usuarios[u].nome.toLowerCase() === name.toLowerCase()) {
                                        let jaMencionou = false
                                        for (let n = 0; n < res.length; n++) {
                                            if (res[n] === usuarios[u].codigo) {
                                                jaMencionou = true
                                                break
                                            }
                                        }
                                        if (!jaMencionou) {
                                            res.push(usuarios[u].codigo)
                                        }

                                        break
                                    }
                                }
                            }
                        }
                        return res
                    }

                    postagem.timestamp = getTime().timestamp
                    postagem.codigo = createCode()
                    postagem.avaliacoes = {
                        gostei: [],
                        naoGostei: []
                    }
                    postagem.respostas = []
                    postagem.compartilhamentos = []
                    postagem.reacoes = []
                    postagem.denuncias = []
                    postagem.mencoes = getMentions()

                    posts.push(postagem)

                    for (let m = 0; m < postagem.mencoes.length; m++) {
                        if (postagem.mencoes[m] === postagem.por) {
                            newPost.sczo(postagem.por)
                            break
                        }
                    }

                    return true
                } catch (err) {
                    return warning.new(`<span en="There's an mistake:">Ocorreu um erro:</span><br><span>${err.stack}</span>`)
                }
            },
            rate: {
                like: (icon) => {
                    if (!usuarioAtual)
                        return console.error(`Usuário não conectado`)

                    let postCode = icon.getAttribute("post-code")
                    let dislikeIcons = document.querySelectorAll("i.post-dislike")
                    for (let d = 0; d < dislikeIcons.length; d++) {
                        if (dislikeIcons[d].getAttribute("post-code") === postCode) {
                            dislikeIcons = dislikeIcons[d]
                            break
                        }
                    }

                    let postPosition
                    for (let p = 0; p < posts.length; p++) {
                        if (posts[p].codigo === postCode) {
                            postPosition = p
                            let alreadyLiked = false

                            for (let d = 0; d < posts[p].avaliacoes.naoGostei.length; d++) {
                                if (posts[p].avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                                    posts[p].avaliacoes.naoGostei.splice(d, 1)
                                    remoteControl.undislikeAnimation(dislikeIcons)
                                    break
                                }
                            }

                            for (let g = 0; g < posts[p].avaliacoes.gostei.length; g++) {
                                if (posts[p].avaliacoes.gostei[g] === usuarioAtual?.codigo) {
                                    alreadyLiked = true
                                    posts[p].avaliacoes.gostei.splice(g, 1)
                                    remoteControl.unlikeAnimation(icon)
                                    break
                                }
                            }

                            if (!alreadyLiked) {
                                posts[p].avaliacoes.gostei.push(usuarioAtual?.codigo)
                                remoteControl.likeAnimation(icon)
                            }

                            break
                        }
                    }

                    let likeVs = document.querySelectorAll("span.post-likesdislikes")
                    for (let l = 0; l < likeVs.length; l++) {
                        if (likeVs[l].getAttribute("post-code") === postCode) {
                            likeVs[l].innerHTML = posts[postPosition].avaliacoes.gostei.length - posts[postPosition].avaliacoes.naoGostei.length
                            break
                        }
                    }


                },
                dislike: (icon) => {
                    if (!usuarioAtual)
                        return console.error(`Usuário não conectado`)

                    let postCode = icon.getAttribute("post-code")
                    let postPosition

                    let likeIcons = document.querySelectorAll("i.post-like")
                    for (let l = 0; l < likeIcons.length; l++) {
                        if (likeIcons[l].getAttribute("post-code") === postCode) {
                            likeIcons = likeIcons[l]
                            break
                        }
                    }

                    for (let p = 0; p < posts.length; p++) {
                        if (posts[p].codigo === postCode) {
                            let disliked = false
                            postPosition = p

                            for (let l = 0; l < posts[p].avaliacoes.gostei?.length; l++) {
                                if (posts[p].avaliacoes.gostei[l] === usuarioAtual?.codigo) {
                                    posts[p].avaliacoes.gostei.splice(l, 1)
                                    remoteControl.unlikeAnimation(likeIcons)
                                    break
                                }
                            }

                            for (let d = 0; d < posts[p].avaliacoes.naoGostei?.length; d++) {
                                if (posts[p].avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                                    disliked = true
                                    posts[p].avaliacoes.naoGostei.splice(d, 1)
                                    remoteControl.undislikeAnimation(icon)
                                    break
                                }
                            }

                            if (!disliked) {
                                posts[p].avaliacoes.naoGostei.push(usuarioAtual?.codigo)
                                remoteControl.dislikeAnimation(icon)
                            }

                            break
                        }
                    }

                    remoteControl.recount(postCode, postPosition)
                },
                likeReply: (codigoResp, codigoPost, icones) => {
                    if (!usuarioAtual)
                        return console.error(`Usuário não conectado`)

                    let postPosition
                    let dislikeIcon = icones.dislike
                    let icone = icones.like

                    for (let p = 0; p < posts.length; p++) {
                        if (posts[p].codigo === codigoPost) {
                            postPosition = p
                            for (let r = 0; r < posts[p].respostas.length; r++) {
                                if (posts[p].respostas[r].codigo === codigoResp) {
                                    for (let d = 0; d < posts[p].respostas[r].avaliacoes.naoGostei.length; d++) {
                                        if (posts[p].respostas[r].avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                                            posts[p].respostas[r].avaliacoes.naoGostei.splice(d, 1)
                                            remoteControl.reply.undislikeAnimation(dislikeIcon)
                                            break
                                        }
                                    }

                                    let existe = false
                                    for (let l = 0; l < posts[p].respostas[r].avaliacoes.gostei.length; l++) {
                                        if (posts[p].respostas[r].avaliacoes.gostei[l] === usuarioAtual?.codigo) {
                                            existe = true
                                            posts[p].respostas[r].avaliacoes.gostei.splice(l, 1)
                                            remoteControl.reply.unlikeAnimation(icone)
                                            break
                                        }
                                    }

                                    if (!existe) {
                                        posts[p].respostas[r].avaliacoes.gostei.push(usuarioAtual?.codigo)
                                        remoteControl.reply.likeAnimation(icone)
                                    }
                                    break
                                }
                            }
                            break
                        }
                    }

                    remoteControl.reply.recount(codigoResp, postPosition)
                },
                dislikeReply: (codigoResp, codigoPost, icones) => {
                    if (!usuarioAtual)
                        return console.error(`Usuário não conectado`)
                    let postPosition
                    let likeIcon = icones.like
                    let icone = icones.dislike

                    for (let p = 0; p < posts.length; p++) {
                        if (posts[p].codigo === codigoPost) {
                            postPosition = p
                            for (let r = 0; r < posts[p].respostas.length; r++) {
                                if (posts[p].respostas[r].codigo === codigoResp) {
                                    for (let l = 0; l < posts[p].respostas[r].avaliacoes.gostei.length; l++) {
                                        if (posts[p].respostas[r].avaliacoes.gostei[l] === usuarioAtual?.codigo) {
                                            posts[p].respostas[r].avaliacoes.gostei.splice(l, 1)
                                            remoteControl.reply.unlikeAnimation(likeIcon)
                                            break
                                        }
                                    }

                                    let existe = false
                                    for (let d = 0; d < posts[p].respostas[r].avaliacoes.naoGostei.length; d++) {
                                        if (posts[p].respostas[r].avaliacoes.naoGostei[d] === usuarioAtual?.codigo) {
                                            existe = true
                                            posts[p].respostas[r].avaliacoes.naoGostei.splice(d, 1)
                                            remoteControl.reply.undislikeAnimation(icone)
                                            break
                                        }
                                    }

                                    if (!existe) {
                                        posts[p].respostas[r].avaliacoes.naoGostei.push(usuarioAtual?.codigo)
                                        remoteControl.reply.dislikeAnimation(icone)
                                        break
                                    }
                                    break
                                }
                            }
                            break
                        }
                    }

                    remoteControl.reply.recount(codigoResp, postPosition)
                }
            },
            reply: (resposta, codigo) => {
                if (!resposta || !codigo) {
                    console.error(`Erro ao criar resposta:\nCódigo ou resposta não recebido.`)
                    return false
                }

                try {
                    let post = backend.get.post(codigo)

                    if (!post) {
                        console.error(`Erro ao criar resposta:\nPostagem não encontrada`)
                        return false
                    }

                    let createCode = () => {
                        let chars = "abcdefghijklmnopqrstuvwxyz0123456789+$#@!"
                        let res = ""

                        for (let c = 0; c < 24; c++) {
                            let char = chars[Math.round(Math.random() * (chars.length - 1))]

                            if (Math.random() > 0.5)
                                char = char.toUpperCase()

                            res += char
                        }

                        for (let r = 0; r < post.respostas.length; r++) {
                            if (post.respostas[r].codigo === res)
                                return createCode()
                        }

                        return res
                    }

                    resposta.codigo = createCode()
                    resposta.timestamp = getTime().timestamp

                    if (resposta.respondendo) {
                        let existe = false

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === resposta.respondendo) {
                                existe = true
                                break
                            }
                        }
    
                        if (!existe)
                            delete resposta.respondendo
                    }

                    post.respostas.push(resposta)

                    return true
                } catch (err) {
                    console.error(`Erro ao criar resposta:\n${err.stack}`)
                    return false
                }
            },
            delete: (codigo, codigoR) => {
                if (!codigo)
                    return console.error(`Nenhum código recebido para excluir postagem!`)

                if (codigoR) {
                    for (let p = 0; p < posts.length; p++) {
                        if (posts[p].codigo === codigo) {
                            for (let r = 0; r < posts[p].respostas.length; r++) {
                                if (posts[p].respostas[r].codigo === codigoR) {
                                    posts[p].respostas.splice(r, 1)
                                    remoteControl.reply.showCounter(posts[p].respostas.length)
                                    remoteControl.reply.removeReply(codigoR)
                                    break
                                }
                            }
                            break
                        }
                    }

                    return
                }

                for (let p = 0; p < posts.length; p++) {
                    if (posts[p].codigo === codigo) {
                        if (posts[p].por !== usuarioAtual?.codigo)
                            return alert(`Não é possível excluir postagem, pois você não é o dono!`)

                        conquista.nova("ngm", posts[p].por)
                        posts.splice(p, 1)

                        for (let f = 0; f < usuarioAtual?.favoritos.postagens.length; f++) {
                            if (usuarioAtual?.favoritos.postagens[f] === codigo) {
                                usuarioAtual?.favoritos.postagens.splice(f, 1)
                                break
                            }
                        }

                        remoteControl.removePost(codigo)
                        remoteControl.showCounter()
                    }
                }
            }
        },
        edit: {
            isEditable: (codigo) => {
                for (let p = 0; p < posts.length; p++) {
                    if (posts[p].codigo === codigo) {
                        if (posts[p].avaliacoes.gostei.length === 0 && posts[p].avaliacoes.naoGostei.length === 0) {
                            if (posts[p].por === usuarioAtual?.codigo) {
                                return true
                            }
                            return false
                        } else {
                            return false
                        }
                    }
                }
                return false
            }
        }
    }
}

function autoSave() {
    db.rede.save()

    setTimeout(autoSave, 180000)
}
setTimeout(autoSave, 180000)

var friends = {
    suggestions: (codigo) => {
        if (!codigo) {
            console.error(`Erro ao carregar sugestões de amigos:\nCódigo não recebido`)
            return []
        }

        try {

            let usr
            let res = []
            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === codigo) {
                    usr = usuarios[u]
                    break
                }
            }

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo !== usr?.codigo) {
                    let existe = false
                    for (let f = 0; f < usr?.amigos.length; f++) {
                        if (usuarios[u].codigo === usr?.amigos[f].codigo) {
                            existe = true
                            break
                        }
                    }
                    for (let s = 0; s < usuarios[u].solicitacoes.recebidas.length; s++) {
                        if (usuarios[u].solicitacoes.recebidas[s] === usr?.codigo) {
                            existe = true
                            break
                        }
                    }
                    for (let s = 0; s < usuarios[u].solicitacoes.enviadas.length; s++) {
                        if (usuarios[u].solicitacoes.enviadas[s] === usr?.codigo) {
                            existe = true
                            break
                        }
                    }
                    if (!existe) {
                        res.push(usuarios[u])
                    }
                }
            }
            return res
        } catch (err) {
            console.error(`Erro ao carregar sugestões de amigos:\n${err.stack}`)
            return []
        }
    },
    requests: (codigo) => {
        if (!codigo) {
            console.error(`Erro ao carregar solicitações de amizade:\nCódigo não recebido.`)
            return []
        }

        try {

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === codigo)
                    return usuarios[u].solicitacoes.recebidas
            }
            return []

        } catch (err) {
            console.error(`Erro ao carregar solicitações de amizade:\n${err.stack}`)
            return []
        }
    },
    friends: (codigo) => {
        if (!codigo) {
            console.error(`Erro ao carregar amigos:\nCódigo não recebido`)
            return []
        }

        try {

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === codigo) {
                    let res = []
                    for (let a = 0; a < usuarios[u].amigos.length; a++) {
                        res.push(faceBackend.get.user.infos(usuarios[u].amigos[a].codigo))
                    }
                    return res
                }
            }
            return []

        } catch (err) {
            console.error(`Erro ao carregar amigos:\n${err.stack}`)
            return []
        }
    },
    sent: (codigo) => {
        if (!codigo) {
            console.error(`Não foi possível carregar solicitações enviadas:\nCódigo não recebido`)
            return []
        }

        try {

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === codigo)
                    return usuarios[u].solicitacoes.enviadas
            }
            return []

        } catch (err) {
            console.error(`Não foi possível carregar solicitações enviadas:\n${err.stack}`)
        }
    }
}