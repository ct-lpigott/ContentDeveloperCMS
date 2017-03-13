webpackJsonp([0,3],{

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomJsonPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CustomJsonPipe = (function () {
    function CustomJsonPipe() {
    }
    CustomJsonPipe.prototype.transform = function (value, action, indent) {
        if (indent === void 0) { indent = 2; }
        var result = null;
        if (action == "parse") {
            try {
                result = JSON.parse(value);
            }
            catch (err) { }
        }
        else if (action == "stringify") {
            try {
                result = JSON.stringify(value, null, indent);
            }
            catch (err) { }
        }
        return result;
    };
    CustomJsonPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'customJson'
        }), 
        __metadata('design:paramtypes', [])
    ], CustomJsonPipe);
    return CustomJsonPipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/custom-json.pipe.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CloneObjectPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CloneObjectPipe = (function () {
    function CloneObjectPipe() {
    }
    CloneObjectPipe.prototype.transform = function (originalObject, args) {
        var stringifiedObject = JSON.stringify(originalObject);
        var cloneOfObject = JSON.parse(stringifiedObject);
        return cloneOfObject;
    };
    CloneObjectPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'cloneObject'
        }), 
        __metadata('design:paramtypes', [])
    ], CloneObjectPipe);
    return CloneObjectPipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/clone-object.pipe.js.map

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DoubleDigitPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DoubleDigitPipe = (function () {
    function DoubleDigitPipe() {
    }
    DoubleDigitPipe.prototype.transform = function (num) {
        var result = num < 10 ? "0" + num : "" + num;
        return result;
    };
    DoubleDigitPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'doubleDigit'
        }), 
        __metadata('design:paramtypes', [])
    ], DoubleDigitPipe);
    return DoubleDigitPipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/double-digit.pipe.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeyValArrayPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var KeyValArrayPipe = (function () {
    function KeyValArrayPipe() {
    }
    KeyValArrayPipe.prototype.transform = function (object, get) {
        var result = [];
        for (var key in object) {
            if (get == null) {
                result.push({});
                result[result.length - 1][key] = object[key];
            }
            else if (get == "keys") {
                result.push(key);
            }
            else if (get == "values") {
                result.push(object[key]);
            }
        }
        return result;
    };
    KeyValArrayPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'keyValArray'
        }), 
        __metadata('design:paramtypes', [])
    ], KeyValArrayPipe);
    return KeyValArrayPipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/key-val-array.pipe.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShortenerPipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ShortenerPipe = (function () {
    function ShortenerPipe() {
    }
    ShortenerPipe.prototype.transform = function (stringVal, length) {
        return stringVal.slice(0, length);
    };
    ShortenerPipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'shortener'
        }), 
        __metadata('design:paramtypes', [])
    ], ShortenerPipe);
    return ShortenerPipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/shortener.pipe.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UnderscoreToSpacePipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UnderscoreToSpacePipe = (function () {
    function UnderscoreToSpacePipe() {
    }
    UnderscoreToSpacePipe.prototype.transform = function (stringVal) {
        stringVal += "";
        return stringVal.replace(/_/g, " ");
        ;
    };
    UnderscoreToSpacePipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'underscoreToSpace'
        }), 
        __metadata('design:paramtypes', [])
    ], UnderscoreToSpacePipe);
    return UnderscoreToSpacePipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/underscore-to-space.pipe.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UpperCamelCasePipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UpperCamelCasePipe = (function () {
    function UpperCamelCasePipe() {
    }
    UpperCamelCasePipe.prototype.transform = function (stringVal, firstWordOnly) {
        if (firstWordOnly === void 0) { firstWordOnly = false; }
        stringVal += "";
        var result = "";
        var words = firstWordOnly ? stringVal.split(" ").slice(0, 1) : stringVal.split(" ");
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            result += word[0].toUpperCase() + word.slice(1) + " ";
        }
        return result;
    };
    UpperCamelCasePipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'upperCamelCase'
        }), 
        __metadata('design:paramtypes', [])
    ], UpperCamelCasePipe);
    return UpperCamelCasePipe;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/upper-camel-case.pipe.js.map

/***/ }),

/***/ 352:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 352;


/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_module__ = __webpack_require__(460);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/main.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipes_clone_object_pipe__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__(681);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do__ = __webpack_require__(682);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(683);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw__ = __webpack_require__(680);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_throw__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentDeveloperServerService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ContentDeveloperServerService = (function () {
    function ContentDeveloperServerService(_http, _coPipe) {
        this._http = _http;
        this._coPipe = _coPipe;
        //private _serverUrl = "./..";
        this._serverUrl = "http://localhost:3000";
        this._headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        this._headers.append("Content-Type", "application/json");
    }
    ContentDeveloperServerService.prototype.getLoginUrl = function () {
        var requestUrl = this._serverUrl + "/admin/loginUrl";
        var getLoginUrlObservable = this._http
            .get(requestUrl)
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error) || "Unknown error getting login url"; })
            .do(function (responseObject) { return responseObject.loginUrl; });
        return getLoginUrlObservable;
    };
    ContentDeveloperServerService.prototype.loadUser = function () {
        var _this = this;
        var requestUrl = this._serverUrl + "/admin/user";
        var loadUserObservable = this._http
            .get(requestUrl)
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error) || "Unknown error getting users details"; })
            .do(function (responseObject) { return _this._currentUser = responseObject.user; });
        return loadUserObservable;
    };
    ContentDeveloperServerService.prototype.logout = function () {
        var _this = this;
        var logoutUrl = this._serverUrl + "/admin/logout";
        var logoutObservable = this._http
            .get(logoutUrl)
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error) || "Unknown error when logging user out"; })
            .do(function (response) { return _this._currentUser = null; });
        this.leaveProject();
        return logoutObservable;
    };
    ContentDeveloperServerService.prototype.loadUserProjects = function () {
        var requestUrl = this._serverUrl + "/feeds/?action=collaborators";
        var loadUserProjectsObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error getting users projects"; });
        return loadUserProjectsObservable;
    };
    ContentDeveloperServerService.prototype.loadProjectContentStructureHistory = function (projectId) {
        var _this = this;
        this._currentProjectId = projectId;
        console.log("Reloading project content and structure");
        var requestUrl = this._serverUrl + "/feeds/" + projectId + "?include=structure,content,history";
        var loadProjectContentAndStructureObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error getting project content and structure"; })
            .do(function (responseObject) {
            _this._currentProjectContentStructureHistory = responseObject;
            _this._currentProjectContentStructureHistory.content_history = _this._currentProjectContentStructureHistory.content_history.all;
            _this._currentProjectContentStructureHistory.structure_history = _this._currentProjectContentStructureHistory.structure_history.all;
        });
        return loadProjectContentAndStructureObservable;
    };
    ContentDeveloperServerService.prototype.loadProjectSettings = function () {
        var _this = this;
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?allSettings";
        var loadProjectSettingsObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error); })
            .do(function (responseObject) {
            _this._currentProjectSettings = responseObject;
        });
        return loadProjectSettingsObservable;
    };
    ContentDeveloperServerService.prototype.updateProjectSettings = function (projectName, maxCacheAge, customCss) {
        if (projectName === void 0) { projectName = null; }
        if (maxCacheAge === void 0) { maxCacheAge = null; }
        if (customCss === void 0) { customCss = null; }
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?allSettings";
        var updateProjectSettingsObservable = this._http
            .put(requestUrl, { project_name: projectName, max_cache_age: maxCacheAge, custom_css: customCss }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error); })
            .do(function (responseObject) { return console.log("Project settings updated!!"); });
        return updateProjectSettingsObservable;
    };
    ContentDeveloperServerService.prototype.loadAdminSettings = function () {
        var _this = this;
        var requestUrl = this._serverUrl + "/admin/settings/" + this._currentProjectId;
        var loadAdminSettingsObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error); })
            .do(function (responseObject) {
            _this._currentProjectSettings.update_origins = responseObject.update_origins;
            _this._currentProjectSettings.read_origins = responseObject.read_origins;
        });
        return loadAdminSettingsObservable;
    };
    ContentDeveloperServerService.prototype.updateAdminSettings = function (updateOrigins, readOrigins) {
        if (updateOrigins === void 0) { updateOrigins = null; }
        if (readOrigins === void 0) { readOrigins = null; }
        var requestUrl = this._serverUrl + "/admin/settings/" + this._currentProjectId;
        var updateProjectSettingsObservable = this._http
            .put(requestUrl, { update_origins: updateOrigins, read_origins: readOrigins }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error); })
            .do(function (responseObject) { return console.log("Admin settings updated!!"); });
        return updateProjectSettingsObservable;
    };
    ContentDeveloperServerService.prototype.updateProjectStructure = function (projectStructure, commitMessage) {
        var _this = this;
        if (commitMessage === void 0) { commitMessage = null; }
        console.log(commitMessage);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId;
        var structureUpdateObservable = this._http
            .put(requestUrl, { structure: projectStructure, commit_message: commitMessage }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error updating project structure"; })
            .do(function (responseObject) {
            _this._currentProjectContentStructureHistory.structure = responseObject;
            _this.refreshProjectHistory();
        });
        return structureUpdateObservable;
    };
    ContentDeveloperServerService.prototype.updateProjectContent = function (projectContent, commitMessage, encapsulationPath) {
        var _this = this;
        if (commitMessage === void 0) { commitMessage = null; }
        if (encapsulationPath === void 0) { encapsulationPath = ""; }
        console.log(projectContent);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "/" + encapsulationPath;
        var contentUpdateObservable = this._http
            .put(requestUrl, { content: projectContent, commit_message: commitMessage }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error updating project content"; })
            .do(function (responseObject) {
            if (encapsulationPath.length == 0) {
                _this._currentProjectContentStructureHistory.content = responseObject;
                _this.refreshProjectHistory();
            }
            else {
            }
        });
        return contentUpdateObservable;
    };
    ContentDeveloperServerService.prototype.refreshProjectHistory = function () {
        var _this = this;
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?include=history";
        var contentUpdateObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error refreshing project history"; })
            .do(function (responseObject) {
            _this._currentProjectContentStructureHistory.content_history = responseObject.content_history.all;
            _this._currentProjectContentStructureHistory.structure_hisory = responseObject.structure_history.all;
        });
    };
    ContentDeveloperServerService.prototype.getContentofCommit = function (commitHash, historyOf) {
        var _this = this;
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=previewCommit&commit_hash=" + commitHash + "&historyof=" + historyOf;
        var commitContentObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error getting commit content"; })
            .do(function (responseObject) {
            switch (historyOf) {
                case "structure": {
                    _this._currentProjectContentStructureHistory.structure = responseObject;
                    break;
                }
                case "content": {
                    _this._currentProjectContentStructureHistory.content = responseObject;
                    break;
                }
            }
        });
        return commitContentObservable;
    };
    ContentDeveloperServerService.prototype.createNewProject = function (projectName, template) {
        if (template === void 0) { template = ""; }
        var requestUrl = this._serverUrl + "/feeds/?action=createProject";
        var createProjectObservable = this._http
            .post(requestUrl, { project_name: projectName, template: template }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error creating project content"; });
        return createProjectObservable;
    };
    ContentDeveloperServerService.prototype.createProjectContent = function (projectContent, encapsulationPath) {
        if (encapsulationPath === void 0) { encapsulationPath = ""; }
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "/" + encapsulationPath;
        var createContentObservable = this._http
            .post(requestUrl, { content: projectContent }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error creating project content"; })
            .do(function (responseObject) {
            console.log(responseObject);
        });
        return createContentObservable;
    };
    ContentDeveloperServerService.prototype.addNewCollaborator = function (emailAddress, accessLevelInt) {
        console.log("CDService");
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=collaborators";
        var addNewCollaboratorObservable = this._http
            .post(requestUrl, { email: emailAddress, accessLevelInt: accessLevelInt }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error adding new collaborator to project"; })
            .do(function (responseObject) {
            console.log("New Collaborator Added");
            //this._currentProjectSettings.collaborators = responseObject;
        });
        return addNewCollaboratorObservable;
    };
    ContentDeveloperServerService.prototype.removeCollaborator = function (collaboratorID) {
        console.log("CDService");
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=collaborators";
        var removeCollaboratorObservable = this._http
            .delete(requestUrl + "&collaboratorID=" + collaboratorID, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error adding new collaborator to project"; })
            .do(function (responseObject) {
            console.log("Collaborator Removed");
            //this._currentProjectSettings.collaborators = responseObject;
        });
        return removeCollaboratorObservable;
    };
    ContentDeveloperServerService.prototype.updateCollaborator = function (collaboratorID, accessLevelInt) {
        console.log("About to updated " + collaboratorID + " to access level " + accessLevelInt);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=collaborators";
        var addNewCollaboratorObservable = this._http
            .put(requestUrl, { collaboratorID: collaboratorID, accessLevelInt: accessLevelInt }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error adding new collaborator to project"; })
            .do(function (responseObject) {
            console.log("Collaborator Updated");
            //this._currentProjectSettings.collaborators = responseObject;
        });
        return addNewCollaboratorObservable;
    };
    ContentDeveloperServerService.prototype.createAccessLevel = function (accessLevelInt, accessLevelName) {
        console.log("About to create access level " + accessLevelInt + " with the name " + accessLevelName);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=accessLevels";
        var addNewCollaboratorObservable = this._http
            .post(requestUrl, { access_level_int: accessLevelInt, access_level_name: accessLevelName }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error creating project access level"; })
            .do(function (responseObject) {
            console.log("Access Level Created");
            //this._currentProjectSettings.access_levels = responseObject;
        });
        return addNewCollaboratorObservable;
    };
    ContentDeveloperServerService.prototype.deleteAccessLevel = function (accessLevelInt) {
        if (accessLevelInt > 3) {
            console.log("About to delete access level " + accessLevelInt);
            var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=accessLevels";
            var deleteAccessLevelObservable = this._http
                .delete(requestUrl + "&access_level_int=" + accessLevelInt, { headers: this._headers })
                .map(function (responseObject) { return responseObject.json(); })
                .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error creating project access level"; })
                .do(function (responseObject) {
                console.log("Access Level deleted");
                //this._currentProjectSettings.access_levels = responseObject;
            });
            return deleteAccessLevelObservable;
        }
    };
    ContentDeveloperServerService.prototype.updateAccessLevel = function (accessLevelInt, accessLevelName) {
        console.log("About to updated access level " + accessLevelInt + " to have the name " + accessLevelName);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=accessLevels";
        var addNewCollaboratorObservable = this._http
            .put(requestUrl, { access_level_int: accessLevelInt, access_level_name: accessLevelName }, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error updating project access level"; })
            .do(function (responseObject) {
            console.log("Access Level Updated Updated");
            //this._currentProjectSettings.access_levels = responseObject;
        });
        return addNewCollaboratorObservable;
    };
    ContentDeveloperServerService.prototype.loadProjectMediaItems = function (numItems, nextPageToken) {
        if (nextPageToken === void 0) { nextPageToken = null; }
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=mediaItems&numFiles=" + numItems + "&nextPageToken=" + nextPageToken;
        var loadMediaItemsObservable = this._http
            .get(requestUrl, { headers: this._headers })
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error.json().error) || "Unknown error updating project access level"; });
        return loadMediaItemsObservable;
    };
    ContentDeveloperServerService.prototype.uploadMediaItem = function (mediaItemFile) {
        var formData = new FormData();
        formData.append("file", mediaItemFile);
        var requestUrl = this._serverUrl + "/feeds/" + this._currentProjectId + "?action=mediaItems";
        var uploadMediaItemObservable = this._http
            .post(requestUrl, formData)
            .map(function (responseObject) { return responseObject.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(error) || "Unknown error uploading media item"; });
        return uploadMediaItemObservable;
    };
    ContentDeveloperServerService.prototype.getCurrentUser = function () {
        return this._currentUser;
    };
    ContentDeveloperServerService.prototype.getCurrentProjectContent = function () {
        return this._coPipe.transform(this._currentProjectContentStructureHistory.content);
    };
    ContentDeveloperServerService.prototype.getCurrentProjectStructure = function () {
        return this._coPipe.transform(this._currentProjectContentStructureHistory.structure);
    };
    ContentDeveloperServerService.prototype.getCurrentProjectSettings = function () {
        return this._coPipe.transform(this._currentProjectSettings);
    };
    ContentDeveloperServerService.prototype.getCurrentProjectContentHistory = function () {
        return this._coPipe.transform(this._currentProjectContentStructureHistory.content_history);
    };
    ContentDeveloperServerService.prototype.getCurrentProjectStructureHistory = function () {
        return this._coPipe.transform(this._currentProjectContentStructureHistory.structure_history);
    };
    ContentDeveloperServerService.prototype.leaveProject = function () {
        this._currentProjectId = null;
        this._currentProjectContentStructureHistory = null;
        this._currentProjectSettings = null;
    };
    ContentDeveloperServerService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__pipes_clone_object_pipe__["a" /* CloneObjectPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__pipes_clone_object_pipe__["a" /* CloneObjectPipe */]) === 'function' && _b) || Object])
    ], ContentDeveloperServerService);
    return ContentDeveloperServerService;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/content-developer-server.service.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(_cdService) {
        this._cdService = _cdService;
        this.pageTitle = "Content Developer CMS";
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._cdService.loadUser().subscribe(function (responseObject) {
            _this.user = _this._cdService.getCurrentUser();
            if (_this.user == {}) {
                _this.user = null;
            }
        });
    };
    AppComponent.prototype.logout = function () {
        var _this = this;
        this._cdService.logout().subscribe(function (response) { return _this.user = null; });
    };
    AppComponent.prototype.updatePageTitle = function (title) {
        this.pageTitle = title;
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(657),
            styles: [__webpack_require__(637)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/app.component.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pipes_key_val_array_pipe__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pipes_custom_json_pipe__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pipes_clone_object_pipe__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pipes_upper_camel_case_pipe__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pipes_underscore_to_space_pipe__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pipes_title_pipe__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pipes_shortener_pipe__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pipes_custom_date_pipe__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pipes_double_digit_pipe__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_component__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__cms_cms_component__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__cms_admin_admin_component__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__cms_editor_editor_component__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__general_header_header_component__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__general_footer_footer_component__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__cms_reusable_content_editor_content_editor_component__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__cms_reusable_collection_collection_component__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__cms_reusable_collection_item_collection_item_component__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__cms_admin_structure_view_structure_view_component__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__cms_admin_content_view_content_view_component__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__cms_admin_history_view_history_view_component__ = __webpack_require__(463);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__cms_admin_settings_view_settings_view_component__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__cms_reusable_history_display_history_display_component__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__cms_reusable_history_preview_history_preview_component__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__cms_user_projects_user_projects_component__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__login_login_component__ = __webpack_require__(480);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__cms_reusable_media_item_gallery_media_item_gallery_component__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__cms_reusable_media_item_media_item_component__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__cms_reusable_draggable_container_draggable_container_directive__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__cms_reusable_code_editor_code_editor_component__ = __webpack_require__(468);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_14__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_15__cms_cms_component__["a" /* CmsComponent */],
                __WEBPACK_IMPORTED_MODULE_16__cms_admin_admin_component__["a" /* AdminComponent */],
                __WEBPACK_IMPORTED_MODULE_17__cms_editor_editor_component__["a" /* EditorComponent */],
                __WEBPACK_IMPORTED_MODULE_18__general_header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_19__general_footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_20__cms_reusable_content_editor_content_editor_component__["a" /* ContentEditorComponent */],
                __WEBPACK_IMPORTED_MODULE_4__pipes_key_val_array_pipe__["a" /* KeyValArrayPipe */],
                __WEBPACK_IMPORTED_MODULE_21__cms_reusable_collection_collection_component__["a" /* CollectionComponent */],
                __WEBPACK_IMPORTED_MODULE_22__cms_reusable_collection_item_collection_item_component__["a" /* CollectionItemComponent */],
                __WEBPACK_IMPORTED_MODULE_5__pipes_custom_json_pipe__["a" /* CustomJsonPipe */],
                __WEBPACK_IMPORTED_MODULE_23__cms_admin_structure_view_structure_view_component__["a" /* StructureViewComponent */],
                __WEBPACK_IMPORTED_MODULE_24__cms_admin_content_view_content_view_component__["a" /* ContentViewComponent */],
                __WEBPACK_IMPORTED_MODULE_25__cms_admin_history_view_history_view_component__["a" /* HistoryViewComponent */],
                __WEBPACK_IMPORTED_MODULE_26__cms_admin_settings_view_settings_view_component__["a" /* SettingsViewComponent */],
                __WEBPACK_IMPORTED_MODULE_6__pipes_clone_object_pipe__["a" /* CloneObjectPipe */],
                __WEBPACK_IMPORTED_MODULE_7__pipes_upper_camel_case_pipe__["a" /* UpperCamelCasePipe */],
                __WEBPACK_IMPORTED_MODULE_8__pipes_underscore_to_space_pipe__["a" /* UnderscoreToSpacePipe */],
                __WEBPACK_IMPORTED_MODULE_9__pipes_title_pipe__["a" /* TitlePipe */],
                __WEBPACK_IMPORTED_MODULE_27__cms_reusable_history_display_history_display_component__["a" /* HistoryDisplayComponent */],
                __WEBPACK_IMPORTED_MODULE_10__pipes_shortener_pipe__["a" /* ShortenerPipe */],
                __WEBPACK_IMPORTED_MODULE_11__pipes_custom_date_pipe__["a" /* CustomDatePipe */],
                __WEBPACK_IMPORTED_MODULE_12__pipes_double_digit_pipe__["a" /* DoubleDigitPipe */],
                __WEBPACK_IMPORTED_MODULE_28__cms_reusable_history_preview_history_preview_component__["a" /* HistoryPreviewComponent */],
                __WEBPACK_IMPORTED_MODULE_29__cms_user_projects_user_projects_component__["a" /* UserProjectsComponent */],
                __WEBPACK_IMPORTED_MODULE_30__login_login_component__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_31__cms_reusable_media_item_gallery_media_item_gallery_component__["a" /* MediaItemGalleryComponent */],
                __WEBPACK_IMPORTED_MODULE_32__cms_reusable_media_item_media_item_component__["a" /* MediaItemComponent */],
                __WEBPACK_IMPORTED_MODULE_33__cms_reusable_draggable_container_draggable_container_directive__["a" /* DraggableContainerDirective */],
                __WEBPACK_IMPORTED_MODULE_34__cms_reusable_code_editor_code_editor_component__["a" /* CodeEditorComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_13__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */],
                __WEBPACK_IMPORTED_MODULE_5__pipes_custom_json_pipe__["a" /* CustomJsonPipe */],
                __WEBPACK_IMPORTED_MODULE_6__pipes_clone_object_pipe__["a" /* CloneObjectPipe */],
                __WEBPACK_IMPORTED_MODULE_7__pipes_upper_camel_case_pipe__["a" /* UpperCamelCasePipe */],
                __WEBPACK_IMPORTED_MODULE_8__pipes_underscore_to_space_pipe__["a" /* UnderscoreToSpacePipe */],
                __WEBPACK_IMPORTED_MODULE_9__pipes_title_pipe__["a" /* TitlePipe */],
                __WEBPACK_IMPORTED_MODULE_10__pipes_shortener_pipe__["a" /* ShortenerPipe */],
                __WEBPACK_IMPORTED_MODULE_11__pipes_custom_date_pipe__["a" /* CustomDatePipe */],
                __WEBPACK_IMPORTED_MODULE_12__pipes_double_digit_pipe__["a" /* DoubleDigitPipe */],
                __WEBPACK_IMPORTED_MODULE_4__pipes_key_val_array_pipe__["a" /* KeyValArrayPipe */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_14__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/app.module.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminComponent = (function () {
    function AdminComponent(_cdService) {
        this._cdService = _cdService;
        this.adminRequestToSaveStructure = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.adminRequestToResetStructure = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.adminRequestToSaveContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.adminRequestToResetContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.adminRequestToRefreshSettings = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this._view = "structure";
    }
    AdminComponent.prototype.changeView = function (toView) {
        this._view = toView;
    };
    AdminComponent.prototype.resetContent = function () {
        this.adminRequestToResetContent.emit();
    };
    AdminComponent.prototype.viewRequestToSaveStructure = function (updatedStructure) {
        this.adminRequestToSaveStructure.emit(updatedStructure);
    };
    AdminComponent.prototype.viewRequestToResetStructure = function () {
        this.adminRequestToResetStructure.emit();
    };
    AdminComponent.prototype.viewRequestToSaveContent = function (updatedContent) {
        if (updatedContent === void 0) { updatedContent = null; }
        this.adminRequestToSaveContent.emit(updatedContent);
    };
    AdminComponent.prototype.viewRequestToResetContent = function () {
        this.adminRequestToResetContent.emit();
    };
    AdminComponent.prototype.viewRequestToRefreshSettings = function () {
        this.adminRequestToRefreshSettings.emit();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], AdminComponent.prototype, "projectStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], AdminComponent.prototype, "projectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], AdminComponent.prototype, "projectStructureHistory", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], AdminComponent.prototype, "projectContentHistory", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], AdminComponent.prototype, "projectSettings", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], AdminComponent.prototype, "adminRequestToSaveStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], AdminComponent.prototype, "adminRequestToResetStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _c) || Object)
    ], AdminComponent.prototype, "adminRequestToSaveContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _d) || Object)
    ], AdminComponent.prototype, "adminRequestToResetContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _e) || Object)
    ], AdminComponent.prototype, "adminRequestToRefreshSettings", void 0);
    AdminComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-cms-admin',
            template: __webpack_require__(658),
            styles: [__webpack_require__(638)]
        }), 
        __metadata('design:paramtypes', [(typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _f) || Object])
    ], AdminComponent);
    return AdminComponent;
    var _a, _b, _c, _d, _e, _f;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/admin.component.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentViewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContentViewComponent = (function () {
    function ContentViewComponent() {
        this.viewRequestToSaveContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.viewRequestToResetContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    ContentViewComponent.prototype.requestToSaveProjectContent = function (contentData) {
        this.viewRequestToSaveContent.emit(contentData);
    };
    ContentViewComponent.prototype.requestToResetProjectContent = function () {
        this.viewRequestToResetContent.emit();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], ContentViewComponent.prototype, "projectStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], ContentViewComponent.prototype, "projectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], ContentViewComponent.prototype, "viewRequestToSaveContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], ContentViewComponent.prototype, "viewRequestToResetContent", void 0);
    ContentViewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-content-view',
            template: __webpack_require__(659),
            styles: [__webpack_require__(639)]
        }), 
        __metadata('design:paramtypes', [])
    ], ContentViewComponent);
    return ContentViewComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/content-view.component.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HistoryViewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HistoryViewComponent = (function () {
    function HistoryViewComponent() {
        this.viewRequestToSaveStructure = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.viewRequestToSaveContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    HistoryViewComponent.prototype.revertToCommit = function (revertData) {
        var updatedData = {};
        updatedData.commit_message = revertData.commit_message;
        updatedData[revertData.for] = revertData.object;
        switch (revertData.for) {
            case "structure": {
                this.viewRequestToSaveStructure.emit(updatedData);
                break;
            }
            case "content": {
                this.viewRequestToSaveContent.emit(updatedData);
                break;
            }
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], HistoryViewComponent.prototype, "projectStructureHistory", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], HistoryViewComponent.prototype, "projectContentHistory", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], HistoryViewComponent.prototype, "viewRequestToSaveStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], HistoryViewComponent.prototype, "viewRequestToSaveContent", void 0);
    HistoryViewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-history-view',
            template: __webpack_require__(660),
            styles: [__webpack_require__(640)]
        }), 
        __metadata('design:paramtypes', [])
    ], HistoryViewComponent);
    return HistoryViewComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/history-view.component.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsViewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SettingsViewComponent = (function () {
    function SettingsViewComponent(_cdService) {
        this._cdService = _cdService;
        this.settingsUpdated = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    SettingsViewComponent.prototype.addCollaborator = function (emailInput, accessLevelIntInput) {
        var _this = this;
        console.log(emailInput.value, accessLevelIntInput.value);
        this._cdService.addNewCollaborator(emailInput.value, accessLevelIntInput.value).subscribe(function (responseObject) {
            console.log("Collaborator added!!");
            emailInput.value = accessLevelIntInput.value = "";
            _this.settingsUpdated.emit();
        });
    };
    SettingsViewComponent.prototype.deleteCollaborator = function (collaborator) {
        var _this = this;
        console.log(collaborator);
        this._cdService.removeCollaborator(collaborator.user_id).subscribe(function (responseObject) {
            console.log("Collaborator removed!!");
            _this.settingsUpdated.emit();
        });
    };
    SettingsViewComponent.prototype.addNewAccessLevel = function (accessLevelNameInput, accessLevelIntInput) {
        var _this = this;
        var requestedAccessLevel = accessLevelIntInput.value;
        while (this._accessLevelExists(requestedAccessLevel)) {
            requestedAccessLevel++;
        }
        this._cdService.createAccessLevel(requestedAccessLevel, accessLevelNameInput.value).subscribe(function (responseObject) {
            console.log("Access level added!!");
            accessLevelIntInput.value = accessLevelNameInput.value = "";
            _this.settingsUpdated.emit();
        });
    };
    SettingsViewComponent.prototype.deleteAccessLevel = function (accessLevelInt) {
        var _this = this;
        this._cdService.deleteAccessLevel(accessLevelInt).subscribe(function (responseObject) {
            console.log("Access level deleted");
            _this.settingsUpdated.emit();
        });
    };
    SettingsViewComponent.prototype.saveAllProjectSettings = function () {
        var _this = this;
        this._cdService.updateProjectSettings(this.projectSettings.project_name, this.projectSettings.max_cache_age, this.projectSettings.custom_css).subscribe(function (responseObject) { return _this.settingsUpdated.emit(); });
        this._cdService.updateAdminSettings(this.projectSettings.update_origins, this.projectSettings.read_origins).subscribe(function (responseObject) { return _this.settingsUpdated.emit(); });
        var currentProjectSettings = this._cdService.getCurrentProjectSettings();
        if (currentProjectSettings.collaborators != this.projectSettings.collaborators) {
            var updatedCollaborators = [];
            for (var _i = 0, _a = this.projectSettings.collaborators; _i < _a.length; _i++) {
                var collaborator = _a[_i];
                if (collaborator.user_id != null) {
                    for (var i = 0; i < currentProjectSettings.collaborators.length; i++) {
                        if (currentProjectSettings.collaborators[i].user_id == collaborator.user_id) {
                            if (currentProjectSettings.collaborators[i].access_level_int != collaborator.access_level_int) {
                                updatedCollaborators.push(collaborator);
                            }
                        }
                    }
                }
            }
            for (var _b = 0, updatedCollaborators_1 = updatedCollaborators; _b < updatedCollaborators_1.length; _b++) {
                var updatedCollab = updatedCollaborators_1[_b];
                console.log("Updating Collaborator - id:" + updatedCollab.user_id);
                this._updateCollaboratorAccessLevel(updatedCollab, updatedCollab.access_level_int);
            }
        }
        if (currentProjectSettings.access_levels != this.projectSettings.access_levels) {
            var updatedAccessLevels = [];
            for (var _c = 0, _d = this.projectSettings.access_levels; _c < _d.length; _c++) {
                var accessLevel = _d[_c];
                for (var i = 0; i < currentProjectSettings.access_levels.length; i++) {
                    if (currentProjectSettings.access_levels[i].access_level_int == accessLevel.access_level_int) {
                        if (currentProjectSettings.access_levels[i].access_level_name != accessLevel.access_level_name) {
                            console.log(accessLevel.access_level_name);
                            updatedAccessLevels.push(accessLevel);
                        }
                    }
                }
            }
            for (var _e = 0, updatedAccessLevels_1 = updatedAccessLevels; _e < updatedAccessLevels_1.length; _e++) {
                var updatedAL = updatedAccessLevels_1[_e];
                console.log("Updating Access Level - int:" + updatedAL.access_level_int);
                this._updateAccessLevel(updatedAL.access_level_int, updatedAL.access_level_name);
            }
        }
    };
    SettingsViewComponent.prototype._accessLevelExists = function (requestedAccessLevelInt) {
        var exists = false;
        for (var i = 0; i < this.projectSettings.access_levels; i++) {
            if (this.projectSettings.access_levels[i].access_level_int == requestedAccessLevelInt) {
                exists = true;
            }
        }
        return exists;
    };
    SettingsViewComponent.prototype._updateAccessLevel = function (accessLevelInt, accessLevelName) {
        var _this = this;
        if (accessLevelName != null && accessLevelName.length > 0) {
            this._cdService.updateAccessLevel(accessLevelInt, accessLevelName).subscribe(function (responseObject) {
                console.log("Access level updated");
                _this.settingsUpdated.emit();
            });
        }
    };
    SettingsViewComponent.prototype._updateCollaboratorAccessLevel = function (collaborator, accessLevelInt) {
        var _this = this;
        collaborator.access_level_int = accessLevelInt;
        this._cdService.updateCollaborator(collaborator.user_id, accessLevelInt).subscribe(function (responseObject) {
            console.log("Collaborator updated!!");
            _this.settingsUpdated.emit();
        });
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], SettingsViewComponent.prototype, "projectSettings", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], SettingsViewComponent.prototype, "settingsUpdated", void 0);
    SettingsViewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-settings-view',
            template: __webpack_require__(661),
            styles: [__webpack_require__(641)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _b) || Object])
    ], SettingsViewComponent);
    return SettingsViewComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/settings-view.component.js.map

/***/ }),

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__ = __webpack_require__(201);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StructureViewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var StructureViewComponent = (function () {
    function StructureViewComponent(_jsPipe) {
        this._jsPipe = _jsPipe;
        this.viewRequestToSaveStructure = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.viewRequestToResetStructure = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.formatJson = false;
    }
    StructureViewComponent.prototype.ngOnChanges = function (changes) {
        if (changes.projectStructure && this.projectStructureJson == null) {
            this.projectStructureJson = this._jsPipe.transform(this.projectStructure, "stringify");
        }
    };
    StructureViewComponent.prototype.formatJsonClicked = function () {
        this.formatJson = true;
    };
    StructureViewComponent.prototype.codeUpdated = function (updatedProjectStructure) {
        this.projectStructure = updatedProjectStructure;
    };
    StructureViewComponent.prototype.resetProjectStructure = function () {
        this.viewRequestToResetStructure.emit();
    };
    StructureViewComponent.prototype.saveProjectStructure = function () {
        if (this.projectStructure != null) {
            var structureData = {
                structure: this.projectStructure
            };
            this.viewRequestToSaveStructure.emit(structureData);
        }
    };
    StructureViewComponent.prototype.structureCollectionTabsReordered = function (reorderedProjectStructure) {
        this.projectStructure = reorderedProjectStructure;
        this.projectStructureJson = this._jsPipe.transform(this.projectStructure, "stringify");
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], StructureViewComponent.prototype, "projectStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], StructureViewComponent.prototype, "viewRequestToSaveStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], StructureViewComponent.prototype, "viewRequestToResetStructure", void 0);
    StructureViewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-structure-view',
            template: __webpack_require__(662),
            styles: [__webpack_require__(642)]
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__["a" /* CustomJsonPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__["a" /* CustomJsonPipe */]) === 'function' && _c) || Object])
    ], StructureViewComponent);
    return StructureViewComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/structure-view.component.js.map

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CmsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CmsComponent = (function () {
    function CmsComponent(_cdService) {
        this._cdService = _cdService;
        this.requestToUpdatePageTitle = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    CmsComponent.prototype.viewProject = function (projectData) {
        this._projectId = projectData.projectId;
        this._projectName = projectData.projectName;
        this._userAccessLevel = projectData.userAccessLevel;
        this.loadProjectContentAndStructure();
        this.loadProjectSettings();
        this.updatePageTitle(this._projectName);
    };
    CmsComponent.prototype.updatePageTitle = function (title) {
        this.requestToUpdatePageTitle.emit(title);
    };
    CmsComponent.prototype.viewUserProjects = function () {
        this._projectId = null;
        this._userAccessLevel = null;
        this._cdService.leaveProject();
        this.updatePageTitle("My Projects");
    };
    CmsComponent.prototype.loadProjectContentAndStructure = function () {
        var _this = this;
        this._cdService.loadProjectContentStructureHistory(this._projectId).subscribe(function (responseObject) {
            console.log("Project Content and Structure Loaded!");
            _this.resetProjectStructure();
            _this.resetProjectContent();
            _this.resetProjectHistory();
        });
    };
    CmsComponent.prototype.loadProjectSettings = function () {
        var _this = this;
        this._cdService.loadProjectSettings().subscribe(function (responseObject) {
            _this._cdService.loadAdminSettings().subscribe(function (responseObject) {
                _this.resetProjectSettings();
                console.log(_this.projectSettings);
            });
        });
    };
    CmsComponent.prototype.saveProjectStructure = function (structureData) {
        var _this = this;
        var commitMessage = structureData != null ? structureData.commit_message : null;
        console.log("About to save structure");
        this._cdService.updateProjectStructure(structureData.structure, commitMessage).subscribe(function (responseObject) {
            console.log("Structure Saved!!");
            _this.resetProjectStructure();
            _this.resetProjectHistory();
        });
    };
    CmsComponent.prototype.saveProjectContent = function (contentData) {
        var _this = this;
        if (contentData === void 0) { contentData = null; }
        var updatedContent = contentData != null && contentData.content != null ? contentData.content : this.projectContent;
        var commitMessage = contentData != null ? contentData.commit_message : null;
        console.log("About to save content");
        this._cdService.updateProjectContent(updatedContent, commitMessage).subscribe(function (responseObject) {
            console.log("Content Saved!!");
            _this.resetProjectContent();
            _this.resetProjectHistory();
        });
    };
    CmsComponent.prototype.resetProjectContent = function () {
        this.projectContent = this._cdService.getCurrentProjectContent();
    };
    CmsComponent.prototype.resetProjectStructure = function () {
        this.projectStructure = this._cdService.getCurrentProjectStructure();
    };
    CmsComponent.prototype.resetProjectSettings = function () {
        this.projectSettings = this._cdService.getCurrentProjectSettings();
    };
    CmsComponent.prototype.resetProjectHistory = function () {
        console.log("Project History Reset!!");
        this.projectContentHistory = this._cdService.getCurrentProjectContentHistory();
        this.projectStructureHistory = this._cdService.getCurrentProjectStructureHistory();
        //console.log(this.projectStructureHistory[0]);
        //console.log(this.projectContentHistory[0]);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], CmsComponent.prototype, "requestToUpdatePageTitle", void 0);
    CmsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-cms',
            template: __webpack_require__(663),
            styles: [__webpack_require__(643)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _b) || Object])
    ], CmsComponent);
    return CmsComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/cms.component.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EditorComponent = (function () {
    function EditorComponent() {
    }
    EditorComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], EditorComponent.prototype, "projectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], EditorComponent.prototype, "projectStructure", void 0);
    EditorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-cms-editor',
            template: __webpack_require__(664),
            styles: [__webpack_require__(644)]
        }), 
        __metadata('design:paramtypes', [])
    ], EditorComponent);
    return EditorComponent;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/editor.component.js.map

/***/ }),

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__ = __webpack_require__(201);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodeEditorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CodeEditorComponent = (function () {
    function CodeEditorComponent(_jsPipe) {
        this._jsPipe = _jsPipe;
        this.formatJson = false;
        this.codeUpdated = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    CodeEditorComponent.prototype.ngDoCheck = function () {
        if (this._textarea != null && this._textarea.selectionStart == this.codeJson.length) {
            this._textarea.setSelectionRange(this._cursorPosition, this._cursorPosition);
        }
        if (this.formatJson) {
            this._formatStructureJson();
        }
    };
    CodeEditorComponent.prototype.onKeyUp = function (e) {
        this._formatStructureJson(e);
    };
    CodeEditorComponent.prototype.onKeyDown = function (e) {
        this._textarea = e.target;
        this._cursorPosition = e.target.selectionStart;
        var deletePrevChar = false;
        var deleteSelection = false;
        var appendChar = "";
        if (e.key.toLowerCase() == "enter" || e.keyCode == 13) {
            e.preventDefault();
            appendChar = "\n";
        }
        if (e.key.toLowerCase() == "backspace" || e.keyCode == 8) {
            if (e.target.selectionEnd - e.target.selectionStart > 0) {
                deleteSelection = true;
            }
            else {
                deletePrevChar = true;
            }
        }
        if (e.key.toLowerCase() == "tab" || e.keyCode == 9) {
            e.preventDefault();
            if (e.shiftKey) {
                deletePrevChar = true;
            }
            else {
                appendChar = "\t";
            }
        }
        this._formatStructureJson(e, appendChar, deletePrevChar, deleteSelection);
    };
    CodeEditorComponent.prototype._formatStructureJson = function (e, appendChar, deletePrevChar, deleteSelection) {
        if (e === void 0) { e = null; }
        if (appendChar === void 0) { appendChar = ""; }
        if (deletePrevChar === void 0) { deletePrevChar = false; }
        if (deleteSelection === void 0) { deleteSelection = false; }
        if (e != null) {
            if (deleteSelection) {
                this.codeJson = this.codeJson.slice(0, this._cursorPosition) + this.codeJson.slice(e.target.selectionEnd + 1);
                this._cursorPosition = this._cursorPosition > 1 ? this._cursorPosition - 1 : this._cursorPosition;
            }
            else if (deletePrevChar) {
                var prevChar = this.codeJson.slice(this._cursorPosition - 1, this._cursorPosition);
                if (prevChar.replace(/\s/g, "").length == 0) {
                    this.codeJson = this.codeJson.slice(0, this._cursorPosition - 1) + this.codeJson.slice(this._cursorPosition);
                }
                this._cursorPosition = this._cursorPosition > 1 ? this._cursorPosition - 1 : this._cursorPosition;
            }
            else if (appendChar.length > 0) {
                this.codeJson = this.codeJson.slice(0, this._cursorPosition) + appendChar + this.codeJson.slice(e.target.selectionEnd);
                this._cursorPosition += 1;
            }
            else {
                this._cursorPosition += 1;
            }
        }
        var tmpObj = this._jsPipe.transform(this.codeJson, "parse");
        if (tmpObj != null) {
            this.codeUpdated.emit(tmpObj);
            if (this.formatJson) {
                this.codeJson = this._jsPipe.transform(tmpObj, "stringify");
                this.formatJson = false;
            }
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], CodeEditorComponent.prototype, "codeJson", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], CodeEditorComponent.prototype, "formatJson", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], CodeEditorComponent.prototype, "codeUpdated", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* HostListener */])("keyup", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CodeEditorComponent.prototype, "onKeyUp", null);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* HostListener */])("keydown", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CodeEditorComponent.prototype, "onKeyDown", null);
    CodeEditorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-code-editor',
            template: __webpack_require__(665),
            styles: [__webpack_require__(645)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__["a" /* CustomJsonPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__pipes_custom_json_pipe__["a" /* CustomJsonPipe */]) === 'function' && _b) || Object])
    ], CodeEditorComponent);
    return CodeEditorComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/code-editor.component.js.map

/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CollectionItemComponent = (function () {
    function CollectionItemComponent(_cdService) {
        this._cdService = _cdService;
        this.itemContentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.collectionItemRequestToViewMediaItems = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    CollectionItemComponent.prototype.contentChanged = function () {
        this.itemContentChanged.emit({ path: this.encapsulationPath, content: this.itemContent });
    };
    CollectionItemComponent.prototype.viewAvailableMediaItems = function () {
        this.collectionItemRequestToViewMediaItems.emit(this.encapsulationPath);
    };
    CollectionItemComponent.prototype.fileInputChanged = function (event) {
        var _this = this;
        if (event.srcElement.files != null && event.srcElement.files.length > 0) {
            this._cdService.uploadMediaItem(event.srcElement.files[0]).subscribe(function (responseObject) {
                if (responseObject.fileUrl != null) {
                    event.srcElement.value = "";
                    _this.itemContent = responseObject.fileUrl;
                    _this.contentChanged();
                }
            });
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], CollectionItemComponent.prototype, "itemName", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], CollectionItemComponent.prototype, "itemStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], CollectionItemComponent.prototype, "itemContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], CollectionItemComponent.prototype, "viewContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], CollectionItemComponent.prototype, "encapsulationPath", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], CollectionItemComponent.prototype, "itemContentChanged", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], CollectionItemComponent.prototype, "collectionItemRequestToViewMediaItems", void 0);
    CollectionItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-collection-item',
            template: __webpack_require__(666),
            styles: [__webpack_require__(646)]
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _c) || Object])
    ], CollectionItemComponent);
    return CollectionItemComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/collection-item.component.js.map

/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CollectionComponent = (function () {
    function CollectionComponent() {
        this.topLevelCollection = false;
        this.subCollection = false;
        this.contentChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.collectionRequestToViewMediaItems = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    CollectionComponent.prototype.itemContentChanged = function (contentData) {
        this.contentChanged.emit(contentData);
    };
    CollectionComponent.prototype.collectionContentChanged = function (contentData) {
        console.log(contentData);
        this.contentChanged.emit(contentData);
    };
    CollectionComponent.prototype.collectionItemRequestToViewMediaItems = function (itemEncapsulationPath) {
        this.collectionRequestToViewMediaItems.emit(itemEncapsulationPath);
    };
    CollectionComponent.prototype.viewMediaItems = function (itemEncapsulationPath) {
        this.collectionRequestToViewMediaItems.emit(itemEncapsulationPath);
    };
    CollectionComponent.prototype.deleteItem = function (encapsulationPath, index) {
        if (this.projectContent[encapsulationPath] != null) {
            switch (this.projectContent[encapsulationPath].constructor.name.toLowerCase()) {
                case "array": {
                    this.projectContent[encapsulationPath].splice(index, 1);
                    break;
                }
            }
        }
    };
    CollectionComponent.prototype.addNewItem = function (encapsulationPath, contentType) {
        if (this.projectContent[encapsulationPath] != null) {
            if (this.projectStructure[encapsulationPath] != null) {
                if (this.projectStructure[encapsulationPath].items != null) {
                    if (this.projectStructure[encapsulationPath].type != null && this.projectStructure[encapsulationPath].type == "array") {
                        var newItem = this._createNewItem(this.projectStructure[encapsulationPath].items);
                        this.projectContent[encapsulationPath].push(newItem);
                        this.collectionContentChanged({ path: encapsulationPath, content: this.projectContent[encapsulationPath] });
                    }
                }
            }
        }
    };
    CollectionComponent.prototype._createNewItem = function (itemsStructure) {
        var newItem = {};
        for (var attribute in itemsStructure) {
            newItem[attribute] = null;
        }
        return newItem;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], CollectionComponent.prototype, "collection", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], CollectionComponent.prototype, "projectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], CollectionComponent.prototype, "projectStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], CollectionComponent.prototype, "viewContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], CollectionComponent.prototype, "topLevelCollection", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], CollectionComponent.prototype, "subCollection", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], CollectionComponent.prototype, "encapsulationPath", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], CollectionComponent.prototype, "contentChanged", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], CollectionComponent.prototype, "collectionRequestToViewMediaItems", void 0);
    CollectionComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-collection',
            template: __webpack_require__(667),
            styles: [__webpack_require__(647)]
        }), 
        __metadata('design:paramtypes', [])
    ], CollectionComponent);
    return CollectionComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/collection.component.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentEditorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContentEditorComponent = (function () {
    function ContentEditorComponent() {
        this.requestToSaveProjectContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.requestToResetProjectContent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.structureCollectionTabsReordered = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.mediaItemGalleryVisible = false;
    }
    ContentEditorComponent.prototype.ngOnInit = function () {
        this._selectFirstComponent();
    };
    ContentEditorComponent.prototype.ngOnChanges = function (changes) {
        if (changes.projectStructure) {
            if (this.projectStructure[this.currentCollectionName] == undefined) {
                this.currentCollectionName = null;
                this._selectFirstComponent();
            }
        }
    };
    ContentEditorComponent.prototype.viewCollection = function (collection) {
        this.currentCollectionName = collection;
    };
    ContentEditorComponent.prototype.projectContentChanged = function (contentData) {
        this.updateProjectContent(this.projectContent, contentData);
    };
    ContentEditorComponent.prototype.saveProjectContent = function () {
        var contentData = {
            commit_message: "Update to content of '" + this.currentCollectionName + "'"
        };
        this.requestToSaveProjectContent.emit(contentData);
    };
    ContentEditorComponent.prototype.resetProjectContent = function () {
        this.requestToResetProjectContent.emit();
    };
    ContentEditorComponent.prototype.updateProjectContent = function (currentContent, newContentData) {
        var encapsulationKeys = newContentData.path.split("/");
        for (var i = 0; i < encapsulationKeys.length - 1; i++) {
            if (currentContent[encapsulationKeys[i]] == null) {
                if (isNaN(encapsulationKeys[i + 1])) {
                    currentContent[encapsulationKeys[i]] = {};
                }
                else {
                    if (currentContent == null || currentContent.constructor.name.toLowerCase() != "array") {
                        currentContent[encapsulationKeys[i]] = [];
                    }
                }
            }
            currentContent = currentContent[encapsulationKeys[i]];
        }
        currentContent[encapsulationKeys[encapsulationKeys.length - 1]] = newContentData.content;
    };
    ContentEditorComponent.prototype.showMediaItemGallery = function (itemEncapsulationPath) {
        this._encapsulationPathForCurrentFileInput = itemEncapsulationPath;
        this.mediaItemGalleryVisible = true;
    };
    ContentEditorComponent.prototype.hideMediaItemGallery = function () {
        this._encapsulationPathForCurrentFileInput = null;
        this.mediaItemGalleryVisible = false;
    };
    ContentEditorComponent.prototype.mediaItemSelected = function (mediaItemUrl) {
        var contentData = {
            path: this._encapsulationPathForCurrentFileInput,
            content: mediaItemUrl
        };
        this.updateProjectContent(this.projectContent, contentData);
        this.hideMediaItemGallery();
    };
    ContentEditorComponent.prototype.collectionTabsReordered = function (updatedTabOrder) {
        this.structureCollectionTabsReordered.emit(updatedTabOrder.content);
    };
    ContentEditorComponent.prototype._selectFirstComponent = function () {
        if (this.currentCollectionName == null) {
            for (var collection in this.projectStructure) {
                this.viewCollection(collection);
                break;
            }
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], ContentEditorComponent.prototype, "viewContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], ContentEditorComponent.prototype, "projectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], ContentEditorComponent.prototype, "projectStructure", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], ContentEditorComponent.prototype, "requestToSaveProjectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], ContentEditorComponent.prototype, "requestToResetProjectContent", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _c) || Object)
    ], ContentEditorComponent.prototype, "structureCollectionTabsReordered", void 0);
    ContentEditorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-content-editor',
            template: __webpack_require__(668),
            styles: [__webpack_require__(648)]
        }), 
        __metadata('design:paramtypes', [])
    ], ContentEditorComponent);
    return ContentEditorComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/content-editor.component.js.map

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pipes_key_val_array_pipe__ = __webpack_require__(307);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraggableContainerDirective; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DraggableContainerDirective = (function () {
    function DraggableContainerDirective(_el, _kvaPipe) {
        this._el = _el;
        this._kvaPipe = _kvaPipe;
        this.contentReordered = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    DraggableContainerDirective.prototype.ngAfterViewInit = function () {
        this._containerElement = this._el.nativeElement;
        for (var i = 0; i < this._containerElement.children.length; i++) {
            // Setting the draggable property of each child of the draggable 
            // container to true, so that it can be dragged
            this._containerElement.children[i].setAttribute("draggable", "true");
        }
    };
    DraggableContainerDirective.prototype.onDragStart = function (e) {
        this._dragStartY = e.screenY;
        if (e.target.parentNode == this._containerElement) {
            this._draggingElement = e.target;
        }
    };
    DraggableContainerDirective.prototype.onDragOver = function (e) {
        // The default action of this event is to reset the drag operation
        // to none. Preventing this from happening, so that the "drop" event
        // will occur, so the item can be moved within the DOM
        e.preventDefault();
    };
    DraggableContainerDirective.prototype.onDrop = function (e) {
        if (this._draggingElement != null && e.target.parentNode === this._containerElement) {
            var direction = e.screenY < this._dragStartY ? -1 : 1;
            var dragData = {
                dragDirection: direction,
                keys: {
                    elementDragged: this._draggingElement.getAttribute("data-key"),
                    elementDroppedOn: e.target.getAttribute("data-key")
                }
            };
            this._draggingElement = null;
            this._dragStartY = null;
            this._reorderContent(dragData);
        }
    };
    DraggableContainerDirective.prototype._reorderContent = function (dragData) {
        if (this.content != null) {
            var reorderedContent;
            if (this.contentType == "array") {
                reorderedContent = this._reorderArray(dragData);
            }
            else {
                reorderedContent = this._reorderObject(dragData);
            }
            var reorderedContentData = {
                path: this.contentEncapsulationPath,
                content: reorderedContent
            };
            this.contentReordered.emit(reorderedContentData);
        }
    };
    DraggableContainerDirective.prototype._reorderObject = function (dragData) {
        var reorderedContent = {};
        var currentContentKeys = this._kvaPipe.transform(this.content, "keys");
        if (dragData.dragDirection < 0) {
            // Up
            for (var i = 0; i < currentContentKeys.length; i++) {
                if (currentContentKeys[i] == dragData.keys.elementDroppedOn) {
                    reorderedContent[dragData.keys.elementDragged] = this.content[dragData.keys.elementDragged];
                    reorderedContent[dragData.keys.elementDroppedOn] = this.content[dragData.keys.elementDroppedOn];
                }
                else if (currentContentKeys[i] != dragData.keys.elementDragged) {
                    reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i]];
                }
            }
        }
        else if (dragData.dragDirection > 0) {
            // Down
            for (var i = 0; i < currentContentKeys.length; i++) {
                if (currentContentKeys[i] == dragData.keys.elementDroppedOn) {
                    reorderedContent[dragData.keys.elementDroppedOn] = this.content[dragData.keys.elementDroppedOn];
                    reorderedContent[dragData.keys.elementDragged] = this.content[dragData.keys.elementDragged];
                }
                else if (currentContentKeys[i] != dragData.keys.elementDragged) {
                    reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i]];
                }
            }
        }
        return reorderedContent;
    };
    DraggableContainerDirective.prototype._reorderArray = function (dragData) {
        var reorderedContent = [];
        var currentContentKeys = [];
        for (var index in this.content) {
            currentContentKeys.push(index);
        }
        if (dragData.dragDirection < 0) {
            //Up
            var droppedItemFound = false;
            var draggedItemFound = false;
            for (var i = 0; i < currentContentKeys.length; i++) {
                if (currentContentKeys[i] == dragData.keys.elementDroppedOn) {
                    reorderedContent[currentContentKeys[i]] = this.content[dragData.keys.elementDragged];
                    reorderedContent[currentContentKeys[i + 1]] = this.content[dragData.keys.elementDroppedOn];
                    droppedItemFound = true;
                    if (currentContentKeys[i + 1] == dragData.keys.elementDragged) {
                        draggedItemFound = true;
                    }
                    i++;
                }
                else if (currentContentKeys[i] == dragData.keys.elementDragged) {
                    reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i - 1]];
                    draggedItemFound = true;
                }
                else {
                    if (droppedItemFound && draggedItemFound == false) {
                        reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i - 1]];
                    }
                    else {
                        reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i]];
                    }
                }
            }
        }
        else if (dragData.dragDirection > 0) {
            //Down COMPLETED
            var draggedItemFound = false;
            var droppedItemFound = false;
            for (var i = 0; i < currentContentKeys.length; i++) {
                if (currentContentKeys[i + 1] == dragData.keys.elementDroppedOn) {
                    reorderedContent[currentContentKeys[i]] = this.content[dragData.keys.elementDroppedOn];
                    reorderedContent[currentContentKeys[i + 1]] = this.content[dragData.keys.elementDragged];
                    droppedItemFound = true;
                    i++;
                }
                else if (currentContentKeys[i] == dragData.keys.elementDragged) {
                    reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i + 1]];
                    draggedItemFound = true;
                }
                else {
                    if (draggedItemFound && droppedItemFound == false) {
                        reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i + 1]];
                    }
                    else {
                        reorderedContent[currentContentKeys[i]] = this.content[currentContentKeys[i]];
                    }
                }
            }
        }
        return reorderedContent;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], DraggableContainerDirective.prototype, "content", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], DraggableContainerDirective.prototype, "contentEncapsulationPath", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], DraggableContainerDirective.prototype, "contentType", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], DraggableContainerDirective.prototype, "contentReordered", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* HostListener */])("dragstart", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DraggableContainerDirective.prototype, "onDragStart", null);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* HostListener */])("dragover", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DraggableContainerDirective.prototype, "onDragOver", null);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* HostListener */])("drop", ["$event"]), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DraggableContainerDirective.prototype, "onDrop", null);
    DraggableContainerDirective = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* Directive */])({
            selector: 'app-draggable-container'
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__pipes_key_val_array_pipe__["a" /* KeyValArrayPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__pipes_key_val_array_pipe__["a" /* KeyValArrayPipe */]) === 'function' && _c) || Object])
    ], DraggableContainerDirective);
    return DraggableContainerDirective;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/draggable-container.directive.js.map

/***/ }),

/***/ 473:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pipes_shortener_pipe__ = __webpack_require__(308);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HistoryDisplayComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HistoryDisplayComponent = (function () {
    function HistoryDisplayComponent(_cdService, _sPipe) {
        this._cdService = _cdService;
        this._sPipe = _sPipe;
        this.showPreview = false;
        this.revertToCommit = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    HistoryDisplayComponent.prototype.preview = function (historyObject) {
        var _this = this;
        this._previewHistoryObject = this._cdService.getContentofCommit(historyObject.hash, this.historyOf).subscribe(function (responseObject) {
            _this._previewHistoryObject = _this.historyOf == 'structure' ? responseObject.commit_structure : responseObject.commit_content;
            _this._previewHistoryHash = historyObject.hash;
        });
    };
    HistoryDisplayComponent.prototype.revert = function () {
        var revertData = {
            for: this.historyOf,
            commit_message: "Project " + this.historyOf + " rolled back to commit id: " + this._sPipe.transform(this._previewHistoryHash, 6),
            object: this._previewHistoryObject
        };
        this.revertToCommit.emit(revertData);
    };
    HistoryDisplayComponent.prototype.clear = function () {
        this._previewHistoryObject = null;
        this._previewHistoryHash = null;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], HistoryDisplayComponent.prototype, "history", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], HistoryDisplayComponent.prototype, "historyOf", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], HistoryDisplayComponent.prototype, "showPreview", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], HistoryDisplayComponent.prototype, "revertToCommit", void 0);
    HistoryDisplayComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-history-display',
            template: __webpack_require__(669),
            styles: [__webpack_require__(649)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__pipes_shortener_pipe__["a" /* ShortenerPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__pipes_shortener_pipe__["a" /* ShortenerPipe */]) === 'function' && _c) || Object])
    ], HistoryDisplayComponent);
    return HistoryDisplayComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/history-display.component.js.map

/***/ }),

/***/ 474:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HistoryPreviewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HistoryPreviewComponent = (function () {
    function HistoryPreviewComponent() {
    }
    HistoryPreviewComponent.prototype.ngOnInit = function () {
    };
    HistoryPreviewComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-history-preview',
            template: __webpack_require__(670),
            styles: [__webpack_require__(650)]
        }), 
        __metadata('design:paramtypes', [])
    ], HistoryPreviewComponent);
    return HistoryPreviewComponent;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/history-preview.component.js.map

/***/ }),

/***/ 475:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MediaItemGalleryComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MediaItemGalleryComponent = (function () {
    function MediaItemGalleryComponent(_cdService) {
        this._cdService = _cdService;
        this.closeButtonClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
        this.mediaItemSelected = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    MediaItemGalleryComponent.prototype.ngOnInit = function () {
        this.loadMediaItems();
    };
    MediaItemGalleryComponent.prototype.ngOnChanges = function (changes) {
        if (changes.visible && this.visible) {
            this.loadMediaItems(false);
        }
    };
    MediaItemGalleryComponent.prototype.loadMediaItems = function (useNextPageToken) {
        var _this = this;
        if (useNextPageToken === void 0) { useNextPageToken = true; }
        var nextPageToken = useNextPageToken ? this._mediaItemNextPageToken : null;
        this._cdService.loadProjectMediaItems(this.numItemsPerPage, nextPageToken).subscribe(function (responseObject) {
            _this._mediaItemNextPageToken = responseObject.nextPageToken;
            if (responseObject.files != null) {
                _this._mediaItems = responseObject.files;
            }
        });
    };
    MediaItemGalleryComponent.prototype.mediaItemClicked = function (mediaItemUrl) {
        this.mediaItemSelected.emit(mediaItemUrl);
    };
    MediaItemGalleryComponent.prototype.hide = function () {
        this.closeButtonClicked.emit();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Number)
    ], MediaItemGalleryComponent.prototype, "numItemsPerPage", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Number)
    ], MediaItemGalleryComponent.prototype, "numItemsPerRow", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Boolean)
    ], MediaItemGalleryComponent.prototype, "visible", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], MediaItemGalleryComponent.prototype, "closeButtonClicked", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _b) || Object)
    ], MediaItemGalleryComponent.prototype, "mediaItemSelected", void 0);
    MediaItemGalleryComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-media-item-gallery',
            template: __webpack_require__(671),
            styles: [__webpack_require__(651)]
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _c) || Object])
    ], MediaItemGalleryComponent);
    return MediaItemGalleryComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/media-item-gallery.component.js.map

/***/ }),

/***/ 476:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MediaItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MediaItemComponent = (function () {
    function MediaItemComponent() {
        this.mediaItemClicked = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    MediaItemComponent.prototype.onClick = function () {
        this.mediaItemClicked.emit(this.mediaItemUrl);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MediaItemComponent.prototype, "mediaItemUrl", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], MediaItemComponent.prototype, "mediaItemName", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], MediaItemComponent.prototype, "mediaItemClicked", void 0);
    MediaItemComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-media-item',
            template: __webpack_require__(672),
            styles: [__webpack_require__(652)]
        }), 
        __metadata('design:paramtypes', [])
    ], MediaItemComponent);
    return MediaItemComponent;
    var _a;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/media-item.component.js.map

/***/ }),

/***/ 477:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserProjectsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UserProjectsComponent = (function () {
    function UserProjectsComponent(_cdService) {
        this._cdService = _cdService;
        this.viewProject = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    UserProjectsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._cdService.loadUserProjects().subscribe(function (responesObject) { return _this._userProjects = responesObject; });
    };
    UserProjectsComponent.prototype.createNewProject = function (projectNameInput, template) {
        var _this = this;
        if (template === void 0) { template = ""; }
        if (projectNameInput.value.length > 0) {
            this._cdService.createNewProject(projectNameInput.value, template).subscribe(function (responseObject) {
                _this.editProject(responseObject.new_project_id, projectNameInput.value, 1);
                projectNameInput.value = "";
            });
        }
    };
    UserProjectsComponent.prototype.editProject = function (projectId, projectName, userAccessLevel) {
        var projectData = {
            projectId: projectId,
            projectName: projectName,
            userAccessLevel: userAccessLevel
        };
        this.viewProject.emit(projectData);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], UserProjectsComponent.prototype, "viewProject", void 0);
    UserProjectsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-user-projects',
            template: __webpack_require__(673),
            styles: [__webpack_require__(653)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _b) || Object])
    ], UserProjectsComponent);
    return UserProjectsComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/user-projects.component.js.map

/***/ }),

/***/ 478:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-footer',
            template: __webpack_require__(674),
            styles: [__webpack_require__(654)]
        }), 
        __metadata('design:paramtypes', [])
    ], FooterComponent);
    return FooterComponent;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/footer.component.js.map

/***/ }),

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HeaderComponent = (function () {
    function HeaderComponent() {
        this.requestToLogout = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]();
    }
    HeaderComponent.prototype.logoutClicked = function () {
        this.requestToLogout.emit();
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', Object)
    ], HeaderComponent.prototype, "user", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* Input */])(), 
        __metadata('design:type', String)
    ], HeaderComponent.prototype, "pageTitle", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* EventEmitter */]) === 'function' && _a) || Object)
    ], HeaderComponent.prototype, "requestToLogout", void 0);
    HeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-header',
            template: __webpack_require__(675),
            styles: [__webpack_require__(655)]
        }), 
        __metadata('design:paramtypes', [])
    ], HeaderComponent);
    return HeaderComponent;
    var _a;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/header.component.js.map

/***/ }),

/***/ 480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LoginComponent = (function () {
    function LoginComponent(_cdService) {
        this._cdService = _cdService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._cdService.getLoginUrl().subscribe(function (responseObject) { return _this._loginUrl = responseObject.loginUrl; });
    };
    LoginComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-login',
            template: __webpack_require__(676),
            styles: [__webpack_require__(656)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__services_content_developer_server_content_developer_server_service__["a" /* ContentDeveloperServerService */]) === 'function' && _a) || Object])
    ], LoginComponent);
    return LoginComponent;
    var _a;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/login.component.js.map

/***/ }),

/***/ 481:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__double_digit_pipe__ = __webpack_require__(306);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomDatePipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CustomDatePipe = (function () {
    function CustomDatePipe(_ddPipe) {
        this._ddPipe = _ddPipe;
        this._months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    }
    CustomDatePipe.prototype.transform = function (date, shortDate, includeTime) {
        if (shortDate === void 0) { shortDate = false; }
        if (includeTime === void 0) { includeTime = true; }
        var dateObj = new Date(date);
        var dateString = "";
        var doubleDigitDay = this._ddPipe.transform(dateObj.getDate());
        if (shortDate) {
            var doubleDigitMonth = this._ddPipe.transform(dateObj.getMonth() + 1);
            dateString = doubleDigitDay + "/" + doubleDigitMonth + "/" + dateObj.getFullYear();
        }
        else {
            dateString = doubleDigitDay + " " + this._months[dateObj.getMonth()] + " " + dateObj.getFullYear();
        }
        if (includeTime) {
            var amPm = dateObj.getHours() < 12 ? "am" : "pm";
            dateString += " " + this._ddPipe.transform(dateObj.getHours()) + ":" + this._ddPipe.transform(dateObj.getMinutes()) + amPm;
        }
        return dateString;
    };
    CustomDatePipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'customDate'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__double_digit_pipe__["a" /* DoubleDigitPipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__double_digit_pipe__["a" /* DoubleDigitPipe */]) === 'function' && _a) || Object])
    ], CustomDatePipe);
    return CustomDatePipe;
    var _a;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/custom-date.pipe.js.map

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__upper_camel_case_pipe__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__underscore_to_space_pipe__ = __webpack_require__(309);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TitlePipe; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TitlePipe = (function () {
    function TitlePipe(_utsPipe, _uccPipe) {
        this._utsPipe = _utsPipe;
        this._uccPipe = _uccPipe;
    }
    TitlePipe.prototype.transform = function (stringVal) {
        stringVal += "";
        var underscoresRemoved = this._utsPipe.transform(stringVal);
        var allWordsToUppercase = this._uccPipe.transform(underscoresRemoved);
        return allWordsToUppercase;
    };
    TitlePipe = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["p" /* Pipe */])({
            name: 'title'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__underscore_to_space_pipe__["a" /* UnderscoreToSpacePipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__underscore_to_space_pipe__["a" /* UnderscoreToSpacePipe */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__upper_camel_case_pipe__["a" /* UpperCamelCasePipe */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__upper_camel_case_pipe__["a" /* UpperCamelCasePipe */]) === 'function' && _b) || Object])
    ], TitlePipe);
    return TitlePipe;
    var _a, _b;
}());
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/title.pipe.js.map

/***/ }),

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/environment.js.map

/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(491);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(489);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(497);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(495);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(701);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
















//# sourceMappingURL=C:/GitHub/ContentDeveloperCMS/ContentDeveloperCMS-AngularApp/src/polyfills.js.map

/***/ }),

/***/ 637:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 638:
/***/ (function(module, exports) {

module.exports = "textarea {\r\n    min-height: 200px;\r\n}\r\n\r\nnav ul {\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nnav ul li {\r\n    cursor: pointer;\r\n    box-sizing: border-box;\r\n    display: inline-block;\r\n    width: 24%;\r\n    padding: 1%;\r\n    background-color: #000;\r\n    color: #fff;\r\n    text-align: center;\r\n}"

/***/ }),

/***/ 639:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 640:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 641:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 642:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 643:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 644:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 645:
/***/ (function(module, exports) {

module.exports = "textarea {\r\n    min-height: 250px;\r\n}"

/***/ }),

/***/ 646:
/***/ (function(module, exports) {

module.exports = "img {\r\n    width: 100px;\r\n    min-height: 80px;\r\n    height: auto;\r\n    vertical-align: top;\r\n    border: 1px solid black;\r\n}\r\ntextarea {\r\n    width: 100%;\r\n}"

/***/ }),

/***/ 647:
/***/ (function(module, exports) {

module.exports = ":host > div{\r\n    background-color: #FFFFFF;\r\n}\r\n.collection, .subCollection{\r\n    display: block;\r\n}\r\n.subCollection{\r\n    margin-left: 4%;\r\n}"

/***/ }),

/***/ 648:
/***/ (function(module, exports) {

module.exports = ".collectionTab {\r\n    padding: 7% 1%;\r\n    color: white;\r\n    background-color: grey;\r\n    text-align: center;\r\n    border: 1px solid white;\r\n}\r\n\r\napp-media-item-gallery {\r\n    width: 50%;\r\n    height: 300px;\r\n    top: 0;\r\n    right: 0;\r\n    overflow-y: scroll;\r\n    position: absolute;    \r\n}"

/***/ }),

/***/ 649:
/***/ (function(module, exports) {

module.exports = "th:nth-child(1), td:nth-child(1) {width: 10%;}\r\nth:nth-child(2), td:nth-child(2) {width: 20%;}\r\nth:nth-child(3), td:nth-child(3) {width: 40%;}\r\nth:nth-child(4), td:nth-child(4) {width: 20%;}\r\nth:nth-child(5), td:nth-child(5) {width: 10%;}\r\n\r\n.scrollable {\r\n    max-height: 200px;\r\n}\r\n\r\ntextarea {\r\n    min-height: 200px;\r\n}"

/***/ }),

/***/ 650:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 651:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 652:
/***/ (function(module, exports) {

module.exports = ":host {\r\n    display: inline-block;\r\n}\r\nimg {\r\n    box-sizing: border-box;\r\n    min-height: 100px;\r\n    width: 100%;\r\n    cursor: pointer;\r\n    border: 2px solid #000;\r\n}"

/***/ }),

/***/ 653:
/***/ (function(module, exports) {

module.exports = "th:nth-child(1), td:nth-child(1) {width: 30%;}\r\nth:nth-child(2), td:nth-child(2) {width: 20%;}\r\nth:nth-child(3), td:nth-child(3) {width: 20%;}\r\nth:nth-child(4), td:nth-child(4) {width: 20%;}\r\nth:nth-child(5), td:nth-child(5) {width: 10%;}\r\n\r\n.templates button {\r\n    cursor: pointer;\r\n    text-align: left;\r\n    background-color: #000;\r\n    color: #FFF;\r\n    padding: 3%;\r\n    display: block;\r\n    width: 100%;\r\n}"

/***/ }),

/***/ 654:
/***/ (function(module, exports) {

module.exports = ":host > div {\r\n    text-align: center;\r\n}"

/***/ }),

/***/ 655:
/***/ (function(module, exports) {

module.exports = ":host > div {\r\n    background-color: black;\r\n    color: white;\r\n}\r\nh1 {\r\n    margin: 1% 0;\r\n}\r\nimg {\r\n    width: 50px;\r\n    vertical-align: bottom;\r\n    height: auto;\r\n}"

/***/ }),

/***/ 656:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 657:
/***/ (function(module, exports) {

module.exports = "<app-header\r\n    [user]=\"user\"\r\n    [pageTitle]=\"pageTitle\"\r\n    (requestToLogout)=\"logout()\"></app-header>\r\n\r\n    <app-login\r\n        *ngIf=\"user == null\">\r\n    </app-login>\r\n\r\n    <app-cms \r\n        *ngIf=\"user != null\"\r\n        (requestToUpdatePageTitle)=\"updatePageTitle($event)\">\r\n    </app-cms>\r\n<app-footer></app-footer>\r\n"

/***/ }),

/***/ 658:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n\t<nav>\r\n\t\t<ul>\r\n\t\t\t<li (click)=\"changeView('structure')\">View as Admin</li>\r\n\t\t\t<li (click)=\"changeView('content')\">View as Collaborator</li>\r\n\t\t\t<li (click)=\"changeView('history')\">Project History</li>\r\n\t\t\t<li (click)=\"changeView('settings')\">Project Settings</li>\r\n\t\t</ul>\r\n\t</nav>\r\n</div>\r\n<div class=\"row\">\r\n\t<app-structure-view\r\n\t\t*ngIf=\"_view == 'structure'\"\r\n\t\t[projectStructure]=\"projectStructure\"\r\n\t\t(viewRequestToSaveStructure)=\"viewRequestToSaveStructure($event)\"\r\n\t\t(viewRequestToResetStructure)=\"viewRequestToResetStructure()\">\r\n\t</app-structure-view>\r\n\r\n\t<app-content-view\r\n\t\t*ngIf=\"_view == 'content'\"\r\n\t\t[projectStructure]=\"projectStructure\"\r\n\t\t[(projectContent)]=\"projectContent\"\r\n\t\t(viewRequestToSaveContent)=\"viewRequestToSaveContent($event)\"\r\n\t\t(viewRequestToResetContent)=\"viewRequestToResetContent()\">\r\n\t</app-content-view>\r\n\r\n\t<app-history-view\r\n\t\t*ngIf=\"_view == 'history'\"\r\n\t\t[projectStructureHistory]=\"projectStructureHistory\"\r\n\t\t[projectContentHistory]=\"projectContentHistory\"\r\n\t\t(viewRequestToSaveStructure)=\"viewRequestToSaveStructure($event)\"\r\n\t\t(viewRequestToSaveContent)=\"viewRequestToSaveContent($event)\">\r\n\t</app-history-view>\r\n\r\n\t<app-settings-view\r\n\t\t*ngIf=\"_view == 'settings'\"\r\n\t\t[(projectSettings)]=\"projectSettings\"\r\n\t\t(settingsUpdated)=\"viewRequestToRefreshSettings($event)\">\r\n\t</app-settings-view>\r\n</div>"

/***/ }),

/***/ 659:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-12-12\">\n    <h2>Project Content</h2>\n    <div *ngIf=\"projectStructure != null\">\n      <app-content-editor\n        [viewContent]=\"true\"\n        [(projectContent)]=\"projectContent\"\n        [projectStructure]=\"projectStructure\"\n        (requestToSaveProjectContent)=\"requestToSaveProjectContent($event)\"\n        (requestToResetProjectContent)=\"requestToResetProjectContent()\">\n      </app-content-editor>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ 660:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <app-history-display\n    [history]=\"projectStructureHistory\"\n    [historyOf]=\"'structure'\"\n    [showPreview]=\"true\"\n    (revertToCommit)=\"revertToCommit($event)\">\n  </app-history-display>\n</div>\n\n<div class=\"row\">\n  <app-history-display\n    [history]=\"projectContentHistory\"\n    [historyOf]=\"'content'\"\n    [showPreview]=\"true\"\n    (revertToCommit)=\"revertToCommit($event)\">\n  </app-history-display>\n</div>"

/***/ }),

/***/ 661:
/***/ (function(module, exports) {

module.exports = "<h2>Project Settings</h2>\n<button (click)=\"saveAllProjectSettings()\">Save All</button>\n\n<div *ngIf=\"projectSettings != null\">\n  <div class=\"row\">\n    <h3>General</h3>\n\n    <div class=\"col-6-12\">\n      <div class=\"row\">\n        <label>Project Name:\n          <input #pnInput type=\"text\" [(ngModel)]=\"projectSettings.project_name\">\n        </label>\n      </div>\n\n      <div class=\"row\">\n        <label>Maximum Content Cache Time (in milliseconds)\n          <input #pmcInput type=\"number\" [(ngModel)]=\"projectSettings.max_cache_age\">ms\n        </label>\n      </div>\n\n      <div class=\"row\">\n        <label>Allowed Update Origins:\n          <textarea [(ngModel)]=\"projectSettings.update_origins\"></textarea>\n        </label>\n      </div>\n\n      <div class=\"row\">\n        <label>Allowed Read Origins:\n          <textarea [(ngModel)]=\"projectSettings.read_origins\"></textarea>\n        </label>\n      </div>\n    </div>\n\n    <div class=\"col-6-12\">\n      <div class=\"row\">\n        <label>Custom Content Editor CSS\n          <textarea #cssInput [(ngModel)]=\"projectSettings.custom_css\">\n          </textarea>\n        </label>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\">\n    <div class=\"col-6-12\">\n      <h3>Collaborators</h3>\n      <div class=\"row\">\n        <h4>Add Collaborator</h4>\n        <label>Email Address:\n          <input #acEmailInput type=\"text\">\n        </label>\n        <br>\n        <label>Access Level\n          <select #acAccessInput>\n            <option\n              *ngFor=\"let accessLevel of projectSettings.access_levels\"\n              [value]=\"accessLevel.access_level_int\">\n              {{accessLevel.access_level_name}}\n            </option>\n          </select>\n        </label>\n        <br>\n        <button (click)=\"addCollaborator(acEmailInput, acAccessInput)\">Add Collaborator</button>\n      </div>\n      <div class=\"row\">\n        <h4>Project Collaborators</h4>\n        <table>\n          <thead>\n            <tr>\n              <th>User</th>\n              <th>Access Level</th>\n              <th>Options</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let collaborator of projectSettings.collaborators\">\n              <td>{{collaborator.display_name}}</td>\n              <td>\n                <select\n                  #calInput\n                  [(ngModel)]=\"collaborator.access_level_int\">\n                  <option\n                    *ngFor=\"let accessLevel of projectSettings.access_levels\"\n                    [value]=\"accessLevel.access_level_int\">\n                    {{accessLevel.access_level_name}}\n                  </option>\n                </select>\n              </td>\n              <td>\n                <button\n                  (click)=\"deleteCollaborator(collaborator)\">Delete</button>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <div class=\"col-6-12\">\n      <h3>Access Levels</h3>\n      <div class=\"row\">\n        <h4>Add Access Level</h4>\n        <label>Access Level Name:\n          <input #aalLevelNameInput type=\"text\">\n        </label>\n        <br>\n        <label>Access Level Int:\n          <input #aalLevelIntInput type=\"text\">\n        </label>\n        <br>\n        <button (click)=\"addNewAccessLevel(aalLevelNameInput, aalLevelIntInput)\">Add New Access Level</button>\n      </div>\n      <div class=\"row\">\n        <h4>Project Access Levels</h4>\n        <table>\n          <thead>\n            <tr>\n              <th>Access Level Name</th>\n              <th>Access Level Int</th>\n              <th>In Use</th>\n              <th>Options</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let accessLevel of projectSettings.access_levels\">\n              <td>\n                <input type=\"text\" [(ngModel)]=\"accessLevel.access_level_name\">\n              </td>\n              <td>\n                {{accessLevel.access_level_int}}\n              </td>\n              <td>{{accessLevel.in_use ? \"Yes\" : \"No\"}}</td>\n              <td>\n                <button\n                  *ngIf=\"accessLevel.access_level_int > 3\"\n                  (click)=\"deleteAccessLevel(accessLevel.access_level_int)\">Delete</button>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),

/***/ 662:
/***/ (function(module, exports) {

module.exports = "<div class=\"col-6-12\">\n  <h2>Project Structure</h2>\n  <app-code-editor\n    [(codeJson)]=\"projectStructureJson\"\n    [(formatJson)]=\"formatJson\"\n    (codeUpdated)=\"codeUpdated($event)\">\n  </app-code-editor>\n  <button (click)=\"formatJsonClicked()\">Format JSON</button>\n  <button (click)=\"resetProjectStructure()\">Reset</button>\n  <button (click)=\"saveProjectStructure()\">Save</button>\n</div>\n<div class=\"col-6-12\">\n  <h2>Input Preview</h2>\n  <div *ngIf=\"projectStructure != null\">\n    <app-content-editor\n      [viewContent]=\"false\"\n      [projectStructure]=\"projectStructure\"\n      (structureCollectionTabsReordered)=\"structureCollectionTabsReordered($event)\">\n    </app-content-editor>\n  </div>\n</div>"

/***/ }),

/***/ 663:
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"_projectId == null && _userAccessLevel == null\">\r\n    <app-user-projects\r\n        (viewProject)=\"viewProject($event)\"></app-user-projects>\r\n</ng-container>\r\n\r\n<ng-container *ngIf=\"_projectId != null && _userAccessLevel != null\">\r\n    <button (click)=\"viewUserProjects()\">Back to all Projects</button>\r\n    <app-cms-admin\r\n        *ngIf=\"_userAccessLevel == 1\"\r\n        [(projectStructure)]=\"projectStructure\"\r\n        [(projectContent)]=\"projectContent\"\r\n        [projectStructureHistory]=\"projectStructureHistory\"\r\n        [projectContentHistory]=\"projectContentHistory\"\r\n        [(projectSettings)]=\"projectSettings\"\r\n        (adminRequestToSaveStructure)=\"saveProjectStructure($event)\"\r\n        (adminRequestToResetStructure)=\"resetProjectStructure()\"\r\n        (adminRequestToSaveContent)=\"saveProjectContent($event)\"\r\n        (adminRequestToResetContent)=\"resetProjectContent()\"\r\n        (adminRequestToRefreshSettings)=\"loadProjectSettings()\">\r\n    </app-cms-admin>\r\n    <app-cms-editor\r\n        *ngIf=\"_userAccessLevel == 2 || _userAccessLevel > 3\"\r\n        [(projectContent)]=\"projectContent\"\r\n        [projectStructure]=\"projectStructure\">\r\n    </app-cms-editor>\r\n</ng-container>"

/***/ }),

/***/ 664:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n\t<div class=\"col-12-12\">\n\t\t<h2>Project Content</h2>\n            <app-content-editor\n\t\t\t[viewContent]=\"true\"\n\t\t\t[projectContent]=\"projectContent\"\n\t\t></app-content-editor>\n\t</div>\n</div>\n"

/***/ }),

/***/ 665:
/***/ (function(module, exports) {

module.exports = "<textarea\n  [(ngModel)]=\"codeJson\">\n</textarea>"

/***/ }),

/***/ 666:
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"itemStructure.attributes != null\">\n  <br *ngIf=\"itemStructure.input_type == 'textarea'\">\n  <label>{{itemName | title}} {{itemStructure.attributes.required == \"required\" ? '*' : ''}}\n\n    <ng-container *ngIf=\"itemStructure.input_type == null || itemStructure.input_type == 'input'\">\n      <input\n        *ngIf=\"itemStructure.type != 'html' && itemStructure.attributes.type != 'file'\"\n        [type]=\"itemStructure.attributes.type != null ? itemStructure.attributes.type : text\"\n        [(ngModel)]=\"itemContent\"\n        (change)=\"contentChanged($event)\">\n      \n      <ng-container *ngIf=\"itemStructure.attributes.type == 'file'\">\n        <input\n          type=\"file\"\n          class=\"hi\"\n          (change)=\"fileInputChanged($event)\">\n        <span\n          *ngIf=\"_warning != null\">{{_warning}}</span>\n        <img\n          *ngIf=\"viewContent && itemContent != null\"\n          [src]=\"itemContent\">\n        <button \n          (click)=\"viewAvailableMediaItems()\">Select Image</button>\n      </ng-container>\n    </ng-container>\n\n    <textarea\n      *ngIf=\"itemStructure.input_type == 'textarea' || itemStructure.type == 'html'\"\n      [(ngModel)]=\"itemContent\"\n      (change)=\"contentChanged($event)\">\n    </textarea>\n\n    <select\n      *ngIf=\"itemStructure.input_type != null && itemStructure.input_type == 'select'\"\n      [(ngModel)]=\"itemContent\"\n      (change)=\"contentChanged($event)\">\n      <ng-container *ngIf=\"itemStructure.attributes != null && itemStructure.attributes.options != null\">\n        <option\n          *ngFor=\"let option of itemStructure.attributes.options\"\n          [value]=\"option\"\n          [selected]=\"itemContent != null && viewContent != false && option == itemContent\">\n          {{option | title}}\n        </option>\n      </ng-container>\n    </select>\n  </label>\n</ng-container>"

/***/ }),

/***/ 667:
/***/ (function(module, exports) {

module.exports = "<h3 *ngIf=\"subCollection\">{{collection | title}}</h3>\n<br *ngIf=\"projectStructure != null && (projectStructure[collection] != null && (projectStructure[collection].input_type == 'textarea' || projectStructure[collection].type == 'html'))\">\n<div [class]=\"subCollection ? 'subCollection ' + collection : 'inline'\">\n  <ng-container *ngIf=\"projectStructure != null && projectStructure[collection] != null\">\n    <ng-container *ngIf=\"projectStructure[collection] != null && projectStructure[collection].items == null && encapsulationPath != null\">\n      <app-collection-item\n        [class]=\"encapsulationPath.split('/').join(' ')\"\n        [encapsulationPath]=\"encapsulationPath\"\n        [itemName]=\"collection\"\n        [itemStructure]=\"projectStructure[collection]\"\n        [itemContent]=\"projectContent != null && projectContent[collection] != null ? projectContent[collection] : null\"\n        [viewContent]=\"viewContent\"\n        (itemContentChanged)=\"collectionContentChanged($event)\"\n        (collectionItemRequestToViewMediaItems)=\"collectionItemRequestToViewMediaItems($event)\">\n      </app-collection-item>\n    </ng-container>\n    \n    <ng-container *ngIf=\"projectStructure[collection] != null && projectStructure[collection].items != null\">\n      \n      <ng-container *ngIf=\"projectStructure[collection].type == 'object'\">\n        <ng-container *ngFor=\"let collectionItemName of projectStructure[collection].items | keyValArray : 'keys'\">\n          <app-collection\n            [encapsulationPath]=\"encapsulationPath + '/' + collectionItemName\"\n            [subCollection]=\"projectStructure[collection].items[collectionItemName].type == 'object' || projectStructure[collection].items[collectionItemName].type == 'array'\"\n            [collection]=\"collectionItemName\"\n            [projectStructure]=\"projectStructure[collection].items\"\n            [projectContent]=\"projectContent != null && projectContent[collection] != null ? projectContent[collection] : null\"\n            [viewContent]=\"viewContent\"\n            (itemContentChanged)=\"itemContentChanged($event)\"\n            (contentChanged)=\"collectionContentChanged($event)\"\n            (collectionRequestToViewMediaItems)=\"viewMediaItems($event)\">\n          </app-collection>\n        </ng-container>\n      </ng-container>\n\n      <ng-container *ngIf=\"projectStructure[collection].type == 'array'\">\n        <ng-container *ngIf=\"projectContent != null && projectContent[collection] != null && viewContent\">\n          <app-draggable-container\n            [content]=\"projectContent[collection]\"\n            [contentEncapsulationPath]=\"encapsulationPath\"\n            [contentType]=\"projectStructure[collection].type\"\n            (contentReordered)=\"collectionContentChanged($event)\">\n            <ng-container *ngFor=\"let index of projectContent[collection] | keyValArray : 'keys'\">\n              <div\n                class=\"collection\"\n                draggable=\"true\"\n                [attr.data-key]=\"index\">\n                <ng-container *ngFor=\"let collectionItemName of projectStructure[collection].items | keyValArray : 'keys'\">\n                  <app-collection\n                    [subCollection]=\"projectStructure[collection].items[collectionItemName].type == 'array'\"\n                    [encapsulationPath]=\"encapsulationPath + '/' + index + '/' + collectionItemName\"\n                    [collection]=\"collectionItemName\"\n                    [projectStructure]=\"projectStructure[collection].items\"\n                    [projectContent]=\"projectContent[collection][index] != null ? projectContent[collection][index] : null\"\n                    [viewContent]=\"viewContent\"\n                    (itemContentChanged)=\"collectionContentChanged($event)\"\n                    (contentChanged)=\"collectionContentChanged($event)\"\n                    (collectionRequestToViewMediaItems)=\"viewMediaItems($event)\">\n                  </app-collection>\n                </ng-container>\n                <button (click)=\"deleteItem(encapsulationPath, index)\">Delete</button>\n              </div>\n            </ng-container>\n          </app-draggable-container>\n          <button (click)=\"addNewItem(encapsulationPath, projectStructure[collection].type)\"> Add {{collection}}</button>\n        </ng-container>\n\n        <ng-container *ngIf=\"projectContent == null || projectContent[collection] == null || viewContent == false\">\n          <ng-container *ngFor=\"let collectionItemName of projectStructure[collection].items | keyValArray : 'keys'\">\n            <ng-container *ngIf=\"projectStructure[collection].items[collectionItemName].type != 'object' && projectStructure[collection].items[collectionItemName].type != 'array'\">\n                <app-collection\n                  [encapsulationPath]=\"projectStructure[collection].type == 'array' ? encapsulationPath + '/0/' + collectionItemName : encapsulationPath + '/' + collectionItemName\"\n                  [collection]=\"collectionItemName\"\n                  [projectStructure]=\"projectStructure[collection].items\"\n                  [viewContent]=\"viewContent\"\n                  (itemContentChanged)=\"collectionContentChanged($event)\"\n                  (contentChanged)=\"collectionContentChanged($event)\"\n                  (collectionRequestToViewMediaItems)=\"viewMediaItems($event)\">\n                </app-collection>\n            </ng-container>\n            \n            <ng-container *ngIf=\"projectStructure[collection].items[collectionItemName].type == 'object'\">\n              <app-collection\n                [encapsulationPath]=\"encapsulationPath + '/' + collectionItemName\"\n                [subCollection]=\"true\"\n                [collection]=\"collectionItemName\"\n                [projectStructure]=\"projectStructure[collection].items\"\n                [viewContent]=\"viewContent\"\n                (itemContentChanged)=\"collectionContentChanged($event)\"\n                (contentChanged)=\"collectionContentChanged($event)\"\n                (collectionRequestToViewMediaItems)=\"viewMediaItems($event)\">\n              </app-collection>\n            </ng-container>\n\n            <ng-container *ngIf=\"projectStructure[collection].items[collectionItemName].type == 'array'\">\n              <app-collection\n                [encapsulationPath]=\"encapsulationPath + '/0/' + collectionItemName\"\n                [subCollection]=\"true\"\n                [collection]=\"collectionItemName\"\n                [projectStructure]=\"projectStructure[collection].items\"\n                [viewContent]=\"viewContent\"\n                (itemContentChanged)=\"collectionContentChanged($event)\"\n                (contentChanged)=\"collectionContentChanged($event)\"\n                (collectionRequestToViewMediaItems)=\"viewMediaItems($event)\">\n              </app-collection>\n            </ng-container>\n          </ng-container>\n        </ng-container>\n\n      </ng-container>\n\n    </ng-container>\n  </ng-container>\n</div>\n"

/***/ }),

/***/ 668:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"projectStructure != null\">\r\n  <div *ngIf=\"viewContent\" class=\"row\">\r\n    <button (click)=\"saveProjectContent()\">Save</button>\r\n    <button (click)=\"resetProjectContent()\">Reset</button>\r\n  </div>\r\n\r\n  <div class=\"row\">\r\n    <div class=\"col-2-12\">\r\n        <div *ngIf=\"projectStructure != null\">\r\n          <app-draggable-container\r\n            [content]=\"projectStructure\"\r\n            [contentEncapsulationPath]=\"\"\r\n            [contentType]=\"object\"\r\n            (contentReordered)=\"collectionTabsReordered($event)\">\r\n            <div *ngFor=\"let collection of projectStructure | keyValArray : 'keys'\"\r\n              draggable=\"true\"\r\n              [attr.data-key]=\"collection\"\r\n              (click)=\"viewCollection(collection)\"\r\n              [class]=\"(collection === currentCollectionName ? 'active ' : '')  + 'collectionTab'\">{{collection | title}}\r\n            </div>\r\n          </app-draggable-container>\r\n        </div>\r\n    </div>\r\n    <div class=\"col-10-12\">\r\n      <ng-container *ngIf=\"currentCollectionName != null\">\r\n        <h2>{{currentCollectionName | title}}</h2>\r\n        <app-collection\r\n          [topLevelCollection]=\"true\"\r\n          [encapsulationPath]=\"currentCollectionName\"\r\n          [collection]=\"currentCollectionName\"\r\n          [projectContent]=\"projectContent\"\r\n          [projectStructure]=\"projectStructure\"\r\n          [viewContent]=\"viewContent\"\r\n          (contentChanged)=\"projectContentChanged($event)\"\r\n          (collectionRequestToViewMediaItems)=\"showMediaItemGallery($event)\">\r\n        </app-collection>\r\n      </ng-container>\r\n    </div>\r\n  </div>\r\n  <app-media-item-gallery\r\n    [class]=\"mediaItemGalleryVisible ? 'visible' : 'hidden'\"\r\n    [visible]=\"mediaItemGalleryVisible\"\r\n    [numItemsPerPage]=2\r\n    [numItemsPerRow]=3\r\n    (closeButtonClicked)=\"hideMediaItemGallery()\"\r\n    (mediaItemSelected)=\"mediaItemSelected($event)\">\r\n  </app-media-item-gallery>\r\n</div>\r\n"

/***/ }),

/***/ 669:
/***/ (function(module, exports) {

module.exports = "<h2 *ngIf=\"historyOf\">{{historyOf | upperCamelCase }}History</h2>\n<div *ngIf=\"history != null\" class=\"row\">\n  <div [class]=\"showPreview ? 'col-8-12' : 'col-12-12'\">\n    <table>\n      <thead>\n        <tr>\n          <th>Commit ID</th>\n          <th>Date</th>\n          <th>Changes</th>\n          <th>Made By</th>\n          <th>Options</th>\n        </tr>\n      </thead>\n    </table>\n    <div class=\"scrollable\">\n      <table>\n        <tbody>\n          <tr\n            *ngFor=\"let commit of history | keyValArray : 'values'\"\n            [class]=\"_previewHistoryHash == commit.hash ? 'selected' : ''\">\n            <td>{{commit.hash | shortener : 6}}</td>\n            <td>{{commit.date | customDate : false : true}}</td>\n            <td>{{commit.message.split(\" (HEAD ->\")[0]}}</td>\n            <td>{{commit.author_name}}</td>\n            <td><button (click)=\"preview(commit)\">Preview</button></td>\n          </tr>\n        </tbody>\n      </table>  \n    </div>\n  </div>\n  <div *ngIf=\"showPreview\" class=\"col-4-12\">\n    <button (click)=\"clear()\">Clear Preview</button>\n    <button (click)=\"revert()\">Revert to this {{historyOf | upperCamelCase}}</button>\n    <textarea\n      [value]=\"_previewHistoryObject != null ? (_previewHistoryObject | customJson : 'stringify') : ''\">\n    </textarea>\n  </div>\n</div>"

/***/ }),

/***/ 670:
/***/ (function(module, exports) {

module.exports = "<p>\n  history-preview works!\n</p>\n"

/***/ }),

/***/ 671:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"_mediaItems != null\">\n  <h2>Available Images</h2>\n  <div class=\"row\">\n    <button (click)=\"hide()\">Close</button>\n    <button (click)=\"loadMediaItems()\">Next</button>\n  </div>\n  <div>\n    <app-media-item\n        *ngFor=\"let mediaItem of _mediaItems\"\n        [mediaItemUrl]=\"mediaItem.url\"\n        [mediaItemName]=\"mediaItem.name\"\n        (mediaItemClicked)=\"mediaItemClicked($event)\"\n        [style.width]=\"((100 / numItemsPerRow) - 1) + '%'\">\n    </app-media-item>\n  </div>\n</div>\n"

/***/ }),

/***/ 672:
/***/ (function(module, exports) {

module.exports = "<img\n  [src]=\"mediaItemUrl\"\n  [title]=\"mediaItemName\"\n  [alt]=\"mediaItemName\"\n  (click)=\"onClick()\">\n"

/***/ }),

/***/ 673:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-8-12\">\n    <div *ngIf=\"_userProjects == null || _userProjects.length == 0\">\n      You have no projects\n    </div>\n\n    <div *ngIf=\"_userProjects != null && _userProjects.length > 0\">\n      <table>\n        <thead>\n          <tr>\n            <th>Project Name</th>\n            <th>Access Level</th>\n            <th>Last Modified</th>\n            <th>Last Modified By</th>\n            <th>Options</th>\t\t\t\n          </tr>\n        </thead>\n      </table>\n\n      <div class=\"scrollable\">\n        <table>\n          <tbody>\n            <tr *ngFor=\"let project of _userProjects\">\n              <td>{{project.project_name}}</td>\n              <td>{{project.access_level_name}}</td>\n              <td>&nbsp;</td>\n              <td>&nbsp;</td>\n              <td><button (click)=\"editProject(project.project_id, project.project_name, project.access_level_int)\">Edit</button></td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n  <div class=\"col-4-12\">\n    <h2>Create a New Project</h2>\n    <h3>Project Name</h3>\n    <input #pnInput type=\"text\">\n    \n    <h3>Templates</h3>\n    <span class=\"templates\">\n      <button (click)=\"createNewProject(pnInput)\">No Template</button>\n      <button (click)=\"createNewProject(pnInput, 'website_template')\">Website Template</button>\n      <button (click)=\"createNewProject(pnInput, 'mediaitems_template')\">Media Items Template</button>\n    </span>\n  </div>\n</div>"

/***/ }),

/***/ 674:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  Copyright &copy; Laura Pigott\n</div>\n"

/***/ }),

/***/ 675:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-8-12\">\r\n    <h1>{{pageTitle}}</h1>\r\n  </div>\r\n  <div *ngIf=\"user != null\" class=\"col-4-12 right\">\r\n    <span>{{user.displayName}}</span>\r\n    <button (click)=\"logoutClicked()\">Logout</button>\r\n    <img \r\n      *ngIf=\"user.profileImage != null\"\r\n      [src]=\"user.profileImage + '&sz=50'\">\r\n  </div>\r\n</div>"

/***/ }),

/***/ 676:
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"_loginUrl != null\">\n  <a [href]=\"_loginUrl\">\n    <button>Login with Google</button>\n  </a>\n</ng-container>\n"

/***/ }),

/***/ 702:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(353);


/***/ })

},[702]);
//# sourceMappingURL=main.bundle.map