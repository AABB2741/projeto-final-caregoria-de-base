function getTime(tempo) {
    if (!tempo)
        tempo = new Date().getTime()

    let time = new Date(tempo)

    let tc = {
        dia: () => {
            let d = time.getDate()
            if (d.toString().length < 2)
                d = "0" + d
            return d
        },
        mes: () => {
            let m = time.getMonth() + 1
            if (m.toString().length < 2)
                m = "0" + m
            return m
        },
        hora: () => {
            let h = time.getHours()
            if (h.toString().length < 2)
                h = "0" + h
            return h
        },
        min: () => {
            let m = time.getMinutes()
            if (m.toString().length < 2)
                m = "0" + m
            return m
        },
        seg: () => {
            let s = time.getSeconds()
            if (s.toString().length < 2)
                s = "0" + s
            return s
        }
    }

    let res = {
        dia: tc.dia(),
        mes: tc.mes(),
        ano: time.getFullYear(),
        hora: tc.hora(),
        min: tc.min(),
        seg: tc.seg(),
        timestamp: time.getTime(),
        string: {
            default: `${tc.hora()}:${tc.min()} - ${tc.dia()}/${tc.mes()}/${time.getFullYear()}`,
            data: `${tc.dia()}/${tc.mes()}/${time.getFullYear()}`,
            hora: {
                normal: `${tc.hora()}:${tc.min()}`,
                detalhada: `${tc.hora()}:${tc.min()}:${tc.seg()}`,
                escrito: `${tc.hora()}h ${tc.min()}m`
            }
        }
    }

    return res
}