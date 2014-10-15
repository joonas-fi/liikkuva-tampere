require 'json'
require './common.rb'

routes = parse_gtfs_file("routes.txt")

filename = "data-processed/routes.js"

File.open(filename, "w") do |file|
	# the file is not strictly JSON (hence extension .js)
	file.write "var routes = "

	# the rest are JSON
	file.write(routes.to_json)
end

puts "#{routes.length} routes(s) written to #{filename}"
