




//make the filter image a button to make the filter options slide over
// jquery function to slidetoggle
//
$(function()
{
  $("#filter-button").click( function(){
    $(".filter-options").toggle('slide' );
    return false;
  });
});

$(function()
{
  $("#arrow-hide").click( function(){
    $(".filter-options").toggle('slide' );
    return false;
  });
});

//add key event listeners for the elements with aria role = button
let filterButton = document.getElementById('filter-button');
let hideFilterOptions = document.getElementById('arrow-hide');
// when space or enter is hit on keyboard, the element will react the same way as when a click event happens
filterButton.addEventListener('keydown', function (e) {
  // see comment above setMarketIconKeyEvents, it is most likely that the user will go to the markers
  // after passing the filter element
  if (e.key === 'Enter' || e.key === ' ') {
    $(".filter-options").toggle('slide' );
    $("#neighborhoods-select").focus();
  }
});

hideFilterOptions.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    $(".filter-options").toggle('slide' );
    let firstMarker = document.getElementsByClassName('leaflet-marker-icon')[0];
    firstMarker.focus();
    }
});



function setMarkerAriaRole () {
  let markerIcons = document.getElementsByClassName('leaflet-marker-icon');
  for (let i = 0; i<markerIcons.length; i++) {
    let marker = markerIcons[i];
    marker.setAttribute('role','link')
  }
}




let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoibWV3b3RlcmhhZ2VuIiwiYSI6ImNqdndrM21zNjQwOHo0NHJ0aHQ0azhvb3EifQ.Sa_KE3u3g0OAzgd2vhmmIA',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);
  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const tile = document.createElement('div');
  tile.className = 'restaurant-tile';

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  tile.append(image);

  const divForBackGround = document.createElement('div');
  divForBackGround.className = 'restaurant-details-tile';
  divForBackGround.style.backgroundColor = 'white';
  tile.append(divForBackGround);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  name.style.marginTop = '0';
  divForBackGround.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  divForBackGround.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  divForBackGround.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('aria-label', 'view details of ' + restaurant.name)
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.style.fontWeight = '900';
  divForBackGround.append(more)

  return tile
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    marker.on('keypress', function (e) {
      if (e.originalEvent.key === 'Enter' || e.key === ' ') {
        window.location.href = marker.options.url;
      }
    });
    self.markers.push(marker);
  });
  setMarkerAriaRole();

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */

// sregister the serviceworker if browser supports it

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('js/sw/index.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}


//Because the map is drawn in a script that is reached via internet I can not set the attributes of this map.
//For this reason I first call the element when it's drawn to adapt it.
// instead of giving the element the right attribute before it is appended.
window.onload = () => {
  let zoomIn = document.getElementsByClassName('leaflet-control-zoom-in')[0];
  let zoomOut = document.getElementsByClassName('leaflet-control-zoom-out')[0];
  zoomIn.setAttribute('tabindex', '3');
  zoomOut.setAttribute('tabindex','4');
};


