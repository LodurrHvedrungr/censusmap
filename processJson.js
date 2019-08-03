const fs = require('fs')

const file = fs.readFileSync('assets/VG250_GEM.json', { encoding: 'utf8' })
let d = JSON.parse(file)
for (let i = 0; i < d.features.length; i++) {
    d.features[i].id = i;
}
fs.writeFileSync('assets/processed.json', JSON.stringify(d))