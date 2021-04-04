// AVISO: Este documento faz parte do BACKEND

var achievement = { // refazer
    get: {
        user: (codigo) => {},
        list: (codigo) => {
            // Tipos de conquista: c e s, sendo c = conquista e s = segredo
            let lista = [
                {
                    titulo: {
                        pt: "Melhores amigos para sempre",
                        en: "Best friends forever"
                    },
                    descricao: {
                        pt: "Adicionou seu primeiro amigo",
                        en: "You added your first friend"
                    },
                    codigo: "bff",
                    foto: "../../common/files/achievements/bff.jpg",
                    tipo: "c"
                },
                {
                    titulo: {
                        pt: "Detetive",
                        en: "Detective"
                    },
                    descricao: {
                        pt: "Com suas incríveis habilidades de investigação, obteve um segredo.",
                        en: "Using your amazing investigation skills, you've found a secret."
                    },
                    codigo: "detetive",
                    foto: "../../common/files/achievements/detetive.jpg",
                    tipo: "c"
                },
                {
                    titulo: {
                        pt: "Ninguém viu nada",
                        en: "Nobody saw anything"
                    },
                    descricao: {
                        pt: "Excluiu uma postagem",
                        en: "You deleted a post"
                    },
                    codigo: "ngm",
                    foto: "../../common/files/achievements/ngm.gif",
                    tipo: "c"
                },
                {
                    titulo: {
                        pt: "Face clicker",
                        en: "Face clicker"
                    },
                    descricao: {
                        pt: "Por algum motivo, clicou 100 vezes na logo do Face in the Book.",
                        en: "For some reason, you clicked a hundred times on the logo of the Face in the Book."
                    },
                    codigo: "click",
                    foto: "../../common/files/achievements/click.png",
                    tipo: "s"
                }
                ,
                {
                    titulo: {
                        pt: "Esquizofrenia",
                        en: "Schizophrenia"
                    },
                    descricao: {
                        pt: "Mencionou a si mesmo em uma publicação",
                        en: "You mentioned yourself in a post"
                    },
                    codigo: "esquizofrenia",
                    foto: "../../common/files/achievements/espelho.jpg",
                    tipo: "s"
                }
                ,
                {
                    titulo: {
                        pt: "Celebridade",
                        en: "Celebrity"
                    },
                    descricao: {
                        pt: "Seja mencionado em 10 publicações",
                        en: "Be mentioned in 10 publications"
                    },
                    codigo: "celebridade",
                    foto: "../../common/files/achievements/famous.gif",
                    tipo: "c"
                },
                {
                    titulo: {
                        pt: "Identidade secreta",
                        en: "Secret identity"
                    },
                    descricao: {
                        pt: "Alterou seu nome de usuário",
                        en: "You changed your username"
                    },
                    codigo: "identidade",
                    foto: "../../common/files/achievements/identidade.jpg",
                    tipo: "c"
                }
            ]

            if (codigo) {
                for (let c = 0; c < lista.length; c++) {
                    if (lista[c].codigo === codigo)
                        return lista[c]
                }

                return false
            }

            return lista
        }
    },
    new: (codigo, codigoUsuario) => {
        if (!codigo) {
            console.error(`Não é possível obter conquista:\nCódigo não recebido`)
            return false
        }

        if (!codigoUsuario) {
            console.error(`Não foi possível adicionar conquista ao usuário:\nCódigo de usuário não recebido`)
            return false
        }

        try {

            let listaConquistas = achievement.get.list()
        for (let c = 0; c < listaConquistas.length; c++) {
            if (listaConquistas[c].codigo === codigo) {
                let usuario = faceBackend.get.user.infos(codigoUsuario)
                if (!usuario) {
                    console.error(`Não foi possível adicionar conquista ao usuário:\nUsuário não encontrado`)
                    return false
                }
                
                for (let a = 0; a < usuario.conquistas.length; a++) {
                    if (usuario.conquistas[a].codigo === codigo) {
                        return false
                    }
                }
                
                let tempo = getTime().timestamp
                let novaConquista = achievement.get.list(codigo)
                if (!novaConquista) {
                    console.error(`Não foi possível obter conquista:\nUma conquista com o código "${codigo}" não foi encontrada!`)
                    return false
                }
                let res = {
                    horario: tempo,
                    codigo: novaConquista.codigo
                }

                usuario.conquistas.push(res)

                if (usuarioAtual?.codigo === usuario.codigo) {
                    usuarioAtual.conquistas.push(res)
                }

                return novaConquista
            }
        }
        
        console.error(`Não foi possível adicionar conquista ao usuário:\nConquista não encontrada com este código`)
        return false

        } catch (err) {
            console.error(`Não foi possível adicionar conquista ao usuário:\n${err.stack}`)
            return false
        }

    }
}