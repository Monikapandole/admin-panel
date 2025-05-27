import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaUsers, FaBlackberry, FaBuilding, FaSignOutAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // adjust path if different
import './Sidebar.css';

function Sidebar({ showSidebar, closeSidebar }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // redirect after logout
    closeSidebar(); // optional: close sidebar on logout
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${showSidebar ? 'block' : 'hidden'
          }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 
          z-50 w-64 h-screen bg-white shadow-md 
          transform transition-transform duration-300 ease-in-out 
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block
        `}
      >
        <div className="p-4 border-b flex items-center gap-3">
          <img src="https://i.pravatar.cc/50?img=3" alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <h4 className="font-semibold text-sm">David Grey. H</h4>
            <span className="text-xs text-gray-500">Project Manager</span>
          </div>
        </div>
        <ul className="menu p-4 space-y-3">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/" onClick={closeSidebar}><FaHome /> Dashboard</Link>
          </li>
          <li className={location.pathname === '/category' ? 'active' : ''}>
            <Link to="/category" onClick={closeSidebar}><FaBlackberry /> Category</Link>
          </li>
          <li className={location.pathname === '/areas' ? 'active' : ''}>
            <Link to="/areas" onClick={closeSidebar}>
              <FaMapMarkerAlt /> Areas
            </Link>
          </li>

          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users" onClick={closeSidebar}><FaUsers /> Users</Link>
          </li>
          <li className={location.pathname === '/properties' ? 'active' : ''}>
            <Link to="/properties" onClick={closeSidebar}><FaBuilding /> Properties</Link>
          </li>
          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings" onClick={closeSidebar}><FaCog /> Settings</Link>
          </li>
          <li className="text-red-600 hover:text-red-800 cursor-pointer  p-4">
            <div onClick={handleLogout} className="flex items-center gap-2">
              <FaSignOutAlt /> Logout
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
