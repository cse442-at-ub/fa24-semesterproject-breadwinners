import { useState } from 'react'
import bookstoreLogo from './assets/Bookshelf-3d-logo.svg' // Replace with your own bookstore image
import './App.css'
import LoginPage from './components/Login/LoginPage';
import CartPage from './Cart/CartPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CartPage/>
      </div>
    </>
  )
}

export default App
