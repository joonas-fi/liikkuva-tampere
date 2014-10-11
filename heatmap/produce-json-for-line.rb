require 'json'

route_short_name = ARGV[0]

unless route_short_name
	puts "Usage: <route_short_name>"
	exit!
end

def read_gtfs_file(filename)
	buffer = File.read("itsfactory-gtfs-data/" + filename, :encoding => 'utf-8')

	# remove BOM 0xEF,0xBB,0xBF ( http://en.wikipedia.org/wiki/Byte_order_mark#UTF-8 )
	buffer = buffer[1..-1]

	lines = buffer.split "\n"

	heading = lines.shift().split(",")

	ret = []

	lines.each do |line|
		line = line.split(",")

		processed = {}

		heading.each_with_index do |field, index|
			processed[field] = line[index]
		end

		ret.push processed
	end

	ret
end

# Data examples
#
# routes.txt:
# 	route_id,route_short_name,route_long_name,route_type
# 	1,1,Vatiala - Pirkkala,3
# 
# shapes.txt contains this data:
# 	shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence
# 	1227145677060,61.49038,23.92267,1
# 
# Route

routes = read_gtfs_file("routes.txt")
trips = read_gtfs_file("trips.txt")
shapes = read_gtfs_file("shapes.txt")

def get_route_id_for_route_short_name(routes, short_name_to_find)
	found = routes.select do |route|
		route["route_short_name"] == short_name_to_find
	end

	if found[0]
		return found[0]["route_id"]
	else
		return nil
	end
end

def get_unique_shape_ids_for_route(trips, route_id)
	found = trips.select do |trip|
		trip["route_id"] == route_id
	end

	# map array to contain only shape_ids
	found = found.map do |trip|
		trip["shape_id"]
	end

	# remove duplicates
	found.uniq
end

def expand_shape_ids_into(shapes, shape_ids)
	found = shapes.select do |shape|
		shape_ids.include? shape["shape_id"]
	end

	# map to (lat, lng) float pairs
	found = found.map do |point|
		[point["shape_pt_lat"].to_f, point["shape_pt_lon"].to_f]
	end

	found
end

route_id = get_route_id_for_route_short_name(routes, route_short_name)

raise "route_short_name not found" unless route_id

unique_shape_ids = get_unique_shape_ids_for_route(trips, route_id)

discarded = unique_shape_ids.length - 1

# fixme: what else to do with multiples?
unique_shape_ids = unique_shape_ids[0]

points = expand_shape_ids_into(shapes, unique_shape_ids)

filename = "points.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var points = "

	# the rest are JSON
	file.write(points.to_json)
end

puts "#{points.length} point(s) written to #{filename}"
puts "fixme: discarded #{discarded} shapes"
