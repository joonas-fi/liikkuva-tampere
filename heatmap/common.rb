
# GTFS files are formatted somewhat like .csv
def parse_gtfs_file(filename)
	buffer = File.read("itsfactory-gtfs-data/" + filename, :encoding => 'utf-8')

	# remove BOM 0xEF,0xBB,0xBF ( http://en.wikipedia.org/wiki/Byte_order_mark#UTF-8 )
	buffer = buffer[1..-1]

	# parse file content into lines
	lines = buffer.split "\n"

	# parse first line's heading from "foo,bar" into ["foo", "bar"]
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

def expand_shape_ids_into_paths(shapes, shape_ids)
	found = shapes.select do |shape|
		shape_ids.include? shape["shape_id"]
	end

	# map to (lat, lng) float pairs
	found = found.map do |point|
		[point["shape_pt_lat"].to_f, point["shape_pt_lon"].to_f]
	end

	found
end
