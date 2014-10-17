
$(document).ready(function (){
	var testData = {
		max: 8,
		data: [
			{lat: 61.485008, lng: 23.846995, count: 3},
			{lat: 61.486300, lng: 23.839500, count: 2}
		]
	};

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

	var heatmapLayer = new HeatmapOverlay(heatmapConfig);
	map.addLayer(heatmapLayer);
	heatmapLayer.setData(testData);
});
