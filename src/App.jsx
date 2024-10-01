import { useState } from 'react'
import './App.css'
import RegisterPage from './components/Register/RegisterPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <RegisterPage/>
      </div>
    </>
  )
}

export default App