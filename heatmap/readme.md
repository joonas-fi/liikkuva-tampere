# What is this?

todo

# To run this

Open bus-lines.html in your browser!

# To produce points.js file for a different bus line

Run the following script:

	$ ruby produce-json-for-line.rb
	Usage: <route_short_name>

=> So use the bus number to build the points.js file:

	$ ruby produce-json-for-line.rb Y35
	202 point(s) written to points.js
	fixme: discarded 2 shapes

List of bus lines can be found from routes.txt

# Origin of the data files

The .txt files in the directory itsfactory-gtfs-data/ were extracted from:

[http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip](http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip)
