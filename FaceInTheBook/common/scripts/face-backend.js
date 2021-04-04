var usuarios = db.rede.usuarios()
var usuarioAtual = db.rede.usuarioAtual()

var getBackendInfo = {
    isLogged: () => {
        let is = db.rede.usuarioAtual()

        if (!is)
            return false

        if (!is.nome)
            return false

        return true
    }
}

var faceBackend = {
    request: {
        friend: {
            request: {
                send: (codigoAtual, codigoAmigo) => {
                    if (!codigoAtual || !codigoAmigo) {
                        console.error(`Backend: Não foi possível solicitar usuário como amigo:\ncodigoAtual ou codigoAmigo não recebido.`)
                        return false
                    }

                    try {

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === usuarioAtual?.codigo) {
                                usuarios[u].solicitacoes.enviadas.push(codigoAmigo)
                                usuarioAtual.solicitacoes.enviadas.push(codigoAmigo)
                                break
                            }
                        }
                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAmigo) {
                                usuarios[u].solicitacoes.recebidas.push(usuarioAtual?.codigo)
                                return true
                            }
                        }
                        return false

                    } catch (err) {
                        console.error(`Backend: Não foi possível solicitar usuário como amigo:\n${err.stack}`)
                        return false
                    }
                },
                accept: (codigoAtual, codigoAmigo) => {
                    if (!codigoAtual || !codigoAmigo) {
                        console.error(`Backend: Não foi possível aceitar o usuário como amigo:\ncodigoAtual ou codigoAmigo não recebido.`)
                        return false
                    }

                    try {
                        let timestamp = getTime().timestamp

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAtual) {
                                for (let s = 0; s < usuarios[u].solicitacoes.recebidas.length; s++) {
                                    if (usuarios[u].solicitacoes.recebidas[s] === codigoAmigo) {
                                        usuarios[u].solicitacoes.recebidas.splice(s, 1)
                                        usuarioAtual?.solicitacoes.recebidas.splice(s, 1)
                                        let obj = {
                                            codigo: codigoAmigo,
                                            adicionado: timestamp
                                        }
                                        usuarios[u].amigos.push(obj)
                                        usuarioAtual?.amigos.push(obj)
                                        conquista.nova("bff", codigoAtual)
                                        break
                                    }
                                }
                                break
                            }
                        }

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAmigo) {
                                for (let s = 0; s < usuarios[u].solicitacoes.enviadas.length; s++) {
                                    if (usuarios[u].solicitacoes.enviadas[s] === codigoAtual) {
                                        usuarios[u].solicitacoes.enviadas.splice(s, 1)
                                        let obj = {
                                            codigo: codigoAtual,
                                            adicionado: timestamp
                                        }
                                        usuarios[u].amigos.push(obj)
                                        conquista.nova("bff", codigoAmigo)
                                        return true
                                    }
                                }
                            }
                        }
                        return false

                    } catch (err) {
                        console.error(`Backend: Não foi possível aceitar o usuário como amigo:\n${err.stack}`)
                        return false
                    }
                },
                reject: (codigoAtual, codigoAmigo) => {
                    if (!codigoAtual || !codigoAmigo) {
                        console.error(`Backend: Não foi possível rejeitar usuário como amigo:\ncodigoAtual ou codigoAmigo não recebido.`)
                        return false
                    }

                    try {

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAtual) {
                                for (let s = 0; s < usuarios[u].solicitacoes.recebidas.length; s++) {
                                    if (usuarios[u].solicitacoes.recebidas[s] === codigoAmigo) {
                                        usuarios[u].solicitacoes.recebidas.splice(s, 1)
                                        usuarioAtual?.solicitacoes.recebidas.splice(s, 1)
                                    }
                                }
                                break
                            }
                        }

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAmigo) {
                                for (let s = 0; s < usuarios[u].solicitacoes.enviadas.length; s++) {
                                    if (usuarios[u].solicitacoes.enviadas[s] === codigoAtual) {
                                        usuarios[u].solicitacoes.enviadas.splice(s, 1)
                                        return true
                                    }
                                }
                            }
                        }

                        return false
                    } catch (err) {
                        console.error(`Backend: Não foi possível rejeitar usuário como amigo:\n${err.stack}`)
                        return false
                    }
                },
                cancel: (codigoAtual, codigoAmigo) => {
                    if (!codigoAtual || !codigoAmigo) {
                        console.error(`Backend: Não foi possível cancelar solicitação de amizade:\ncodigoAtual ou codigoAmigo não recebido.`)
                        return false
                    }

                    try {

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAmigo) {
                                for (let s = 0; s < usuarios[u].solicitacoes.recebidas.length; s++) {
                                    if (usuarios[u].solicitacoes.recebidas[s] === codigoAtual) {
                                        usuarios[u].solicitacoes.recebidas.splice(s, 1)
                                        break
                                    }
                                }
                                break
                            }
                        }

                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigoAtual) {
                                for (let s = 0; s < usuarios[u].solicitacoes.enviadas.length; s++) {
                                    if (usuarios[u].solicitacoes.enviadas[s] === codigoAmigo) {
                                        usuarios[u].solicitacoes.enviadas.splice(s, 1)
                                        usuarioAtual?.solicitacoes.enviadas.splice(s, 1)
                                        return true
                                    }
                                }
                            }
                        }

                        return false

                    } catch (err) {
                        console.error(`Backend: Não foi possível cancelar solicitação de amizade:\n${err.stack}`)
                        return false
                    }
                }
            },
            remove: (codigoAtual, codigoAmigo) => {
                if (!codigoAtual || !codigoAmigo) {
                    console.error(`Backend: Não foi possível remover usuário como amigo:\ncodigoAtual ou codigoAmigo não recebido.`)
                    return false
                }

                try {

                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigoAtual) {
                            for (let a = 0; a < usuarios[u].amigos.length; a++) {
                                if (usuarios[u].amigos[a].codigo === codigoAmigo) {
                                    usuarios[u].amigos.splice(a, 1)
                                    usuarioAtual?.amigos.splice(a, 1)
                                    break
                                }
                            }
                            break
                        }
                    }
                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigoAmigo) {
                            for (let a = 0; a < usuarios[u].amigos.length; a++) {
                                if (usuarios[u].amigos[a].codigo === codigoAtual) {
                                    usuarios[u].amigos.splice(a, 1)
                                    return true
                                }
                            }
                        }
                    }

                } catch (err) {
                    console.error(`Backend: Não foi possível remover usuário como amigo:\n${err.stack}`)
                    return false
                }
            }
        },
        gallery: {
            add: (infos, codigoUsuario) => {
                if (!infos || !codigoUsuario) {
                    console.error(`Não foi possível adicionar imagem à galeria:\ninformações ou codigoUsuario não recebido.`)
                    return false
                }

                try {

                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigoUsuario) {
                            let imagens = faceBackend.get.user.gallery(usuarios[u].codigo, "img")
                            for (let i = 0; i < imagens.length; i++) {
                                if (imagens[i].nome.toLowerCase() === infos.titulo.toLowerCase())
                                    return false
                            }

                            let hora = getTime().timestamp
                            let res = {
                                url: infos.url,
                                nome: infos.titulo,
                                horario: hora,
                                codigo: code.new(10)
                            }
                            usuarios[u].galeria.imagem.push(res)

                            if (usuarios[u].codigo === usuarioAtual?.codigo)
                                usuarioAtual.galeria.imagem.push(res)

                            return true
                        }
                    }

                    console.warn(`Não foi adicionado a imagem na galeria:\nNenhum usuário com este código foi encontrado.`)
                    return false

                } catch (err) {
                    console.error(`Não foi possível adicionar imagem à galeria:\n${err.stack}`)
                    return false
                }
            },
            remove: (codigoImagem, codigoUsuario) => {
                if (!codigoImagem || !codigoUsuario) {
                    console.error(`Não foi possível excluir imagem:\ncodigoImagem ou codigoUsuario não recebidos`)
                    return false
                }

                try {

                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigoUsuario) {
                            for (let g = 0; g < usuarios[u].galeria.imagem.length; g++) {
                                if (usuarios[u].galeria.imagem[g].codigo === codigoImagem) {
                                    usuarios[u].galeria.imagem.splice(g, 1)
                                    if (usuarios[u].codigo === usuarioAtual?.codigo)
                                        usuarioAtual?.galeria.imagem.splice(g, 1)

                                    return true
                                }
                            }
                        }
                    }
                    return false

                } catch (err) {
                    console.error(`Não foi possível excluir imagem:\n${err.stack}`)
                    return false
                }
            },
            change: (infos, codigoUsuario) => {
                // infos deve conter:

                // nome
                // url
                // codigo

                if (!infos || !codigoUsuario) {
                    console.error(`Não foi possível editar imagem:\ninfos ou codigoUsuario não foram recebidos`)
                    return false
                }

                if (typeof infos !== "object") {
                    console.error(`Não foi possível editar imagem:\nO tipo de infos é ${typeof infos}`)
                    return false
                }

                try {

                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === codigoUsuario) {
                            for (let g = 0; g < usuarios[u].galeria.imagem.length; g++) {
                                if (usuarios[u].galeria.imagem[g].nome.toLowerCase() === infos.nome.toLowerCase()) {
                                    if (usuarios[u].galeria.imagem[g].codigo !== infos.codigo)
                                        return false
                                }
                            }

                            for (let g = 0; g < usuarios[u].galeria.imagem.length; g++) {
                                if (usuarios[u].galeria.imagem[g].codigo === infos.codigo) {
                                    usuarios[u].galeria.imagem[g].nome = infos.nome
                                    usuarios[u].galeria.imagem[g].url = infos.url

                                    if (usuarios[u].codigo === usuarioAtual?.codigo) {
                                        usuarioAtual.galeria.imagem[g].nome = infos.nome
                                        usuarioAtual.galeria.imagem[g].url = infos.url
                                    }

                                    return true
                                }
                            }
                        }
                    }

                } catch (err) {
                    console.error(`Não foi possível editar imagem:\n${err.stack}`)
                    return false
                }
            }
        },
        xp: {
            gain: (xp, usuario) => {
                if (!xp && typeof xp !== "number") {
                    console.error(`Não foi possível adicionar experiência:\nQuantidade de XP não recebida`)
                    return false
                }

                if (isNaN(xp)) {
                    console.error(`Não foi possível adicionar experiência:\nO XP recebido não é um número.`)
                    return false
                }

                if (!usuario) {
                    console.error(`Não foi possível adicionar experiência:\nCódigo do usuário não recebido`)
                    return false
                }

                try {

                    common.xpGained(xp, usuario)
                    for (let u = 0; u < usuarios.length; u++) {
                        if (usuarios[u].codigo === usuario) {
                            let res = usuarios[u].exp.xp + xp
                            if (res > usuarios[u].exp.meta) {
                                res = res - usuarios[u].exp.meta
                                usuarios[u].exp.meta += 100
                                usuarios[u].exp.nivel += 1
                                usuarios[u].exp.xp = res

                                if (typeof usuarioAtual !== "undefined") {
                                    if (usuarioAtual?.codigo === usuario) {
                                        usuarioAtual.exp.meta += 100
                                        usuarioAtual.exp.nivel += 1
                                        usuarioAtual.exp.xp = res
                                    }
                                }
                                return true
                            } else {
                                usuarios[u].exp.xp = res
                                if (usuarioAtual?.codigo === usuario)
                                    usuarioAtual.exp.xp = res

                                return true
                            }
                        }
                    }

                    console.warn(`Experiência não adicionada:\nUsuário não encontrado.`)
                    return false

                } catch (err) {
                    console.error(`Não foi possível adicionar experiência:\n${err.stack}`)
                    return false
                }
            }
        },
        switchAccount: (codigo) => {
            if (!codigo) {
                console.error(`Não foi possível alternar conta:\ncódigo não recebido`)
                return false
            }

            try {

                for (let u in usuarios) {
                    if (usuarios[u].codigo === codigo) {
                        db.set("usuarioAtual", usuarios[u])
                        return true
                    }
                }
                return false

            } catch (err) {
                console.error(`Não foi possível alternar conta:\n${err.stack}`)
                return false
            }
        },
        delAccount: (codigo, senha) => {
            if (!codigo || !senha) {
                console.error(`Não foi possível excluir conta:\ncódigo ou senha não recebidos`)
                return false
            }

            try {

                for (let u in usuarios) {
                    if (usuarios[u].codigo === codigo) {
                        if (usuarios[u].senha === senha) {
                            usuarios.splice(u, 1)
                            db.empty("usuarioAtual")
                            db.set("usuarios", usuarios)
                            return true
                        } else {
                            return false
                        }
                        break
                    }
                }
                console.warn(`A conta não foi excluida, pois não foi encontrado o usuário.`)
                return false

            } catch (err) {
                console.error(`Não foi possível excluir conta:\n${err.stack}`)
                return false
            }
        }
    },
    get: {
        user: {
            gallery: (codigo, tipo, src) => {
                if (!codigo || !tipo) {
                    console.error(`Não foi possível obter a galeria do usuário:\nCódigo ou tipo não recebido`)
                    return []
                }

                if (!src)
                    src = ""

                try {
                    let res = []

                    if (tipo === "img") {
                        for (let u = 0; u < usuarios.length; u++) {
                            if (usuarios[u].codigo === codigo) {
                                for (let g = 0; g < usuarios[u].galeria.imagem.length; g++) {
                                    if (usuarios[u].galeria.imagem[g].nome.toLowerCase().includes(src))
                                        res.push(usuarios[u].galeria.imagem[g])
                                }
                            }
                        }
                    }

                    return res

                } catch (err) {
                    console.error(`Não foi possível obter a galeria do usuário:\n${err.stack}`)
                    return []
                }
            },
            infos: (codigo) => {
                for (let u = 0; u < usuarios.length; u++) {
                    if (usuarios[u].codigo === codigo)
                        return usuarios[u]
                }
                return false
            }
        },
        advancementList: (codigo) => {
            let lista = [
                {
                    nome: {
                        pt: "Contagem de publicações",
                        en: "Post count"
                    },
                    descricao: {
                        pt: "Quantidade de publicações feitas na página principal",
                        en: "Number of publications made on the main page"
                    },
                    codigo: "postcount"
                }
            ]
        },
        themeList: (codigo) => {
            var list = [
                {
                    nome: {
                        pt: "Cor de fundo principal",
                        en: "Main background color"
                    },
                    codigo: "--bc",
                    valor: "#282828"
                },
                {
                    nome: {
                        pt: "Cor de sobreposição",
                        en: "Hover color"
                    },
                    codigo: "--hov",
                    valor: "#494949"
                },
                {
                    nome: {
                        pt: "Cor de fundo secundária",
                        en: "Secondary background color"
                    },
                    codigo: "--bc-s",
                    valor: "#121212"
                },
                {
                    nome: {
                        pt: "Cor de fundo terciária",
                        en: "Third background color"
                    },
                    codigo: "--bc-t",
                    valor: "#232323"
                },
                {
                    nome: {
                        pt: "Cor do texto",
                        en: "Text color"
                    },
                    codigo: "--cor",
                    valor: "#ffffff"
                },
                {
                    nome: {
                        pt: "Cor de destaque",
                        en: "Highlight color"
                    },
                    codigo: "--feat",
                    valor: "#1e90ff"
                },
                {
                    nome: {
                        pt: "Cor da borda",
                        en: "Border color"
                    },
                    codigo: "--br",
                    valor: "#ffffff"
                },
                {
                    nome: {
                        pt: "Cor de descrição",
                        en: "Description color"
                    },
                    codigo: "--desc",
                    valor: "#c4c4c4"
                },
                {
                    nome: {
                        pt: "Cor de seleção",
                        en: "Select color"
                    },
                    codigo: "--sel",
                    valor: "#00cf00"
                },
                {
                    nome: {
                        pt: "Cor de texto ilegível",
                        en: "Unreadable text color"
                    },
                    codigo: "--inblack",
                    valor: "#000000"
                },
                {
                    nome: {
                        pt: "Cor primária",
                        en: "Primary color"
                    },
                    codigo: "--prim",
                    valor: "#0000ff"
                },
                {
                    nome: {
                        pt: "Cor secundária",
                        en: "Secondary color"
                    },
                    codigo: "--sec",
                    valor: "#00ffff"
                },
                {
                    nome: {
                        pt: "Cor terciária",
                        en: "Tertiary color"
                    },
                    codigo: "--thir",
                    valor: "#ffff00"
                },
                {
                    nome: {
                        pt: "Cor quaternária",
                        en: "Quaternary color"
                    },
                    codigo: "--qua",
                    valor: "#a200ff"
                },
                {
                    nome: {
                        pt: "Cor de aviso",
                        en: "Warning color"
                    },
                    codigo: "--warn",
                    valor: "#ff0000"
                }
            ]


            if (codigo) {
                let res = []

                if (typeof codigo === "string") {
                    for (let c in list) {
                        if (list[c].codigo === codigo) {
                            return list[c]
                        }
                    }
                } else if (Array.isArray(codigo)) {
                    for (let s in codigo) {
                        for (let c in list) {
                            if (codigo[s] === list[c].codigo) {
                                res.push(list[c])
                                break
                            }
                        }
                    }
                } else if (codigo.hasOwnProperty("not")) {
                    if (typeof codigo.not === "string") {
                        let result = []
                        for (let c in list) {
                            if (list[c].codigo !== codigo.not) {
                                result.push(list[c])
                            }
                        }

                        return result
                    } else if (Array.isArray(codigo.not)) {
                        let result = []
                        for (let c in list) {
                            let existe = false
                            for (let s in codigo.not) {
                                if (codigo.not[s] === list[c].codigo) {
                                    existe = true
                                    break
                                }
                            }
                            if (!existe)
                                result.push(list[c])
                        }
                        return result
                    }
                }

                return res
            }

            return list
        },
        apiThemeList: async (codigo) => {
            let url = "http://localhost:8000/themes/get/"
            let dados = await fetch(url)
            var list = await dados.json()
            list = list.res

            if (codigo) {
                let res = []

                if (typeof codigo === "string") {
                    for (let c in list) {
                        if (list[c].codigo === codigo) {
                            res.push(list[c])
                            break
                        }
                    }
                } else if (Array.isArray(codigo)) {
                    for (let s in codigo) {
                        for (let c in list) {
                            if (codigo[s] === list[c].codigo) {
                                res.push(list[c])
                                break
                            }
                        }
                    }
                } else if (codigo.hasOwnProperty("not")) {
                    if (typeof codigo.not === "string") {
                        let result = []
                        for (let c in list) {
                            if (list[c].codigo !== codigo.not) {
                                result.push(list[c])
                            }
                        }

                        return result
                    } else if (Array.isArray(codigo.not)) {
                        let result = []
                        for (let c in list) {
                            let existe = false
                            for (let s in codigo.not) {
                                if (codigo.not[s] === list[c].codigo) {
                                    existe = true
                                    break
                                }
                            }
                            if (!existe)
                                result.push(list[c])
                        }

                        return result
                    }
                }

                return res
            }

            return list
        },
        whiteTheme: () => {
            let lista = [
                {
                    codigo: "--bc",
                    valor: "#ffffff"
                },
                {
                    codigo: "--hov",
                    valor: "#e3e1e1"
                },
                {
                    codigo: "--bc-s",
                    valor: "#f1f1f1"
                },
                {
                    codigo: "--bc-t",
                    valor: "#e0e0e0"
                },
                {
                    codigo: "--cor",
                    valor: "#000000"
                },
                {
                    codigo: "--feat",
                    valor: "#99cdff"
                },
                {
                    codigo: "--br",
                    valor: "#000000"
                },
                {
                    codigo: "--desc",
                    valor: "#808080"
                },
                {
                    codigo: "--sel",
                    valor: "#00cf00"
                },
                {
                    codigo: "--inblack",
                    valor: "#ffffff"
                },
                {
                    codigo: "--prim",
                    valor: "#00ffff"
                },
                {
                    codigo: "--sec",
                    valor: "#0000ff"
                },
                {
                    codigo: "--thir",
                    valor: "#ff9900"
                },
                {
                    codigo: "--qua",
                    valor: "#a200ff"
                },
                {
                    codigo: "--warn",
                    valor: "#ff0000"
                }
            ]

            return lista
        }
    },
    any: {
        alt: {
            list: (codigo) => {
                let lista = db.get("altAccounts") || []
                let res

                if (codigo) {
                    for (let l in lista) {
                        if (lista[l].codigo === codigo)
                            res = JSON.parse(JSON.stringify(lista[l]))
                    }
                } else {
                    res = JSON.parse(JSON.stringify(lista))
                }

                return res
            },
            add: (nome, senha) => {
                if (!nome || !senha) {
                    console.error(`Não foi possível adicionar conta alternativa:\nnome ou senha não recebido.`)
                    return false
                }

                try {
                    let lista = faceBackend.any.alt.list()

                    for (let u in usuarios) {
                        if (usuarios[u].nome === nome && usuarios[u].senha === senha) {
                            let codigo = usuarios[u].codigo
                            for (let l in lista) {
                                if (lista[l].codigo === codigo)
                                    return true
                            }
                            let obj = {
                                codigo: codigo,
                                timestamp: getTime().timestamp
                            }
                            lista.push(obj)
                            db.set("altAccounts", lista)
                            return true
                        }
                    }

                    console.warn(`Conta alternativa não adicionada:\nNenhum usuário com este nome ou senha foi encontrado`)
                    return false

                } catch (err) {
                    console.error(`Não foi possível adicionar conta alternativa:\n${err.stack}`)
                    return false
                }
            },
            remove: (codigo) => {
                if (!codigo) {
                    console.error(`Não foi possível remover conta alternativa:\ncódigo não recebido.`)
                    return false
                }

                try {

                    let lista = faceBackend.any.alt.list()

                    for (let l in lista) {
                        if (lista[l].codigo === codigo) {
                            lista.splice(l, 1)
                            db.set("altAccounts", lista)
                            return true
                        }
                    }
                    console.warn(`Conta alternativa não removida:\nNenhum usuário com este código foi encontrado.`)
                    return false

                } catch (err) {
                    console.error(`Não foi possível remover conta alternativa:\n${err.stack}`)
                    return false
                }
            },
            clear: () => {
                try {
                    db.empty("altAccounts")
                    return true
                } catch (err) {
                    console.error(`Não foi possível esvaziar contas alternativas:\n${err.stack}`)
                    return false
                }
            }
        }
    },
    verify: {
        username: (nome, codigo) => {
            // codigo é do usuário para ignorar
            if (!nome) {
                console.error(`Não foi possível verificar se o nome já está sendo usado:\nnome não recebido`)
                return false
            }

            try {

                if (codigo) {
                    for (let u in usuarios) {
                        if (usuarios[u].codigo !== codigo) {
                            if (usuarios[u].nome.toLowerCase() === nome.toLowerCase())
                                return true
                        }
                    }

                    return false
                } else {
                    for (let u in usuarios) {
                        if (usuarios[u].nome.toLowerCase() === nome.toLowerCase())
                            return true
                    }

                    return false
                }

            } catch (err) {
                console.error(`Não foi possível verificar se o nome já está sendo usado:\n${err.stack}`)
                return false
            }
        }
    },
    logout: async () => {
        let lo = await db.set("usuarios", usuarios)
        if (!lo)
            return warning.new(`<span en="An error occurred while disconnecting. Please try again later!">Ocorreu um erro ao desconectar-se. Por favor, tente novamente mais tarde!</span>`)

        await db.empty("usuarioAtual")
        usuarioAtual = null
        await db.rede.save()
        local.set("../../home/pages/inicio.html", param.list.select(["theme", "lang"]))
    }
}
