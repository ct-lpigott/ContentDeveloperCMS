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

    if(e.target.id == "next"){
        var inputName = imagePreviewContainer.getAttribute("data-input_for");
        var currentInput =  document.getElementById(inputName);
        var inputViewImagesButton = currentInput.parentNode.getElementsByClassName("viewImages")[0];
        inputViewImagesButton.click();
        document.getElementsByClassName("viewImages");
    } else if(hasClass(e.target, "viewImages") == false){
        removeClass(imagePreviewContainer, "visible");
    }

    if(hasClass(e.target, "cancelRow")){
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    } else if(hasClass(e.target, "viewImages")){
            var imageInput = e.target.parentNode.getElementsByTagName("input")[0];
            var nextPageToken = imageInput.getAttribute("data-next_page_token");
            sendAjaxRequest("/feeds/" + projectID + "?action=mediaFiles&numFiles=9&nextPageToken=" + nextPageToken, {}, function(responseObject){
                if(responseObject != null){
                    if(responseObject.nextPageToken != null){
                        imageInput.setAttribute("data-next_page_token", responseObject.nextPageToken);
                        addClass(imagePreviewContainerNext, "visible");
                    } else {
                        imageInput.removeAttribute("data-next_page_token");
                    }
                    if(responseObject.files != null) {
                        generateAvailableImagesPreview(imageInput.getAttribute("id"), responseObject.files);
                    }
                }
                
                console.log(responseObject);
            });
    } else if(hasClass(e.target, "previewImage")){
        var imageURL = e.target.getAttribute("src");
        var inputName = imagePreviewContainer.getAttribute("data-input_for");
        var inputElement = document.getElementById(inputName);
        inputElement.setAttribute("data-file_url", imageURL);
        updateThumbnailImage(inputElement, imageURL);
        removeClass(imagePreviewContainer, "visible");
    }

    if(typeof customClickEventHandler == "function"){
        customClickEventHandler(e);
    }
}

function sendAjaxRequest(url, requestData, callback, method="GET"){
    var queryStringURL = url.indexOf("?") > -1 ? url + "&" : url + "?";
    queryStringURL += "userID=" + userID;

    var formData = new FormData();

    for(var data in requestData){
        formData.append(data, requestData[data]);
    }


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
    xhttp.send(formData);
    console.log("done");
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