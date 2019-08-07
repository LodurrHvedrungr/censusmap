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
let hoveredStateId = null

map.on('load', () => {
    map.resize()

    map.addSource('population', {
        type: 'geojson',
        data: 'assets/processed.json'
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
                -10, '#000000',
                -5, '#000000',
                -3, '#000000',
                -1.5, '#000000',
                -1, '#000000',
                -0.5, '#000000',
                -0.3, '#000000',
                -0.1, '#000000',
                0, '#F2F12D',
                0.1, '#EED322',
                0.3, '#E6B71E',
                0.5, '#DA9C20',
                1, '#CA8323',
                1.5, '#B86B25',
                3, '#A25626',
                5, '#8B4225',
                10, '#723122'
            ],
            "fill-opacity": ["case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0.5
            ]
        }
    })

    map.on('click', 'state-population', function (e) {
        const d = map.queryRenderedFeatures(e.point)
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(createPopupMsg(d[0]))
            .addTo(map);
    })
    map.on('mousemove', 'state-population', function (e) {
        const d = map.queryRenderedFeatures(e.point)
        if (d.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = d[0].id;
            map.setFeatureState({ source: 'population', id: hoveredStateId }, { hover: true });
        }
    })
    map.on('mouseleave', 'state-population', function () {
        if (hoveredStateId) {
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
    <div class="popup">
        <h2>${data.properties.GEN}, ${data.properties.BEZ}</h2>
        ${data.properties.EWZ ? `<p>Einwohner 2017:<br/><strong>${data.properties.EWZ}</strong></p>` : 'Keine Daten vorhanden'}
        ${data.properties.JVA ? `<p>jährliche Veränderung seit 2011:<p ${sign}${data.properties.JVA}%</p></p>` : ''}
    </div>`
}
