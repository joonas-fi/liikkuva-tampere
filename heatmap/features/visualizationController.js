var currentTime = 0;
var busDepartureFactor = 20;
var interval = 60;
var visualizationRunning = false;
var updateSpeed = 0;
var continuous = false;

var calculateTimeoutForNextFrame = function() {
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

var secondsFromHoursAndMinutes = function(input)
{
    var seconds = 0;
    var parts = input.split(":");
    
    if (parts.length == 2)
        seconds = parseInt(parts[0]) * 60 * 60 + parseInt(parts[1]) * 60;
        
    return seconds;
}

function setVisualizationRunState(state)
{
	visualizationRunning = state;
	document.getElementById("updateSpeed").disabled = state;
	document.getElementById("interval").disabled = state;
	document.getElementById("continuous").disabled = state;
	document.getElementById("endTime").disabled = state;
	document.getElementById("startTime").disabled = state;
    document.getElementById("visualizationMode").disabled = state;
    
    if (state == true)
    {
        document.getElementById("stopButton").disabled = false;
        document.getElementById("startButton").disabled = true;
    }
    else
    {
        document.getElementById("stopButton").disabled = true;
        document.getElementById("startButton").disabled = false;
    }
}

function endMoment()
{
    return secondsFromHoursAndMinutes(document.getElementById("endTime").value);
}

function startMoment()
{
    return secondsFromHoursAndMinutes(document.getElementById("startTime").value);
}

function startVisualization()
{
	updateSpeed = document.getElementById("updateSpeed").value;
	interval = parseInt(document.getElementById("interval").value);
	continuous = document.getElementById("continuous").checked;
    
    currentTime = startMoment();
    setVisualizationRunState(true);

    var mode = $("#visualizationMode").find('.active').find('input').val();
    if ( mode == "bus-stops-visualization" )
    {
        resumeHotness();
    }
    else if ( mode == "bus-routes-visualization" )
    {
        startTripping();
    }
}

function stopVisualization()
{
    setVisualizationRunState(false);
    document.getElementById("startTime").value = document.getElementById("currentTime").value;
}

function clearVisualizationSettings()
{
    setVisualizationRunState(false);
    
    document.getElementById("startTime").value = "00:00";
    document.getElementById("endTime").value = "23:59";
    document.getElementById("currentTime").value = "00:00";
    
    var mode = $("#visualizationMode").find('.active').find('input').val();
    if ( mode == "bus-stops-visualization" )
    {
        clearHotness();
    }
    else if ( mode == "bus-routes-visualization" )
    {
        clearTrips();
    }
}