function secondsToHHMMSS(seconds){
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

function getData(){    
    // Get the reference for the body
    var body = document.getElementsByTagName("body")[0];

    // Creates a <table> element and a <tbody> element
    var tbody = document.getElementsByTagName("tbody")[0];
    
    // Get the data from the web service
    url = "http://localhost:9999/getAllActivities";
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            jsonResponse = JSON.parse(xhttp.response);
            
            // Sort the JSON response in descending order of timeSpent
            data = new Map();
            for (var key in jsonResponse) {
                data.set(key, jsonResponse[key]);
            }
            
            const mapSort1 = new Map([...data.entries()].sort((a, b) => b[1] - a[1]));
            data = mapSort1
            
            for (const [url, timeSpent] of data) {
                var row = document.createElement("tr");
                
                var cell = document.createElement("td");
                var cellText = document.createTextNode(url);
                cell.appendChild(cellText);
                row.appendChild(cell);

                var cell = document.createElement("td");
                var cellText = document.createTextNode(secondsToHHMMSS(timeSpent));
                cell.appendChild(cellText);
                row.appendChild(cell);

                tbody.appendChild(row);   
            }
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}

getData();