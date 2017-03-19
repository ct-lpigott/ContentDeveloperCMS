var miniNav;
window.onload = function(e){
    miniNav = document.getElementById("miniNav");
    miniNav.addEventListener("click", clickHandler);

    var requestedTab = window.location.hash;
    if(requestedTab.length > 0){
        miniNav.querySelector("a[href='" + requestedTab + "']").click();
    } else {
        miniNav.querySelector("li:first-child a").click();
    }
};

function clickHandler(e){
    if(e.target.tagName == "A"){
        var activeTabs = miniNav.getElementsByClassName("active");
        removeClassFromChildren(activeTabs, "active");
        addClass(e.target.parentNode, "active");
        if(hasClass(e.target.parentNode.parentNode, "subNav")){
            addClass(e.target.parentNode.parentNode.parentNode, "active");
        }
    }
}

function removeClassFromChildren(children, className){
    for(var i=children.length-1; i>=0; i--){
        removeClass(children[i], className);
    }
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
