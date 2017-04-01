var projectData;
var body;
var allPages;
var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function(e){
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response;

            try {
                response = JSON.parse(xmlHttpReq.responseText);
            } catch(e) {
                response = xmlHttpReq.responseText;
            }

            projectData = response;
            console.log(projectData);
            setupPage();
        }
    };
    xmlHttpReq.open("GET", "https://contentdevelopercms.eu/feeds/1", true);
    xmlHttpReq.send();
};

function setupPage(){
    body = document.getElementsByTagName("body")[0];
    allPages = document.getElementsByClassName("page");
    setupBody();
    setupHeader();
    setupWelcomeSection();
    setupSpecialOffers();
    setupAboutSection();
    setupContactDetails();
    setupFooter();
    showPageSpecificContent();
}

function getCurrentPage(){
    var currentPage = "home";
    if(body.hasAttribute("page")){
        currentPage = body.getAttribute("page");
    }
    return currentPage;
}

function setupBody(){
    body.setAttribute("style", "background-color:" + projectData.styles.colors.page_background_color + ";");
}

function setupHeader(){
    var currentPage = getCurrentPage();

    var mainHeading = document.getElementById("mainHeading");
    mainHeading.innerHTML = projectData.header.title;

    var logo = document.getElementById("logo");
    logo.setAttribute("src", projectData.header.logo);

    setupNavigation(currentPage);
}

function setupNavigation(currentPage){
    var mainNavigation = document.getElementById("mainNavigation");
    for(var i=0; i< projectData.header.navigation.length; i++){
        var newNavLi = document.createElement("li");
        newNavLi.innerHTML = projectData.header.navigation[i].title;
        newNavLi.setAttribute("style", "background-color:" + projectData.styles.colors.navigation_background_color + ";");
        newNavLi.setAttribute("linkTo", projectData.header.navigation[i].link);
        newNavLi.addEventListener("click", function(e){
            body.setAttribute("page", e.target.getAttribute("linkTo"));
            showPageSpecificContent();
        });

        if(projectData.header.navigation[i].link.indexOf(currentPage) > -1){
            newNavLi.setAttribute("class", "active");
        }
        
        mainNavigation.appendChild(newNavLi);
    }
}

function setupWelcomeSection(){
    var welcome = document.getElementById("welcome");
    welcome.innerHTML = projectData.home.welcome;
}

function setupAboutSection(){
    var aboutUs = document.getElementById("aboutUs");
    aboutUs.innerHTML = projectData.about_us.history;

    var shopImg = document.getElementById("shop");
    shopImg.setAttribute("src", projectData.about_us.shop_photo);
}

function setupContactDetails(){
    var googleMap = document.getElementById("googleMap");
    googleMap.innerHTML = projectData.contact_details.google_maps_embed_url;
    
    var phone = document.getElementById("phone");
    phone.innerHTML = projectData.contact_details.phone;

    var address = document.getElementById("address");
    address.innerHTML = projectData.contact_details.address;
}

function setupFooter(){
    var copyright = document.getElementById("copyright");
    copyright.innerHTML = "&copy; " + projectData.footer.copyright;

    var usefulLinks = document.getElementById("usefulLinks");
    for(var i=0; i<projectData.footer.useful_links.length; i++){
        usefulLinks.innerHTML += "<a href='" + projectData.footer.useful_links[i].link + "' target='_blank'>" + projectData.footer.useful_links[i].title + "</a>";
        if(i < projectData.footer.useful_links.length - 1){
            usefulLinks.innerHTML += " - ";
        }
    }
}

function showPageSpecificContent(){
    var currentPage = getCurrentPage();
    var pageTitle = document.getElementById("pageTitle");
    pageTitle.text = projectData.header.title + " | " + currentPage;

    for(var i=0; i<allPages.length; i++){
        removeClass(allPages[i], "visible");
    }
    addClass(document.getElementById(currentPage), "visible");
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

function setupSpecialOffers(){
    var specialOffers = document.getElementById("specialOffers");

    sortSpecialOffers();

    for(var i=0; i<projectData.special_offers.length; i++){
        var newDiv = document.createElement("div");

        var newH3 = document.createElement("h3");
        newH3.innerHTML = projectData.special_offers[i].offer_name;
        newDiv.appendChild(newH3);

        var newStartSpan = document.createElement("span");
        var startDate = new Date(projectData.special_offers[i].start_date);
        newStartSpan.setAttribute("class", "start");
        newStartSpan.innerHTML = "Starts " + days[startDate.getDay()] + " " + startDate.getDate() + " " + longMonths[startDate.getMonth()] + " " + startDate.getFullYear();
        newDiv.appendChild(newStartSpan);

        var newEndSpan = document.createElement("span");
        var endDate = new Date(projectData.special_offers[i].end_date);
        newEndSpan.setAttribute("class", "end");
        newEndSpan.innerHTML = "Ends " + days[endDate.getDay()] + " " + endDate.getDate() + " " + longMonths[endDate.getMonth()] + " " + endDate.getFullYear();
        newDiv.appendChild(newEndSpan);

        var newDetailsDiv = document.createElement("div");
        newDetailsDiv.setAttribute("class", "details");
        newDetailsDiv.innerHTML = projectData.special_offers[i].details;
        newDiv.appendChild(newDetailsDiv);

        specialOffers.appendChild(newDiv);
    }
}

function sortSpecialOffers(){
    projectData.special_offers.sort(function(a, b){
        var result = 0;

        if(a.end_date > b.end_date){
            result = -1;
        } else if(a.end_date < b.end_date){
            result = 1;
        }

        return result;
    });
}