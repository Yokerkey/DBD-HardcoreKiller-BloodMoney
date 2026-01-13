import { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "./MatchResults.tsx";
import { BalanceStateProvider, useBalanceState } from "./BalanceContext";

export function Menu() {

    let rankMap: Record<number, string> = {
        3: "Ash III",
        6: "Ash II",
        10: "Ash I",
        14: "Bronze IV",
        18: "Bronze III",
        22: "Bronze II",
        26: "Bronze I",
        30: "Silver IV",
        35: "Silver III",
        40: "Silver II",
        45: "Silver I",
        50: "Gold IV",
        55: "Gold III",
        60: "Gold II",
        65: "Gold I",
        70: "Iridescent IV",
        75: "Iridescent III",
        80: "Iridescent II",
        85: "Iridescent I",
    };
    let [totalPips, setTotalPips] = useState(() => {
        let totalPipsString = localStorage.getItem("totalPips");
        let totalPips = totalPipsString ? Number(JSON.parse(totalPipsString)) : 0;
        return totalPips;
    });


    let rank = (() => {
        let rankValue = "Ash IV";
        for (let [threshold, rank] of Object.entries(rankMap).reverse()) {
            if (totalPips >= Number(threshold)) {
                rankValue = rank;
                break;
            }
        }
        return rankValue;
    })();

  let navigate = useNavigate();
  //let [selectedKills, setSelectedKills] = useState("");
  //let [selectedBonus, setSelectedBonus] = useState("");

  let [isOpen, setIsOpen] = useState(false);

  let loadoutPerksString = localStorage.getItem("loadoutPerks");
  let [loadoutPerks, setLoadoutPerks] = useState<{ name: string; cost: number}[]>(loadoutPerksString ? JSON.parse(loadoutPerksString) : []);
  let loadoutKillerString = localStorage.getItem("loadoutKiller");
  let [loadoutKiller, setLoadoutKiller] = useState<{ name: string; cost: number} | null>(loadoutKillerString ? JSON.parse(loadoutKillerString) : null);
  let perkTotalCost = loadoutPerks.reduce(
    (total, perk) => total + perk.cost,
    0
  );
  let { balance } = useBalanceState();
  return (
    <>
        <div>
            <h1>Hardcore Killer - Blood Money</h1>
        </div>
        <div>
            <h3>Balance: {balance}$</h3>
            <h2>Current Rank: {rank}</h2>
            <h2>Current Loadout:</h2>
            <div className="loadout-container">
                {loadoutKiller && (
                    <div className="killer-info">
                        <img src={"/killers/" + loadoutKiller.name + ".webp"} className="logo" alt={loadoutKiller.name} />
                        <div className="killer-text">
                            <p>The {loadoutKiller.name}</p>
                            <p>Cost: {loadoutKiller.cost}$</p>
                        </div>
                    </div>
                )}
                <div className="perks-container">
                    {loadoutPerks.map(perk => (
                        <div key={perk.name} className="perk-item">
                            <img src={"/perks/" + perk.name + ".webp"} className="logo"/>
                            <p>{perk.name}</p>
                            <p>{perk.cost}$</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                {loadoutKiller && <p>Total Loadout Cost: {loadoutKiller.cost + perkTotalCost}$</p>}
                {loadoutKiller && <p>Remaining Funds: {(Number(localStorage.getItem("balance")) || 0) - (loadoutKiller.cost + perkTotalCost)}$</p>}
            </div>
        </div>
        <div className="card">
            <button className="button" onClick={() => {navigate("/killerSelection");}}>
                Killer Selection
            </button>
            <button className="button" onClick={() => {navigate("/perkSelection");}}>
                Perk Selection
            </button>
            <div>
                <button className="button" onClick={() => setIsOpen(true)}>
                    Match Results
                </button>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} setLoadoutPerks={setLoadoutPerks} setLoadoutKiller={setLoadoutKiller} setTotalPips={setTotalPips}></Modal>
            </div>
            <button className="button" onClick={() => {navigate("/market");}}>
                Marketplace
            </button>
            <button className="button" onClick={() => {navigate("/history");}}>
                History
            </button>
        </div>
        <div data-reactroot className="footer">
            <button onClick={() => {navigate("/");}}>
            Back
            </button>
        </div>
    </>
  )
}

export default function MenuWrapper() {
  return (
    <BalanceStateProvider>
      <Menu />
    </BalanceStateProvider>
  );
}