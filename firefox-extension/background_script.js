//
// For now, simply log the URL of the website loaded
//
function logVisit(event) {
    // We don't want embedded content's URLs to be logged, only the top-level URL
    if (event.frameId !== 0) {
        return;
    }

    curr_url = new URL(event.url);

    // Check if it is an actual website and not something like "about:profiles"
    if (curr_url.hostname != ""){
        console.log("Loading: " + curr_url.hostname + " at " + event.timeStamp);
    }
}

//
// Fired when a navigation is committed. At least part of the new document has been 
// received from the server and the browser has decided to switch to the new document.
//
browser.webNavigation.onCommitted.addListener(logVisit);