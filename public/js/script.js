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
    var queryStringURL = url.indexOf("?") > -1 ? url + "&" : url + "?";
    queryStringURL += "userID=" + userID;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response;

            try {
                response = JSON.parse(xhttp.responseText);
            } catch(e) {
                response = xhttp.responseText;
            }

            callback(response);
        }
    };
    xhttp.open(method, queryStringURL, true);
    xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(requestData));
}

function upperCamelCase(stringVal){
    stringVal += "";
    return stringVal[0].toUpperCase() + stringVal.slice(1);
}

function underscoreToSpace(stringVal){
    stringVal += "";
    return stringVal.replace(/_/g, " ");
}

function upperCamelCaseAll(stringVal){
    stringVal += "";
    var words = stringVal.split(" ");
    var result = "";

    for(var word in words){
        result += upperCamelCase(words[word]) + " ";
    }

    return result;
}

function addClass(element, className){
    if(hasClass(element, className) == false){
        element.className += " " + className;
    } 
}

function removeClass(element, className){
    var elementClasses = element.className.split(" ");
    for(var i=0; i<elementClasses.length; i++){
        if(elementClasses[i] == className){
            elementClasses.splice(i, 1);
        }
    }
    element.className = elementClasses.join(" ");
}

function hasClass(element, className){
    var elementHasClass = false;
    var elementClasses = element.className.split(" ");
    for(var i=0; i<elementClasses.length; i++){
        if(elementClasses[i] == className){
            elementHasClass = true;
        }
    }
    return elementHasClass;
}

function getChildIndex(parent, child){
    var childIndex = -1;
    for(var i=0; i<parent.children.length; i++){
        if(parent.children[i] == child){
            childIndex = i;
        }
    }
    return childIndex;
}
function customDateFormat(dateObj, shortDate=false, includeTime=true){
    var dateString = "";

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    var doubleDigitDay = doubleDigitNum(dateObj.getDate());

    if(shortDate){
        var doubleDigitMonth = doubleDigitNum(dateObj.getMonth() + 1);
        dateString = doubleDigitDay + "/" + doubleDigitMonth + "/" + dateObj.getFullYear();
    } else {
        dateString = doubleDigitDay + " " + months[dateObj.getMonth()] + " " + dateObj.getFullYear();
    }
    

    if(includeTime){
        var amPm = dateObj.getHours() < 12 ? "am" : "pm";
        dateString += " " + doubleDigitNum(dateObj.getHours()) + ":" + doubleDigitNum(dateObj.getMinutes()) + amPm;
    }
    
    return dateString;
}

function doubleDigitNum(num){
    return num < 10 ? "0" + num : num;
}

function jsonToObject(jsonString){
    var validJsObject = false;
    var jsObj = {};

    try {
        jsObj = JSON.parse(jsonString);
        validJsObject = true;
    } catch(e) {
        validJsObject = false;
    }
    
    console.log("VALIDATION | Valid object = " + validJsObject);
    return validJsObject;
}

function objectToJson(jsObject){
    var validJson = false;
    var jsonString = "";

    try {
        jsonString = JSON.stringify(jsObject);
        validJson = true;
    } catch(e) {
        validJson = false;
    }
    
    console.log("VALIDATION | Valid JSON = " + validJson);
    return validJson;
}