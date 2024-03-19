import Nav from '../components/nav';
import WeatherApp from '../components/weather';
import styles from '../css/home.module.css';

function Attractions() {
  return (
    <main className={styles.main}>
      <Nav />
      <WeatherApp page='attractions' />
    </main> 
  );
}

export default Attractions;
