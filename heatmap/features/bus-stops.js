
$(document).ready(function (){
	// create bus stop feature group (so we can treat all bus stops as one layer)
	// note: the difference of featureGroup vs layerGroup is that it contains getBounds() and supports some events etc.
	var busStopLayer = L.featureGroup();

	for (var busStopId in busStops) {
		var busStopDetails = busStops[busStopId];
		var coords = [ busStopDetails[0], busStopDetails[1] ];

		// var arrivalTimes = busStopDetails[2];
		// 
		// note to Samu:
		// - arrival times is a list like this: [3600, 7200, ...]
		// - time is seconds since midnight, so 3600 is 01:00:00, 3666  is 01:01:06 etc..
		// - the list is not sorted, call sort() on the array if needed


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
