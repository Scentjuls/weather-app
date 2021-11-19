/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Background from './assets/clouds.jpeg';
import SunBackground from './assets/sun.jpeg';

const Layout = () => {
    const [responseData, setResponseData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState('');

    const onChange = (e) => {
        setLocation(e.target.value);
        searchLocation(e.target.value);
    }

    function searchLocation(location) {
        fetch(`${process.env.REACT_APP_API_URL}/weather?q=${location}&appid=${process.env.REACT_APP_API_KEY}`,
        )
            .then(res => res.json())
            .then(response => {
                setResponseData(response)
                })
            .catch((error) => {
                console.log('err', error)
            })
    }

    function getLocation(coords) {
        setIsLoading(true);
        fetch(
               `${process.env.REACT_APP_API_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_API_KEY}`,
           )
            .then(res => res.json())
            .then(response => {
                setIsLoading(false);
                setResponseData(response)
               })
            .catch((error) => {
                   setIsLoading(false);
               })
    }

    useEffect(() => {
           if (navigator.geolocation) {
                navigator.geolocation.watchPosition(function (position) {
                getLocation(position.coords)
            });
        } 
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return <h1> loading</h1>
    } else {
return (
        <div className="weather-background" style={responseData?.main?.temp < 11 ? {background: `url(${SunBackground})`, color: 'black'} : {background: `url(${Background})`, color: 'white'}}>
           <div className="weather-card">
                <div className="first-section">
                    <h1 className="welcome"> Welcome,</h1>
            <h3 className="weather-like">What is the weather like today?</h3>
                     <p className="temperature">{Math.ceil(responseData?.main?.temp)} <sup>o</sup></p>
                <p> 
                    <p className="location">{responseData?.name}</p>
                {responseData.weather && responseData.weather.map((e) => (
                    <p key={e.id}>
                        <p className="">{e.description} </p>
                        <p> {e.main} </p>
                    </p>
                ))}
            </p>
                </div>
                <div className="second-section"> 
                    <form>
                        <input type="text" placeholder="another location" name="location" value={location} onChange={onChange} />
                        <input type="submit" value="submit" />
                    </form>

                    <hr />
                    <div>
                        <p>Weather details</p>
                        <div className="inline">
                            <span>Cloudy</span>
                            <span>{responseData?.clouds?.all}%</span>
                        </div>
                        <div className="inline">
                            <span>Humidity</span>
                            <span>{responseData?.main?.humidity}%</span>
                        </div>
                        <div className="inline">
                            <span>Wind</span>
                            <span>{responseData?.wind?.deg} <sup>o</sup></span>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
           
       </div>
           
        )
    }
}

export default Layout;
