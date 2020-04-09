var jsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//define function to set color based on what level of magnitude the earthquake had
function getColor(d) {
  return d <= 1 ? 'green' : // Means: if (d <= 1) return 'green' else…
    d <= 2 ? 'yellow' : // if (d <-2) return 'yellow' else etc…
    d <= 3 ? 'gold' :
    d <= 4 ? 'orange' : // Note that numbers must be in descending order
    'red'; //return red as final choice
};
    function createMap(earthquakedata) {

        // Create the tile layer that will be the background of our map
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
          maxZoom: 10,
          id: "mapbox.streets",
          accessToken: API_KEY
        });
      
        // Create a baseMaps object to hold the streetmap layer
        var baseMaps = {
          "street Map": streetmap
        };
      
        // Create an overlayMaps object to hold the earthquakedata layer
        var overlayMaps = {
          "earthquakes": earthquakedata
        };
      
        // Create the map object with options
        var map = L.map("map", {
          center: [39.8283, -98.5795],
          zoom: 5,
          layers: [streetmap, earthquakedata]
        });
      
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(map);
//set variable to create legend with the data
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'legend');
      labels = ['<strong>Categories</strong>'],
      categories = ['0-1','1-2','2-3','3-4','5+'];
  
    //cycle through the full length of the data, push for each one to show the color
      for (var i = 0; i < categories.length; i++) {
  
              div.innerHTML += 
              labels.push(
                  '<i class="circle" style="background:' + getColor(i+1) + '"></i> ' +
              (categories[i] ? categories[i] : '+'));
  
          }
          div.innerHTML = labels.join('<br>');
      return div;
      };
      legend.addTo(map);
    };
    //set function to create markers for teh data
      function createMarkers(data) {
      
      
        // Initialize an array to hold earthquake markers
        var quakeMarkers = [];
      
        // Loop through the earthquake array
        for (var index = 0; index < data.features.length; index++) {
            var location = data.features[index];
            var utcSeconds = location.properties.time
            //convert date information
            var d = new Date(0)
            d.setUTCSeconds(utcSeconds);
          // For each incident, create a marker and bind a popup with the earthquake location
          var quakeMarker = L.circleMarker([location.geometry.coordinates[1], location.geometry.coordinates[0]],
          {
            color: getColor(location.properties.mag),
            fillColor: getColor(location.properties.mag),
            fillOpacity: 0.5,
            radius: location.properties.mag*4
          })
          //set values to be displayed on popup
          .bindPopup("<h3>" + location.properties.place + "</h3><h3>Magnitude: " + location.properties.mag + "</h3><h3>date: "+d);
    
        // Add the marker to the quakemarkers array
        quakeMarkers.push(quakeMarker);
        }
      
        // Create a layer group made from the quakemarkers array, pass it into the createMap function
        createMap(L.layerGroup(quakeMarkers));
      }

      // Perform an API call to the earthquake API to get earthquake information. Call createMarkers when complete
d3.json(jsonUrl, createMarkers);

