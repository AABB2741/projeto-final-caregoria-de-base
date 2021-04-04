// AVISO: Este documento faz parte do FRONTEND

var conquista = {
    anim: (infos) => {
        if (!infos)
            return console.error(`Não foi possível fazer animação de conquista:\nInformações não recebidas.`)

        let isAnim = document.querySelector("div.achievement").getAttribute("animation")

        if (isAnim == "1") {
            conquista.list.push(infos)
            return
        }

        document.querySelector("div.achievement").setAttribute("animation", 1)

        if (infos.tipo === "c") {
            som.play("achievement", 0.15)
            document.querySelector("div.achievement").classList.remove("is-secret")
            document.querySelector("div.achievement").setAttribute("text", "Conquista desbloqueada ")
            document.querySelector("div.achievement").setAttribute("en", "Achievement unlocked ")
            document.querySelector("span.achievement-face-title").innerText = "Conquista desbloqueada!"
            document.querySelector("span.achievement-face-title").setAttribute("en", "Achievement unlocked!")
            document.querySelector("div.achievement-face-icon-space").innerHTML = `<i class="fas fa-trophy"></i>`
            lang.update(["div.achievement", "div.achievement *"])
        } else if (infos.tipo === "s") {
            som.play("secret", 0.15)
            document.querySelector("div.achievement").classList.add("is-secret")
            document.querySelector("div.achievement").setAttribute("text", "Segredo descoberto ")
            document.querySelector("div.achievement").setAttribute("en", "Secret discovered ")
            document.querySelector("span.achievement-face-title").innerText = "Segredo descoberto!"
            document.querySelector("span.achievement-face-title").setAttribute("en", "Secret discovered!")
            document.querySelector("div.achievement-face-icon-space").innerHTML = `<i class="fas fa-search"></i>`
            lang.update(["div.achievement", "div.achievement *"])
        }

        document.querySelector("span.achievement-title").innerText = infos.titulo.pt
        document.querySelector("span.achievement-title").setAttribute("en", infos.titulo.en)
        document.querySelector("span.achievement-desc").innerText = infos.descricao.pt
        document.querySelector("span.achievement-desc").setAttribute("en", infos.descricao.en)
        document.querySelector("img.achievement-icon").setAttribute("src", infos.foto)
        document.querySelector("div.achievement").classList.remove("hidden")

        lang.update(["div.achievement", "div.achievement *"])
        def.update()

        setTimeout(() => {
            document.querySelector("div.achievement").classList.add("hidden")

            setTimeout(() => {
                document.querySelector("div.achievement").setAttribute("animation", 0)
                if (conquista.list.length > 0) {
                    conquista.anim(conquista.list[0])
                    conquista.list.splice(0, 1)
                }
            }, 1000)
        }, 6000)
    },
    list: [],
    nova: (codigoConquista, codigoUsuario) => {
        if (!codigoConquista) {
            return console.error(`Não foi possível adicionar conquista ao usuário:\nCódigo conquista não recebido.`)
        }

        if (!codigoUsuario) {
            return console.error(`Não foi possível adicioanr conquista ao usuário:\nCódigo usuário não recebido.`)
        }

        let conq = achievement.new(codigoConquista, codigoUsuario)

        if (conq) {
            if (codigoUsuario === usuarioAtual?.codigo) {
                conquista.anim(conq)
            }
        }
    }
}