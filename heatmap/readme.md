# What is this?

This is our entry to [apps4pirkanmaa](http://apps4pirkanmaa.fi) competition.

Our entry is about visualizing public transportation in the Tampere region.

# Demo

[liikkuvatampere.xs.fi](http://liikkuvatampere.xs.fi/)

# To refresh the data:

Download latest GTFS dump from [ITSFactory](http://data.itsfactory.fi/files/tampere_gtfs_latest.zip) and extract to itsfactory-gtfs-data/

	$ ruby produce-json-for-all-lines.rb
	$ ruby produce-json-for-all-routes.rb
	$ ruby produce-json-for-bus-stops.rb

# Origin of the data files

The .txt files in the directory itsfactory-gtfs-data/ were extracted from:

[http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip](http://data.itsfactory.fi/files/gtfs/tampere_gtfs_20141006.zip)
