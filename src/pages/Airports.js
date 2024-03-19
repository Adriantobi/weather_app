import Nav from '../components/nav';
import WeatherApp from '../components/weather';
import styles from '../css/home.module.css';

function Airports() {
  return (
    <main className={styles.main}>
      <Nav />
      <WeatherApp page='airports' />
    </main> 
  );
}

export default Airports;
