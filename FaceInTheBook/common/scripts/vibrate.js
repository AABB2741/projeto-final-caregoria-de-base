document.querySelectorAll("*").forEach(elm => {
    elm.classList.forEach(c => {
        if (c.toString().startsWith("vibrate")) {
            let vib = parseInt(c.toString().replace("vibrate", ""))

            try {
                elm.addEventListener("click", () => {
                    navigator.vibrate(vib)
                })
            } catch (err) {
                console.log(`Falha ao vibrar dispositivo:\n${err.stack}`)
            }
        }
    })
})