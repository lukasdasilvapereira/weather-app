const searchinput = document.querySelector('.bar-nav');
const currentWeatherDIV = document.querySelector('.main-details');
const hourlyWeatherDIV = document.querySelector('.hour-list');

const API_KEY = "f03ef05f8f4043fabee183757251003"

const weathercodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246,1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
}

const displayHourlyForecast = (hourlyData) => {

    const currentHour = new Date().setMinutes(0, 0, 0)
    const next24hours = currentHour + 24 * 60 * 60 * 1000

    const next24Hoursdata = hourlyData.filter(({ time}) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24hours
    })

    hourlyWeatherDIV.innerHTML = next24Hoursdata.map(item => {
        const temperature = Math.floor(item.temp_c)
        const time = item.time.split(" ")[1].substring(0, 5)
        const weatherIcon = Object.keys(weathercodes).find(icon => weathercodes[icon].includes(item.condition.code))

        return `    <li class="hour-items">
                        <p>${time}</p>
                        <img src="weather-app-javascript-2024-08-10/icons/${weatherIcon}.svg" alt="image">
                        <p class="graus">${temperature}</p>
                    </li>`
    }).join("")
}

const getWeatherDetails = async (cityname) => {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityname}&days=2`

    try {
        const response = await fetch(API_URL)
        const data = await response.json()

        const temperature = Math.floor(data.current.temp_c)
        const description = data.current.condition.text
        const weatherIcon = Object.keys(weathercodes).find(icon => weathercodes[icon].includes(data.current.condition.code))

        currentWeatherDIV.querySelector(".weather-icon").src = `weather-app-javascript-2024-08-10/icons/${weatherIcon}.svg`
        currentWeatherDIV.querySelector(".temperatura").innerHTML = `${temperature}<span>°C</span>`
         currentWeatherDIV.querySelector(".descricao").innerText =
         description

         const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour]
        displayHourlyForecast(combinedHourlyData)
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

searchinput.addEventListener("keyup", (e) => {
    const cityname = searchinput.value.trim()

    if(e.key == "Enter" && cityname)  {
        getWeatherDetails(cityname)
    }
})