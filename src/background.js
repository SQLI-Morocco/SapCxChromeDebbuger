'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        backOffice: [
            {
                urlPattern : "powertools\\.*" ,
                backOfficeLink : "https://localhost:9002/backoffice/",
            }
        ],
        dataX: [
            {
                label: "JSP",
                regex: "requestURI=.*\\/(\\w*\\/\\w*.jsp)",
            },
            {
                label: "CMSPage",
                regex: "cmsPageName=([^\\n\\r]+)(?:\\n|\\r)(?:cmsPagePK=([^\\n\\r]+))?",
            },
            {
                label: "User",
                regex: "\\[user\\] = \\[([^\\[]+)\\[([0-9]+)",
            },
            {
                label: "BaseStore",
                regex: "baseStoreUid=([^\\n\\r]+)(?:\\n|\\r)(?:baseStorePK=([^\\n\\r]+))?",
            },
            {
                label: "CMSSite",
                regex: "cmsSiteUid=([^\\n\\r]+)(?:\\n|\\r)(?:cmsSitePK=([^\\n\\r]+))?",
            },
            {
                label: "CART",
                regex: "\\[cart\\] = \\[([^\\[]+)\\(([0-9]+)",
            },
            {
                label: "Language",
                regex: "\\[language\\] = \\[([0-9]+)->([^\\]]+)",
            },
            {
                label: "Currency",
                regex: "\\[currency\\] = \\[([0-9]+)->([^\\]]+)",
            },
            {
                label: "Product",
                regex: "ProductCode=([^\\n\\r]+)(?:\\n|\\r)(?:ProductPk=([^\\n\\r]+))?",
            }
        ]
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request == "runContentScript") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { // Fetch the current tab
                chrome.tabs.sendMessage(tabs[0].id,{action: "getCMSPage"}, function(response) {
                    if(typeof response === "undefined") {
                        chrome.tabs.executeScript({
                            file: 'contentScript.js'
                        });
                    }else {
                        chrome.runtime.sendMessage("ready");
                    }
                });
            });
        }
    });

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync" && "backOffice" in changes) {
        var regex = "";
        changes.backOffice.newValue.forEach(function(obj) {
            if(regex === "") {
                regex+=obj.urlPattern;
            }else {
                regex+="|"+obj.urlPattern;
            }
        });
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {urlMatches: regex},
                })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
        });
    }
});