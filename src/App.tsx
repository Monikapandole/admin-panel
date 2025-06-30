import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Category from './pages/Category';
import PropertyListPage from './pages/property';
import AddPropertyForm from './components/propertyDetails/addPropertyForm';
import PropertyViewPage from './components/propertyDetails/PropertyViewPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Area from './pages/Area';
import Tenant from './pages/Tenant';
import Blog from './pages/Blog';
import Policy from './pages/Policy';
import Terms from './pages/Terms';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(prev => !prev);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className=" flex">
                {/* Mobile Toggle Button */}
                <button
                  className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
                  onClick={toggleSidebar}
                  aria-label="Toggle navigation"
                >
                  <svg
                    className="w-6 h-6 text-[#D32F2F]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Sidebar (mobile toggle + always visible on md+) */}
                <Sidebar showSidebar={showSidebar} closeSidebar={closeSidebar} />
                <div className="content">
                  {/* Main Content */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/areas" element={<Area />} />
                    <Route path="/tenants" element={<Tenant />} />
                    <Route path="/blogs" element={<Blog />} />
                    <Route path="/policy" element={<Policy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/properties" element={<PropertyListPage />} />
                    <Route path="/add-property" element={<AddPropertyForm />} />
                    <Route path="/property/:id" element={<PropertyViewPage />} />
                    <Route path="/edit-property/:id" element={<AddPropertyForm />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
