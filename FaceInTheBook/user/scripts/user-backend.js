var usrBackend = {
    get: {
        user: {
            isLogged: () => {
                let is = db.rede.usuarioAtual()

                if (!is)
                    return false

                if (!is.nome)
                    return false

                return true
            },
            infos: (codigo) => {
                for (let u = 0; u < usuarios.length; u++) {
                    if (usuarios[u].codigo === codigo)
                        return usuarios[u]
                }
                return false
            },
            friendInfo: () => {
                if (!visitando || !getBackendInfo.isLogged() || visitando?.codigo === usuarioAtual?.codigo)
                    return false

                for (let f = 0; f < visitando.amigos.length; f++) {
                    if (visitando.amigos[f].codigo === usuarioAtual?.codigo)
                        return "friend"
                }

                for (let s = 0; s < visitando.solicitacoes.recebidas.length; s++) {
                    if (visitando.solicitacoes.recebidas[s] === usuarioAtual?.codigo)
                        return "sent"
                }

                for (let s = 0; s < visitando.solicitacoes.enviadas.length; s++) {
                    if (visitando.solicitacoes.enviadas[s] === usuarioAtual?.codigo)
                        return "received"
                }

                return "none"
            },
            lastAchievement: (codigo) => {
                for (let u = 0; u < usuarios.length; u++) {
                    if (usuarios[u].codigo === codigo)
                        return usuarios[u].conquistas[usuarios[u].conquistas.length - 1]
                }
                return false
            },
            posts: (codigo, codigoVisitante) => {
                // Usará o codigoVisitante para saber se o usuário é amigo caso o usuário da página tenha selecionado 'somente amigos' nas opções de postagem
                if (!codigo) {
                    console.error(`Não foi possível obter postagens do usuário:\ncodigo não recebido`)
                    return []
                }

                try {

                    let visitante
                    for (let u in usuarios) {
                        if (usuarios[u].codigo === codigoVisitante) {
                            visitante = usuarios[u]
                            break
                        }
                    }

                    if (!visitante) {
                        console.warn(`Problema ao obter postagens do usuário:\nVisitante não encontrado com o código ${codigoVisitante}`)
                        return []
                    }
                    
                    let vis = visitante.config.perfil.postagens

                    if (vis === "none" && codigoVisitante !== codigo) {
                        if (codigoVisitante === codigo) {
                            return visitante.perfil.postagens
                        } else {
                            return []
                        }
                    } else if (vis === "amigos" && codigoVisitante !== codigo) {
                        for (let a in visitante.amigos) {
                            if (visitante.amigos[a].codigo === codigo)
                                return visitante.perfil.postagens
                        }
                    } else {
                        return visitante.perfil.postagens
                    }

                    console.warn(`Problema ao obter postagens do usuário:\nNenhum usuário com o código inserido foi encontrado.`)
                    return []

                } catch (err) {
                    console.error(`Não foi possível obter postagens do usuário:\n${err.stack}`)
                    return []
                }
            }
        },
        visiting: (cod) => {
            // cod = código da visita

            if (!cod)
                return false

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === cod)
                    return usuarios[u]
            }

            return false
        }
    },
    request: {
        post: (conteudo) => {
            if (!conteudo.conteudo.texto) {
                if (!conteudo.conteudo.midia.url) {
                    console.error(`Não foi possível fazer a postagem no perfil:\nNão há conteúdo na postagem!`)
                    return false
                }
            }

            try {

                conteudo.avaliacoes = {
                    gostei: [],
                    naoGostei: []
                }
                conteudo.codigo = `${conteudo.por}-${code.new(24)}`
                conteudo.timestamp = getTime().timestamp

                for (let u = 0; u < usuarios.length; u++) {
                    if (usuarios[u].codigo === conteudo.por) {
                        usuarios[u].perfil.postagens.push(conteudo)
                        if (usuarios[u].codigo === usuarioAtual?.codigo)
                            usuarioAtual?.perfil?.postagens.push(conteudo)

                        return true
                    }
                }
                console.warn(`Postagem não enviada:\nUsuário não encontrado`)
                return false

            } catch (err) {
                console.error(`Não foi possível fazer a postagem no perfil:\n${err.stack}`)
                return false
            }
        },
        postLike: (codigoPost, codigoDono, codigoUsuario) => {},
        postDislike: (codigoPost, codigoDono, codigoUsuario) => {},
        delPost: (codigo) => {
            if (!codigo) {
                console.error(`Não foi possível excluir postagem:\ncódigo não recebido.`)
                return false
            }

            try {

                let postagens = visitando.perfil.postagens
                for (let p in postagens) {
                    if (postagens[p].codigo === codigo) {
                        postagens.splice(p, 1)
                        usuarioAtual.perfil.postagens.splice(p, 1)
                        return true
                    }
                }
                console.warn(`Problema ao excluir postagem:\nPostagem não encontrada.`)
                return false

            } catch (err) {
                console.error(`Não foi possível excluir postagem:\n${err.stack}`)
                return false
            }
        }
    }
}