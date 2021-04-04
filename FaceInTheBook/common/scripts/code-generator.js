var code = {
    new: (tamanho) => {
        if (!tamanho)
            tamanho = 26

        let chars = `abcdefghijklmnopqrstuvwxyz0123456789#!$+%`
            let codigo = ""
        
            for (let r = 0; r < tamanho; r++) {
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
}