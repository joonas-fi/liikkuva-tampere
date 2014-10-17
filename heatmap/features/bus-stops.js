
$(document).ready(function (){
	// create bus stop feature group (so we can treat all bus stops as one layer)
	// note: the difference of featureGroup vs layerGroup is that it contains getBounds() and supports some events etc.
	var busStopLayer = L.featureGroup();

	for(var i = 0; i < busStops.length; i++) {
		var coords = [ busStops[i][0], busStops[i][1] ];
		L.circle(coords, 25, { color: '#0000ff', weight: 3 }).addTo(busStopLayer);
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
