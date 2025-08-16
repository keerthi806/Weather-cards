import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function getCityInfo(cityId){
  const cityData = {
    name: document.querySelector('.js-city-name').textContent,
    temp: document.querySelector('.js-temp').textContent.trim(),
    description: document.querySelector('.js-description').textContent,
    weatherEmoji: document.querySelector('.js-emoji').textContent,
    recordedtime: formatTime(dayjs()),
    cityId
  }
  console.log(cityData);
  return cityData;
}

export function updateCardsHTML(){
  let cityCardHTML = '';

  let addedCities = JSON.parse(localStorage.getItem('addedCities')) || [];

  addedCities.forEach(city => {
    cityCardHTML += `
      <div class="city-data city-${city.cityId}">
        <h2 class="city-name">${city.name.toUpperCase()}</h2>
        <p class="temp cards-temp">
          <span class="js-card-temp-${city.cityId}">
            ${city.temp}
          </span>
          <button class="temp-change js-card-change-button" title="Change unit" data-city-id="${city.cityId}">
            <img src="change.png" alt="change temperature to Fahrenhite" class="card-change-img">
          </button>
        </p>
        <p class="clouds">${city.description}</p>
        <p class="emoji">${city.weatherEmoji}</p>
        <div class="recorded-time">
          <p>Recorded on:</p>
          <p class="time">${city.recordedtime}</p>
        </div>
        <button class="remove-card js-remove-card" data-city-id="${city.cityId}">Remove</button>
      </div>
    `;
  });

  document.querySelector('.js-cities-container').innerHTML = cityCardHTML;

  document.querySelectorAll('.js-remove-card').forEach(removeButton => {
    removeButton.addEventListener('click', () => {
      const cityId = Number(removeButton.dataset.cityId);
      //console.log(cityId, typeof(cityId));
      removeCity(cityId);
    });
  });

  document.querySelectorAll('.js-card-change-button').forEach(button => {
    button.addEventListener('click', () => {
      const cityId = button.dataset.cityId;
      changeTemperatureUnitCard(cityId);
    });
  });
}

export function removeCity(cityId){
  //console.log('removeCity()');
  let addedCities = JSON.parse(localStorage.getItem('addedCities'));

  let updatedCities = addedCities.filter(addedCity => addedCity.cityId !== cityId);
  
  addedCities = updatedCities;

  localStorage.setItem('addedCities', JSON.stringify(addedCities));

  updateCardsHTML();
  displayRemoveAllButton(addedCities);
}

export function displayRemoveAllButton(addedCities){
  if(addedCities.length === 0){
    document.querySelector('.js-remove-all').classList.remove('toggle-remove-all');
  } else {
    document.querySelector('.js-remove-all').classList.add('toggle-remove-all');
  }
}

function formatTime(dayjsObject){
  return dayjsObject.format('MMMM D, HH:mm');
}

function changeTemperatureUnitCard(cityId){
  const tempString = document.querySelector(`.js-card-temp-${cityId}`).textContent.trim();
  // console.log(tempString);
   if(tempString.includes('F')){
    const value = Number(tempString.slice(0, 5));
    const celsius = (value - 32) * 5 / 9;
    document.querySelector(`.js-card-temp-${cityId}`).textContent = `${celsius.toFixed(2)}°C`;
   }

   if(tempString.includes('C')){
    const value = Number(tempString.slice(0, 5));
    const fahrenhite = (value * 9 / 5) + 32;
    document.querySelector(`.js-card-temp-${cityId}`).textContent = `${fahrenhite.toFixed(2)}°F`;
   }
}
