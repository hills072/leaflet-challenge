// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  console.log(data.features);

  createFeatures(data.features);

  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {

      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    //define marker color
    function markerColor(depth) {
      switch (true) {
        case depth < 0:
          return "lawngreen";
        case depth < 10:
          return "lime";
        case depth < 20:
          return "yellow";
        case depth < 30:
          return "orange";
        case depth < 40:
          return "orangered";
        case depth >= 40:
          return "red";
      }

    }

    //define marker radius
    function markerRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 4;
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {

      pointToLayer: function (earthquakeData, latlng) {

        return L.circleMarker(latlng, {

          opacity: 1,
          fillOpacity: 1,
          radius: markerRadius(earthquakeData.properties.mag),
          color: "white",
          weight: 1,
          fillColor: markerColor(earthquakeData.geometry.coordinates[2]),
          stroke: true,

        });
      },
      onEachFeature: onEachFeature
    });

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "?? <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ?? <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery ?? <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });

    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };

    var overlayMaps = {
      Earthquakes: earthquakes
    };

    // Create map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    // Display layer controls
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Create legend
    var legend = L.control({
      position: "bottomright"
  });

  // The code below is attributed to group member and class teammate 'Sharon'
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var labels = ["Earthquake Depth"]
      var depths = [40, 30, 20, 10, 0, -10];
              
      depths.forEach(function(depth, index) {
          div.innerHTML+= 
          labels.push("<i class='rectangle' style = 'background: " + markerColor(depth) + "'>" + depth + " </i> kilometers"
          );           
      });
      div.innerHTML = labels.join("<br>");
      return div;
  };

    legend.addTo(myMap)
  }
});
