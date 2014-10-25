
var busTripLayer;

$(document).ready(function (){
	
	busTripLayer = L.featureGroup();
});

var updateTrips = function()
{
	if (!visualizationRunning)
		return;
        
    map.removeLayer(busTripLayer);
	busTripLayer = L.featureGroup();
    for ( var tripIndex = 0; tripIndex < allTrips.length; tripIndex++ )
    {
        if (isTripRouteActive(allTrips[tripIndex], currentTime))
        {
            var coords = calculateBusPositionOnTripRoute(allTrips[tripIndex], currentTime);
            
            L.circle(coords, 10, { color: '#ff00ff', weight: 3 }).addTo(busTripLayer);
        }
    }
	busTripLayer.addTo(map);

	updateClockDisplay('currentTime', currentTime);
    
	currentTime += timeStep;
	
	if (currentTime > 60 * 60 * 24)
	{
		currentTime = 0;
        
        if (continuous)
        {
            startTripping();
        }
	}
}

var isTripRouteActive = function(trip, currentTime)
{
    // TODO : add Date exclusion & trip-exception handling
    return currentTime >= trip.start && currentTime <= trip.end;
}

var calculateBusPositionOnTripRoute = function(trip, currentTime)
{
    //[south, west], [north, east]
    //[61.40, 23.50], [61.55, 24.10]

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

function setTripAnimationRunState(state)
{
	visualizationRunning = state;
	var updateSpeed = document.getElementById("updateSpeed");
	updateSpeed.disabled = state;
}

function startTripping()
{
    setTripAnimationRunState(true);
	var updateSpeed = document.getElementById("updateSpeed");
	setTimeout(updateTrips, parseInt(1000 / 10) );
}

function stopTripping()
{
    setTripAnimationRunState(false);
}

function clearTrips()
{
    currentTime = 0;
    updateClockDisplay('currentTime', currentTime);
	map.removeLayer(busTripLayer);
}
