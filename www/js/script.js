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

function upperCamelCase(stringVal){
    return stringVal[0].toUpperCase() + stringVal.slice(1);
}

function underscoreToSpace(stringVal){
    return stringVal.replace(/_/g, " ");
}

function upperCamelCaseAll(stringVal){
    var words = stringVal.split(" ");
    var result = "";

    for(var word in words){
        result += upperCamelCase(words[word]) + " ";
    }

    return result;
}