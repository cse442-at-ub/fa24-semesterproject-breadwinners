import { useState } from 'react'
import bookstoreLogo from './assets/Bookshelf-3d-logo.svg' // Replace with your own bookstore image
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <img src={bookstoreLogo} className="logo" alt="Bookstore logo" />
      </div>
      <h1>Welcome to My Bookstore</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Books Added: {count}
        </button>
        <p>
          Click the button to count the number of books added.
        </p>
      </div>
      
      <p className="read-the-docs">
        Manage your bookstore inventory with ease.
      </p>
    </>
  )
}

export default App
