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

const colorSelect = document.getElementById('color-switcher')
const map = new mapboxgl.Map(options)
const popup = document.querySelector('.popup')
const mapHtml = document.querySelector('#map')
const rampGradient = document.querySelector('.ramp__gradient')
const negativeValue = document.querySelector('.negative-value')
const positiveValue = document.querySelector('.positive-value')
const searchInput = document.querySelector('#search')
let hoveredStateId = null
let marker, firstSymbolId, regionsData = {}
const colorSchemes = {
    'green-red': [
        -5, 'rgb(255, 26, 26)',
        -3, 'rgb(230, 0, 0)',
        -1.5, 'rgb(179, 0, 0)',
        -1, 'rgb(128, 0, 0)',
        -0.1, 'rgb(77, 0, 0)',
        0, '#000000',
        0.1, 'rgb(0, 77, 19)',
        1, 'rgb(0, 128, 31)',
        1.5, 'rgb(0, 179, 43)',
        3, 'rgb(0, 230, 56)',
        5, 'rgb(26, 255, 81)'
    ],
    'purple-yellow': [
        -5, 'rgb(241, 255, 26)',
        -3, 'rgb(216, 230, 0)',
        -1.5, 'rgb(168, 179, 0)',
        -1, 'rgb(120, 128, 0)',
        -0.1, 'rgb(72, 77, 0)',
        0, '#000000',
        0.1, 'rgb(43, 0, 77)',
        1, 'rgb(71, 0, 128)',
        1.5, 'rgb(100, 0, 179)',
        3, 'rgb(129, 0, 230)',
        5, 'rgb(154, 26, 255)',
    ],
    'blue-green': [
        -5, 'rgb(98, 134, 44)',
        -3, 'rgb(125, 173, 57)',
        -1.5, 'rgb(151, 198, 82)',
        -1, 'rgb(174, 211, 121)',
        -0.1, 'rgb(197, 223, 159)',
        0, '#ffffff',
        0.1, 'rgb(153, 191, 229)',
        1, 'rgb(113, 165, 219)',
        1.5, 'rgb(72, 140, 208)',
        3, 'rgb(47, 114, 183)',
        5, 'rgb(36, 89, 142)',
    ],
    'orange-lightblue': [
        -5, 'rgb(0, 143, 179)',
        -3, 'rgb(0, 184, 230)',
        -1.5, 'rgb(26, 209, 255)',
        -1, 'rgb(77, 219, 255)',
        -0.1, 'rgb(128, 229, 255)',
        0, '#ffffff',
        0.1, 'rgb(237, 173, 146)',
        1, 'rgb(229, 140, 102)',
        1.5, 'rgb(222, 107, 58)',
        3, 'rgb(197, 81, 33)',
        5, 'rgb(153, 63, 26)',
    ],
}

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              findLocation(inp.value)
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
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
    }, firstSymbolId)

    rampGradient.style.background = generateLegendGradient(e.target.value)
    negativeValue.style.color = colorSchemes[e.target.value][1]
    positiveValue.style.color = colorSchemes[e.target.value][21]
})

searchInput.addEventListener('keydown', function (e) {
    if (e.code === 'Enter') {
        findLocation(searchInput.value)
    }
})

map.on('load', () => {
    map.resize()

    let layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    fetch('data.json')
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
                            ...colorSchemes['green-red']
                        ],
                        "fill-opacity": ["case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.8,
                            0.6
                        ]
                    }
                }, firstSymbolId)

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
            popup.innerHTML = createPopupMsg(mainLayer)
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

function generateLegendGradient(currentColor) {
    return `linear-gradient(to right, ${colorSchemes[currentColor][1]} 0%, ${colorSchemes[currentColor][5]} 33%, ${colorSchemes[currentColor][9]} 49%, ${colorSchemes[currentColor][11]} 50%, ${colorSchemes[currentColor][13]} 51%, ${colorSchemes[currentColor][17]} 67%, ${colorSchemes[currentColor][21]} 100%)`
}