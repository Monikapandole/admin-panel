// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Users from './pages/Users';
import './App.css';
import Category from './pages/Category';
import PropertyListPage from './pages/property';
import AddPropertyForm from './components/propertyDetails/addPropertyForm';
import PropertyViewPage from './components/propertyDetails/PropertyViewPage';

function App() {
  return (
    <Router>
      <div className="app">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<Users />} />
              <Route path="/properties" element={<PropertyListPage />} />
              <Route path="/add-property" element={<AddPropertyForm />} />
              <Route path="/property/:id" element={<PropertyViewPage />} />
              <Route path="/edit-property/:id" element={<AddPropertyForm />} />

            </Routes>
          </div>
      </div>
    </Router>
  );
}

export default App;
