//jshint elision: true
//jshint esversion: 9

/*
Author: Anthony Noel

This page uses an API call combined with the long/latitude from the navigator item or an ip-lookup to
get geo info from the user's browser
*/

//Used to hold the section elements
leftSection = document.querySelector("section[data-left]");
rightSection = document.querySelector("section[data-right]");
//Used to hold the Longitudeand latitudeinfo
let long, lat;
//api key
let apiKey = "RESYC64ZVJGVT8HRCKRBIK0QDJOBGZMQ";


const displayUserInfo = (userInfoObject) => {
  //Get all the DOM elements
  console.log(userInfoObject);
  const [regionEle, countryEle, cityEle, longEle, latEle] = leftSection.querySelectorAll("h2");
  const [currencyEle, sunriseEle, sunsetEle] = rightSection.querySelectorAll("h2");

  //update the textcontent of the elements
  Object.values(userInfoObject).forEach((value,index) => {
    if(  [countryEle,regionEle,cityEle,longEle,latEle,,currencyEle,,sunriseEle,sunsetEle][index]) {//if it exists
    [countryEle,regionEle,cityEle,longEle,latEle,,currencyEle,,sunriseEle,sunsetEle][index].textContent = `${[countryEle,regionEle,cityEle,longEle,latEle,,currencyEle,,sunriseEle,sunsetEle][index].textContent} ${value}`;
    }
  });



  // [countryEle,regionEle,cityEle,longEle,latEle,,currencyEle,,sunriseEle,sunsetEle].textContent = Object.values(userInfoObject);
};

const getUserInfo = ( position) => {
  //use the navigator geolocation object to get coordinate info
  [long, lat] = [position.coords.longitude, position.coords.latitude];
  console.log(long,lat);

  //Get endpoint
  let endpoint = `https://api.geodatasource.com/city?key=${apiKey}&format=json&lat=${lat}&lng=${long}`;
  //Use the long,lat vars to do an api call to get more info to populate the DOM
  console.log(endpoint);
  fetch("https://cors-anywhere.herokuapp.com/"+endpoint,
     {
       method: 'GET',
       headers: {

        'Content-type': 'application/json;charset=utf-8',
        'Accept': 'application/json',

        'Access-Control-Allow-Credentials': 'true'
       }
      })
  .then(response => response.json())
  .then(result => {
    displayUserInfo({...result});

  });
};


const getLongLat = async() => {

  //Get the endpoint
  const endpoint = "https://extreme-ip-lookup.com/json/";
  //Do a api call wih the endpoint
  const position = await fetch(endpoint)
  .then(response => response.json())
  .then(result => {
    [long,lat] = [result.lon,result.lat];
    //console.log(long,lat);
    //make a position object that can be passed to getuserinfo
    return {
      coords: {longitude: long, latitude: lat}
    };
  }
  );
  //Return the position object
  return position;
};



const initPage = async() => {
  //Check to see if the navegator works, if not alert the user and use a geolo api
  if(navigator.geolocation) navigator.geolocation.getCurrentPosition(getUserInfo);
  //Use the other api call to get the longitude and latitude info and alert the user
  else {
      alert("Your geolocation isn't functioning and the info displayed might not be as accurate!");
      getUserInfo(await getLongLat());
  }
};

initPage();
