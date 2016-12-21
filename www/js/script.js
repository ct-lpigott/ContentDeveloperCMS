window.onload = function(){
    console.log("JS Available");

    setupEventListeners();

    if(typeof customWindowOnload == "function"){
        customWindowOnload();
    }
};

function setupEventListeners(){
    document.addEventListener("click", clickEventHandler);

    if(typeof customSetupEventListeners == "function"){
        customSetupEventListeners();
    }
}

function clickEventHandler(e){

    if(typeof customClickEventHandler == "function"){
        customClickEventHandler(e);
    }
}

function sendAjaxRequest(url, requestData, callback, method="GET"){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(requestData));
}