import { useNavigate } from "react-router";
import killers from './assets/killers.json';
import './KillerSelection.css';
import { useEffect, useState } from "react";

export default function KillerSelection() {
  let navigate = useNavigate();
  interface Killer {
    name: string;
    cost: number;
  }

  let killersArray: Killer[] = Object.entries(killers).map(([name, data]) => ({
    name,
    cost: data.cost,
  }));

  let [activeKiller, setActiveKiller] = useState<Killer | null>(() => {
    try {
      let stored = localStorage.getItem("loadoutKiller");
      return stored ? (JSON.parse(stored) as Killer) : null;
    } catch {
      return null
    }
  });

  useEffect(() => {
  /*
  let storedKillerString = localStorage.getItem("loadoutKiller");
  if (storedKillerString) {
    let storedKiller: Killer = JSON.parse(storedKillerString)
    setActiveKiller(storedKiller.name);
  }
    */

  if (activeKiller) {
    localStorage.setItem("selectedKiller", JSON.stringify(activeKiller));
  } else {
    localStorage.removeItem("selectedKiller");
  }
  }, [activeKiller]);

  let handleClick = (killer: Killer) => {
    setActiveKiller(killer);
    localStorage.setItem("selectedKiller", JSON.stringify(killer))
  }

  /*
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
    */

  type KillerState = {
    state: "Alive" | "Dead" | "Sold";
  };

  
  let [killerStates] = useState<Record<string, KillerState>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem("killerStates") ?? "{}");
      } catch {
        return {};
      }
    }
  );

  let isDead = (name: string) =>
    killerStates[name]?.state === "Dead";

  let isSold = (name: string) =>
    killerStates[name]?.state === "Sold";

  return (
    <>
        <div>
          <h1>Killer Selection Page</h1>
          <p>This is where users can select their killer.</p>
        </div>
        <div className="killer-buttons-container">
          {killersArray.map((killer) => {
            let available = !isDead(killer.name) && !isSold(killer.name);
            return (
            <button
              key={killer.name}
              className={
                isDead(killer.name) 
                  ? "dead" 
                  : isSold(killer.name) 
                  ? "dead" // TODO: have a unique class for sold killers
                  : killer.name === activeKiller?.name 
                  ? "active" 
                  : "inactive"
              }
              onClick={() => {if (available) handleClick(killer)}}
            >
              <img src={"killers/" + killer.name + ".webp"} className="logo" alt={killer.name} />
              <p className="killerDescription">{killer.name}</p>
              <p className="killerDescription">{killer.cost}$</p>
              <p className="killerDescription">
                {isDead(killer.name)
                  ? "DEAD"
                  : isSold(killer.name)
                  ? "SOLD"
                  : "ALIVE"}
              </p>
            </button>
            
          )})}
            {/*{killerList}*/}
        </div>
        <div data-reactroot className="footer">
            <button onClick={() => {navigate("/menu");
              localStorage.removeItem("selectedKiller");
            }}>
            Back
            </button>
            <button onClick={() => {navigate("/menu");
              localStorage.setItem("loadoutKiller", localStorage.getItem("selectedKiller") || "")
            }}>
            Confirm
            </button>
        </div>
    </>
  )
}