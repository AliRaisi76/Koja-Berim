// const residence = require("../../models/residence")

mapboxgl.accessToken = mapToken
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js')
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: residence.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
    .setLngLat(residence.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${residence.title}</h3><p>${residence.location}</p>`
        )
    )
    .addTo(map)