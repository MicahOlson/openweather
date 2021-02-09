import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

$(document).ready(function () {
  $('#weatherLocation').click(function (event) {
    event.preventDefault();
    const searchType = $('input[name=searchType]:checked').val();
    const location = $('#location').val();
    const unit = $('#tempSelect').val();

    let locParam;
    let latLon;
    switch (searchType) {
    case "1":
      locParam = "q=" + location;
      break;
    case "2":
      locParam = "zip=" + location;
      break;
    case "3":
      latLon = location.split(",");
      locParam = "lat=" + latLon[0].trim() + "&lon=" + latLon[1].trim();
      break;
    }

    let unitTranslated;
    switch (unit) {
    case ('standard'):
      unitTranslated = 'Kelvin';
      break;
    case ('metric'):
      unitTranslated = 'Celcius';
      break;
    default:
      unitTranslated = 'Fahrenheit';
    }

    $('#location').val("");
    $('#tempSelect').val("");

    let request = new XMLHttpRequest();
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?${locParam}&units=${unit}&appid=${process.env.API_KEY}`;
    const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?${locParam}&units=${unit}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", weatherURL, true);
    request.send();
    let getElements = function (response) {
      $('.showHumidity').text(`The humidity in ${location} is ${response.main.humidity}%`);
      $('.showTemp').text(`The temperature in ${unitTranslated} is ${response.main.temp} degrees.`);
    };
    if ($("#forecast").prop("checked")) {
      request.open("GET", forecastURL, true);
      request.send();
      getElements = function (response) {
        // logic for forecast data to come
      };
    }

  });
});