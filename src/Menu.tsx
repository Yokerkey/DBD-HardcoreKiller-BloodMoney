import { useNavigate } from "react-router";

export default function Menu() {
  let navigate = useNavigate();
  return (
    <>
        <div>
            <h1>Hardcore Killer - Blood Money</h1>
        </div>
        <div>
            <h2>Current Loadout:</h2>
            <img src={"/killers/" + localStorage.getItem("selectedKiller") + ".webp"} className="logo" alt={localStorage.getItem("selectedKiller")!} />
            <p>The {localStorage.getItem("selectedKiller")}</p>
            <p>Cost: {localStorage.getItem("killerCost")}$</p>
        </div>
        <div className="card">
            <button className="button" onClick={() => {navigate("/killerSelection");}}>
                Killer Selection
            </button>
            <button className="button" onClick={() => {navigate("/perkSelection");}}>
                Perk Selection
            </button>
        </div>
        <div className="card">
            <button onClick={() => {navigate("/");}}>
            Back
            </button>
        </div>
    </>
  )
}