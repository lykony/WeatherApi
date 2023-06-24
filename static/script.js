const apikey = "7633072951954c44a4b121241231006";
const dropdown = document.getElementById('dropdown');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const content = document.getElementById("content");
const body = document.body;

const forecastDays = 7; // Максимальна кількість днів для прогнозу

getWeather("London");

dropdown.addEventListener('change', function () {
    const selectedOption = dropdown.value;
    getWeather(selectedOption);
});

searchBtn.addEventListener('click', function () {
    const searchCity = searchInput.value;
    if (searchCity.trim() !== '') {
        getWeather(searchCity);
    }
});

function getWeather(city) {
    const updatedUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=${forecastDays}&aqi=yes`;
    fetch(updatedUrl)
        .then(res => {
            if (!res.ok) {
                throw new Error('Помилка отримання даних погоди');
            }
            return res.json();
        })
        .then(data => fillPage(data))
        .catch(error => {
            content.innerHTML = `<p>${error.message}</p>`;
        });
}

function fillPage(data) {
    const forecast = data.forecast.forecastday;

    let forecastHTML = '';
    forecast.forEach((day, index) => {
        const dynamicColor = setBackgroundColor(day.day.condition.text, day.day.is_night);
        forecastHTML += `
            <div class="weather" style="background-color: ${dynamicColor}">
                <h3>${day.date}</h3>
                <img src="https:${day.day.condition.icon}" />
                <p>Cloudiness: ${day.day.condition.text}</p>
                <p>Temperature: ${day.day.avgtemp_c}°C</p>
                <p>Wind speed: ${day.day.maxwind_kph} kph</p>
                <p>Precip: ${day.day.totalprecip_mm} mm</p>
                <p>Location: ${data.location.name}, ${data.location.country}</p>
                <button class="toggle-btn" data-forecast-id="${index}">Toggle Hourly Forecast</button>
                <div class="hourly-forecast" id="hourly-forecast-${index}"></div>
            </div>
        `;
    });

    content.innerHTML = forecastHTML;

    forecast.forEach((day, index) => {
        const toggleButton = document.querySelector(`[data-forecast-id="${index}"]`);
        const hourlyForecastContainer = document.getElementById(`hourly-forecast-${index}`);
        const hourlyForecast = day.hour;

        let hourlyForecastHTML = '';
        hourlyForecast.forEach(hour => {
            const dynamicColor = setBackgroundColor(hour.condition.text, hour.is_night);
            hourlyForecastHTML += `
                <div class="hourly-weather" style="background-color: ${dynamicColor}">
                    <h4>${hour.time}</h4>
                    <img src="https:${hour.condition.icon}" />
                    <p>Temperature: ${hour.temp_c}°C</p>
                    <p>Wind speed: ${hour.wind_kph} kph</p>
                    <p>Precip: ${hour.precip_mm} mm</p>
                </div>
            `;
        });

        hourlyForecastContainer.innerHTML = hourlyForecastHTML;
        hourlyForecastContainer.style.display = 'none'; // Hide hourly forecast by default

        toggleButton.addEventListener('click', function () {
            hourlyForecastContainer.style.display = hourlyForecastContainer.style.display === 'none' ? 'block' : 'none';
        });
    });
}

function setBackgroundColor(condition, isNight) {
    let color = '';
    switch (condition) {
      case 'Sunny':
        color = '#FFFF00'; // Gold
        break;
      case 'Clear':
        color = '#FFD700'; // Gold
        break;
      case 'Cloudy':
        color = '#808080'; // Gray
        break;
      case 'Partly cloudy':
        color = '#87CEEB'; // Sky Blue
        break;
      case 'Overcast':
        color = '#C0C0C0'; // Silver
        break;
      case 'Mist':
        color = '#A9A9A9'; // Dark Gray
        break;
      case 'Patchy rain possible':
        color = '#6495ED'; // Cornflower Blue
        break;
      case 'Patchy snow possible':
        color = '#FFFFFF'; // White
        break;
      case 'Patchy sleet possible':
        color = '#ADD8E6'; // Light Blue
        break;
      case 'Patchy freezing drizzle possible':
        color = '#E0FFFF'; // Light Cyan
        break;
      case 'Thundery outbreaks possible':
        color = '#800080'; // Purple
        break;
      case 'Blowing snow':
        color = '#FFFAFA'; // Snow
        break;
      case 'Blizzard':
        color = '#F8F8FF'; // Ghost White
        break;
      case 'Fog':
        color = '#D3D3D3'; // Light Grey
        break;
      case 'Freezing fog':
        color = '#DCDCDC'; // Gainsboro
        break;
      case 'Patchy light drizzle':
        color = '#708090'; // Slate Grey
        break;
      case 'Light drizzle':
        color = '#778899'; // Light Slate Gray
        break;
      case 'Freezing drizzle':
        color = '#F0F8FF'; // Alice Blue
        break;
      case 'Heavy freezing drizzle':
        color = '#FFFAF0'; // Floral White
        break;
      case 'Patchy light rain':
        color = '#87CEFA'; // Light Sky Blue
        break;
      default:
        color = isNight ? '#00008B' : '#FFFFFF'; // Темно-синій у нічний час, білий у денний час
        break;
    }
    return color;
  }
  
