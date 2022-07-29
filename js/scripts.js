const END_POINT_URL = "";
const TYPE_REQUEST = "GET";
const CIRCLE_RADIO = 200;
const ZOOM_MAP = 17;
const TIME_REFRESH = 5000000;

const closeAllInformation = document.getElementById("close-all-info");
const ALL_INFORMATION = document.getElementById("allprofiles");
let MOST_WANTED;
let pointer_img = "./img/ladron.png";
let map;
let userLocation;
let markers = [];


const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: ZOOM_MAP,
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

  let item = MOST_WANTED[i];

  profile_image = document.getElementById("profile_image");
  profile_image.style.backgroundImage = "url(" + item.foto_perfil + ")";

  profile_name = document.getElementById("profile_name");
  profile_name.innerHTML = item.nombre;
  profile_ak = document.getElementById("profile_ak");
  profile_ak.innerHTML = item.alias;
  profile_age = document.getElementById("profile_age");
  profile_age.innerHTML = item.edad;
  profile_type = document.getElementById("profile_type");
  profile_type.innerHTML = item.tipo_organizacion;
  profile_gang = document.getElementById("profile_gang");
  profile_gang.innerHTML = item.pandilla;
  profile_location = document.getElementById("profile_location");
  profile_location.innerHTML = item.direccion;
  profile_charact = document.getElementById("profile_charact");
  profile_charact.innerHTML = item.carac_fisicas;
  profile_special = document.getElementById("profile_special");
  profile_special.innerHTML = item.marcas_espec;

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

  MOST_WANTED.filter(function (elem, i) {

    list += '<div class="card mt-3 d-none" data-id="'+i+'">';
          list +=
            '<img onclick="ShowProfileDetail('+i+')" src="' + elem.foto_perfil + '" class="card-img-top" alt="...">';
          list += '<div class="card-body">';
            list +=
              '<h5 class="card-title text-center">' + elem.nombre + " " + elem.apellido +  '</h5>';
            list += '<div class="row">';
              list += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
                list += '<p class="text-center">';
                  list += "Fecha de nacimiento <br>" + elem.fecha_nacimiento;
                list += '</p>';
                list += '<p class="text-center">';
                  list += "Departamento <br>" + elem.departamento;
                list += '</p>';
              list += '</div>';
              list += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
                list += '<p class="text-center">';
                  list += "Años <br> " + elem.edad;
                list += '</p>';
                list += '<p class="text-center">';
                  list += "Colonia <br> " + elem.direccion;
                list += '</p>';
              list += '</div>';
            list += '</div>';
            list +=
              '<p onclick="ShowProfileDetail('+i+')" class="text-center bg-warning pt-2 pb-2">Alias: ' +elem.alias + "</p>";
            list += '<p class="card-text">' + elem.carac_fisicas + "</p>";
          list += '</div>';
        list += '</div>';
  });

  fullList.innerHTML = list;
}

function init() {
  const initialPosition = { lat: 59.3, lng: 17.7 };
  map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });
  const $info = document.getElementById("info");


  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      userLocation = { lat, lng };
      map.panTo({ lat, lng });

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

      getProfiles();


    },
    onError: (err) => {
      console.log($info);
      $info.textContent = `Error: ${
        err.message || getPositionErrorMessage(err.code)
      }`;
      $info.classList.add("error");
    },
  });



}

function setPointsForUser(){
  MOST_WANTED.filter(function (elem, i) {

    let location = {
      lat: parseFloat(elem.latitud),
      lng: parseFloat(elem.longitud),
    };

    let infowindow = new google.maps.InfoWindow({
      content:
        "<div class=infowindow><h1>" + elem.nombre + "</h1></div>",
    });
    pointer = new google.maps.Marker({
      position: location,
      map,
      title: elem.nombre + " " + elem.apellido,
      icon: pointer_img,
      content: infowindow,
      animation: google.maps.Animation.DROP,
    });

    pointer.addListener("click", () => {
      viewPoinerInfo(i);
    });

    markers.push(pointer);
  });
}


function getProfiles(){
  let required_positions = calculate_coords();

  $.ajax(END_POINT_URL, {
    type: TYPE_REQUEST,
    data: required_positions,
    success: function (data, status, xhr) {
      MOST_WANTED = data.area;
      if (MOST_WANTED) {
        fillProfilesData();
        setPointsForUser();
      }
    },
    error: function (jqXhr, textStatus, errorMessage) {
      console.log("ajax: Error" + errorMessage);
    },
  });
}

function calculate_coords(side){

  if (side=="CORNER") {

    const item = 155500;

    distanceA = parseFloat(userLocation.lat + CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng - CIRCLE_RADIO / item);

    let cc_one = {
      lat: distanceA,
      lng: distanceb,
    };

    pointer = new google.maps.Marker({
      position: cc_one,
      map,
    });

    distanceA = parseFloat(userLocation.lat + CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng + CIRCLE_RADIO / item);

    let cc_two = {
      lat: distanceA,
      lng: distanceb,
    };

    pointer = new google.maps.Marker({
      position: cc_two,
      map,
    });

    distanceA = parseFloat(userLocation.lat - CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng - CIRCLE_RADIO / item);

    let coords_three = {
      lat: distanceA,
      lng: distanceb,
    };

    pointer = new google.maps.Marker({
      position: coords_three,
      map,
    });

    distanceA = parseFloat(userLocation.lat - CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng + CIRCLE_RADIO / item);

    let coords_four = {
      lat: distanceA,
      lng: distanceb,
    };

    pointer = new google.maps.Marker({
      position: coords_four,
      map,
    });
  }else{
    const item = 111000;

    distanceA = parseFloat(userLocation.lat + CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng);

    let coords_uno = { lat: distanceA, lng: distanceb };

    /*
    pointer = new google.maps.Marker({
      position: coords_uno,
      map,
    });
    */

    distanceA = parseFloat(userLocation.lat);
    distanceb = parseFloat(userLocation.lng + CIRCLE_RADIO / item);

    let coords_dos = { lat: distanceA, lng: distanceb };

    /*
    pointer = new google.maps.Marker({
      position: coords_dos,
      map,
    });
    */

    distanceA = parseFloat(userLocation.lat - CIRCLE_RADIO / item);
    distanceb = parseFloat(userLocation.lng);

    let coords_tres = { lat: distanceA, lng: distanceb };

    /*
    pointer = new google.maps.Marker({
      position: coords_tres,
      map,
    });
    */

    distanceA = parseFloat(userLocation.lat);
    distanceb = parseFloat(userLocation.lng - CIRCLE_RADIO / item);

    let coords_cuatro = { lat: distanceA, lng: distanceb };

    /*
    pointer = new google.maps.Marker({
      position: coords_cuatro,
      map,
    });
    */


    return {
      LatIni : coords_uno,
      LatFin : coords_dos,
      LonIni : coords_tres,
      LonFin : coords_cuatro
    }
  }
}
