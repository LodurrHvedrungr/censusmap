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
                ['get', 'EWZ'],
                0, '#F2F12D',
                100, '#EED322',
                1000, '#E6B71E',
                5000, '#DA9C20',
                10000, '#CA8323',
                50000, '#B86B25',
                100000, '#A25626',
                500000, '#8B4225',
                1000000, '#723122'
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
            .setHTML(`<div class="popup"><h2>${d[0].properties.GEN}, ${d[0].properties.BEZ}</h2><p>Einwohner 2017:<br/><strong>${d[0].properties.EWZ}</strong></p></div>`)
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