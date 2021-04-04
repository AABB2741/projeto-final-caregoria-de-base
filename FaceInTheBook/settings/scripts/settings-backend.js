var sBackend = {
    get: {
        settingsList: (code) => {
            let list = [
                {
                    nome: {
                        pt: "Geral",
                        en: "General"
                    },
                    icone: `fas fa-cogs`,
                    codigo: "geral",
                    descricao: {
                        pt: "Gerenciamento de configurações gerais do Face in the Book.",
                        en: "General settings management of Face in the Book."
                    }
                },
                {
                    nome: {
                        pt: "Perfil",
                        en: "Profile"
                    },
                    icone: `fas fa-user`,
                    codigo: "perfil",
                    descricao: {
                        pt: "Gerencie o jeito que outros usuários verão seu perfil.",
                        en: "Manage the way other users will see your profile."
                    }
                },
                {
                    nome: {
                        pt: "Segurança",
                        en: "Security"
                    },
                    icone: `fas fa-lock`,
                    codigo: "seguranca",
                    descricao: {
                        pt: "Segurança em primeiro lugar!",
                        en: "Protect your account better here."
                    }
                },
                {
                    nome: {
                        pt: "Privacidade",
                        en: "Privacy"
                    },
                    icone: `fas fa-user-ninja`,
                    codigo: "privacidade",
                    descricao: {
                        pt: "Respeitamos sua privacidade. Faça as alterações do jeito que você quiser aqui.",
                        en: "We respect your privacy, so you can change your settings however you want."
                    }
                },
                {
                    nome: {
                        pt: "Preferências",
                        en: "Preferences"
                    },
                    icone: `fas fa-wrench`,
                    codigo: "preferencias",
                    descricao: {
                        pt: "Faça alterações e faça o Face in the Book funcionar do jeito que você quiser.",
                        en: "Make changes and make Face in the Book work the way you want."
                    }
                },
                {
                    nome: {
                        pt: "Estatísticas",
                        en: "Statistics"
                    },
                    icone: `fas fa-poll-h rotate-90`,
                    codigo: "estatisticas",
                    descricao: {
                        pt: "Veja informações (não) importantes da sua jornada no Face in the Book.",
                        en: "See (not) important infos about your journey on Face in the Book."
                    }
                },
                {
                    nome: {
                        pt: "Social",
                        en: "Social"
                    },
                    icone: `fas fa-users`,
                    codigo: "social",
                    descricao: {
                        pt: "Gerenciar suas amizades",
                        en: "Manage your friendships"
                    }
                },
                {
                    nome: {
                        pt: "Aparência",
                        en: "Appearance"
                    },
                    icone: `fas fa-palette`,
                    codigo: "aparencia",
                    descricao: {
                        pt: "Deixe o Face in the Book do seu jeito.",
                        en: "Change the Face in the Book however you want"
                    }
                },
                {
                    nome: {
                        pt: "Restrição",
                        en: "Restriction"
                    },
                    icone: `fas fa-low-vision`,
                    codigo: "restricao",
                    descricao: {
                        pt: "Selecione o que você quer ou não ver.",
                        en: "Select what you want or don't want to see."
                    }
                }
            ]

            return list
        },
        originals: (codigoUsuario) => {
            if (!codigoUsuario) {
                console.error(`Não foi possível pegar informações originais do usuário:\ncodigoUsuario não recebido.`)
                return false
            }

            try {

                for (let u in usuarios) {
                    if (usuarios[u].codigo === codigoUsuario)
                        return JSON.parse(JSON.stringify(usuarios[u]))
                }

                console.warn(`Informações originais não obtidas:\nNão foi encontrado um usuário com o código "${codigoUsuario}".`)
                return false

            } catch (err) {
                console.error(`Não foi possível pegar informações originais do usuário:\n${err.stack}`)
                return false
            }
        },
        revert: (codigo) => {
            if (!codigo) {
                console.error(`Não foi possível redefinir usuário:\ncódigo não recebido.`)
                return undefined
            }

            try {

                for (let u in usuarios) {
                    if (usuarios[u].codigo === codigo) {
                        let res = JSON.parse(JSON.stringify(usuarios[u]))
                        return res
                    }
                }

                console.warn(`Usuário não redefinido: Não encontrado.`)
                return undefined

            } catch (err) {
                console.error(`Não foi possível redefinir usuário:\n${err.stack}`)
                return undefined
            }
        }
    },
    compare: (usuario) => {
        if (!usuario) {
            console.error(`Não foi possível comparar usuário:\nusuario não recebido.`)
            return []
        }

        try {

            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].codigo === usuario.codigo) {
                    let changes = []

                    // Página geral
                    if (usuarios[u].galeria.imagem.length !== usuario?.galeria.imagem.length) {
                        changes.push("galeria")
                    } else if (usuarios[u].galeria.video.length !== usuario?.galeria.video.length) {
                        changes.push("galeria")
                    } else {
                        let listaUsuario = usuarios[u].galeria.imagem
                        let lista = usuario.galeria.imagem
                        for (let u in listaUsuario) {
                            let existe = false
                            for (let l in lista) {
                                if (lista[l].codigo === listaUsuario[u].codigo)
                                    existe = true
                            }
                            if (!existe) {
                                changes.push("galeria")
                                break
                            }
                        }
                    }

                    if (usuarios[u].nomeReal !== usuario?.nomeReal)
                        changes.push("nome_real")

                    if (usuarios[u].nascimento.dia !== usuario?.nascimento.dia)
                        changes.push("dia_nascimento")

                    if (usuarios[u].nascimento.mes !== usuario?.nascimento.mes)
                        changes.push("mes_nascimento")

                    if (usuarios[u].nascimento.ano !== usuario?.nascimento.ano)
                        changes.push("ano_nascimento")

                    // Página do perfil
                    if (usuarios[u].nome !== usuario?.nome)
                        changes.push("nome")

                    if (usuarios[u].avatar !== usuario?.avatar)
                        changes.push("avatar")

                    if (usuarios[u].banner !== usuario?.banner)
                        changes.push("banner")

                    if (usuarios[u].biografia !== usuario?.biografia)
                        changes.push("biografia")

                    if (usuarios[u].config.perfil.conquistas !== usuario?.config.perfil.conquistas)
                        changes.push("conquistas")

                    if (usuarios[u].config.perfil.distintivos !== usuario?.config.perfil.distintivos)
                        changes.push("ver_badges")

                    if (usuarios[u].config.perfil.postagens !== usuario?.config.perfil.postagens)
                        changes.push("postagens")

                    if (usuarios[u].config.perfil.sobre !== usuario?.config.perfil.sobre)
                        changes.push("ver_biografia")

                    // Página de segurança
                    if (usuarios[u].senha !== usuario?.senha)
                        changes.push("senha")

                    // Página de preferências
                    if (usuarios[u].config.preferencias.idioma !== usuario?.config.preferencias.idioma)
                        changes.push("idioma")

                    // Página de aparência
                    if (usuarios[u].config.aparencia.temas.lista.length !== usuario?.config.aparencia.temas.lista.length) {
                        changes.push("lista_temas")

                    } else {
                        let userList = usuarios[u].config.aparencia.temas.lista
                        let lista = usuario?.config.aparencia.temas.lista

                        for (let u in userList) {
                            let existe = false
                            for (let l in lista) {
                                if (lista[l].codigo === userList[u].codigo) {
                                    existe = true
                                    break
                                }
                            }
                            if (!existe) {
                                changes.push("lista_temas")
                                break
                            }
                        }
                    }

                    if (usuarios[u].config.aparencia.temas.selecionado !== usuario?.config.aparencia.temas.selecionado)
                        changes.push("tema_selecionado")

                    if (usuarios[u].config.aparencia.fundo.selecionado !== usuarioAtual.config.aparencia.fundo.selecionado)
                        changes.push("fundo_selecionado")

                    if (usuarios[u].config.aparencia.fundo.url !== usuarioAtual.config.aparencia.fundo.url)
                        changes.push("url_fundo")

                    if (usuarios[u].config.aparencia.fundo.pacotes.length !== usuarioAtual.config.aparencia.fundo.pacotes.length) {
                        changes.push("pacotes_fundo")
                    } else {
                        let userList = usuarios[u].config.aparencia.fundo.pacotes
                        let lista = usuarioAtual.config.aparencia.fundo.pacotes

                        for (let u in userList) {
                            let existe = false
                            for (let l in lista) {
                                if (lista[l].codigo === userList[u].codigo) {
                                    existe = true
                                    break
                                }
                            }
                            if (!existe) {
                                changes.push("pacotes_fundo")
                                break
                            }
                        }
                    }

                    return changes
                }
            }
            return []

        } catch (err) {
            console.error(`Não foi possível comparar usuário:\n${err.stack}`)
            return []
        }
    }, // Função para comparar usuarioAtual com o usuario da lista
    request: {
        saveChanges: (usuario) => {
            if (!usuario) {
                console.error(`Não foi possível salvar alterações de configurações:\nusuario não recebido`)
                return false
            }

            try {

                for (let u in usuarios) {
                    if (usuarios[u].codigo === usuario.codigo) {
                        usuarios[u] = JSON.parse(JSON.stringify(usuario))
                        db.set("usuarios", usuarios)
                        return true
                    }
                }

            } catch (err) {
                console.error(`Não foi possível salvar alterações de configurações:\n${err.stack}`)
                return false
            }
        }
    }
}