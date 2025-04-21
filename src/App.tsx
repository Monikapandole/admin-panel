// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Users from './pages/Users';
import './App.css';
import Category from './pages/Category';

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
            </Routes>
          </div>
      </div>
    </Router>
  );
}

export default App;
