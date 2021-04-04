var local = {
    set: (loc, prms) => {
        if (!loc) {
            console.error(`Não foi possível redirecionar:\nLocalização não especificada.`)
            return false
        }

        try {

            if (prms) {
                if (typeof prms === "string") {

                    if (!prms.startsWith("?")) {
                        location.href = `${loc}?${prms}`
                        return true
                    } else {
                        location.href = loc + prms
                        return true
                    }
    
                } else if (Array.isArray(prms)) {
    
                    prms = param.string(prms)
    
                    if (!prms.startsWith("?")) {
                        location.href = loc + "?" + prms
                    } else {
                        location.href = loc + prms
                    }
    
                }
            } else {
                location.href = loc
            }

        } catch (err) {
            console.error(`Não foi possível redirecionar:\n${err.stack}`)
            return false
        }
    }
}