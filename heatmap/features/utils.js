var map; // this is the global reference to leaflet.js based map object

var calculateCenter = function (pointsArray) {
	var center = pointsArray.reduce(function (prev, current){
		prev[0] += current[0];
		prev[1] += current[1];

		return prev;
	}, [0.0, 0.0]);

	center[0] /= pointsArray.length;
	center[1] /= pointsArray.length;

	return center;
}

// NOTE! Google Maps takes coordinates in format (latitude, longitude), but GeoJSON takes (longitude, latitude)
// that's why we have to reverse the order of coordinates before putting those in GeoJSON
var flipCoordinatesForStupidGeoJSON = function (listOfCoordinates) {
	return listOfCoordinates.map(function (coord) {
		return [coord[1], coord[0]];
	});
};

// some providers that leaflet supports. you can try to change the provider to get a different looking map
var providers = {
	mapbox: {
		template: 'https://{s}.tiles.mapbox.com/v4/joonas-fi.jp9f2lef/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoiam9vbmFzLWZpIiwiYSI6ImVkUWgwZTgifQ.WRQC8mpASiCFxFll7t6odQ',
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
	},

	osm: {
		template: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
	},

	mapquest: {
		template: 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
		attribution: 'fixme'
	}
};

var updateClockDisplay = function(clockComponent, time)
{
	var clock = new Date(time * 1000);
	
	var time = clock.getUTCHours()< 10 ? "0" + clock.getUTCHours() : clock.getUTCHours();
	time += ":";
	time += clock.getUTCMinutes() < 10 ? "0" + clock.getUTCMinutes() : clock.getUTCMinutes();
	
	document.getElementById(clockComponent).value = time;
}

// master-checkbox

$(document.body).on('change', 'input.master-checkbox', function (){
	// toggle all checkboxes from tbody, which are visible (invisible checkboxes could be filtered out)
	$(this).closest('table').find('> tbody input[type=checkbox]:visible').click();
});
