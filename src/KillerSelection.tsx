import { useNavigate } from "react-router";
import killers from './assets/killers.json';
import './KillerSelection.css';

export default function KillerSelection() {
  let navigate = useNavigate();
  function buttonHandler(killerName: string, cost: number) {
        localStorage.setItem("selectedKiller", killerName);
        localStorage.setItem("killerCost", cost.toString());
        navigate("/menu");
    }
  let killerList = [];
  for (let [key, value] of Object.entries(killers)) {
    killerList.push(
      <button key={key} onClick={() => buttonHandler(key, value.cost)}>
        <img src={"/killers/" + key + ".webp"} className="logo" alt={key} />
        <p className="killerDescription">{"The " + key}</p>
        <p className="killerDescription">Tier: {value.tier}</p>
        <p className="killerDescription">{value.cost}$</p>
      </button>
    );
  }
  return (
    <>
        <div>
        <h1>Killer Selection Page</h1>
        <p>This is where users can select their killer.</p>
        </div>
        <div className="card">
            {killerList}
        </div>
        <div data-reactroot className="footer">
            <button onClick={() => {navigate("/menu");}}>
            Back
            </button>
            <button disabled={true} onClick={() => {navigate("/menu");}}>
            Confirm
            </button>
        </div>
    </>
  )
}