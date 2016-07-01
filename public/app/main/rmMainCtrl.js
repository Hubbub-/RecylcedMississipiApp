angular.module('app').controller('rmMainCtrl', function($scope, $http, leafletData) {

    function init() {
        var latinit;
        var longinit;
        $http.get("/geo.geojson").success(function(data, status) {
            // latinit = data.features[i].geometry.coordinates[1];
            // longinit = data.features[i].geometry.coordinates[0];
            
            angular.extend($scope, {
                geojson: {
                    data: data,
                    style: {
                        fillColor: "pink",
                        weight: 2,
                        opacity: 0.5,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7,
                    },
                    
                    
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.name);
                        layer.setIcon(L.icon({
                            iconUrl: 'sailboat.png',
                            iconSize: [100],
                            shadowUrl: 'sailboat_shadow.png',
                            shadowSize: [100],
                        }))
                    },
                    
                }
                
            })
            
            
        });
        
        
        //place the map center to be first vlog position
        $scope.center = {     
            lat: 42.07165,
            lng: -90.17184,
            zoom: 10
        };
        
        $scope.centerJSON = function() {
            leafletData.getMap().then(function(map) {
                var latlngs = [];
                for (var i in $scope.geojson.data.features) {
                    var coord = $scope.geojson.data.features[i].geometry.coordinates;
                    for (var j in coord) {
                        var points = coord[j];
                        for (var k in points) {
                            latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
                        }
                    }
                }
                map.fitBounds(latlngs);
            });
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

    init();
});