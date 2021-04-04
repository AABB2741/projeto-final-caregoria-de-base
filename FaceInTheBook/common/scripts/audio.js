var som = {
    play: (aud, vol) => {
        if (!vol && typeof vol !== "number")
            vol = 0.5

        let presets = [
            {
                name: "achievement",
                path: "../../common/files/achievements/achievement-get.mp3"
            },
            {
                name: "secret",
                path: "../../common/files/achievements/secret-get.mp3"
            }
        ]

        for (let p = 0; p < presets.length; p++) {
            if (presets[p].name === aud) {
                aud = presets[p].path
                break
            }
        }

        let audCode = Math.round(Math.random() * 1000).toString()
        document.querySelector("div.sound-effects").innerHTML += `
            <audio class="aud-${audCode}" src="${aud}" onended="this.remove()" autoplay></audio>
        `

        document.querySelector(`audio.aud-${audCode}`).volume = vol
    }
}