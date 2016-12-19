window.onload = function(){
    console.log("JS Available");

    setupEventListeners();

    if(typeof customWindowOnload == "function"){
        customWindowOnload();
    }
};

function setupEventListeners(){
    document.addEventListener("click", clickEventHandler);
}

function clickEventHandler(e){

    if(typeof customClickEventHandler == "function"){
        customClickEventHandler(e);
    }
}

function loadDataFromURL(url, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}