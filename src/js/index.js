import '../styles/index.scss'

import mapboxgl from 'mapbox-gl'

const options = {
    container: 'map',
    accessToken: 'pk.eyJ1IjoiZXVnZXlvbmUiLCJhIjoiY2p5c2kzNWd4MGtjeDNkbnUzcHNuZG5nZiJ9.QascU0AxqjJdeRehD88fSA',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 0,
    maxZoom: 8,
    center: [10.4660513, 50.6702632],
    maxBounds: [[-0.765531, 46.631365], [20.888930, 55.352543]]
}

const map = new mapboxgl.Map(options)
const popup = document.querySelector('.popup')
const mapHtml = document.querySelector('#map')
let hoveredStateId = null
let firstSymbolId

map.on('load', () => {
    map.resize()

    let layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.setPaintProperty('country-label', 'text-color', '#000000')
    map.setPaintProperty('state-label', 'text-color', '#000000')
    map.setPaintProperty('settlement-label', 'text-color', '#000000')
    map.setPaintProperty('settlement-subdivision-label', 'text-color', '#000000')

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
                -5, '#0f7785',
                -0.1, '#8fd7d2',
                0, '#ffffff',
                0.1, '#eb9878',
                5, '#96210e',
            ],
            "fill-outline-color": ["case",
                ["boolean", ["feature-state", "hover"], false],
                '#18758D',
                'transparent'
            ]
        }
    }, firstSymbolId)

    map.on('mousemove', 'state-population', function (e) {
        const d = map.queryRenderedFeatures(e.point)
        let mainLayer

        if (d.length > 0) {
            for (const layer of d) {
                if (layer.layer.id === 'state-population') {
                    mainLayer = layer
                    break
                }
            }
            if (!mainLayer) return
            if (hoveredStateId) {
                map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: false })
            }
            hoveredStateId = mainLayer.id;
            map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: true })

            const x = e.originalEvent.clientX
            const y = e.originalEvent.clientY
            const bottom = y > mapHtml.clientHeight / 2
            const right = x > mapHtml.clientWidth / 2

            popup.innerHTML = createPopupMsg(mainLayer)
            popup.style.display = 'block'
            const popupArrow = document.querySelector('.popup__arrow')

            if (bottom && !right) {
                // bottom left
                popup.style.left = `${x - 30}px`
                popup.style.top = `${y - popup.offsetHeight - 30}px`
            } else if (bottom && right) {
                // bottom right
                popup.style.left = `${x - popup.offsetWidth + 30}px`
                popup.style.top = `${y - popup.offsetHeight - 30}px`
                popupArrow.classList.add('bottom-right')
            } else if (!bottom && !right) {
                // top left
                popup.style.left = `${x - 30}px`
                popup.style.top = `${y + 30}px`
                popupArrow.classList.add('top-left')
            } else {
                // top right
                popup.style.left = `${x - popup.offsetWidth + 30}px`
                popup.style.top = `${y + 30}px`
                popupArrow.classList.add('top-right')
            }
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
        <div class="popup__arrow"></div>
        <h2 class="popup__title">${data.properties.GEN}, ${data.properties.BEZ}</h2>
        ${data.properties.EWZ ? `<p class="popup__info">Einwohner 2017:<br/><strong class="popup__info__people">${data.properties.EWZ}</strong></p><p class="popup__info">jährliche Veränderung seit 2011:<p ${data.properties.JVA ? `${sign}${data.properties.JVA}%` : 'class="black">±0%'}</p></p>` : '<p>Keine Daten vorhanden</p>'}
    `
}