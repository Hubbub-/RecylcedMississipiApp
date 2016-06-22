
var jsonfile = require('jsonfile');
var request = require('request');
var promise = require('promise');
var geoJSON = require('geojson');
var mongoose = require('mongoose');


var readFile = promise.denodeify(require('fs').readFile);

var newMessageArray = [];
var newTimeArray = [];
var newLatArray = [];
var newLongArray = [];
var exMessageArray = [];
var exTimeArray = [];

var combinedData = [];



module.exports = function(app, config) {
    
    loadSpot(config);

}

function loadSpot(config){
    //--- load the spot json feed ---
    // var url = "https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0N6dXjTo7eRCUfsNlXrLNnfDFuDVNVN1c/message.json"
    var url = 'https://raw.githubusercontent.com/Hubbub-/mapboxupload/master/message.json'
    request({url: url, json: true}, function(error,response,body){
        if(!error && response.statusCode == 200){
            newMessageArray = body.response.feedMessageResponse.messages.message;
            console.log("number of spot messages: " + newMessageArray.length);
            
            //--- make lists for time, lat and long from the spot GPS ---
            for(var i=0; i<newMessageArray.length; i++){
                newTimeArray.push(newMessageArray[i].dateTime);
                newLatArray.push(newMessageArray[i].latitude);
                newLongArray.push(newMessageArray[i].longitude);
            }
            console.log("NewTimes");
            console.log(newTimeArray);
            console.log("newLats");
            console.log(newLatArray);
            console.log("newLongs");
            console.log(newLongArray);
            loadExisting(config); //------------------------ call next function
        }
    })
    
}

function readJSON(filename, callback){
    // If a callback is provided, call it with error as the first argument
    // and result as the second argument, then return `undefined`.
    // If no callback is provided, just return the promise.
    return readFile(filename, 'utf8').then(JSON.parse).nodeify(callback);
}

function loadExisting(config){
    //--- load the existing geojson file ---
    readJSON('./server/fetch/rawmessage.json', function(err, obj){
        exMessageArray = obj.response.feedMessageResponse.messages.message;
        console.log("number of existing messages: " + exMessageArray.length);
        //--- make a list of existing times
        for(var i=0; i<exMessageArray.length; i++){
            exTimeArray.push(exMessageArray[i].dateTime);
        }
        console.log("existing Times:");
        console.log(exTimeArray);
        compare(config);  //------------------------ call next function
    })
}



//--- compare times of existing data and new data ---
function compare(config) {
    for(var i=newTimeArray.length-1; i >= 0; i--){
        for(var j=exTimeArray.length-1; j >= 0; j--){
            if(newTimeArray[i] == exTimeArray[j]){
                console.log("removing:");
                console.log(newTimeArray[i]);
                newTimeArray.splice(i,1);
                newLatArray.splice(i,1);
                newLongArray.splice(i,1);
            }
        }
    }
    console.log("resulting new times");
    console.log(newTimeArray);
    combine(config);   //------------------------ call next function
}


//--- put the time, latitude and longitude together as "features" ---
function combine(config){
    
    // for(var i=0; i<exTimeArray.length; i++){
    //     var iLat = exMessageArray[i].latitude;
    //     var iLong = exMessageArray[i].longitude;
    //     var str = '{ "name": "' + exTimeArray[i] + '", "lat": "' + iLat + '", "long": "' + iLong + '" }';
    //     var pj = JSON.parse(str);
    //     combinedData.push(pj);
    // }
    
    for(var i=0; i<newTimeArray.length; i++){
        var iLat = newMessageArray[i].latitude;
        var iLong = newMessageArray[i].longitude;
        var str = '{ "name": "' + newTimeArray[i] + '", "lat": "' + iLat + '", "long": "' + iLong + '" }';
        var pj = JSON.parse(str);
        combinedData.push(pj);
    }
    
    console.log(combinedData);
    
    geoParse(config); //---------------------------- next function
}


//--- turn the list of features into a collection ---
function geoParse(config){
    var geoData = geoJSON.parse(combinedData, {Point: ['lat', 'long']});
    console.log(geoData);

    geoWrite(config, geoData); //----------------------- next function
}


//--- write a geojson file from the collection ---
function geoWrite(config, geoData) {
    // mongoose.connect(config.db);
    var db = mongoose.connection;
    var collection = db.collection('geo');
    collection.insert(geoData, function(err, result){
        if (err){
            console.log(err);
        }
        else{
            console.log('inserted %d into the "geo" collection. The documents inserted with "_id" are: ', result.length, result);
        }
        db.close();
    });
}

