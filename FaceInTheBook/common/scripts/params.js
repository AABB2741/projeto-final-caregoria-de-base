var param = {
    set: (nome, valor, recarregar) => {
        if (!valor && typeof valor !== "boolean")
            return console.error(`Não foi possível definir parâmetro:\nValor não definido`)
        
        try {
    
            let params = new URLSearchParams(location.search)
            params.set(nome.toString(), valor.toString())
            history.replaceState(null, null, "?" + params.toString())
    
        } catch (err) {
            return console.error(`Não foi possível definir parâmetro:\n${err.stack}`)
        } finally {
            if (recarregar)
                location.reload()
        }
    },
    get: (valor) => {
        let prms = new URLSearchParams(location.search)

        if (valor && typeof valor !== "boolean")
            return prms.get(valor.toString())

        return prms
    },
    list: {
        get: (prms) => {
            if (!prms)
                prms = param.get()
    
            let str = prms.toString().replaceAll("?", "")
            str = str.split("&")
    
            let res = []
    
            for (let s = 0; s < str.length; s++) {
                let r = {}
                r.key = str[s].split("=")[0]
                r.value = str[s].split("=")[1]
    
                res.push(r)
            }
    
            return res
        },
        remove: (key, ar, stringify) => {
            if (!key) {
                console.error(`Erro ao remover parâmetro(s):\nChave não recebida.`)
                return false
            }

            if (!Array.isArray(ar) || !ar) {
                ar = param.list.get()
            }

            if (typeof key === "string") {

                for (let p = 0; p < ar.length; p++) {
                    if (ar[p].key === key) {
                        ar.splice(p, 1)
                        break
                    }
                }

                if (stringify) {
                    ar = param.string(ar)
                }
                return ar

            } else if (Array.isArray(key)) {
                for (let k = 0; k < key.length; k++) {
                    for (let a = 0; a < ar.length; a++) {
                        if (key[k] === ar[a].key) {
                            ar.splice(a, 1)
                            break
                        }
                    }
                }

                if (stringify) {
                    ar = param.string(ar)
                }

                return ar
            }
        },
        select: (prms) => {
            if (!prms)
                return param.get()

            if (typeof prms === "string") {
                let list = param.list.get()
                let res = []

                for (let l = 0; l < list.length; l++) {
                    if (list[l].key === prms) {
                        res.push(list[l])
                        break
                    }
                }

                return res
            } else if (Array.isArray(prms)) {
                let list = param.list.get()
                let res = []

                for (let l = 0; l < list.length; l++) {
                    for (let p = 0; p < prms.length; p++) {
                        if (list[l].key === prms[p]) {
                            res.push(list[l])
                            break
                        }
                    }
                }

                return res
            }
        }
    },
    transform: (ar, interrogacao) => {
        if (!ar || !Array.isArray(ar))
            ar = param.list.get()

        let res = []
        for (let a = 0; a < ar.length; a++) {
            res.push(`${ar[a].key}=${ar[a].value}`)
        }

        if (interrogacao)
            return "?" + res.join("&")

        return res.join("&")
    },
    string: (prms) => {
        if (!prms)
            prms = param.get()

        if (Array.isArray(prms)) {
            prms = param.transform(prms)
        }

        return prms.toString()
    },
    remove: (prms) => {
        if (!prms) {
            console.error(`Não foi possível remover parâmetro(s):\nParâmetro(s) não especificado(s).`)
            return false
        }

        let url = new URL(location.href)
        let prmtrs = url.searchParams

        if (typeof prms === "string") {
            if (prmtrs.has(prms))
                prmtrs.delete(prms)
        } else if (Array.isArray(prms)) {
            for (let p = 0; p < prms.length; p++) {
                if (prmtrs.has(prms[p]))
                    prmtrs.delete(prms[p])
            }
        }

        history.replaceState(null, null, url)
    }
}