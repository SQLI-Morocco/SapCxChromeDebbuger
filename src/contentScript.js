dataX=[]; // a global variable
backOffice=[]; // a global variable
chrome.storage.sync.get("dataX", function (data) {
    dataX = data.dataX;
    chrome.runtime.sendMessage("ready");
});
chrome.storage.sync.get("backOffice", function (data) {
    backOffice = data.backOffice
});

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync" && "dataX" in changes) {
        dataX = changes.dataX.newValue;
    }
    if (area == "sync" && "backOffice" in changes) {
        backOffice = changes.backOffice.newValue;
    }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "getCMSPage") {
        backOfficeLink =null;
        backOffice.forEach(function(obj) {
            var rgx = RegExp(obj.urlPattern);
            if(rgx) {
                backOfficeLink = obj.backOfficeLink;
            }
        });
        console.log("HHH : "+backOfficeLink);
      dom = document.getElementsByTagName("html")[0].innerHTML;
      var html = "";
        var regExp ,value;
        dataX.forEach(function(obj) {
            regExp = new RegExp(obj.regex);
            value = regExp.exec(dom);
            if(value) {
                html+='<li><span class="key">'+obj.label+'</span></li>';
                html+='<li><span class="value">'+buildValue(value.slice(1), backOfficeLink)+'</span></li>';
            }
        });
        sendResponse({result: html});
    }
    else
        sendResponse({}); // Send nothing..
});

function buildValue(array, backOfficeLink){
    var pk=null;
    for (x of array) {
        if(!isNaN(x)) {
            pk = x;
        }
    }
    if(pk && backOfficeLink!=null) {
        console.log(pk+ ' ' +backOfficeLink);
        var newArray = [];
        newArray = array.filter(item => item !== pk);
        return '<a target="_blank" href="'+backOfficeLink+"#open("+pk+')">'+(newArray.length>0 ? newArray.join(" - ") : pk)+'</a>';
    }else {
        return array.join(" - ");
    }
}

getComments=function() {
    var comments = "";
    if ( ! document.createTreeWalker ) {
        throw( new Error( "Browser does not support createTreeWalker()." ) );
    }

    function filter( node ) {
        if ( node.nodeValue === " Load scripts. " ) {
            return( NodeFilter.FILTER_SKIP );
        }
        return( NodeFilter.FILTER_ACCEPT );
    }

    filter.acceptNode = filter;

    var treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_COMMENT,
        filter,
        false
    );
    // For each comment node, add a
    while ( treeWalker.nextNode() ) {
        comments+=treeWalker.currentNode.nodeValue;
    }

    return comments;
};
