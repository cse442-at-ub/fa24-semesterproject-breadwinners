
import { useState } from 'react';
import './App.css';
import HomePage from './components/home-page/HomePage';
import LandingPage from './components/landing-page/landing-page';
import RecentPurchase from './components/recent-purchase/recent-purchase';
import SellerDashboard from './components/seller-dashboard/seller-dashboard';
import Settings from './components/settings/settings';
import ShoppingCart from './components/shopping-cart/shopping-cart';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage'


function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/CSE442/2024-Fall/cse-442y/" element={<LandingPage />} />
          <Route path="/CSE442/2024-Fall/cse-442y/Homepage" element={<HomePage />} />
          <Route path="/CSE442/2024-Fall/cse-442y/recent-purchase" element={<RecentPurchase />} />
          <Route path="/CSE442/2024-Fall/cse-442y/shopping-cart" element={<ShoppingCart />} />
          <Route path="/CSE442/2024-Fall/cse-442y/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/CSE442/2024-Fall/cse-442y/settings" element={<Settings />} />
          <Route path="/CSE442/2024-Fall/cse-442y/login" element={<LoginPage />} />
          <Route path="/CSE442/2024-Fall/cse-442y/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;