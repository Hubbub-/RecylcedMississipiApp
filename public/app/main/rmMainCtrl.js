angular.module('app').controller('rmMainCtrl', [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

    function loadData() {
        $http.get("/geo.geojson").success(function(data, status) {
            // latinit = data.features[i].geometry.coordinates[1];
            // longinit = data.features[i].geometry.coordinates[0];
            
            angular.extend($scope, {
                geojson: {
                    data: data,
                    
                    onEachFeature: function (feature, layer) {
                        if(feature.properties.name != ''){
                            layer.bindPopup(feature.properties.name);
                        }
                        if(feature.properties.current === "true"){
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
        
        // place the map center to be first vlog position
        $scope.center = {    
            lat: 38.88464,
            lng: -90.17648,
            zoom: 6,
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
}]);