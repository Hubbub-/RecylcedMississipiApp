angular.module('app').controller('rmMainCtrl', [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {
    var latinit;
    var longinit;
    var pathLatLong = [];
    var shape;

    
    initialised = false;
    
    loadData();
    
    init();
    
    function loadData() {
        $http.get("/geo.geojson").success(function(data, status) {
            // pathLatLong = [];
            
            angular.extend($scope, {
                
                geojson: {
                    data: data,
                    
                    onEachFeature: function (feature, layer) {
                        var pointString = {lat: parseFloat(feature.geometry.coordinates[1]), lng: parseFloat(feature.geometry.coordinates[0])};
                        
                        pathLatLong.push(pointString);
                        
                        if(feature.properties.name != ''){
                            var description = feature.properties.name;
                            layer.bindPopup(description, {
                                minWidth : 570
                            });
                        }
                        if(feature.properties.current === "true"){
                            latinit=parseFloat(feature.geometry.coordinates[1]);
                            longinit=parseFloat(feature.geometry.coordinates[0]);
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
                                iconUrl: 'images/map/video-player.png',
                                iconSize: [32],
                                iconAnchor:[16,30],
                                shadowUrl: 'images/map/sailboat_shadowMedium.png',
                                shadowSize: [100],
                                shadowAnchor: [40,56],
                            }))
                        }
                        else{
                            layer.setIcon(L.icon({
                                iconUrl: 'images/map/dotSmall.png',
                                iconSize: [0],
                                iconAnchor:[5,5],
                            }))
                        }
                    }
                    
                }
            })
            setTimeout($scope.addShape, 1000);
            
        });
        setTimeout(loadData, 200000);
    }
    function init() {
        $scope.center = { 
            lat: 37.3116,
            lng: -89.4068,        
            zoom: 5,
        };
        
        $scope.defaults = {
            scrollWheelZoom: false
        };

        
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

    
    $scope.centerMap = function() {
        // place the map center to be latest tracking point
        $scope.center = {    
            lat: latinit,
            lng: longinit,        
            zoom: 10,
        };
    };
    
    $scope.centerJSON = function() {
        leafletData.getMap().then(function(map) {
            map.fitBounds([[46.1,-90.76], [29.6,-88]]);
        });
    };
    
    $scope.controls = {
        // custom: new L.Control.Fullscreen()
        fullscreen : {
            position: 'topleft'
        }
    };
    
    $scope.addShape = function () {
        
        shape = L.polyline(pathLatLong, {
            color:'blue',
            weight: 5,
            opacity: 0.4,
            smoothFactor: 3
        });
        leafletData.getMap().then(function(map) {
            // map.addLayer(shape);
            shape.addTo(map)
            console.log(shape);
            firstAdd = false;
            // pathLatLong = [];
        })
    }
}]);