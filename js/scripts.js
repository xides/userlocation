const ENDPOINT = "https://api.publicapis.org/entries";
const closeAllInformation = document.getElementById("close-all-info");
const CIRCLE_RADIO = 300;
const TIME_REFRESH = 99999;
const ALL_INFORMATION = document.getElementById("allprofiles");
const BURGLARS = [
  /* Loaded by API  */
  [{ lat: 13.6977923, lng: -89.1911526 }, "Nombre de Prueba A", "11.jpg"],
  [{ lat: 13.6966823, lng: -89.1902526 }, "Nombre de Prueba B", "22.jpg"],
];

const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 15,
  });
};

const createMarker = ({ map, position }) => {
  return new google.maps.Marker({ map, position });
};

const trackLocation = ({ onSuccess, onError = () => {} }) => {
  if ("geolocation" in navigator === false) {
    return onError(new Error("Geolocation is not supported by your browser."));
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,

    timeout: TIME_REFRESH,
    maximumAge: 0,
  });
};

const getPositionErrorMessage = (code) => {
  switch (code) {
    case 1:
      return "Permission denied.";
    case 2:
      return "Position unavailable.";
    case 3:
      return "Timeout reached.";
  }
};

function toggleInformation() {
  ALL_INFORMATION.classList.toggle("d-none");
}

function viewPoinerInfo(i) {

  let items = document.getElementsByClassName("card");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.add("d-none");
  }

  toggleInformation();
  let profileSelected = document.querySelector('[data-id="'+i+'"]');
  profileSelected.classList.remove("d-none");
}

function ShowProfileDetail(i){
  Fancybox.show([{ src: "#dialog-content", type: "inline" }]);

  let item = BURGLARS[i];

  profile_image = document.getElementById("profile_image");
  profile_image.style.backgroundImage = "url(./img/" + item[2] + ")";

  profile_name = document.getElementById("profile_name");
  profile_name.innerHTML = item[1];
  profile_ak = document.getElementById("profile_ak");
  profile_ak.innerHTML = 'Lorem ipsum dolor sit';
  profile_age = document.getElementById("profile_age");
  profile_age.innerHTML = 'Tempor incididunt ut ';
  profile_type = document.getElementById("profile_type");
  profile_type.innerHTML = 'Quis nostrud exercita';
  profile_gang = document.getElementById("profile_gang");
  profile_gang.innerHTML = 'Consequat. Duis aute ';
  profile_location = document.getElementById("profile_location");
  profile_location.innerHTML = 'Cillum dolore eu fugi';
  profile_charact = document.getElementById("profile_charact");
  profile_charact.innerHTML = 'Proident, sunt in cul';
  profile_special = document.getElementById("profile_special");
  profile_special.innerHTML = 'Quis nostrud exercita';

}

function showAllProfiles(){
  let items = document.getElementsByClassName("card");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("d-none");
  }
}


function fillProfilesData(){
  let list = '';
  let fullList = document.getElementById("fullList");
  BURGLARS.filter(function (elem, i) {

    list += '<div class="card mt-3 d-none" data-id="'+i+'">';
          list += '<img onclick="ShowProfileDetail('+i+')" src="./img/' + elem[2]+ '" class="card-img-top" alt="...">';
          list += '<div class="card-body">';
            list += '<h5 class="card-title text-center">'+elem[1]+'</h5>';
            list += '<div class="row">';
              list += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
                list += '<p class="text-center">';
                  list += 'Fecha de nacimiento <br> aaa bbb';
                list += '</p>';
                list += '<p class="text-center">';
                  list += 'Departamento <br> aaa bbb';
                list += '</p>';
              list += '</div>';
              list += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
                list += '<p class="text-center">';
                  list += 'Años <br> aaa bbb';
                list += '</p>';
                list += '<p class="text-center">';
                  list += 'Colonia <br> aaa bbb';
                list += '</p>';
              list += '</div>';
            list += '</div>';
            list += '<p onclick="ShowProfileDetail('+i+')" class="text-center bg-warning pt-2 pb-2">Alias: aliasDemo</p>';
            list += '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.';
          list += '</div>';
        list += '</div>';
  });
        list += list;
        list += list;
  fullList.innerHTML = list;
}

function init() {
  const initialPosition = { lat: 59.3, lng: 17.7 };
  const map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });
  const $info = document.getElementById("info");
  let userLocation;

  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      userLocation = { lat, lng };
      map.panTo({ lat, lng });
      // $info.appendChild( `Lat: ${lat.toFixed(5)} Lng: ${lng.toFixed(5)}` );
      // $info.classList.remove('error');

      cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "transparent",
        fillOpacity: 0.35,
        map,
        center: userLocation,
        radius: CIRCLE_RADIO,
      });

      /* Targets */
      let image = "./img/ladron.png";

      BURGLARS.filter(function (elem, i) {
        // let location = { lat: elem[0].lat, lng: elem[0].lng };
        let location = {
          lat: userLocation.lat + i / Math.random() / 1779,
          lng: userLocation.lng + i / Math.random() / 1347,
        };

        let infowindow = new google.maps.InfoWindow({
          content:
            "<div class=infowindow><h1>Leeds</h1><p>Population: 715,402</p></div>",
        });
        pointer = new google.maps.Marker({
          position: location,
          map,
          title: elem[1],
          icon: image,
          content: infowindow,
          animation: google.maps.Animation.DROP,
        });

        pointer.addListener("click", () => {
          viewPoinerInfo(i);
        });
      });
    },
    onError: (err) => {
      console.log($info);
      $info.textContent = `Error: ${
        err.message || getPositionErrorMessage(err.code)
      }`;
      $info.classList.add("error");
    },
  });



  fillProfilesData();
}


function getJSON(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";

  xhr.onload = function () {
    var status = xhr.status;

    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };

  xhr.send();
};
getJSON(ENDPOINT, function (err, data) {
  if (err != null) {
    console.error(err);
  } else {
    console.log(data);
  }
});
