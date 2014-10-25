# What is this?

todo

# To run this

Open bus-lines.html in your browser!

# To refresh the data:

Download latest GTFS dump from [ITSFactory](http://data.itsfactory.fi/files/tampere_gtfs_latest.zip) and extract to itsfactory-gtfs-data/

	$ ruby produce-json-for-all-lines.rb
	$ ruby produce-json-for-all-routes.rb
	$ ruby produce-json-for-bus-stops.rb

# Origin of the data files

The .txt files in the directory itsfactory-gtfs-data/ were extracted from:

[http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip](http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip)
