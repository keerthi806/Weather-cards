import { updateCardsHTML, getCityInfo, displayRemoveAllButton } from "./cards.js";

updateCardsHTML();

let addedCities = JSON.parse(localStorage.getItem('addedCities')) || [];

let cityId = JSON.parse(localStorage.getItem('cityId')) || 1;

displayRemoveAllButton(addedCities);

const apiKey = 'b923ad656c0ddc07d8ee6b9ea3044d94';
let timeoutId;

async function getWeatherData() {
  const city = document.querySelector('.js-city-input').value.trim().toLowerCase();

  if (!city) {
    errorHandler('"City name" cannot be empty');
    return;
  }

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

  if (!response.ok) {
    if (response.status === 404) {
      errorHandler('Please check the  city name');
      throw new Error('Check city name');
    }
    errorHandler('Unable to fetch data');
    throw new Error('Unable to fetch data');
  }

  const data = await response.json();
  generateCurrentDataHtml(data);
}

function generateCurrentDataHtml(weatherData) {
  console.log(weatherData);
  const { name: city,
    coord: { lon, lat },
    main: { temp, humidity, grnd_level: groundLevel, sea_level: seaLevel },
    sys: {country},
    weather: [{ description, id }] } = weatherData;

  let currentCityHtml = `
    <div class="current-data js-current-data">  
      <h2 class="city-name js-city-name">${city.toUpperCase()}, ${country}</h2>
      <p class="temp">
        <span class="js-temp">
          ${(temp - 273.15).toFixed(2)}°C
        </span>
          <button class="temp-change js-change-button" title="Change unit">
            <img src="change.png" alt="change temperature to Fahrenhite" class="change-img">
          </button>
      </p>
      <div class="lat-long-container">
        <p>Latitude: <span>${lat}</span></p>
        <p>Longitude: <span>${lon}</span></p>
      </div>
      <p class="sea-level">Sea level: <span>${getAltitude(groundLevel, seaLevel)}m</span></p>
      <p class="humidity">Humidity: <span>${humidity}%</span></p>
      <p class="clouds js-description">Clouds: ${description}</p>
      <p class="emoji js-emoji">${getWeatherEmoji(id)}</p>
    </div>
    <button class="add-city-button js-add-city">Add city</button>
  `;

  document.querySelector('.js-current-search').innerHTML = currentCityHtml;

  document.querySelector('.js-current-search').style.opacity = '1';

  document.querySelector('.js-current-data').style.background = backgroundColorPicker(temp);

  document.querySelector('.js-temp').style.color = temperatureColorPicker(temp);

  document.querySelector('.js-add-city').addEventListener('click', () => {
    const cityData = getCityInfo(cityId);

    addedCities.push(cityData);
    cityId += 1;

    localStorage.setItem('addedCities', JSON.stringify(addedCities));
    localStorage.setItem('cityId', JSON.stringify(cityId));

    updateCardsHTML();
    displayRemoveAllButton(JSON.parse(localStorage.getItem('addedCities')));
  });

  document.querySelector('.js-change-button').addEventListener('click', () => {
    changeTemperatureUnit(temp);
  });
}

function errorHandler(errorMessage) {
  const errorContainer = document.querySelector('.js-error');
  errorContainer.textContent = errorMessage;
  errorContainer.style.opacity = '1';

  timeoutId = setTimeout(() => {
    errorContainer.textContent = '';
    errorContainer.style.opacity = '0';
  }, 3000);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case (weatherId >= 200 && weatherId < 300):
      return "⚡⛈️";
    case (weatherId >= 300 && weatherId < 400):
      return "🌧️";
    case (weatherId >= 500 && weatherId < 600):
      return "🌧️";
    case (weatherId >= 600 && weatherId < 700):
      return "❄️";
    case (weatherId >= 700 && weatherId < 800):
      return "🌫️";
    case (weatherId === 800):
      return "☀️";
    case (weatherId >= 801 && weatherId < 810):
      return "☁️";
    default:
      return "❓";
  }
}

function backgroundColorPicker(temperature) {
  //console.log(temperature);
  if (temperature >= 303) {
    return 'linear-gradient(180deg, hsl(25, 100%, 60%), hsl(0, 100%, 50%))';
  } else if (temperature >= 293 && temperature < 303) {
    return 'linear-gradient(180deg, hsl(50, 100%, 70%), hsl(30, 100%, 60%))';
  } else if (temperature >= 283 && temperature < 293) {
    return 'linear-gradient(180deg, hsl(210, 100.00%, 80.00%), hsl(50, 100%, 85%))';
  } else if (temperature > 273 && temperature < 283) {
    return 'linear-gradient(180deg, hsla(210, 90.70%, 21.20%, 0.82), hsl(190, 100%, 70%))';
  } else if (temperature <= 273) {
    return 'linear-gradient(180deg, hsl(220, 100%, 40%), hsl(200, 100%, 75%))';
  }
}

function temperatureColorPicker(temperature) {
  if (temperature >= 303) {
    return 'hsl(0, 100%, 30%)';
  } else if (temperature >= 293 && temperature < 303) {
    return 'hsl(21, 70%, 51%)';
  } else if (temperature >= 283 && temperature < 293) {
    return 'hsl(189, 84.40%, 27.60%)';
  } else if (temperature > 273 && temperature < 283) {
    return 'hsl(196, 96%, 52%)';
  } else if (temperature <= 273) {
    return 'hsl(226, 89%, 53%)';
  }
}

function getAltitude(P, P0) {
  const T0 = 288.15;
  const L = 0.0065;
  const g = 9.81;
  const R = 8.314;
  const M = 0.029;

  const h = T0 / L * (1 - Math.pow((P / P0), ((R * L) / (g * M))));
  return Math.round(h);
}

function changeTemperatureUnit(temp){
  const tempString = document.querySelector('.js-temp').textContent.trim();

  if(tempString.includes('C')){
    const fahrenhite = ((temp - 273.15) * (9 / 5) + 32).toFixed(2);
    document.querySelector('.js-temp').textContent = `${fahrenhite}°F`;
  }
  
  if(tempString.includes('F')){
    const celsius = (temp - 273.15).toFixed(2);
    document.querySelector('.js-temp').textContent = `${celsius}°C`;
  }
}

document.querySelector('.js-get-button').addEventListener('click', () => {
  clearTimeout(timeoutId);
  // document.querySelector('.js-current-search').innerHTML = '';
  getWeatherData();  
  document.querySelector('.js-city-input').value = '';
  
});

document.querySelector('.js-remove-all').addEventListener('click', () => {
  localStorage.clear();
  document.querySelector('.js-cities-container').innerHTML = '';
  document.querySelector('.js-remove-all').classList.remove('toggle-remove-all');
});

document.querySelector('.js-city-input').addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    document.querySelector('.js-get-button').click();
  }
});
