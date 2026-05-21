import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (lat, lon) => {
  const get_url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
  return axios.get(get_url).then(response => response.data)
}

export default { getWeather }