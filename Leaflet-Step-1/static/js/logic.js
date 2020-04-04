var jsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    function createMap(earthquakedata) {

        // Create the tile layer that will be the background of our map
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
          maxZoom: 5,
          id: "mapbox.streets",
          accessToken: API_KEY
        });
      
        // Create a baseMaps object to hold the lightmap layer
        var baseMaps = {
          "street Map": streetmap
        };
      
        // Create an overlayMaps object to hold the bikeStations layer
        var overlayMaps = {
          "earthquakes": earthquakedata
        };
      
        // Create the map object with options
        var map = L.map("map", {
          center: [40.73, -74.0059],
          zoom: 5,
          layers: [streetmap, earthquakedata]
        });
      
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(map);
      }
      
      function createMarkers(data) {
      
      
        // Initialize an array to hold bike markers
        var earthquakeArray = [];
        var quakeMarkers = [];
      
        // Loop through the stations array
        for (var index = 0; index < data.features.length; index++) {
            var location = data.features[index];
      
          // For each station, create a marker and bind a popup with the station's name
          var quakeMarker = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]],location.properties.mag*10000)
          .bindPopup("<h3>" + location.properties.place + "</h3><h3>Magnitude: " + location.properties.mag + "<h3>");
    
        // Add the marker to the bikeMarkers array
        quakeMarkers.push(quakeMarker);
        }
      
        // Create a layer group made from the bike markers array, pass it into the createMap function
        createMap(L.layerGroup(quakeMarkers));
      }

      // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(jsonUrl, createMarkers);

