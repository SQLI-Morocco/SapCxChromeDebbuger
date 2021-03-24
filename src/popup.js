document.querySelector('#go-to-options').addEventListener("click",function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

chrome.runtime.sendMessage("runContentScript");
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request == "ready") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { // Fetch the current tab
                chrome.tabs.sendMessage(tabs[0].id,{action: "getCMSPage"}, function(response) {
                    if(typeof response !== "undefined" && response.result!="") {
                        document.querySelector("ul").innerHTML = response.result;
                    }
                });
            });
            sendResponse("DONE");
        }
    });
