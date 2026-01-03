import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from "react-router";

export default function App() {
  const [count, setCount] = useState(0)
  let navigate = useNavigate();

  return (
    <>
      <h1>Hardcore Killer</h1>
      <h2>Blood Money</h2>
      <div className="card">
        <button className="button" onClick={() => {navigate("/menu");}}>
          New Game
        </button>
        <button disabled={true} className="button" onClick={() => null}>
          Continue Game
        </button>
      </div>
    </>
  )
}