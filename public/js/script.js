var insertionPoint;
var selectedText;

window.onload = function(){
    console.log("JS Available");

    setupEventListeners();

    if(typeof customAdminWindowOnload == "function"){
        customAdminWindowOnload();
    }
    if(typeof customContentWindowOnload == "function"){
        customContentWindowOnload();
    }
};

function setupEventListeners(){
    document.addEventListener("click", clickEventHandler);

    if(typeof customAdminSetupEventListeners == "function"){
        customAdminSetupEventListeners();
    }
    if(typeof customContentSetupEventListeners == "function"){
        customContentSetupEventListeners();
    }
}

function clickEventHandler(e){
    if(window.getSelection().focusNode != null){
        if(hasClass(window.getSelection().focusNode.ownerDocument.activeElement, "wysiwygInput")){
            var currentWysiwygInput = window.getSelection().focusNode.ownerDocument.activeElement;
            //insertionPoint = window.getSelection().focusOffset; 
            getCursorPosition(currentWysiwygInput);
        }
    }    
    
    if(hasClass(e.target, "insertElement")){
        insertWysiwygElement(e.target);
    }
    /*
    if(hasClass(e.target, "wysiwygImages") == false){
        hide(wysiwygImages);
    }
    if(hasClass(e.target, "wysiwygHeadings") == false){
        hide(wysiwygHeadings);
    }
    if(hasClass(e.target, "wysiwygLinks") == false){
        hide(wysiwygLinks);
    }
    */

    if(hasClass(e.target, "cancelRow")){
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    } else if(hasClass(e.target, "viewImages")){
            var imageInput = e.target.parentNode.getElementsByTagName("input")[0];
            imagePreviewContainer.setAttribute("data-for_input", imageInput.id);
            var nextPageToken = imageInput.getAttribute("data-next_page_token");
            sendAjaxRequest("/feeds/" + projectID + "?action=mediaItems&numFiles=9&nextPageToken=" + nextPageToken, {}, function(responseObject){
                if(responseObject != null){
                    if(responseObject.nextPageToken != null){
                        imageInput.setAttribute("data-next_page_token", responseObject.nextPageToken);
                        show(imagePreviewContainerNext);
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
        var inputName = imagePreviewContainer.getAttribute("data-for_input");
        var inputElement = document.querySelector("#projectCollectionsContent #" + inputName);
        inputElement.setAttribute("data-file_url", imageURL);
        updateThumbnailImage(inputElement, imageURL);
        hide(imagePreviewContainer);
    } else if(hasClass(e.target, "wysiwygButton")){
        var elementType = e.target.getAttribute("data-insert_type");
        var forInput = e.target.parentNode.getAttribute("data-for_input");

        if(elementType == "a"){
            wysiwygLinks.setAttribute("data-for_input", forInput);
            show(wysiwygLinks);
        } else if(elementType == "img"){
            wysiwygImages.setAttribute("data-for_input", forInput);
            show(wysiwygImages);
        } else {
            show(wysiwygHeadings);
            wysiwygHeadings.setAttribute("data-for_input", forInput);
            wysiwygHeadings.setAttribute("data-insert_type", elementType);
        }
    }
    
    function insertWysiwygElement(inputButton){
        var forInput = e.target.parentNode.parentNode.getAttribute("data-for_input");
        var elementType = e.target.parentNode.parentNode.getAttribute("data-insert_type");
        var contentInput = document.getElementById(forInput);
        var content = contentInput.innerHTML;
        var newElement;
        insertionPoint = insertionPoint == null ? contentInput.length - 1 : insertionPoint;

        console.log("Insert " + elementType + " into " + forInput);
        
        if(elementType == "a"){
            var linkUrl = wysiwygLinks.getElementsByClassName("linkUrl")[0].value;
            var linkText = wysiwygLinks.getElementsByClassName("linkText")[0].value;
            newElement = "<a href='" + linkUrl + "'>" + linkText + "</a>";
            hide(wysiwygLinks);
            clearInputs(wysiwygLinks);
        } else if(elementType == "img"){
            var imageSrc = wysiwygImages.getElementsByClassName("fileUrl")[0].getAttribute("data-file_url");
            var altText = wysiwygImages.getElementsByClassName("altText")[0].value;
            newElement = "<img src='" + imageSrc + "' alt='" + altText + "'/>";
            hide(wysiwygImages);
            clearInputs(wysiwygImages);
        } else {
            var headingText = wysiwygHeadings.getElementsByClassName("headingText")[0].value;
            newElement = "<" + elementType + ">" + headingText + "</" + elementType + ">";
            hide(wysiwygHeadings);
            clearInputs(wysiwygHeadings);
        }
        
        if(content.indexOf("<") > -1){
            while(content.slice(0, insertionPoint).lastIndexOf("<") > content.slice(0, insertionPoint).lastIndexOf(">")){
                insertionPoint++;
            }
        }
        
        contentInput.innerHTML = content.slice(0, insertionPoint) + newElement + content.slice(insertionPoint);
    }

    if(typeof customAdminClickEventHandler == "function"){
        customAdminClickEventHandler(e);
    }
    if(typeof customContentClickEventHandler == "function"){
        customContentClickEventHandler(e);
    }
}

function sendAjaxRequest(url, requestData, callback, method="GET"){
    var queryStringURL = url.indexOf("?") > -1 ? url + "&" : url + "?";

    queryStringURL += "include=content,structure,history";
    
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

function show(element){
    removeClass(element, "hidden");
    addClass(element, "visible");
}

function hide(element){
    removeClass(element, "visible");
    addClass(element, "hidden");
}

function clearInputs(element){
    if(element.value != undefined){
        element.value = "";
    } else {
        var inputElements = element.getElementsByTagName("input");
        for(var input of inputElements){
            input.value = "";
        }
    }
}

function getCursorPosition(element, cb) {
    // Defaulting the cursor position to be null 
    var cursorPosition = null;
    // Checking if a selection currently exists on the window object
    if(window.getSelection()){
        // Getting the selection object of the window object, to access
        // the currently selected content on the page
        var selectionObject = window.getSelection();

        // Checking if there are ranges currently in the selection object
        if(selectionObject.rangeCount > 0){
            // Checking if this is a selection of text, or just a cursor position
            if(selectionObject.type.toLowerCase() == "range"){
                // Storing the value of the text that was selected in the global
                // selectedText variable 
                selectedText = selectionObject.toString();
            } 

            // Accessing the first range of the selection object, which
            // will be the active selection range
            var selectionRange = selectionObject.getRangeAt(0);

            var contentBeforeCursor = "";

            for(var i=0; i<element.childNodes.length; i++){
                var nodeContent = element.childNodes[i].outerHTML != undefined ? element.childNodes[i].outerHTML : element.childNodes[i].textContent;
                if(element.childNodes[i] == selectionRange.endContainer){
                    contentBeforeCursor += nodeContent.substring(0, selectionRange.endOffset);
                    break;                 
                } else {
                    contentBeforeCursor += nodeContent;
                }
            }
            console.log(contentBeforeCursor);

            insertionPoint = contentBeforeCursor.length;     
        }
    }
}