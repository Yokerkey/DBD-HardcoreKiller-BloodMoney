import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import perks from './assets/perks.json';
import './KillerSelection.css';

export default function PerkSelection() {
  let navigate = useNavigate();
  let selectedPerks = "selectedPerks";
  let loadoutPerks = "loadoutPerks";

  type activePerk = {
    name: string;
    cost: number;
  };
  //type selectedPerksType = [key: string, cost: number];

  /*
  let getInitialActivePerks = (): Set<string> => {
    try {
      let stored = localStorage.getItem(selectedPerks);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  }
    */


  let [state, setState] = useState<activePerk[]>(() => {
    try {
      let stored = localStorage.getItem(loadoutPerks);
      return stored ? JSON.parse(stored) as activePerk[] : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem(selectedPerks, JSON.stringify(state)
    );
  }, [state]);
  
  let maxPerks = 4;
  let toggleState = (name: string, cost: number) => {
    setState(prev => {
      let exists = prev.some(p => p.name === name);

      if (exists) {
        return prev.filter(p => p.name !== name);
      }
      if (prev.length >= maxPerks) {
        return prev;
      }
      
      return [...prev, {name, cost}];
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
  /*
  function buttonHandler(perkName: string, cost: number) {
    localStorage.setItem("selectedPerk", perkName);
    localStorage.setItem("perkCost", cost.toString());
    navigate("/menu");
  }
    */
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
            {Object.entries(perks).map(([key, perk]) => {
              let isActive = state.some(p => p.name === key);
              return (
                <button key={key}
                className={isActive ? "active" : "inactive"}
                onClick={() => toggleState(key, perk.cost)}>
                <img src={import.meta.env.BASE_URL + "/perks/" + key + ".webp"} className="logo" alt={key} />
                <p className="killerDescription">{key}</p>
                <p className="killerDescription">{perk.cost}$</p>
              </button>
            );
            })}
        </div>
        <div className="card">
            <button onClick={() => {navigate("/menu");}}>
            Back
            </button>
        </div>
        <div data-reactroot className="footer">
            <button onClick={() => {navigate("/menu");
              localStorage.removeItem(selectedPerks)
            }}>
            Back
            </button>
            <button onClick={() => {navigate("/menu");
              localStorage.setItem(loadoutPerks, localStorage.getItem(selectedPerks) || "");
            }}>
            Confirm
            </button>
        </div>
    </>
  )
}