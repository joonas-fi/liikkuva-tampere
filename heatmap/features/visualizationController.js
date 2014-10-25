var timeStep = 60;
var departingBusesWindow = 20 * 60; // [s] 
var currentTime = 0;
var animationRunning = false;

var calculateTimeOutForNextFrame = function() {
    var updateSpeed = document.getElementById("updateSpeed").value;
    return parseInt(1000 / updateSpeed);
}

var updateClockDisplay = function(clockComponent, time)
{
	var clock = new Date(time * 1000);
	
	var time = clock.getUTCHours()< 10 ? "0" + clock.getUTCHours() : clock.getUTCHours();
	time += ":";
	time += clock.getUTCMinutes() < 10 ? "0" + clock.getUTCMinutes() : clock.getUTCMinutes();
	
	document.getElementById(clockComponent).value = time;
}

