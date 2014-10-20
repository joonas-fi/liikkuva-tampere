
var busTripLayer;

$(document).ready(function (){
	
	busTripLayer = L.featureGroup();
});

var tripTimeStep = 1;
var currentTripTime = 0;
var tripAnimationRunning = false;

var updateTrips = function()
{
	if (!tripAnimationRunning)
		return;
        
	startTripping();
    
    map.removeLayer(busTripLayer);
	busTripLayer = L.featureGroup();
    for ( var tripIndex = 0; tripIndex < allTrips.length; tripIndex++ )
    {
        if (isTripRouteActive(allTrips[tripIndex], currentTripTime))
        {
            var coords = calculateBusPositionOnTripRoute(allTrips[tripIndex], currentTripTime);
            
            L.circle(coords, 10, { color: '#ff00ff', weight: 3 }).addTo(busTripLayer);
        }
    }
	busTripLayer.addTo(map);

	updateClockDisplay('currentTripTime', currentTripTime);
    
	currentTripTime += tripTimeStep;
	
	if (currentTripTime > 60 * 60 * 24)
	{
		currentTripTime = 0;
	}
}

var isTripRouteActive = function(trip, currentTripTime)
{
    // TODO : add Date exclusion & trip-exception handling
    return currentTripTime >= trip.start && currentTripTime <= trip.end;
}

var calculateBusPositionOnTripRoute = function(trip, currentTripTime)
{
    for(var i = 0; i < trip.stops.length - 1; i++)
    {
        var prevStop = trip.stops[i];
        var nextStop = trip.stops[i+1];
        if (currentTripTime >= prevStop.time &&
            currentTripTime <= nextStop.time)
        {
            var duration = nextStop.time - prevStop.time;
            var delta = nextStop.time - currentTripTime;
            
            var lat = (nextStop.lat - prevStop.lat) / duration * delta + prevStop.lat;
            var lon = (nextStop.lon - prevStop.lon) / duration * delta + prevStop.lon;

            return [lat, lon];
        }
    }
}

function setTripAnimationRunState(state)
{
	tripAnimationRunning = state;
	var updateSpeed = document.getElementById("updateTripSpeed");
	updateSpeed.disabled = state;
}

function startTripping()
{
    setTripAnimationRunState(true);
	var updateSpeed = document.getElementById("updateTripSpeed");
	setTimeout(updateTrips, parseInt(1000 / 60) );
}

function stopTripping()
{
    setTripAnimationRunState(false);
}

function clearTrips()
{
    currentTripTime = 0;
    updateClockDisplay('currentTripTime', currentTripTime);
	map.removeLayer(busTripLayer);
}
