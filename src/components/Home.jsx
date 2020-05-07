import React, { useState } from 'react';
import wind from '../assets/wind.png';
import humidity from '../assets/humidity.png';
import sunrise from '../assets/sunrise.png';
import sunset from '../assets/sunset.png';
import { usePosition } from '../consts/usePosition';
import { dateBuilder } from '../consts/dateBuilder';
import { convertUnixToTime } from '../consts/convertUnixToTime';

export const Home = () => {

  const { latitude, longitude, error } = usePosition();
  // API info
  const api = {
    key: '12713ce52420589c2732fa06b705ae93',
    base: 'https://api.openweathermap.org/data/2.5/'
  }

  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState({})
  const [unit, setUnit] = useState('metric')
  const [outUnit, setOutUnit] = useState('')
  const [windUnit, setWindUnit] = useState('')

  console.log(weather)

  // Location finder
  const findUser = () => {

    fetch(`https://hendrik-cors-proxy.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result)
        setOutUnit(unit === "metric" ? "°C" : "°F");
        setWindUnit(unit === 'metric' ? 'M/S' : 'M/H');
      });

    if (error != null) {
      alert('Enable geolocation');
    }
  }
  // Search function
  const search = evt => {
    if (evt.key === 'Enter') {
      fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result)
          setQuery('')
          setOutUnit(unit === "metric" ? "°C" : "°F");
          setWindUnit(unit === 'metric' ? 'M/S' : 'M/H');
        });
    }
  }

  return (
    <div className="home">

      <main>
        {/* Search bar */}
        <div className='search-box'>
          <input
            type='text'
            className='search-bar'
            placeholder='Search...'
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>

        {/* Radio Buttons for C/F */}
        <div className="radioButtons">
          <input
            id="metricButton"
            type="radio"
            name="units"
            checked={unit === "metric"}
            value="metric"
            onChange={(e) => setUnit(e.target.value)}
          />
          <label htmlFor="metricButton">°C</label>
          <input
            id="imperialButton"
            type="radio"
            name="units"
            checked={unit === "imperial"}
            value="imperial"
            onChange={(e) => setUnit(e.target.value)}
          />
          <label htmlFor="imperialButton">°F</label>
        </div>

        {/* Button "Find current position" */}
        <button className="button" onClick={findUser}>Find your location</button>
        {(typeof weather.main != 'undefined') ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>

            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}{outUnit}
              </div>

              <div className="weather">{weather.weather[0].main}</div>


              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather-icon"></img>


              <div className="icon-row">
                <div className="wind-force"><img src={wind} alt="wind-icon" />
                  {Math.round(weather.wind.speed)} {windUnit}
                </div>

                <div className="humidity"> <img src={humidity} alt="humidity-icon" />
                  {Math.round(weather.main.humidity)}%
                </div>

                <div className="sunrise"> <img src={sunrise} alt="sunrise-icon" /> {convertUnixToTime(weather.sys.sunrise)}
                </div>

                <div className="sunset"> <img src={sunset} alt="sunset-icon" /> {convertUnixToTime(weather.sys.sunset)}
                </div>
              </div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}
export default Home;
