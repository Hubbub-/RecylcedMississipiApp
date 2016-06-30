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
                        fillColor: "green",
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    }
                }
            })
            
        });

        //place the map center to be first vlog position
        $scope.center = {     
            lat: 42.49517,
            lng: -90.65964,
            zoom: 14
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