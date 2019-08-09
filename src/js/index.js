import '../styles/index.scss'

import mapboxgl from 'mapbox-gl'

const options = {
    container: 'map',
    accessToken: 'pk.eyJ1IjoiZXVnZXlvbmUiLCJhIjoiY2p5c2kzNWd4MGtjeDNkbnUzcHNuZG5nZiJ9.QascU0AxqjJdeRehD88fSA',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 6,
    center: [10.4660513, 50.6702632],
    maxBounds: [[5.864417, 47.26543], [15.05078, 55.14777]]
}

const colorSelect = document.getElementById('color-switcher')
const map = new mapboxgl.Map(options)
const popup = document.querySelector('.popup')
const mapHtml = document.querySelector('#map')
let hoveredStateId = null
const colorSchemes = {
    'green-red': [
        -10, '#FF0404',
        -5, '#DF0404',
        -3, '#BF0303',
        -1.5, '#9F0303',
        -1, '#800202',
        -0.5, '#600202',
        -0.3, '#400101',
        -0.1, '#200101',
        0, '#000000',
        0.1, '#012008',
        0.3, '#014010',
        0.5, '#026018',
        1, '#028021',
        1.5, '#039F29',
        3, '#03BF31',
        5, '#04DF39',
        10, '#04FF41'
    ],
    'purple-yellow': [
        -10, '#B9C500',
        -5, '#A2AC00',
        -3, '#8B9400',
        -1.5, '#747B00',
        -1, '#5C6300',
        -0.5, '#454A00',
        -0.3, '#2E3100',
        -0.1, '#171900',
        0, '#000000',
        0.1, '#0B0013',
        0.3, '#150025',
        0.5, '#200038',
        1, '#2A004B',
        1.5, '#35005E',
        3, '#3F0071',
        5, '#4A0083',
        10, '#540096'
    ],
    'blue-green': [
        -10, '#6A9230',
        -5, '#5D802A',
        -3, '#506E24',
        -1.5, '#425B1E',
        -1, '#354918',
        -0.5, '#283712',
        -0.3, '#1B250C',
        -0.1, '#0D1206',
        0, '#000000',
        0.1, '#09111A',
        0.3, '#122334',
        0.5, '#1B344E',
        1, '#244668',
        1.5, '#2C5782',
        3, '#35689C',
        5, '#3E7AB6',
        10, '#478BD0'
    ],
    'orange-lightblue': [
        -10, '#00CCFF',
        -5, '#00B3DF',
        -3, '#0099BF',
        -1.5, '#00809F',
        -1, '#006680',
        -0.5, '#004D60',
        -0.3, '#003340',
        -0.1, '#001A20',
        0, '#000000',
        0.1, '#1A0B04',
        0.3, '#331509',
        0.5, '#4D200D',
        1, '#662B11',
        1.5, '#803515',
        3, '#99401A',
        5, '#B34A1E',
        10, '#CC5522'
    ],
}

let colorsHtml = ''
Object.keys(colorSchemes).forEach(color => {
    colorsHtml += `<option value="${color}">${color}</option>`
})
colorSelect.innerHTML = colorsHtml

colorSelect.addEventListener('change', function (e) {
    map.removeLayer('state-population')
    map.addLayer({
        'id': 'state-population',
        'source': 'population',
        'type': 'fill',
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'JVA'],
                ...colorSchemes[e.target.value]
            ],
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.8,
                0.6
            ]
        }
    })
})

map.on('load', () => {
    map.resize()

    map.addSource('population', {
        type: 'geojson',
        data: 'https://lodurrhvedrungr.github.io/censusjson/data.json'
    })
    map.addLayer({
        'id': 'state-population',
        'source': 'population',
        'type': 'fill',
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'JVA'],
                ...colorSchemes['green-red']
            ],
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                0.8,
                0.6
            ]
        }
    })

    map.on('mousemove', 'state-population', function (e) {
        const d = map.queryRenderedFeatures(e.point)
        if (d.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: false })
            }
            hoveredStateId = d[0].id;
            map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: true })

            const x = e.originalEvent.clientX
            const y = e.originalEvent.clientY
            const bottom = y > mapHtml.clientHeight / 2
            const right = x > mapHtml.clientWidth / 2

            if (bottom && !right) {
                // bottom left
                popup.style.left = `${x}px`
                popup.style.top = `${y - popup.offsetHeight}px`
            } else if (bottom && right) {
                // bottom right
                popup.style.left = `${x - popup.offsetWidth}px`
                popup.style.top = `${y - popup.offsetHeight}px`
            } else if (!bottom && !right) {
                // top left
                popup.style.left = `${x}px`
                popup.style.top = `${y}px`
            } else {
                // top right
                popup.style.left = `${x - popup.offsetWidth}px`
                popup.style.top = `${y}px`
            }
            popup.innerHTML = createPopupMsg(d[0])
            popup.style.display = 'block'
        }
    })
    map.on('mouseleave', 'state-population', function () {
        if (hoveredStateId) {
            popup.style.display = 'none'
            map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: false });
        }
        hoveredStateId = null;
    })
})

function createPopupMsg(data) {
    let sign
    switch (Math.sign(data.properties.JVA)) {
        case 1:
            sign = 'class="green">+'
            break
        case -1:
            sign = 'class="red">'
            break
        case 0:
            sign = 'class="white">'
            break
    }

    return `
        <h2>${data.properties.GEN}, ${data.properties.BEZ}</h2>
        ${data.properties.EWZ ? `<p>Einwohner 2017:<br/><strong>${data.properties.EWZ}</strong></p>` : 'Keine Daten vorhanden'}
        ${data.properties.JVA ? `<p>jährliche Veränderung seit 2011:<p ${sign}${data.properties.JVA}%</p></p>` : ''}
    `
}