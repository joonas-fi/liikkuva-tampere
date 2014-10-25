require 'json'
require './common.rb'

def createBusStopsHash(bus_stops)

	ret = {}
	bus_stops.each do |stop|
		
		processed = {}
		processed['stop_lat'] = stop["stop_lat"].to_f
		processed['stop_lon'] = stop["stop_lon"].to_f
		
        ret[ stop['stop_id'] ] = processed
	end
	
	ret
end

busStopsDatasource = '../itsfactory-gtfs-data/stops.txt'
stops_original = parse_gtfs_file(busStopsDatasource)
stops_hash = createBusStopsHash(stops_original)

def createTripsHash(trips)

    ret = {}
    trips.each do |trip|
    
        processed = {}
        processed['route_id'] = trip['route_id']
        processed['service_id'] = trip['service_id']
        ret[trip['trip_id']] = processed
    end

    ret
end

tripsDataSource = '../itsfactory-gtfs-data/trips.txt'
trips_original = parse_gtfs_file(tripsDataSource)
trips_hash = createTripsHash(trips_original)

def stringAsSeconds(stringTime)
    partsArray = stringTime.split(":").map { |s| s.to_i }
    ret = partsArray[0].to_i * 60*60 + partsArray[1].to_i * 60 + partsArray[2].to_i
    ret
end

def compactStopTimesData(stopTimes)
    
    ret = {}
    stopTimes.each do |stopTime|
    
        startTrip = stringAsSeconds(stopTime['arrival_time'])
        endTrip = stringAsSeconds(stopTime['departure_time'])
        
        stop = { 'stop_id' => stopTime['stop_id'], 'time' => startTrip, 'lat' => 0, 'lon' => 0 }
        if ret.has_key?(stopTime['trip_id'])
            
            if ret[stopTime['trip_id']]['start'] > startTrip
                ret[stopTime['trip_id']]['start'] = startTrip
            end 
            
            if ret[stopTime['trip_id']]['end'] < endTrip
                ret[stopTime['trip_id']]['end'] = endTrip
            end
            
        else
            ret[stopTime['trip_id']] = { 'start' => startTrip, 'end' => endTrip, 'stops' => [] }
        end
        
        ret[stopTime['trip_id']]['stops'].push stop

    end

    ret
end

stopTimesDataSource = '../itsfactory-gtfs-data/stop_times.txt'
stop_times_original = parse_gtfs_file(stopTimesDataSource)
trip_base_hash = compactStopTimesData(stop_times_original)

def combineDataForTripJSON(stops_hash, trips_hash, trip_base_hash)

    ret = []
    trip_base_hash.each do |trip_id, trip_values|
        trip = {'route_id' => trips_hash[trip_id]['route_id'], 'start' => trip_values['start'], 'end' => trip_values['end'], 'stops' => [] }
        
        trip_values['stops'].each do |stopdata|
            stop = stops_hash[stopdata['stop_id']]
            newStop = {'time' => stopdata['time'], 'lat' => stop['stop_lat'], 'lon' => stop['stop_lon']}
            trip['stops'].push newStop
        end

        ret.push trip
    end
    ret
end

pureTripData = combineDataForTripJSON(stops_hash, trips_hash, trip_base_hash)

filename = "data-processed/pure-trips.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var allTrips = "

	# the rest are JSON
	file.write(pureTripData.to_json)
end

