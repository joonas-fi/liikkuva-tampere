
var busTripLayer;

$(document).ready(function (){
	busTripLayer = L.featureGroup().addTo(map);
});

var busMarkerIcon = L.icon({
    iconUrl: 'www/bus-marker.png',
    iconSize: [32, 37], // ratio is 0.8648648648648649
    iconAnchor: [16, 37]
});

var tripInterval = 5;

// create 1:1 array of marker objects from allTrips
var cachedMarkers = allTrips.map(function (trip){
    return L.marker([0.0, 0.0], { icon: busMarkerIcon, title: trip.route_id });
});

var updateTrips = function()
{
	if (!visualizationRunning)
		return;
        
    for ( var tripIndex = 0; tripIndex < allTrips.length; tripIndex++ )
    {
        if (isTripRouteActive(allTrips[tripIndex], currentTime))
        {
            var coords = calculateBusPositionOnTripRoute(allTrips[tripIndex], currentTime);
            
            cachedMarkers[tripIndex].setLatLng(coords).addTo(busTripLayer);
        }
        else
        {
            busTripLayer.removeLayer(cachedMarkers[tripIndex]);
        }
    }

	updateClockDisplay('currentTime', currentTime);
    
	currentTime += tripInterval;
	
	if (currentTime > endMoment())
	{
		currentTime = 0;
        
        if (continuous)
        {
            currentTime = startMoment();
            setTimeout(updateTrips, calculateTimeoutForNextFrame());
        }
	}
    else
    {
        setTimeout(updateTrips, calculateTimeoutForNextFrame());
    }
}

var isTripRouteActive = function(trip, currentTime)
{
    // TODO : add Date exclusion & trip-exception handling
    return currentTime >= trip.start && currentTime <= trip.end;
}

var calculateBusPositionOnTripRoute = function(trip, currentTime)
{
    for(var i = 0; i < trip.stops.length - 1; i++)
    {
        var prevStop = trip.stops[i];
        var nextStop = trip.stops[i+1];
        
        if (currentTime == prevStop.time)
        {
            return [prevStop.lat, prevStop.lon];
        }
        else if (currentTime > prevStop.time && currentTime <= nextStop.time)
        {
            var duration = nextStop.time - prevStop.time;
            var delta = currentTime - prevStop.time;
            
            var lat = (nextStop.lat - prevStop.lat) / duration * delta + prevStop.lat;
            var lon = (nextStop.lon - prevStop.lon) / duration * delta + prevStop.lon;

            return [lat.toPrecision(7), lon.toPrecision(7)];
        }
    }
}

function startTripping()
{
    busTripLayer.addTo(map);

    updateTrips();
}

function clearTrips()
{
	map.removeLayer(busTripLayer);
}
