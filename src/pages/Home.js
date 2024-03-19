import Nav from '../components/nav';
import WeatherApp from '../components/weather';
import styles from '../css/home.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <Nav />
      <WeatherApp />
    </main> 
  );
}

export default Home;
