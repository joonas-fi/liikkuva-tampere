
var heatmapLayer;

$(document).ready(function (){
	
	// note to Samu: what affects the radius of the "heat point" is it's count field AND heatmapConfig.radius.
	// experiment with those to see the effects. heatmapConfig.radius is kind of a multiplier for the actual value your algorithm will provide

	// see http://www.patrick-wied.at/static/heatmapjs/example-heatmap-leaflet.html
	var heatmapConfig = {
		// radius should be small ONLY if scaleRadius is true (or small radius is intended)
		// if scaleRadius is false it will be the constant radius used in pixels
		"radius": 0.005,
		"maxOpacity": .8, 
		// scales the radius based on map zoom
		"scaleRadius": true, 
		// if set to false the heatmap uses the global maximum for colorization
		// if activated: uses the data maximum within the current map boundaries 
		//   (there will always be a red spot with useLocalExtremas true)
		"useLocalExtrema": true,
		// which field name in your data represents the latitude - default "lat"
		latField: 'lat',
		// which field name in your data represents the longitude - default "lng"
		lngField: 'lng',
		// which field name in your data represents the data value - default "value"
		valueField: 'count'
	};

	heatmapLayer = new HeatmapOverlay(heatmapConfig);
});

var updateHotness = function()
{       
	if (!visualizationRunning)
		return;

	// receives entries like {lat: 61.485008, lng: 23.846995, count: 3},
	var liveData = {
		data: [
		]
	};
    
	for (var busStopId in busStops) {
		liveData.data.push( calculateHotness(busStops[busStopId], currentTime) );
	}
    
    updateClockDisplay('currentTime', currentTime);
	
	currentTime += timeStep;
	
	if (currentTime > 60 * 60 * 24)
	{
		currentTime = 0;
        
        if (continuous)
        {
            setTimeout(updateHotness, parseInt(1000 / updateSpeed) );
        }
	}

	heatmapLayer.setData(liveData);
}

var calculateHotness = function(busStop, currentTime)
{
	var busStopHotness = { lat: busStop[0], lng: busStop[1], count:0 };

	// TODO : perhaps presort usage times so this does not need to run through all values
	var usageTimes = busStop[2];
	var count = usageTimes.reduce(function(previousValue, currentValue, index, array) {
		if (currentValue <= currentTime && currentValue > currentTime - departingBusesWindow)
			return previousValue + 1;
		else
			return previousValue;
	}, 0);
	
	busStopHotness.count = count;
	return busStopHotness;
}

function setAnimationRunState(state)
{
	animationRunning = state;
	document.getElementById("updateSpeed").disabled = state;
}

function resumeHotness()
{
    setAnimationRunState(true);
	updateSpeed = document.getElementById("updateSpeed").value;

	// leaflet is ok with same layer being added multiple times
	map.addLayer(heatmapLayer);

	updateHotness();
}

function pauseHotness()
{
    setAnimationRunState(false);
}

function clearHotness()
{
	pauseHotness();

    currentTime = 0;
    updateClockDisplay('currentTime', currentTime);
    
	var liveData = {
		data: [
		]
	};
    
    heatmapLayer.setData(liveData);

    map.removeLayer(heatmapLayer);
}
