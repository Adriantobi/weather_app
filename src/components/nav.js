import { HomeIcon, MapIcon, PlaneIcon, SettingsIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../css/nav.module.css';

export default function Nav() {
  const location = useLocation();

  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <img src="https://img.icons8.com/color-glass/48/windsock.png" alt="Logo" width={40} height={40} />
        <h1>Weather</h1>
      </div>
      <ul className={styles.menuOptions}>
        <li className={`${location.pathname === '/' ? styles.active : ''} ${styles.menuItem}`}><a href='/'><HomeIcon strokeWidth={1.5} /> Dashboard</a></li>
        <li className={`${location.pathname === '/attractions' ? styles.active : ''} ${styles.menuItem}`}><a href='/attractions'><MapIcon strokeWidth={1.5} /> Attractions</a></li>
        <li className={`${location.pathname === '/airports' ? styles.active : ''} ${styles.menuItem}`}><a href='/airports'><PlaneIcon strokeWidth={1.5} /> Airports</a></li>
      </ul>
      <ul className={`${styles.menuOptions} ${styles.optionsBottom}`}>
        <li className={styles.menuItem}><SettingsIcon strokeWidth={1.5} /> Settings</li>
      </ul>
    </div>
  )
}
