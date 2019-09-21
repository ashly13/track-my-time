# Track My Time

Track My Time is a Firefox-based tool that tracks and displays the amount of time spent on various websites. 
It has the following two components:

### Firefox Extension
A Firefox Extension that collects data about the websites visited and the time spent on each web site. 
The aggregated statistics can then be viewed in the extension's home page.

### RESTful Web Service
A Java Spring Boot based RESTful web service that receives the usage data from the Firefox extension 
and stores them in a MongoDB database.
