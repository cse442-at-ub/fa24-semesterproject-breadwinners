import { useState } from 'react';
import './App.css';
import HomePage from './components/home-page/HomePage';
import LandingPage from './components/landing-page/landing-page';
import RecentPurchase from './components/recent-purchase/recent-purchase';
import SellerDashboard from './components/seller-dashboard/seller-dashboard';
import Settings from './components/settings/settings';
import ShoppingCart from './components/shopping-cart/CartPage';
import LoginPage from './components/Login/LoginPage';
import RegisterPage from './components/Register/RegisterPage';
import BookPage from './components/book-page/BookPage'; // Import BookPage component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);
  const getBaseName = () => {
    const fullPath = window.location.pathname;
    const lastSlashIndex = fullPath.lastIndexOf('/');
    return fullPath.slice(0, lastSlashIndex + 1); 
  };

  return (
    <Router basename={getBaseName()}> {/* Add basename to handle the base URL */}
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
          <Route path="/book/:id" element={<BookPage />} /> {/* New Route for BookPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
