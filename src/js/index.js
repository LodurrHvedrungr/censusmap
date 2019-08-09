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

const map = new mapboxgl.Map(options)
const popup = document.querySelector('.popup')
const mapHtml = document.querySelector('#map')
let hoveredStateId = null

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
