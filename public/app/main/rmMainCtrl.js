angular.module('app').controller('rmMainCtrl', [ '$scope', '$http', 'leafletData', function($scope, $http, leafletData) {

    function init() {
        var latinit;
        var longinit;
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
                                iconUrl: 'sailboat.png',
                                iconSize: [200],
                                iconAnchor:[80,112],
                                shadowUrl: 'sailboat_shadow.png',
                                shadowSize: [200],
                                shadowAnchor: [80,112],
                            }))
                            
                        }
                        else if(feature.properties.name != ''){
                            layer.setIcon(L.icon({
                                iconUrl: 'sailboatMediumRed.png',
                                iconSize: [100],
                                iconAnchor:[40,56],
                                shadowUrl: 'sailboat_shadowMedium.png',
                                shadowSize: [100],
                                shadowAnchor: [40,56],
                            }))
                        }
                        else{
                            layer.setIcon(L.icon({
                                iconUrl: 'sailboatSmall.png',
                                iconSize: [50],
                                iconAnchor:[20,28],
                                shadowUrl: 'sailboat_shadowSmall.png',
                                shadowSize: [50],
                                shadowAnchor: [20,28],
                            }))
                        }
                    }
                }
                
            })
            
            
        });
        
        
        // place the map center to be first vlog position
        $scope.center = {     
            lat: 39.71105,
            lng: -91.35287,
            zoom: 9,
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
        setTimeout(init, 300000);
    }

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