mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "Red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 30})
            .setHTML(`<h4>${listingLocation}</h4><p>Exact Location provided after booking!</p>`)
        )
        .addTo(map);