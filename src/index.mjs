import "./styles.css";
const apiKey = '28719ef4fd00adec7e0aa07fe25fb4cc';
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".weather_search");
const weatherCity = document.querySelector(".weather_city");
const weatherDay = document.querySelector(".weather_day");
const weatherHumidity = document.querySelector(".humidity .value");
const weatherWind = document.querySelector(".wind .value");
const weatherPressure = document.querySelector(".pressure .value");
const weatherImage = document.querySelector(".weather_image");
const weatherTemperature = document.querySelector(".weather_temperature .value");
const forecastItems = document.querySelectorAll(".weather_forcast_items");

// Function to fetch and display weather data
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    const data = await response.json();

    // Update weather data in the HTML
    weatherCity.textContent = data.name;
    weatherDay.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });
    weatherHumidity.textContent = data.main.humidity;
    weatherWind.textContent = data.wind.speed;
    weatherPressure.textContent = data.main.pressure;
    weatherImage.src = `/src/assets/${data.weather[0].icon}.png`;
    weatherTemperature.textContent = data.main.temp;

    // Fetch and display forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`
    );
    const forecastData = await forecastResponse.json();

    // Get the forecast interval from the API response
    const forecastInterval = forecastData.list[1].dt_txt - forecastData.list[0].dt_txt;

    // Get the next seven days
    const today = new Date();
    const startIndex = Math.floor((today.getHours() * 60 + today.getMinutes()) / (forecastInterval / 60));
    const nextSevenDays = [];
    for (let i = startIndex; i < startIndex + 8; i++) {
      const nextDay = new Date(today);
      nextDay.setMinutes(today.getMinutes() + (i * (forecastInterval / 60)));
      nextSevenDays.push(nextDay);
    }

    // Update forecast data in the HTML
    forecastData.list.forEach((forecast, index) => {
      if (index < forecastItems.length) {
        const forecastDate = new Date(forecast.dt_txt);
        const forecastDay = nextSevenDays[index].toLocaleDateString('en-US', {
          weekday: 'long',
        });
        const forecastTemperature = forecast.main.temp;

        forecastItems[index].querySelector('.weather_forcast_day').textContent = forecastDay;
        forecastItems[index].querySelector('.weather_forcast_temperature .value').textContent = forecastTemperature;
        forecastItems[index].querySelector('.weather_forcast_icons').src = `/src/assets/${forecast.weather[0].icon}.png`;
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Event listener for the search input
searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value;
    fetchWeatherData(city);
  }
});