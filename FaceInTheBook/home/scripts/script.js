function alreadyLogged() {
    let logado = param.get("logged")
    let conectado = user.isLogged()

    if (!logado) {
        param.set("logged", conectado)
        logado = param.get("logged")
    }

    if (logado === "true") {
        if (!conectado) {
            return param.set("logged", conectado)
        }

        document.querySelector("div.already-left").setAttribute("onclick", "user.fastLogin()")
        document.querySelector("span.already-name").innerText = db.rede.usuarioAtual().nome
        document.querySelector("div.already-logged-space").classList.remove("hidden")
    }
}
alreadyLogged()

function dontContinue() {
    param.set("logged", "hidden")
    document.querySelector("div.already-logged-space").classList.add("hidden")
}

var signUp = {
    open: () => {
        let nm = document.querySelector("input.rf-username")

        // Limite de 24 caracteres

        document.querySelector("div.fb-reg-space").classList.remove("hidden")
        setTimeout(() => {
            document.querySelector("div.fb-reg-space").classList.remove("hidden-reg-space")
        }, 1)

        if (!nm.value) {
            let nameList = [
                "BryanTroxa",
                "Facebosta",
                "JoaoGames",
                "RPBGames",
                "JoaoFF",
                "EnzoFortni123",
                "JairBolsonaroWhatsapp",
                "FifaireEbom",
                "To_sem_criatividade",
                "O_Limite_E_24_Caracteres",
                "ArthurGamesMineBlox"
            ]

            nm.value = nameList[Math.round(Math.random() * 10)]
            nm.select()
        }

        nm.focus()
    },
    close: () => {
        document.querySelector("div.fb-reg-space").classList.add("hidden-reg-space")
        setTimeout(() => {
            document.querySelector("div.fb-reg-space").classList.add("hidden")
        }, 300)
    },
    validate: {
        username: () => {
            let inp = document.querySelector("input.rf-username")

            let acceptableChars = `0123456789abcdefghijklmnopqrstuvwxyz-_!`
            let res = ""
            inp.value = inp.value.replace(/ /g, "_")
            for (let c = 0; c < inp.value.length; c++) {
                for (let l = 0; l < acceptableChars.length; l++) {
                    if (inp.value[c].toLowerCase() === acceptableChars[l].toLowerCase()) {
                        res += inp.value[c]
                        break
                    }
                }
            }

            if (res.length > 24)
                res = res.slice(0, 24)

            inp.value = res

            if (res) {
                return true
            } else {
                return false
            }
        }
    }
}

function passwordView(btn) {
    let view = btn.getAttribute("current-view")

    if (view === "p") {
        btn.setAttribute("current-view", "t")
        document.querySelector(btn.getAttribute("target")).type = "text"
        btn.innerHTML = `<i class="fas fa-eye-slash"></i>`
    } else {
        btn.setAttribute("current-view", "p")
        document.querySelector(btn.getAttribute("target")).type = "password"
        btn.innerHTML = `<i class="fas fa-eye"></i>`
    }
}

function forgot() {
    let nome = document.querySelector("input.fb-form-name").value

    if (!nome)
        return warning.new(`
            <span en="Failed to recover password:"
            >Não foi possível recuperar senha:</span>
            <br><br>
            <span en="You need to choose a user to recover the password!"
            >É necessário escolher um usuário para recuperar a senha!</span>
        `)

    let usuarios = db.rede.usuarios()
    for (let u = 0; u < usuarios.length; u++) {
        if (usuarios[u].nome === nome) {
            warning.new(`
                <span en="<user-name>'s password is:">A senha de <user-name> é</span>
                <span>'${usuarios[u].senha}'</span>
            `.replace(/<user-name>/g, usuarios[u].nome))
            return true
        }
    }
}

function loginRequest() {
    let nome = document.querySelector("input.fb-form-name").value
    let senha = document.querySelector("input.fb-password").value

    if (!nome || !senha)
        return warning.new(`
            <span en="Failed to sign in:">Não foi possível fazer login:</span>
            <br><br>
            <span en="It's required a username and a password!">É necessário inserir um nome de usuário e uma senha!</span>
        `)

        user.login(nome, senha)
}

function registerRequest() {
    let faltando = []
    document.querySelectorAll(".rf-required").forEach(req => {
        if (!req.value.toString()) {
            faltando.push(`<span en="${req.getAttribute("en")}">${req.getAttribute("name")}</span>`)
        }
    })

    if (faltando.length > 0) {
        warning.new(
            `<span en="Failed do sign up. The following required fields are empty:">Não foi possível cadastrar-se, pois os seguintes campos obrigatórios não foram preenchidos:</span>
            <br><br>
            ${faltando.join("<br>")}
            `
        )
        return
    }

    let getGen = () => {
        let res
        document.querySelectorAll("input.rf-gender").forEach(g => {
            if (g.checked)
                res = g.getAttribute("gender")
        })
        return res
    }

    let nomeReal = document.querySelector("input.rf-name").value
    let nome = document.querySelector("input.rf-username").value
    let senha = document.querySelector("input.rf-password").value
    let genero = getGen()
    let aniversario = {
        dia: document.querySelector("input.rf-bday").value,
        mes: document.querySelector("input.rf-bmonth").value,
        ano: document.querySelector("input.rf-byear").value
    }

    if (!nomeReal)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="It's required to put a valid name!">É necessário inserir um nome válido!</span>
        `)

    if (nome.length < 4 || nome.length > 24)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="The username must be between 4 and 24 characters long!">O nome de usuário precisa ter entre 4 e 24 caracteres!</span>
        `)

    if (senha.length < 4 || senha.length > 24)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="The password must be between 4 and 24 characters long!">A senha precisa ter entre 4 e 24 caracteres!</span>
        `)

    if (aniversario.dia > 31 || aniversario.dia < 1)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
        `)

    if (aniversario.mes == 2 && aniversario.dia > 29)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
        `)

    if (aniversario.mes < 1 || aniversario.mes > 12)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
        `)

    let tempo = getTime()

    if (aniversario.ano > tempo.ano)
        return warning.new(`
            <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
            <br><br>
            <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
        `)

    if (aniversario.ano == tempo.ano) {
        if (aniversario.mes == tempo.mes) {
            if (aniversario.dia > tempo.dia)
                return warning.new(`
                    <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
                    <br><br>
                    <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
                `)
        } else if (aniversario.mes > tempo.mes) {
            return warning.new(`
                <span en="Failed to sign up:">Não foi possível se cadastrar:</span>
                <br><br>
                <span en="It's required a valid birth date!">É necessário que seja inserido uma data de nascimento válida!</span>
            `)
        }
    }

    let res = {
        nomeReal: nomeReal,
        nome: nome,
        senha: senha,
        genero: genero,
        nascimento: aniversario
    }

    let solicitacao = user.register(res)
    if (solicitacao) {
        document.querySelectorAll(".rf-required").forEach(i => {
            i.value = ""
        })

        let nm = document.querySelector("input.fb-form-name")
        let ps = document.querySelector("input.fb-password")

        if (!nm.value && !ps.value) {
            nm.value = res.nome
            ps.value = res.senha
        }

        signUp.close()
    }
}

function pageTexts() {
    let textos = [
        `<span en="Connect with friends and the world around you on face in the book."
        >O face in the book ajuda você a se conectar e compartilhar com as pessoas que fazem parte da sua vida.</span>`,

        `<span en="Enjoy the new face of the face in the book. New appearance, new functions, secrets and a better performance."
        >Desfrute da nova cara do face in the book. Nova aparência, novas funcionalidades, segredos e melhor desempenho para aproveitar!</span>`,

        `<span en="Find out more with the new face in the book."
        >Descubra mais com o novo face in the book.</span>`,

        `<span en="Remake no.5!"
        >Recriado pela 5ª vez!</span>`,

        `<span en="See memes and share with your friends."
        >Veja e compartilhe memes com seus amigos.</span>`,

        `<span en="Invite everyone!"
        >Chama todo mundo para cá!</span>`,

        `<span en="Don't forgot to use alcohol in gel before touching the posts."
        >Não esqueça de passar álcool em gel antes de tocar nas postagens.</span>`,

        `<span en="Talk with friends, family and meet some new peoples on face in the book."
        >Converse com amigos, familiares e conheça novas pessoas no face in the book!</span>`,

        `<span en='"Holy moly! If someone shows how beautiful the site is, the book will have 14 volumes" - Gates, BILL - 2021'
        >"Caramba, se fosse para expressar em livros o quão lindo o site está, precisaria-se de pelo menos 14 volumes" - Gates, BILL - 2021</span>`,

        `<span en='"That... that is better than facebook" - Muckerberg, ZARK - 2021'
        >"Estou de cara com o novo face in the book" - Muckerberg, ZARK - 2021</span>`,

        `<span en="Do not agglomerate"
        >Não aglomere.</span>`
    ]

    document.querySelector("h2.fb-desc").innerHTML = textos[Math.round(Math.random() * 10)]
    lang.update("h2.fb-desc span")
    document.querySelector("h2.fb-desc").classList.remove("invisible")

    /* 
        Textos da página principal para adicionar depois

        Obtenha distintivos e fique exibindo a seus amigos!
        RPB Games
        Tá travando muito aí? Diminua as animações na guia de configurações!
    */

    setTimeout(() => {
        document.querySelector("h2.fb-desc").classList.add("invisible")
    }, 9500)
    setTimeout(pageTexts, 10000)
}
pageTexts()