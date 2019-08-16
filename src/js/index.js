import '../styles/index.scss'

import mapboxgl from 'mapbox-gl'
import polygonCenter from 'geojson-polygon-center'

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
const searchInput = document.querySelector('#search')
const clearBtn = document.querySelector('.clear')
const zoomIn = document.querySelector('.zoom__in')
const zoomOut = document.querySelector('.zoom__out')
let hoveredStateId = null
let marker, firstSymbolId, regionsData = {}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                if (a.children.length === 5) break
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    findLocation(inp.value)
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function findLocation(loc) {
    if (marker) marker.remove()

    searchInput.value = ''
    searchInput.setAttribute('placeholder', loc)
    const center = polygonCenter(regionsData[loc])
    map.setZoom(8)
    map.panTo(center.coordinates)
    let el = document.createElement('div')
    el.className = 'marker'
    marker = new mapboxgl.Marker(el)
        .setLngLat({
            lat: center.coordinates[1] + 0.05000,
            lng: center.coordinates[0]
        })
        .addTo(map)
}

mapHtml.addEventListener('mousedown', function () {
    mapHtml.style.cursor = 'grabbing'
})
mapHtml.addEventListener('mouseup', function () {
    mapHtml.style.cursor = 'initial'
})
clearBtn.addEventListener('click', function () {
    searchInput.value = ''
    searchInput.setAttribute('placeholder', 'Suchen...')
    marker.remove()
})
zoomIn.addEventListener('click', function () {
    const zoom = map.getZoom()
    map.zoomIn()
    if (zoom > 7) zoomIn.classList.add('disabled')
    // if (zoom < 6) zoomOut.classList.remove('disabled')
})
zoomOut.addEventListener('click', function () {
    const zoom = map.getZoom()
    map.zoomOut()
    // if (zoom < 7) zoomOut.classList.add('disabled')
    if (zoom === 8) zoomIn.classList.remove('disabled')
})

map.on('load', () => {
    map.resize()
    map.setPaintProperty('country-label', 'text-color', '#000000')
    map.setLayoutProperty('country-label', 'text-field', ['get', 'name_de']);
    map.setPaintProperty('state-label', 'text-color', '#000000')
    map.setLayoutProperty('state-label', 'text-field', ['get', 'name_de']);
    map.setPaintProperty('settlement-label', 'text-color', '#000000')
    map.setLayoutProperty('settlement-label', 'text-field', ['get', 'name_de']);
    map.setPaintProperty('settlement-subdivision-label', 'text-color', '#000000')
    map.setLayoutProperty('settlement-subdivision-label', 'text-field', ['get', 'name_de']);

    let layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    fetch('https://lodurrhvedrungr.github.io/censusmap/data.json')
        .then(r => r.json())
        .then(r => {
            map.addSource('population', {
                type: 'geojson',
                data: r
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
            map.addLayer({
                'id': 'state-population-border',
                'source': 'population',
                'type': 'line',
                'paint': {
                    'line-width': 2,
                    'line-color': ["case",
                        ["boolean", ["feature-state", "hover"], false],
                        '#18758D',
                        'transparent'
                    ]
                }
            })

            regionsData = r.features.reduce((acc, feat) => {
                acc[`${feat.properties.GEN}, ${feat.properties.BEZ}`] = feat.geometry
                return acc
            }, {})
            autocomplete(searchInput, Object.keys(regionsData))
        })

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
            popup.style.display = 'flex'
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
    map.on('zoomend', 'state-population', function () {
        const zoom = map.getZoom()
        if (zoom < 8) zoomIn.classList.remove('disabled')
        if (zoom === 8) zoomIn.classList.add('disabled')
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
        ${data.properties.EWZ ? `<div class="popup__wrap"><p class="popup__info">Einwohner 2017:<br/><strong class="popup__info__people">${data.properties.EWZ}</strong></p><p class="popup__info">jährliche Veränderung seit 2011:<p ${data.properties.JVA ? `${sign}${data.properties.JVA}%` : 'class="black">±0%'}</p></p></div>` : '<div class="popup__wrap"><p>Keine Daten vorhanden</p></div>'}
    `
}