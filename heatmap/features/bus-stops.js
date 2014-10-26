
var tariffPalette = {
	'1': '#eb0190', // zone 1: pink
	'2': '#1ff1e4', // zone 2: turquoise
	'3': '#ef6c03', // zone 3: orange
	'S': '#f3e41f' // zone 4: yellow
};

$(document).ready(function (){
	// create bus stop feature group (so we can treat all bus stops as one layer)
	// note: the difference of featureGroup vs layerGroup is that it contains getBounds() and supports some events etc.
	var busStopLayer = L.featureGroup();

	for (var busStopId in busStops) {
		var busStopDetails = busStops[busStopId];
		var coords = [ busStopDetails[0], busStopDetails[1] ];
		var tariffZone = busStopDetails[3];

		if (tariffZone in tariffPalette === false) {
			console.log('Tariff zone color not in tariffPalette:', tariffZone);
			continue;
		}

		L.circleMarker(coords, {
			fillColor: tariffPalette[tariffZone],
			fillOpacity: 0.5,

			// border attributes
			color: '#000000',
			weight: 2
		}).addTo(busStopLayer);
	}

	// set map max bounds according to bus stop bounds (so user can't linger too far away from what's important)
	map.setMaxBounds(busStopLayer.getBounds());

	// when the checkbox is clicked, show or hide the bus stop layer layergroup
	$('#showBusStops').change(function (){
		if (this.checked) {
			busStopLayer.addTo(map);
		}
		else {
			map.removeLayer(busStopLayer);
		}
	});
});
