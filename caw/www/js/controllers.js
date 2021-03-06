angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ListCtrl', function($scope, Destinations) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  Destinations.all(function (destinations) {
    $scope.destinations = destinations.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  });
})

.controller('DestDetailCtrl', function($scope, $stateParams, $ionicLoading, Destinations) {
  Destinations.get($stateParams.destinationId, function (destination) {
    $scope.dest = destination;

    $scope.mapCreated = function (map) {
      $scope.map = map;

      // Center on the destination's position.
      var myLatlng = new google.maps.LatLng(
        destination.geocode.lat,
        destination.geocode.lng);

      var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
      });

      map.setCenter(myLatlng);
    };
  });
})

.controller('MapCtrl', function ($scope, Destinations, googleMaps, Location) {  
  googleMaps.mapsInitialized.then(function () {
    loadController();
  });

  function loadController() {
    $scope.monroeAnd4th = new google.maps.LatLng(44.564639,-123.262014);

    $scope.mapCreated = function(map) {
      $scope.map = map;

      Destinations.all(function (destinations) {
        var openWindow = undefined;

        for (var id in destinations) {
          var closure = function () {
            var dest = destinations[id];

            var position = new google.maps.LatLng(
              dest.geocode.lat,
              dest.geocode.lng);

            // Origins, anchor positions and coordinates of the marker
            // increase in the X direction to the right and in
            // the Y direction down.
            var starImage = {
              url: 'img/ionic/ios7-star-outline-red-small.png',
              // This marker is 32 pixels square.
              size: new google.maps.Size(32, 32),
              // The origin for this image is 0,0.
              origin: new google.maps.Point(0,0),
              // The anchor for this image is the center of the star.
              anchor: new google.maps.Point(16, 16)
            };

            var marker = new google.maps.Marker({
              position: position,
              map: map,
              title: dest.name,
              icon: starImage
            });

            var contentString = '<div id="content">'+
            '<h4 id="firstHeading" class="firstHeading">' + dest.name + '</h4>'+
            '<div id="bodyContent">'+
            '<pre>' + dest.summary + '</pre>'+
            '<p><a href="#/tab/map/destinations/' + dest.id + '">'+
            'View details</a></p>'+
            '</div>'+
            '</div>';

            var infoWindow = new google.maps.InfoWindow({
              content: contentString
            });

            google.maps.event.addListener(marker, 'click', function() {
              if (openWindow) {
                openWindow.close();
              }
              infoWindow.open(map,marker);
              openWindow = infoWindow;
            });        
          }(); // closure
        }

        styleMap($scope.map);

        var showLocation = function () {
          Location.setScope($scope);
          Location.startShowing($scope.map);
        };

        showLocation();

          // This doesn't fire the first view
        $scope.$on('$ionicView.enter', showLocation); 
        
        $scope.$on('$ionicView.leave', function(){
          Location.stopShowing();
        });
      });
    };
  }

  function styleMap(map) {

    // To help edit map styles:
    // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    //
    // Used Paulo Avila's work as a starting point, but changed 
    // pretty much everything a little bit.
    // * https://snazzymaps.com/style/15/subtle-grayscale
    // * Licensed under CC BY-SA 3.0
    var style = [
      {
        "featureType":"landscape", // blocks
        "stylers":[{"saturation":-100},{"lightness":-2},{"visibility":"on"}]
      },{
        "featureType":"poi", // businesses, mostly
        "stylers":[{"saturation":-100},{"lightness":61},{"visibility":"off"}]
      },{
        "featureType":"road.highway", // 3rd & 4th St
        "stylers":[{"saturation":-100},{"lightness": 20},{"visibility":"simplified"}]
      },{
        "featureType":"road.arterial",
        "stylers":[{"saturation":-100},{"lightness":20},{"visibility":"on"}]
      },{
        "featureType":"road.local", // Controls label color
        "stylers":[{"saturation":-100},{"lightness":20},{"visibility":"on"}]
      },{
        "featureType":"transit",
        "stylers":[{"saturation":-100},{"visibility":"simplified"}]
      },{
        "featureType":"transit.station.bus",
        "stylers":[{"visibility":"off"}]
      },{
        "featureType":"water",
        "elementType":"labels",
        "stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]
      },{
        "featureType":"water",
        "elementType":"geometry",
        "stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]
      }
    ];



    var styledMap = new google.maps.StyledMapType(style, {name: "CAW Map"});
    
    map.mapTypes.set('caw_map_style', styledMap);
    map.setMapTypeId('caw_map_style');
  }
})

.controller('AboutCtrl', function ($scope) {
  // Nothing at the moment
})

.controller('TopLevelController', function ($scope, $http) {
  // $http.get("config.json")
  // .success(function (data) {
  //   $scope.GoogleMapsApiKey = data.GoogleMapsApiKey;
  // });
});
