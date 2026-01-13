import './App.css'
import { useNavigate } from "react-router";
import killers from "./assets/killers.json";

export default function App() {
  let navigate = useNavigate();

  let availableGame = localStorage.getItem("history") !== null;

  function handleNewGame() {
    navigate("/menu");
    localStorage.clear();
    localStorage.setItem("balance", "20");
    let killerStates = Object.fromEntries(
      Object.keys(killers).map(killer => [killer, {state: "Alive"}])
    );
    localStorage.setItem("killerStates", JSON.stringify(killerStates));
  }

  return (
    <>
      <h1>Hardcore Killer</h1>
      <h2>Blood Money</h2>
      <div className="card">
        <button className="button" onClick={() => handleNewGame()}>
          New Game
        </button>
        <button disabled={!availableGame} className="button" onClick={() => {navigate("/menu")}}>
          Continue Game
        </button>
      </div>
    </>
  )
}