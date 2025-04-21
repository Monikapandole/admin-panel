import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCog, FaUsers ,FaBlackberry} from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="profile">
        <img src="https://i.pravatar.cc/50?img=3" alt="User" />
        <div>
          <h4>David Grey. H</h4>
          <span>Project Manager</span>
        </div>
      </div>
      <ul className="menu">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/"><FaHome /> Dashboard</Link>
        </li>
        <li className={location.pathname === '/category' ? 'active' : ''}>
          <Link to="/category"><FaBlackberry /> Category</Link>
        </li>
        <li className={location.pathname === '/users' ? 'active' : ''}>
          <Link to="/users"><FaUsers /> Users</Link>
        </li>
        <li className={location.pathname === '/settings' ? 'active' : ''}>
          <Link to="/settings"><FaCog /> Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
