
var jsonfile = require('jsonfile');
var request = require('request');
var promise = require('promise');
var geoJSON = require('geojson');


var readFile = promise.denodeify(require('fs').readFile);
var writeFile = promise.denodeify(require('fs').writeFile);

var newMessageArray = [];
var newTimeArray = [];
var newLatArray = [];
var newLongArray = [];
var exMessageArray = [];
var exTimeArray = [];

var combinedData = [];

var output = [];


module.exports = function(app, config) {
    
    loadExisting(app, config);

}

function sortByTIME(a,b) {
    return (a.time > b.time) ? -1 : ((a.time < b.time) ? 1 : 0);
}



function readJSON(filename, callback){
    // If a callback is provided, call it with error as the first argument
    // and result as the second argument, then return `undefined`.
    // If no callback is provided, just return the promise.
    return readFile(filename, 'utf8').then(JSON.parse).nodeify(callback);
}





function loadExisting(app, config){
      
    readJSON('./server/fetch/convertcsv.geojson', function(err, obj){
        exMessageArray = obj.features;
        console.log("number of existing messages: " + exMessageArray.length);
        //--- make a list of existing times
        exTimeArray = [];
        for(var i=0; i<exMessageArray.length; i++){
            var inDateTime = exMessageArray[i].localTime;
            var inDateTimeArray = inDateTime.split(" ");
            var inTime = inDateTimeArray[1];
            var inDateArray = inDateTimeArray[0].split("/");
            var inMonth = inDateArray[0];
            var inDay = inDateArray[1];
            var inYear = inDateArray[2];
            var outTimeString = inYear+"-"+inMonth+"-"+inDay+"T"+inTime+"+0000";
            exTimeArray.push(outTimeString);
        }
        // console.log("existing Times:");
        // console.log(exTimeArray);
        combine(config);  //------------------------ call next function
    })
}





//--- put the time, latitude and longitude together as "features" ---
function combine(config){
    combinedData = [];
    for(var i=0; i<exTimeArray.length; i++){
        var iLat = exMessageArray[i].lat;
        var iLong = exMessageArray[i].long;
        var d = new Date(exTimeArray[i]);
        var uTime = d.getTime()/1000;
        var iName = exMessageArray[i].name;
        var str = '{"current": "false", "time": "' + uTime + '", "name": "' + iName + '", "localTime": "' + exTimeArray[i] + '", "lat": "' + iLat + '", "long": "' + iLong + '" }';
        var pj = JSON.parse(str);
        combinedData.push(pj);
    }
    
    
    
    // console.log(combinedData);
    combinedData.sort(sortByTIME);
    for(var i=0; i<combinedData.length; i++){
        if(i === 0){
            combinedData[i].current = "true"
        }
        else{
            combinedData[i].current = "false"
        }
    }
    geoParse(config); //---------------------------- next function
}


//--- turn the list of features into a collection ---
function geoParse(config){
    var geoData = geoJSON.parse(combinedData, {Point: ['lat', 'long']});
    // console.log("geoParse");
    // console.log(geoData);
    // geoData.sort(sortByNAME);
    geoWrite(config, geoData); //----------------------- next function
}


//--- write a geojson file from the collection ---
function geoWrite(config, geoData) {

    
    jsonfile.writeFile("./server/fetch/newgeo.geojson", geoData, {spaces: 2}, function(err){
        if (err){
            console.error(err)
        }
    });
    
}

