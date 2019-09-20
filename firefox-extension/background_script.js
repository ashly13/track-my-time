//
// Send the data to the web service
//
function sendData(params){
    // For sending data to the service
    var xhttp = new XMLHttpRequest();
    var url = "http://localhost:9999/storeActivity?";
    xhttp.open("GET", url + params, true);
    xhttp.send();
    // console.log("Data sent to " + url + params);
}

//
// Only one webpage can be viewed by the user at a time.
//
const curr_page = {
    top_url: null,
    opened_time: null,
    tabId: null,
    windowId: null
};

// -----------------------------------Callback Functions---------------------------------------

//
// When a URL is loaded
//
function logVisit(event) {
    // We don't want embedded content's URLs to be logged, only the top-level URL
    if (event.frameId !== 0) {
        return;
    }

    curr_url = new URL(event.url);

    params = null;

    // Check if it is an actual website and not something like "about:profiles"
    if (curr_url.hostname != "" && curr_url.hostname.includes('.')){
        // console.log("Loading: " + curr_url.hostname + " at " + event.timeStamp);

        // Check if the curr_page is null
        if (curr_page.top_url == null){
            // Simply assign it (first time a page is being opened)
            curr_page.top_url = curr_url.hostname;
            curr_page.opened_time = event.timeStamp;
            curr_page.tabId = event.tabId;
        }
        else if (curr_page.top_url == curr_url.hostname){
            // Same page, do nothing
        }
        else {
            // Info about old page
            timespent = (event.timeStamp-curr_page.opened_time)/1000;
            console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

            // Send to web service
            params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
            sendData(params);

            // Transition to new page
            curr_page.top_url = curr_url.hostname;
            curr_page.opened_time = event.timeStamp;
            curr_page.tabId = event.tabId;
        }
    }
}

//
// When a tab is closed
//
function tabClosed(tabId, removeInfo){
    // Check if tab being closed is in the one being viewed right now
    if (tabId == curr_page.tabId){
        // Info about old page
        timespent = ((new Date).getTime()-curr_page.opened_time)/1000;
        console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

        // Send to web service
        params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
        sendData(params);

        // No page is open right now
        curr_page.top_url = null;
        curr_page.opened_time = null;
        curr_page.tabId = null;
        curr_page.windowId = null;
    }
}

//
// When a tab is changed
//
async function tabChanged(activeInfo){
    tab = await browser.tabs.get(activeInfo.tabId);
    time = (new Date).getTime();
    curr_url = new URL(tab.url);

    if (curr_url.hostname != "" && curr_url.hostname.includes('.')){
        // Check if the curr_page is null
        if (curr_page.top_url == null){
            // Simply assign it (first time a page is being opened)
            curr_page.top_url = curr_url.hostname;
            curr_page.opened_time = time;
            curr_page.tabId = activeInfo.tabId;
            curr_page.windowId = activeInfo.windowId;
        }
        else if (curr_page.top_url == curr_url.hostname){
            // Same page, do nothing
        }
        else {
            // Info about old page
            timespent = (time-curr_page.opened_time)/1000;
            console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

            // Send to web service
            params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
            sendData(params);

            // Transition to new page
            curr_page.top_url = curr_url.hostname;
            curr_page.opened_time = time;
            curr_page.tabId = activeInfo.tabId;
            curr_page.windowId = activeInfo.windowId;
        }
    }
    else {
        if (curr_page.top_url != null){
            // Info about old page
            timespent = (time-curr_page.opened_time)/1000;
            console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

            // Send to web service
            params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
            sendData(params);

            // Transition to new page
            curr_page.top_url = null;
            curr_page.opened_time = null;
            curr_page.tabId = null;
            curr_page.windowId = null;
        }
    }

}

//
// When the window loses focus
//
function currentTabWhenWindowFocussed(tabs){
    time = (new Date).getTime();

    // One active tab available
    if (tabs.length == 1){
        url = new URL(tabs[0].url);
        url = url.hostname;
        
        if (url != ""){
            curr_page.windowId = tabs[0].windowId;
            curr_page.opened_time = time;
            curr_page.tabId = tabs[0].id;
            curr_page.top_url = url;
        }
    }
}
function windowChanged(windowId){
    time = (new Date).getTime();

    if (curr_page.windowId == null){
        // Window is reopened
        var querying = browser.tabs.query({windowId: windowId, active: true});
        querying.then(currentTabWhenWindowFocussed);
    }
    else if (windowId != curr_page.windowId){
        if (curr_page.top_url != null){
            // Info about old page
            timespent = (time-curr_page.opened_time)/1000;
            console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

            // Send to web service
            params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
            sendData(params);

            // Transition to new page
            curr_page.top_url = null;
            curr_page.opened_time = null;
            curr_page.tabId = null;
            curr_page.windowId = null;
        }
    }
    
}

//
// When the browser state changes
//
function browserStateChanged(newState){
    time = (new Date).getTime();

    if (newState == "locked" || newState == "idle"){
        if (curr_page.top_url != null){
            // Info about old page
            timespent = (time-curr_page.opened_time)/1000;
            console.log(curr_page.top_url + " was viewed for " + timespent + " seconds.");

            // Send data to web service
            params = "url=" + curr_page.top_url + "&timeSpent=" + timespent;
            sendData(params);

            // Transition to new page
            curr_page.top_url = null;
            curr_page.opened_time = null;
            curr_page.tabId = null;
            curr_page.windowId = null;
        }
    }
}

// -----------------------------------Event Handlers-----------------------------------------------

//
// Fired when a navigation is committed. At least part of the new document has been 
// received from the server and the browser has decided to switch to the new document.
//
browser.webNavigation.onCommitted.addListener(logVisit);

//
// Fired when a tab is closed.
//
browser.tabs.onRemoved.addListener(tabClosed);

//
// Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to tabs.onUpdated events to be notified when a URL is set.
//
browser.tabs.onActivated.addListener(tabChanged);

//
// Fired when the currently focused window changes. 
// Will be windows.WINDOW_ID_NONE if all browser windows have lost focus.
//
browser.windows.onFocusChanged.addListener(windowChanged);

//
// Fired when the system changes to an active, idle or locked state. 
// The event listener is passed a string that has one of three values:
// 1) "locked" if the screen is locked or the screensaver activates
// 2) "idle" if the system is unlocked and the user has not generated 
//     any input for a specified number of seconds. This number defaults to 60, 
//     but can be set using idle.setDetectionInterval().
// 3) "active" when the user generates input on an idle system.
//
browser.idle.onStateChanged.addListener(browserStateChanged);

// ----------------------------------------------------------------------------------------
// -----------------------------------Toolbar Button---------------------------------------
// ----------------------------------------------------------------------------------------
browser.browserAction.onClicked.addListener(showExtensionPage);

function showExtensionPage(){
    var creating = browser.tabs.create({
        active: true,
        url: "/track_my_time.html"
    });
    creating.then(onCreated, onError);
}

function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
}

function onError(error) {
    console.log(`Error: ${error}`);
}
