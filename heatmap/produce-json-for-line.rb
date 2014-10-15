require 'json'
require './common.rb'

route_short_name = ARGV[0]

unless route_short_name
	puts "Usage: <route_short_name>"
	exit!
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

routes = parse_gtfs_file("routes.txt")
trips = parse_gtfs_file("trips.txt")
shapes = parse_gtfs_file("shapes.txt")

route_id = get_route_id_for_route_short_name(routes, route_short_name)

raise "route_short_name not found" unless route_id

unique_shape_ids = get_unique_shape_ids_for_route(trips, route_id)

discarded = unique_shape_ids.length - 1

# fixme: what else to do with multiples?
unique_shape_ids = unique_shape_ids[0]

points = expand_shape_ids_into_paths(shapes, unique_shape_ids)

filename = "points.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var points = "

	# the rest are JSON
	file.write(points.to_json)
end

puts "#{points.length} point(s) written to #{filename}"
puts "fixme: discarded #{discarded} shapes"
