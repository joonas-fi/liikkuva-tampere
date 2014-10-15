require 'json'
require './common.rb'

routes = parse_gtfs_file("routes.txt")
trips = parse_gtfs_file("trips.txt")
shapes = parse_gtfs_file("shapes.txt")

allPoints = {}

routes.each do |route|
	route_id = route["route_id"]

	unique_shape_ids = get_unique_shape_ids_for_route(trips, route_id)

	# raise "no shapes found for route #{route_id}" if unique_shape_ids.length < 1
	if unique_shape_ids.length < 1
		puts "warning: no shapes found for route_id #{route_id}"
		next
		# raise "no shapes found for route #{route_id}"
	end

	discarded = unique_shape_ids.length - 1

	# fixme: what else to do with multiples?
	unique_shape_ids = unique_shape_ids[0]

	allPoints[route_id] = expand_shape_ids_into_paths(shapes, unique_shape_ids)
end

filename = "points-all-routes.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var allPoints = "

	# the rest are JSON
	file.write(allPoints.to_json)
end

puts "ready, master"
