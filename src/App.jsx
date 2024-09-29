import { useState } from 'react'
import bookstoreLogo from './assets/Bookshelf-3d-logo.svg' // Replace with your own bookstore image
import './App.css'
import LoginPage from './components/Login/LoginPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <LoginPage/>
      </div>
    </>
  )
}

export default App
