// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js')
// mapboxgl.accessToken = mapToken
// var coordinates = document.getElementById('coordinates');
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [53.6880, 32.4279],
//     zoom: 3
// });

// map.addControl(new mapboxgl.NavigationControl())


// var canvas = map.getCanvasContainer();

// var geojson = {
//     'type': 'FeatureCollection',
//     'features': [
//         {
//             'type': 'Feature',
//             'geometry': {
//                 'type': 'Point',
//                 'coordinates': [53.6880, 32.4279]
//             }
//         }
//     ]
// };

// function onMove(e) {
//     var coords = e.lngLat;

//     // Set a UI indicator for dragging.
//     canvas.style.cursor = 'grabbing';

//     // Update the Point feature in `geojson` coordinates
//     // and call setData to the source layer `point` on it.
//     geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
//     map.getSource('point').setData(geojson);
// }

// function onUp(e) {
//     var coords = e.lngLat;

//     // Print the coordinates of where the point had
//     // finished being dragged to on the map.
//     coordinates.style.display = 'block';
//     coordinates.innerHTML =
//         'Longitude: ' + coords.lng + '<br />Latitude: ' + coords.lat;
//     canvas.style.cursor = '';
//     const locationLng= document.getElementById('locationLng')
//     const locationLat= document.getElementById('locationLat')
//     locationLng.setAttribute('value', coords.lng)
//     locationLat.setAttribute('value', coords.lat)
//     // Unbind mouse/touch events
//     map.off('mousemove', onMove);
//     map.off('touchmove', onMove);
// }


// map.on('load', function () {
//     // Add a single point to the map.
//     map.addSource('point', {
//         'type': 'geojson',
//         'data': geojson
//     });

//     map.addLayer({
//         'id': 'point',
//         'type': 'circle',
//         'source': 'point',
//         'paint': {
//             'circle-radius': 10,
//             'circle-color': '#F84C4C' // red color
//         }
//     });

//     // When the cursor enters a feature in
//     // the point layer, prepare for dragging.
//     map.on('mouseenter', 'point', function () {
//         map.setPaintProperty('point', 'circle-color', '#3bb2d0');
//         canvas.style.cursor = 'move';
//     });

//     map.on('mouseleave', 'point', function () {
//         map.setPaintProperty('point', 'circle-color', '#3887be');
//         canvas.style.cursor = '';
//     });

//     map.on('mousedown', 'point', function (e) {
//         // Prevent the default map drag behavior.
//         e.preventDefault();

//         canvas.style.cursor = 'grab';

//         map.on('mousemove', onMove);
//         map.once('mouseup', onUp);
//     });

//     map.on('touchstart', 'point', function (e) {
//         if (e.points.length !== 1) return;

//         // Prevent the default map drag behavior.
//         e.preventDefault();

//         map.on('touchmove', onMove);
//         map.once('touchend', onUp);
//     });
// });
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js')
mapboxgl.accessToken = mapToken
var coordinates = document.getElementById('coordinates');
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [53.6880, 32.4279],
    zoom: 4

});

var marker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([53.6880, 32.4279])
    .addTo(map);

function onDragEnd() {
    var lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML =
        'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    const locationLng = document.getElementById('locationLng')
    const locationLat = document.getElementById('locationLat')
    locationLng.setAttribute('value', lngLat.lng)
    locationLat.setAttribute('value', lngLat.lat)
}

marker.on('dragend', onDragEnd)