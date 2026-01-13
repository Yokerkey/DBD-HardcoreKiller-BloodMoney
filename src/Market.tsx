import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import killersData from './assets/killers.json';
import "./KillerSelection.css";
import { BalanceStateProvider, useBalanceState } from "./BalanceContext";

type KillerData = {
  tier: number;
  cost: number;
};

type KillerState = {
  state: "Alive" | "Dead" | "Sold";
};

type KillerStates = Record<string, KillerState>;

export function Market() {
    let navigate = useNavigate();
    let storageKey = "killerStates";
    let { balance, setBalance } = useBalanceState();

    // Initialize killerStates (same pattern as PerkSelection)
    let [killerStates, setKillerStates] = useState<KillerStates>(() => {
        try {
        let stored = localStorage.getItem(storageKey);
        if (stored) return JSON.parse(stored);

        let initial = Object.fromEntries(
            Object.keys(killersData).map(killer => [
            killer,
            { state: "Alive" }
            ])
        );

        localStorage.setItem(storageKey, JSON.stringify(initial));
        return initial;
        } catch {
        return {};
        }
    });

    // TEMP selection (not yet sold)
    let [selected, setSelected] = useState<Set<string>>(new Set());

    // Persist on change
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(killerStates));
    }, [killerStates]);

     // Toggle selection
    let toggleSelect = (killerName: string) => {
        let currentState = killerStates[killerName]?.state;

        if (currentState === "Dead" || currentState === "Sold") {
        return;
        }

        setSelected(prev => {
        let next = new Set(prev);
        next.has(killerName) ? next.delete(killerName) : next.add(killerName);
        return next;
        });
    };

    // Confirm sale
    let confirmSale = () => {

        let totalGain = 0;
        let killers = killersData as Record<string, KillerData>;

        selected.forEach(name => {
            if (killerStates[name]?.state === "Alive") {
            totalGain += killers[name].cost;
            }
        });

        setKillerStates(prev => {
            let updated = { ...prev };

            selected.forEach(name => {
                if (updated[name]?.state === "Alive") {
                    updated[name] = { state: "Sold" };
                }
            });

        return updated;
        });

        // 3️⃣ Update global balance
        console.log("Current balance before sale:", balance);
        setBalance(balance + totalGain);
        console.log("New balance after sale:", balance + totalGain);

        setSelected(new Set());
    };

    /*
    // Sell a killer
    let sellKiller = (killerName: string) => {
        setKillerStates(prev => {
        // Prevent selling dead killers
        if (prev[killerName]?.state === "Dead") {
            return prev;
        }

        return {
            ...prev,
            [killerName]: {
            ...prev[killerName],
            state: "Sold"
            }
        };
        });
    };
    */

    return (
    <>
      <div>
        <h1>Marketplace</h1>
        <p>Select killers to sell, then confirm</p>
      </div>

      <div className="card">
        {Object.entries(killersData).map(([key, killer]) => {
          let state = killerStates[key]?.state;
          let isDead = state === "Dead";
          let isSold = state === "Sold";
          let isSelected = selected.has(key);

          return (
            <button
              key={key}
              className={
                isDead || isSold
                  ? "dead"
                  : isSelected
                  ? "active"
                  : "inactive"
              }
              disabled={isDead || isSold}
              onClick={() => toggleSelect(key)}
            >
              <img
                src={`killers/${key}.webp`}
                className="logo"
                alt={key}
              />
              <p className="killerDescription">{key}</p>
              <p className="killerDescription">{killer.cost}$</p>
              <p className="killerDescription">
                {isDead
                  ? "DEAD"
                  : isSold
                  ? "SOLD"
                  : "ALIVE"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="footer">
        <button onClick={() => navigate("/menu")}>
          Back
        </button>

        <button
          onClick={() => confirmSale()}
          disabled={selected.size === 0}
        >
          Confirm
        </button>
      </div>
    </>
  );
}

export default function MarketWrapper() {
  return (
    <BalanceStateProvider>
      <Market />
    </BalanceStateProvider>
  );
}