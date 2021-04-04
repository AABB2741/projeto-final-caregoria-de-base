var msg = {
    new: (content) => {
        if (!content) {
            console.error(`Não foi possível exibir mensagem: texto não recebido`)
            return false
        }

        let isNow = document.querySelector("div.fb-msg").getAttribute("showing")

        if (!isNow && typeof isNow === "string")
            return msg.list.push(content)

        // Propriedades válidas para o conteúdo:

        // txt - en, pt
        // time

        if (typeof content === "string") {
            let txt = content
            content = {
                text: txt
            }
        }

        if (!content.time || content.time < 1)
            content.time = 5

        document.querySelector("div.fb-msg").setAttribute("showing", "")
        if (typeof content.text === "string") {
            document.querySelector("div.fb-msg-text").innerHTML = `<span>${content.text}</span>`
        } else {
            document.querySelector("div.fb-msg-text").innerHTML = `<span en="${content.text.en}">${content.text.pt}</span>`
        }
        lang.update("div.fb-msg *")
        document.querySelector("div.fb-msg").classList.remove("hidden-fb-msg")

        setTimeout(() => {
            document.querySelector("div.fb-msg").classList.add("hidden-fb-msg")
            
            setTimeout(() => {
                document.querySelector("div.fb-msg").removeAttribute("showing")

                if (msg.list.length > 0) {
                    msg.new(msg.list[0])
                    msg.list.splice(0, 1)
                }
            }, 300)
        }, content.time.toString() + "000")
    },
    clear: () => {},
    list: []
}