const fs = require('fs')

const file2011 = JSON.parse(fs.readFileSync('assets/vg250_gem2011.json', 'utf8'))
const file2017 = JSON.parse(fs.readFileSync('assets/VG250_GEM.json', 'utf8'))

let census2011 = {}

for (let i = 0; i < file2011.features.length; i++) {
    census2011[file2011.features[i].properties.GEN] = file2011.features[i].properties.EWZ
}

const census2017 = file2017.features.map((feat, i) => {
    return {
        ...feat,
        id: i,
        properties: {
            GEN: feat.properties.GEN,
            BEZ: feat.properties.BEZ,
            EWZ: feat.properties.EWZ,
            JVA: calcDifferencePercent(feat.properties.EWZ, census2011[feat.properties.GEN])
        }
    }
})

function calcDifferencePercent(a, b) {
    if (!a || !b) return 0
    const diff = (((a - b) / a) * 100) / 6
    return Number(diff.toFixed(1))
}

fs.writeFileSync('assets/processed.json', JSON.stringify({
    type: 'FeatureCollection',
    features: census2017
}))