var common = {
    levelUp: (nivelAtual, meta, codigo) => {
        if (usuarioAtual?.codigo !== codigo)
            return console.warn(`Animação de nível passado ignorado:\nO código-alvo não é o código do usuário atual.`)

        if (!nivelAtual && isNaN(nivelAtual))
            return console.error(`Animação de nível passado ignorado:\nNão foi recebido nivelAtual`)

        if (!meta)
            return console.error(`Animação de nível passado ignorado:\nNão foi recebido meta`)

        document.querySelector("div.levelup-space").classList.remove("hidden")

        setTimeout(() => {
            document.querySelector("span.levelup-middle-xp-current").classList.add("def-counter")
            document.querySelector("span.levelup-porc").classList.add("def-counter")
            def.update()

            som.play("../../common/files/levelup.mp3")
        }, 1500)
    },
    xpGained: (xp, codigo) => {
        if (usuarioAtual?.codigo !== codigo)
            return console.warn(`Animação de ganho de EXP ignorado:\nO código-alvo não é igual ao do usuário atual.`)

        if (isNaN(xp))
            return console.error(`Erro ao fazer animação de XP:\nA quantidade de EXP recebida não é válida!`)

        document.querySelector("div.xp-count").innerHTML = `<span>${xp}</span>`
    }
}