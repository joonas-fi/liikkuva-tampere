
var visibleRoutes = {};

$(document).ready(function (){
	var tbody = $('table.lines tbody');

	for (var i = 0; i < routes.length; ++i) {
		// two issues, that we have to account for:
		// 1) there are some routes which are in the dataset but are discontinued I guess: they are in the routes
		// database but they have no shape data available AND they are not shown in TKL's online catalog. discontinued?
		// so why in the dataset in the first place? there are some operational routes 
		// 2) some routes are operational and the route is shown in TKL site but shape data is not available in GTFS dump - WTF?
		if (routes[i].route_short_name in allPoints === false) {
			continue;
		}

		var tr = $('<tr class="line"></tr>').attr('data-id', routes[i].route_id);

		$('<td><input class="displayed_indicator" type="checkbox" /></td>').appendTo(tr);
		$('<td></td>').text(routes[i].route_short_name).appendTo(tr);
		$('<td></td>').text(routes[i].route_long_name).appendTo(tr);

		tr.appendTo(tbody);
	}

	$(tbody).on('change', '.displayed_indicator', function (){
		var routeId = $(this).closest('tr').attr('data-id');

		if (routeId in allPoints === false) 
		{
			alert('no shape data for route ' + routeId);
			return;
		}
		
		var alreadyVisible = routeId in visibleRoutes;

		// remove from map
		if (alreadyVisible) {
			map.removeLayer(visibleRoutes[routeId]);
			delete visibleRoutes[routeId];
		} else { // add to map
			visibleRoutes[routeId] = L.geoJson([{
				type: 'LineString',
				coordinates: flipCoordinatesForStupidGeoJSON(allPoints[routeId])
			}], {
				color: "#0000ff",
				weight: 5,
				opacity: 0.65
			})

			visibleRoutes[routeId].addTo(map);
		}

	});
});
