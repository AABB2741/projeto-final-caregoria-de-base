var db = {
    get: (nome, bruto) => {
        if (bruto)
            return localStorage.getItem(nome.toString())

        return JSON.parse(localStorage.getItem(nome.toString()))
    },
    set: (nome, dado) => {
        if (!nome) {
            console.error(`Não foi possível salvar:\nNome não especificado`)
            return false
        }

        if (!dado && typeof dado !== "boolean") {
            if (dado !== null) {
                console.error(`Não foi possível salvar:\nDado não recebido.`)
                return false
            } else {
                console.warn(`Aviso: A informação denominada "${nome}" recebeu um valor nulo.`)
            }
        }

        try {
            localStorage.setItem(nome, JSON.stringify(dado))
            return true
        } catch (err) {
            console.error(`Não foi possível salvar:\n${err.stack}`)
            return false
        }
    },
    empty: (nome) => {
        if (!nome) {
            console.error(`Não foi possível esvaziar:\nNome não especificado`)
            return false
        }

        try {
            localStorage.setItem(nome, null)
            return true
        } catch (err) {
            console.error(`Não foi possível esvaziar:\n${err.stack}`)
            return false
        }
    },
    rede: {
        usuarios: (codigo) => {
            let usrs = db.get("usuarios")

            if (codigo) {
                for (let u = 0; u < usrs.length; u++) {
                    if (usrs[u].codigo === codigo)
                        return usrs[u]
                }

                return false
            }

            return usrs || []
        },
        posts: (codigo) => {
            let psts = db.get("posts")

            if (codigo) {
                for (let p = 0; p < psts.length; p++) {
                    if (psts[p].codigo === codigo)
                        return psts[p]
                }

                return false
            }

            return psts
        },
        usuarioAtual: () => {
            return db.get("usuarioAtual")
        },
        save: () => {
            db.set("usuarioAtual", usuarioAtual)
            db.set("usuarios", usuarios)
            if (typeof posts !== "undefined")
                db.set("posts", posts)

            if (typeof msg !== "undefined")
                msg.new({text: {pt: "Salvando...", en: "Saving..."}, time: 1})
        }
    }
}