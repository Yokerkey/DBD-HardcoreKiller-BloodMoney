import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import perks from './assets/perks.json';
import './KillerSelection.css';

export default function PerkSelection() {
  let navigate = useNavigate();
  let maxPerks = 4;
  let selectedPerks = "selectedPerks";
  let getInitialActivePerks = (): Set<string> => {
    try {
      let stored = localStorage.getItem(selectedPerks);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }


  let [state, setState] = useState<Set<string>>(getInitialActivePerks());
  
  useEffect(() => {
    localStorage.setItem(selectedPerks, JSON.stringify(Array.from(state))
    );
  }, [state]);
  
  let toggleState = (key: string) => {
    setState(prev => {
      let next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        return next;
      }
      if (next.size >= maxPerks) {
        return prev;
      }
      
      next.add(key);
      return next;
    });
  }
  /*
  function toggleState() {
    if (state === "inactive") {
      setState("active");
    } else {
      setState("inactive");
    }
  }
    */
  function buttonHandler(perkName: string, cost: number) {
    localStorage.setItem("selectedPerk", perkName);
    localStorage.setItem("perkCost", cost.toString());
    navigate("/menu");
  }
  /*
  let perkList = [];
  for (let [key, value] of Object.entries(perks)) {
    perkList.push(
      <button className={state} key={key} onClick={() => toggleState()}>
        <img src={"/perks/" + key + ".webp"} className="logo" alt={key} />
        <p className="killerDescription">{key}</p>
        <p className="killerDescription">{value.cost}$</p>
      </button>
    );
  }
    */
  return (
    <>
        <div>
        <h1>Perk Selection Page</h1>
        <p>This is where users can select their perks.</p>
        </div>
        <div className="card">
            {/* {perkList} */}
            {Object.entries(perks).map(([key, perk]) => (
              <button key={key}
                className={state.has(key) ? "active" : "inactive"}
                onClick={() => toggleState(key)}>
                <img src={"/perks/" + key + ".webp"} className="logo" alt={key} />
                <p className="killerDescription">{key}</p>
                <p className="killerDescription">{perk.cost}$</p>
              </button>
            ))}
        </div>
        <div className="card">
            <button onClick={() => {navigate("/menu");}}>
            Back
            </button>
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