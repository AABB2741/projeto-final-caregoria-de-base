var user = {
    isLogged: () => {
        let usuarioLogado = JSON.parse(localStorage.getItem("usuarioAtual"))
        if (!usuarioLogado || usuarioLogado === null)
            return false

        return true
    },
    login: (nome, senha) => {
        let usuarios = db.rede.usuarios()

        for (let u = 0; u < usuarios.length; u++) {
            if (usuarios[u].nome === nome) {
                if (usuarios[u].senha === senha) {
                    let usuarioAtual = usuarios[u]
                    db.set("usuarioAtual", usuarioAtual)

                    let prms = param.list.remove("logged", false, true)
                    local.set("../../main/pages/principal.html", prms)

                    return true
                }
                break
            }
        }

        warning.new(`
            <span en="Failed to login:"
            >Não foi possível fazer login:</span>
            <br><br>
            <span en="We didn't find a username with this name or the password is incorrect."
            >O nome de usuário ou senha estão incorretos.</span>
        `)
        return false
    },
    register: (infos) => {
        let trueType = "object"
        if (typeof infos !== trueType) {
            console.error(`Nâo foi possível cadastrar usuário:\nO tipo do parâmetro recebido não é '${trueType}'.`)
            return false
        }

        try {

            let usuarios = db.rede.usuarios()
            for (let u = 0; u < usuarios.length; u++) {
                if (usuarios[u].nome.toLowerCase() === infos.nome.toLowerCase())
                    return warning.new(`
                        <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
                        <br><br>
                        <span en="There's already some user with this name!">Já existe um usuário com este nome!</span>
                    `)
            }

            let hora = getTime()
            let newUser = {
                nome: infos.nome,
                nomeReal: infos.nomeReal,
                senha: infos.senha,
                codigo: generateID(),
                avatar: "../../common/files/default-avatar.png",
                banner: "../../common/files/default-banner.png",
                genero: infos.genero,
                nascimento: infos.nascimento,
                biografia: "",
                entrouEm: hora.timestamp,
                amigos: [],
                conquistas: [],
                avancos: [],
                notificacoes: [],
                galeria: {
                    imagem: [],
                    video: []
                },
                solicitacoes: {
                    enviadas: [],
                    recebidas: []
                },
                perfil: {
                    postagens: []
                },
                favoritos: {
                    usuarios: [],
                    postagens: []
                },
                distintivos: {
                    lista: [
                        {
                            nome: "Beta tester",
                            descricao: "Cadastrou-se durante o período de testes do Face in the Book",
                            codigo: "betaTester",
                            horaObtida: hora.timestamp,
                            icone: "🅱",
                            raridade: "raro"
                        }
                    ],
                    ativos: []
                },
                config: {
                    perfil: {
                        conquistas: true,
                        distintivos: true,
                        postagens: "todos", // todos, amigos, none
                        sobre: "todos" // todos, amigos, none
                    },
                    preferencias: {
                        ajuda: false,
                        mensagens: true,
                        social: true,
                        excluir: true,
                        emojis: true,
                        idioma: lang.get.navigator()
                    },
                    aparencia: {
                        temas: {
                            selecionado: "dark", // Quando for um pré-definido, colocar seu nome, como "dark", "light". Quando for um personalizado, colocar seu código
                            lista: [] // Quando fizer um novo tema, criar uma propriedade chamada "novo"
                        },
                        fundo: {
                            selecionado: "", // codigo pacote / set / vazio = "nenhum"
                            url: "",
                            pacotes: []
                        }
                    }
                },
                exp: {
                    nivel: 0,
                    xp: 0,
                    meta: 100
                }
            }

            usuarios.push(newUser)
            db.set("usuarios", usuarios)
            return true

            /*
                Adicionar depois:

                Avanços
            */

        } catch (err) {
            console.error(`Não foi possível cadastrar usuário:\n${err.stack}`)
            return false
        }
    },
    save: (usuarios) => {
        if (!usuarios)
            return console.error(`Não foi possível salvar usuários:\nNão foi recebido algo como parâmetro.`)

        if (!Array.isArray(usuarios))
            return console.error(`Não foi possível salvar usuários:\nO tipo do parâmetro recebido não é um array.`)

        localStorage.setItem("usuarios", JSON.stringify(usuarios))
    },
    fastLogin: () => {
        let usuario = db.rede.usuarioAtual()
        user.login(usuario.nome, usuario.senha)
    }
}

function generateID() {
    let chars = `abcdefghijklmnopqrstuvwxyz0123456789#!$+%`
    let codigo = ""

    for (let r = 0; r < 26; r++) {
        let l = Math.round(Math.random() * (chars.length - 1))
        let s = chars[l]

        if (!s)
            return generateCode()

        if (Math.random() < 0.5)
            s = s.toUpperCase()
        
        codigo += s
    }

    return codigo
}