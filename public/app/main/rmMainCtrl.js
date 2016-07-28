angular.module('app').controller('rmMainCtrl', [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
    var latinit;
    var longinit;
    initialised = false;
    function loadData() {
        $http.get("/geo.geojson").success(function(data, status) {
            
            
            angular.extend($scope, {
                geojson: {
                    data: data,
                    
                    onEachFeature: function (feature, layer) {
                        if(feature.properties.name != ''){
                            var description = feature.properties.name;
                            layer.bindPopup(description, {
                                minWidth : 570
                            });
                        }
                        if(feature.properties.current === "true"){
                            latinit=parseFloat(feature.geometry.coordinates[1]);
                            longinit=parseFloat(feature.geometry.coordinates[0]);
                            console.log("lat:" + latinit);
                            if(!initialised){
                                $scope.centerMap();
                                initialised = true;
                            }
                            
                            layer.setIcon(L.icon({
                                iconUrl: 'images/map/sailboat.png',
                                iconSize: [200],
                                iconAnchor:[80,112],
                                shadowUrl: 'images/map/sailboat_shadow.png',
                                shadowSize: [200],
                                shadowAnchor: [80,112],
                            }))
                            
                        }
                        else if(feature.properties.name != ''){
                            layer.setIcon(L.icon({
                                iconUrl: 'images/map/sailboatMediumRed.png',
                                iconSize: [100],
                                iconAnchor:[40,56],
                                shadowUrl: 'images/map/sailboat_shadowMedium.png',
                                shadowSize: [100],
                                shadowAnchor: [40,56],
                            }))
                        }
                        else{
                            layer.setIcon(L.icon({
                                iconUrl: 'images/map/dotSmall.png',
                                iconSize: [10],
                                iconAnchor:[5,5],
                                
                            }))
                        }
                    }
                }
                
                
                
            })
            
            
        });
        setTimeout(loadData, 300000);
    }
    function init() {
        $scope.center = { 
            lat: 37.06045,
            lng: 89.3848,        
            zoom: 10,
        };
        
        $scope.defaults = {
            scrollWheelZoom: false
        }
        

        
        //define mapbox as the map
        $scope.layers = {
            baselayers: {
                mapbox_terrain: {
                    name: 'Mapbox Terrain',
                    url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1IjoiYnJhZWRlbmYiLCJhIjoiY2lvZGs1MHk5MDA4N3YxbTN4cTBpbmVyYSJ9.g1-OkxRnSdG8pqtEhCjPaA',
                        mapid: 'mapbox.outdoors'
                    }
                }
            }
        };
        
    }
    loadData();
    
    init();
    
    $scope.centerMap = function() {
        // place the map center to be latest tracking point
        $scope.center = {    
            lat: latinit,
            lng: longinit,        
            zoom: 10,
        };
    }
    
    $scope.centerJSON = function() {
        leafletData.getMap().then(function(map) {
            // var latlngs = [];
            // for (var i in $scope.geojson.data.features) {
            //     var coord = $scope.geojson.data.features[i].geometry.coordinates[0];
            //     for (var j in coord) {
            //         var points = coord[j];
            //         for (var k in points) {
            //             latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
            //         }
            //     }
            // }
        //   "-90.76255",
        //   "42.64936"
            map.fitBounds([[46.1,-90.76], [29.6,-88]]);
            
        });
        
    };
    
    $scope.controls = {
        // custom: new L.Control.Fullscreen()
        fullscreen : {
            position: 'topleft'
        },
        // custom: new 
    }
}]);