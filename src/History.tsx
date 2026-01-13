import { useNavigate } from "react-router";

type Match = {
  stats: {
    matchNumber: number;
    matchFunds: number;
    kills: string;
    killer?: Killer;
    perks?: Perk[];
    penalties?: Array<string>;
    bonus?: string;
    matchCost: number;
    remainingFunds: number;
    killerDies: string;
    newBalance: number;
    pips: string;
  };
};

type Killer = {
  name: string;
  cost: number;
};

type Perk = {
  name: string;
  cost: number;
};

/*
type MatchStats = {
  killer?: Killer;
  perks?: Perk[];
};
*/

export default function History() {

  let navigate = useNavigate();

  let renderPerkImage = (perk?: Perk) => {
      if (!perk) return "None";
      return (
          <img
          src={import.meta.env.BASE_URL + `/perks/${perk.name}.webp`}
          alt={perk.name}
          className="logo"
          onError={(e) => {
              let target = e.currentTarget;
              target.replaceWith(document.createTextNode(perk.name));
          }}
          />
      );
  };

  let renderKillerImage = (killer?: Killer) => {
      if (!killer) return "None";
      return (
          <img
          src={import.meta.env.BASE_URL + `/killers/${killer.name}.webp`}
          alt={killer.name}
          className="logo"
          onError={(e) => {
              let target = e.currentTarget;
              target.replaceWith(document.createTextNode(killer.name));
          }}
          />
      );
  };

    //let balance = Number(localStorage.getItem("balance")) ?? 0;

    let getLocalStorageJSON = <T,>(key: string, fallback: T): T => {
        try {
            let item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : fallback;
        } catch {
            return fallback;
        }
    };

    let history = getLocalStorageJSON<Match[]>("history", []);

    /*let calculateMatchCost = (stats: MatchStats) =>
        (stats.killer?.cost ?? 0) +
        (stats.perks?.reduce((sum, p) => sum + (p.cost ?? 0), 0) ?? 0);

    */
    {/*
    return (
    <div style={{ display: "flex", gap: "16px", overflowX: "auto", padding: "8px" }}>
      {history.map((match) => { 
        
        let matchCost = (match.stats.killer?.cost ?? 0) + (match.stats.perks?.reduce((total: number, perk: Perk) => total + perk.cost, 0) ?? 0);
        
        return (
        <div>
          <p><strong>Match Funds:</strong> {balance}$</p>
          <p><strong>Killer:</strong> {match.stats.killer?.name}</p>
          <p><strong>Perk 1:</strong> {match.stats.perks?.[0]?.name}</p>
          <p><strong>Perk 2:</strong> {match.stats.perks?.[1]?.name}</p>
          <p><strong>Perk 3:</strong> {match.stats.perks?.[2]?.name}</p>
          <p><strong>Perk 4:</strong> {match.stats.perks?.[3]?.name}</p>
          <p><strong>Match Cost:</strong> {matchCost}$</p>
          <p><strong>Remaining Funds:</strong> {balance - matchCost}$</p>
          <p>
            <strong>Penalties:</strong>{" "}
            {match.stats.penalties?.length
                ? match.stats.penalties.join(", ")
                : "None"}
          </p>
          <p><strong>Kills in Match:</strong> {match.stats.kills}</p>
          <p><strong>Killer Dies?</strong> TODO</p>
          <p><strong>Bonus?</strong> {match.stats.bonus}</p>
          <p><strong>New Balance:</strong> TODO</p>
          <p><strong>Pips:</strong> TODO</p>
        </div>
      )})}
    </div>
  ); */}

  return (
    <div style={{ display: "flex", justifyContent: "center"}}>
    <table style={{ borderCollapse: "collapse", width: "1200px", margin: "auto", padding: 0 }}>
      <thead>
        <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Match #</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Match Funds</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Killer</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Perk 1</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Perk 2</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Perk 3</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Perk 4</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Match Cost</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Remaining Funds</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Penalties</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Kills</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Killer Dies?</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Bonus</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>New Balance</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pips</th>
        </tr>
      </thead>
      <tbody>
        {history.map((match) => {

          return (
            <tr>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.matchNumber}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.matchFunds}$</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {renderKillerImage(match.stats.killer)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                   {renderPerkImage(match.stats.perks?.[0])}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {renderPerkImage(match.stats.perks?.[1])}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {renderPerkImage(match.stats.perks?.[2])}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {renderPerkImage(match.stats.perks?.[3])}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.matchCost}$</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.remainingFunds}$</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {match.stats.penalties?.length
                    ? match.stats.penalties.join(", ")
                    : "None"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {match.stats.kills ?? 0}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.killerDies}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {match.stats.bonus ?? 0}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.newBalance}$</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.stats.pips}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <div data-reactroot className="footer">
            <button onClick={() => {navigate("/menu");}}>
            Back
            </button>
    </div>
    </div>
  );
}