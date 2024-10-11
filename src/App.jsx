
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/Homepage" element={<HomePage />} />
          <Route path="/recent-purchase" element={<RecentPurchase />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;