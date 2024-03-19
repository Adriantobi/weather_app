import dayjs from 'dayjs';
import { APIProvider, Marker, Map } from '@vis.gl/react-google-maps';
import { DropletsIcon, GaugeIcon, LocateFixedIcon, MapPinIcon, SearchIcon, SunriseIcon, SunsetIcon, ThermometerIcon, TowerControlIcon, WindIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from '../css/weather.module.css';

function Airports({ coords, radius }) {
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=airport&filter=circle:${coords.lon},${coords.lat},${radius*1000}&bias=proximity:${coords.lon},${coords.lat}&limit=50&apiKey=${process.env.REACT_APP_TOURIST_API_KEY}`);
        const data = await response.json();
        setAirports(data.features);
      } catch (error) {
        console.error('Error fetching airport locations:', error);
      }
    };
    fetchData();
  }, [coords, radius]);

  return(
    <div className={styles.airportsWrapper}>
      <h2>Airports Near Here</h2>
      <div className={styles.airportItemWrapper}>
        { airports.map((airport, index) => (
          <div className={styles.airportItem} key={index}>
            <TowerControlIcon strokeWidth={1.5} />
            <span>
              <p>{airport?.properties?.state}</p>
              <h3>{airport?.properties?.name}</h3>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MapItem({coords, radius, setPlace}) {
  const position = {lat: coords.lat, lng: coords.lon};
  const [touristLocations, setTouristLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${coords.lon},${coords.lat},${radius*1000}&bias=proximity:${coords.lon},${coords.lat}&limit=50&apiKey=${process.env.REACT_APP_TOURIST_API_KEY}`);
        const data = await response.json();
        setTouristLocations(data.features);
      } catch (error) {
        console.error('Error fetching tourist locations:', error);
      }
    };
    fetchData();
  }, [coords, radius]);

  return (
    <APIProvider apiKey={process.env.REACT_APP_MAPS_API_KEY}>
      <Map center={position} zoom={12} style={{'borderRadius': '5px', 'outline': 'none', 'borderTop': '0px', 'marginTop':'20px'}}>
        {touristLocations.map((location, index) => (
          <Marker key={index} onClick={() => setPlace(location)} position={{ lat: Number(location?.properties?.lat), lng: Number(location?.properties?.lon) }} />
        ))}
        <Marker position={position} />
      </Map>
    </APIProvider>
  )
}

function WeatherItem({icon, title, value}) {
  return (
    <div className={styles.weatherItemWrapper}>
      {icon}
      <div className={styles.weatherItemData}>
        <span>{title}</span>
        <span>{value}</span>
      </div>
    </div>
  )
}

function TodayOverview({weather}) {
  return (
    <div className={styles.overView}>
      <span className={styles.overViewTitle}>Today's Overview</span>
      <div className={styles.weatherItemContainer}>
        <WeatherItem icon={<WindIcon strokeWidth={1.5} />} title="Wind Speed" value={`${weather?.wind?.speed}m/s`} />
        <WeatherItem icon={<DropletsIcon strokeWidth={1.5} />} title="Humidity" value={`${weather?.main?.humidity}%`} />
        <WeatherItem icon={<GaugeIcon strokeWidth={1.5} />} title="Pressure" value={`${weather?.main?.pressure} hPa`} />
        <WeatherItem icon={<ThermometerIcon strokeWidth={1.5} />} title="Feels Like" value={`${weather?.main?.feels_like}° C`} />
      </div>
    </div>
  )
}

function SunComponent({time, sunrise, timezone}) {
  const date = new Date();
  const sunTime = Math.floor(((Date.parse(date)/1000)-time-(timezone/3600))/3600);
  return (
    <div className={styles.sunTimeItemWrapper}>
      <div className={styles.sunItemData}>
        {sunrise ? <SunriseIcon strokeWidth={1.5} /> : <SunsetIcon strokeWidth={1.5} />}
        <span>
          <h3>{sunrise ? "Sunrise": "Sunset"}</h3>
          <p>{dayjs.unix(time).format('h:mm A')}</p>
        </span>
      </div>
      <div className={styles.timeAgo}>{sunTime === 0 ? `Now` : sunTime < 0 ? `in ${Math.abs(sunTime)} hours` : `${Math.abs(sunTime)} hours ago` }</div>
    </div>
  )
}

function WeatherInfo({ weather, place, size }) {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className={`${styles.weatherWrapper} ${size && size < 760 ?  `${styles.weatherUp}` : ''}`}>
      <div className={styles.weatherHeader}>
        <div className={styles.weatherLocation}>
          <span>{weather?.name}</span>
          <span>{weather?.sys?.country}</span>
        </div>
        <div className={styles.currentTime}>
          {dateState.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </div>
      </div>
      <div>
        <div>
          <img 
            src={`http://openweathermap.org/img/wn/${weather?.weather[0]?.icon}.png`}
            alt={`${weather?.weather[0]?.main} icon`} 
          />
          <div className={styles.weatherDetails}>
            <span className={styles.temperature}>{Math.round(Number(weather?.main?.temp))}° C</span>
            <span className={styles.weatherDescription}>{weather?.weather[0]?.description}</span>
          </div>
        </div>
        <span className={`${styles.weatherDivider} ${styles.divider}`} />
        <div className={styles.sunTiming}>
          <h2>Sunrise & Sunset</h2>
          <div className={styles.sunsetriseWrapper}>
            <SunComponent sunrise={true} time={weather?.sys?.sunrise} timezone={weather?.timezone} />
            <SunComponent sunrise={false} time={weather?.sys?.sunset} timezone={weather?.timezone} />
          </div>
        </div>
        { place !== null ?
          <>
            <span className={`${styles.weatherDivider} ${styles.divider}`} />
            <div className={styles.location}>
              <MapPinIcon strokeWidth={1.5} />
              <span>
                <h4>{place.properties.address_line1}</h4>
                <p>{place.properties.address_line2}</p>
              </span>
            </div>
          </>        
        : null }
      </div>
    </div>
  )
}


function RadiusInput({ setRadius }) {
  const [temp, setTemp] = useState(5);

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem('radius')) !== null) {
      setTemp(JSON.parse(sessionStorage.getItem('radius')))
    }
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setRadius(temp); // Call the setCity function with the entered city
    sessionStorage.setItem('radius', JSON.stringify(temp));
  };

  return (
    <form className={styles.searchWrapper} onSubmit={handleSubmit}>
      <LocateFixedIcon strokeWidth={1.5} />
      <input 
        type="number"
        min={5}
        max={1000}
        value={temp}
        className={styles.searchText} 
        onChange={(e) => setTemp(e.target.value)}
        placeholder="Radius"
      />
    </form>
  )
}

function SearchBar({ setCity, page }) {
  const [temp, setTemp] = useState('');
  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem('city')) !== null) {
      setTemp(JSON.parse(sessionStorage.getItem('city')))
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setCity(temp); // Call the setCity function with the entered city
  };

  return (
    <form className={styles.searchWrapper} onSubmit={handleSubmit}>
      <SearchIcon strokeWidth={1.5} />
      <input 
        type="text" 
        className={styles.searchText} 
        onChange={(e) => setTemp(e.target.value)}
        value={temp}
        placeholder={`Search ${page !== null ? page : `locations` } here`} 
      />
    </form>
  )
}

function Header({ setCity, setRadius, page }) {
  const date = new Date();

  return (
    <div className={styles.header}>
      <div className={styles.date}>
        <span>
          {date.toLocaleString('default', { month: 'long' }) +" "+ date.getFullYear()}
        </span>
        <span>
          {date.toDateString()}
        </span>
      </div>
      <div className={styles.locationSearch}>
        <SearchBar setCity={setCity} page={page} />
        {page !== null ? <RadiusInput setRadius={setRadius} /> : null}
      </div>
    </div>
  )
}


export default function WeatherApp({children, page}) {
  const [city, setCity] = useState('Epsom');
  const [radius, setRadius] = useState(5);
  const [weather, setWeather] = useState(null);
  const [place, setPlace] = useState(null);
  const [size, setSize] = useState()

  useEffect(() => {
    const resize = () => {
      setSize(window.innerWidth);
    }

    window.onload = resize()
    window.addEventListener('resize', resize)
  },[])

  useEffect(() => {
    setCity(JSON.parse(sessionStorage.getItem('city')) !== null ? JSON.parse(sessionStorage.getItem('city')) : getLocation());
    setRadius(JSON.parse(sessionStorage.getItem('radius')) !== null ? JSON.parse(sessionStorage.getItem('radius')) : 5);
  },[])
  
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_OPENWEATHERMAP_API_KEY`);
            const data = await response.json();
            return data.name;
          } catch (error) {
            console.error('Error fetching city:', error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      return 'Epsom';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setWeather(data);
        sessionStorage.setItem('city', JSON.stringify(city));
      } catch (error) {
        console.error('error fetching airport locations:', error);
      }
    }
    fetchData();
  },[city])


  return (
    <main className={styles.main}>
      <div className={`${styles.body} ${page === 'attractions' ? `${styles.mapHeight}` : ''}`}>
        <Header setCity={setCity} setRadius={setRadius} page={page ? page : null} />
        <span className={styles.divider} style={{'borderColor': size < 760 && !page ? 'transparent' : ''}} />
        {size < 760 && !page ? 
          <>
            <WeatherInfo weather={weather} place={page === 'attractions' ? place : null} size={size} />
            <span className={styles.divider} />
          </>
        : null}
        {!children && !page ? <TodayOverview weather={weather} /> : children}
        {page === 'attractions' ? <MapItem coords={weather?.coord ? weather?.coord : {lat:0.0, lon:0.0}} setPlace={setPlace} radius={radius} /> : null}
        {page === 'airports' ? <Airports coords={weather?.coord ? weather?.coord : {lat:0.0, lon:0.0}} radius={radius} /> : null}
      </div>
      {size > 760 || page ? <WeatherInfo weather={weather} place={page === 'attractions' ? place : null} /> : null}
    </main>
  )
}
