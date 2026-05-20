import weatherService from '../services/weather'
import { useState, useEffect } from 'react'


const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)
    useEffect(() => {
      weatherService.getWeather(country.latlng[0], country.latlng[1])
        .then(weatherData => {
            console.log(weatherData)
          setWeather(weatherData)
        })
    }, [country.latlng])
    return (

    <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png}/>
        {weather && (
            <div>
                <h2>Weather in {country.capital}</h2>
                <p>Temperature: {weather.main.temp} °C</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
            </div>
        )}
    </div>     
    )
    }
export default Country