const fs = require('fs')

const file = fs.readFileSync('VG250_VWG.json', { encoding: 'utf8' })
let d = JSON.parse(file)
for (let i = 0; i < d.features.length; i++) {
    d.features[i].id = i;
}
fs.writeFileSync('processed.json', JSON.stringify(d))