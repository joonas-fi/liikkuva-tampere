
$(document).ready(function (){
	// create bus stop layer group (so we can treat all bus stops as one layer)
	var busStopLayer = L.layerGroup();

	for(var i = 0; i < busStops.length; i++) {
		var coords = [ busStops[i][0], busStops[i][1] ];
		L.circle(coords, 50, { color: '#0000ff', weight: 3 }).addTo(busStopLayer);
	}

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
