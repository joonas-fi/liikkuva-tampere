require 'json'
require './common.rb'

# Data examples
#
# stops.txt:
# 	stop_id,stop_code,stop_name,stop_lat,stop_lon
#   0001,0001,Keskustori M,61.49751,23.76151
#   0002,0002,Keskustori L,61.49756,23.76148
#

def bus_stop_coordinates_from_original_data(bus_stops)
	ret = {}

	bus_stops.each do |stop|
		ret[stop["stop_id"]] = [
			stop["stop_lat"].to_f,
			stop["stop_lon"].to_f
		]
	end
	
	ret
end


def parse_hh_mm_ss(str)
	# "06:50:00" => ["06", "50", "00"]

	struct = str.split ":"

	struct[0].to_i * 3600 + struct[1].to_i * 60 + struct[2].to_i
end

def produce_stop_arrival_times()
	#
	# stop_times.txt:
	# 	trip_id,arrival_time,departure_time,stop_id,stop_sequence
	# 	4392873540,06:50:00,06:50:00,10000,1
	# 	4392873540,07:01:30,07:01:30,8931,2
	#

	stop_times = parse_gtfs_file "stop_times.txt"

	# format will be {"bus_stop_1": [arrival_time_1, arrival_time_2, ...], "bus_stop_2": ....}
	arrival_times = {}

	stop_times.each do |stop_time|
		# init list if not yet exists
		unless arrival_times.has_key? stop_time["stop_id"]
			arrival_times[stop_time["stop_id"]] = []
		end

		arrival_times[stop_time["stop_id"]].push parse_hh_mm_ss(stop_time["arrival_time"])
	end

	arrival_times
end

def combine_stop_coordinates_with_arrival_times(stops_coordinates)
	arrival_times = produce_stop_arrival_times()

	arrival_times.each do |stop_id, stop_count|
		unless stops_coordinates.has_key? stop_id
			raise "stop_id #{stop_id} not found from stops_coordinates that was found in arrival_times"
			next
		end

		stops_coordinates[stop_id].push stop_count
	end

	stops_coordinates
end

stops_original = parse_gtfs_file("stops.txt")

puts "Read #{stops_original.length} bus-stops"

stop_coordinates = bus_stop_coordinates_from_original_data(stops_original)

filename = "data-processed/stops.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var busStops = "

	# the rest are JSON
	file.write(combine_stop_coordinates_with_arrival_times(stop_coordinates).to_json)
end

puts "#{stop_coordinates.length} bus-stop(s) written to #{filename}"
