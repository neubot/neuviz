/** neuviz/frontend/router.js
*
* Copyright (c) 2014
*    Nexa Center for Internet & Society, Politecnico di Torino (DAUIN)
*    and Giuseppe Futia <giuseppe.futia@polito.it>.
*
* This file is part of NeuViz.
*
* NeuViz is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* NeuViz is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with NeuViz.  If not, see <http://www.gnu.org/licenses/>.
*
**/


var path = require("path");
var ROOT = "/var/www/";
var API = "/neuviz/1.0/data/";

var years = {};
var months = {};

String.prototype.startsWith = function (prefix) {

    if (this.indexOf(prefix) === 0) {
        return true;
    }
    return false;
};

var fillYears = function () {
    years["2012"] = true;
    years["2013"] = true;
};

var fillMonths = function () {
    for (var i = 1; i <= 12; i++) {
       months[i] = true;
    }
};

var checkParameters = function (parameters) {
	fillYears();
	fillMonths();
    var parameter = parameters.split("/");
    if (parameter.length>2) return false;
    if (years[parameter[0]] === undefined) return false;
    if (months[parameter[1]] === undefined) return false;
    return true;
};

var formatJSON = function (parameters) {
	
	/* TODO: improve the output of the python data processor
    to obtain a cleaner file name and a cleaner code */
    
    var file = "result_";
    var time = parameters[1].split("/");
    if (time[1].length == 1)
        file += "0" + time[1];  
    else file += time[1];
        file += "_" + time[0] + ".json";
    return file;

}

var route = function (pathName) {
	console.info("Route to the requested resource");
	var resource;

	if (pathName.startsWith(API)) {
		console.info("Try to use the API");
        var mapped = path.join(ROOT, pathName);
        var pathController = path.join(ROOT, API);

        if (mapped.startsWith(pathController)) {
            
        	var parameters = mapped.split(pathController);
            console.info("Check parameters: " + parameters);

        	if (!checkParameters(parameters[1])) {
                console.info("Bad parameters");
                resource = "Bad request"; 
            }
            else resource = ROOT + API + formatJSON(parameters);
        }

        else resource = "Bad request" 
    } 
    else if (pathName === "" || pathName === "/" || pathName === "index" || pathName === "index.html") {
        console.info("Resource: index.html");
        pathName = "/index.html";
	    resource = path.join(ROOT, pathName);
    }

    else {
        var staticResource = path.join(ROOT,pathName);
        console.info("Resource: " + staticResource);
        if (staticResource.indexOf(ROOT, 0) !== 0) {
            resource = "Bad request";
        } 
        else resource = staticResource;
    }
     
    console.info(resource); 
    return resource;
}    

exports.route = route;
