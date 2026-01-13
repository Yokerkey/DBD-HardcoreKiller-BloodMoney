import { useState, useMemo, type Dispatch, type SetStateAction  } from "react";
import Picklist from "./Picklist";
import MultiPicklist from "./MultiPicklist";
import {matchCalculation} from "./MatchCalculation";
import { useBalanceState } from "./BalanceContext";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    setLoadoutKiller: Dispatch<SetStateAction<{ name: string; cost: number; } | null>>;
    setLoadoutPerks: (perks: Perks[]) => void;
    setTotalPips: (pips: number) => void;
};

type LoadoutKiller = {
  name: string;
  cost: number;
  // other properties...
};

type Perks = {
    name: string;
    cost: number;
}

export default function Modal({ isOpen, onClose, setLoadoutKiller, setLoadoutPerks, setTotalPips}: ModalProps) {

    let getLocalStorageNumber = (key: string, fallback = 0): number => {
        let item = localStorage.getItem(key);
        return item ? Number(JSON.parse(item)) : fallback;
    };

    let setLocalStorageNumber = (key: string, value: number) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    function saveResults() {
        // Implement saving logic here
        localStorage.setItem("Kills", JSON.stringify(selectedKills));
        localStorage.setItem("Bonus", JSON.stringify(selectedBonus));
        localStorage.setItem("Penalties", JSON.stringify(mergedPenalties));
        let previousTotalPips = getLocalStorageNumber("totalPips", 0);
        let currentPips = Number(selectedPips) || 0;
        let newTotalPips = previousTotalPips + currentPips;
        setLocalStorageNumber("totalPips", newTotalPips);
        setTotalPips(newTotalPips);
    }


    //helper functions:
    let getLocalStorageJSON = <T,>(key: string, fallback: T): T => {
        try {
            let item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : fallback;
        } catch {
            return fallback;
        }
    };

    let setLocalStorageJSON = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    let buildMatchStats = () => {
        let matchNumber = getLocalStorageJSON<number>("matchCounter", 0) + 1;
        localStorage.setItem("matchCounter", JSON.stringify(matchNumber));

        let killer = getLocalStorageJSON<LoadoutKiller | null>("loadoutKiller", null);
        let perks = getLocalStorageJSON<Perks[]>("loadoutPerks", []);
        let matchFunds = getLocalStorageJSON<number>("balance", 0);
        let killerCost = killer?.cost ?? 0;
        let perksCost = perks.reduce((sum, perk) => sum + perk.cost, 0);
        let matchCost = killerCost + perksCost;
        let remainingFunds = matchFunds - matchCost;
        let killerDies = (Number(selectedKills) < 4 ? "Dead" : "Alive");
        killerDies = (Number(selectedKills) === 3 && mergedPenalties.includes("Hatch Escape")) ? "Alive" : killerDies;

        if (killerDies === "Dead") {
            let killerStates = getLocalStorageJSON<Record<string, {state: string}>>("killerStates", {});

            killerStates[killer?.name || ""] = {state: "Dead"};

            localStorage.setItem("killerStates", JSON.stringify(killerStates));
        }

        let newBalance = matchCalculation(selectedKills, remainingFunds, selectedBonus, mergedPenalties);
        setLoadoutKiller(null);
        setLoadoutPerks([]);
        localStorage.removeItem("loadoutKiller");
        localStorage.removeItem("loadoutPerks");

        return {
            matchNumber,
            matchFunds,
            killer,
            perks,
            matchCost,
            remainingFunds,
            kills: selectedKills,
            killerDies,
            bonus: selectedBonus,
            penalties: mergedPenalties,
            newBalance,
            pips: selectedPips,
        };
    };

    if (!isOpen) return null;
    let { setBalance } = useBalanceState();
    let [selectedKills, setSelectedKills] = useState("");
    let [selectedBonus, setSelectedBonus] = useState("");
    let [selectedPenalties, setSelectedPenalties] = useState<string[]>([]);
    let [selectedPips, setSelectedPips] = useState("");
    let killsOptions = [
        { value: "0", label: "0 Kills" },
        { value: "1", label: "1 Kill" },
        { value: "2", label: "2 Kills" },
        { value: "3", label: "3 Kills" },
        { value: "4", label: "4 Kills" },
    ];

    let bonusOptions = [
        { value: "4K + 4 Gens left", label: "4K + 4 Gens left" },
        { value: "4K + 5 Gens left", label: "4K + 5 Gens left" },
    ];

    let penaltyOptions = [
        { value: "Gen before Hook", label: "Gen before Hook" },
        { value: "Last Gen Popped", label: "Last Gen Popped" },
        { value: "Door Opened", label: "Door Opened" },
        { value: "Hatch Escape", label: "Hatch Escape" },
    ];

    let pipOptions = [
        { value: "0", label: "0 Pips" },
        { value: "1", label: "1 Pip" },
        { value: "2", label: "2 Pips" },
    ]

    let killToPenaltyMap: Record<string, string[]> = {
        "0": ["Last Gen Popped", "Door Opened"],
        "1": ["Last Gen Popped", "Door Opened"],
        "2": ["Last Gen Popped", "Door Opened"],
        "3": [],
        "4": [],
    };

    let addMatchToHistory = () => {
        let history = getLocalStorageJSON("history", []);
        
        let newMatch = {
            stats: buildMatchStats()
        };

        let updatedHistory = [...history, newMatch];

        setLocalStorageJSON("history", updatedHistory);
        setBalance(newMatch.stats.newBalance);
        //localStorage.setItem("balance", JSON.stringify(newMatch.stats.newBalance));
    };

    //type KillCount = typeof killsOptions[number]["value"];
    //type KillCountValue = KillCount | "";

    function isKillCount(value: string): value is string {
        return value !== "";
    }

    let forcedPenalties = isKillCount(selectedKills) ? killToPenaltyMap[selectedKills] : [];

    let isConfirmEnabled = selectedKills != null && selectedKills !== "" && selectedPips !== "";

    let fourKillPenalties = ["Gen before Hook", "Door Opened", "Last Gen Popped",];

    let handleKillsChange = (kills: string) => {
        setSelectedKills(kills);

        if (Number(kills) === 4) {
            setSelectedPenalties(prev => prev.filter(p => fourKillPenalties.includes(p))); // remove Hatch Escape
        } else {
            setSelectedBonus(""); // clear selection
            setSelectedPenalties([]); // clear selection
        }
    };

    let handleBonusChange = (bonus: string) => {
        setSelectedBonus(bonus);

        if (bonus === "4K + 4 Gens left") {
            setSelectedPenalties(prev => prev.filter(p => p === "Gen before Hook")); // keep only Gen before Hook
        }

        if (bonus === "4K + 5 Gens left") {
            setSelectedPenalties([]); // clear selection
        }
    };

    let mergedPenalties = useMemo(() => {
        return Array.from(
            new Set([...selectedPenalties, ...forcedPenalties])
        );
    }, [selectedPenalties, forcedPenalties]);

    /*
    let applyForcedPenalties = (forcedPenalties) => {
        if (forcedPenalties.length === 0) return;

        setSelectedPenalties(prev => {
            // Merge previous selections with forced penalties
            let mergedPenalties = new Set([...prev, ...forcedPenalties]);
            return Array.from(mergedPenalties);
        });
    };
    */


    /*
    let handleForcedPenatiesChange = (forcedPenalties) => {
        setForcedPenalties(forcedPenalties);
        applyForcedPenalties(forcedPenalties);
    };
    */

    /*
    useEffect(() => {
    if (Number(selectedKills) === 4) {
        setSelectedPenalties(prev => prev.filter(p => fourKillPenalties.includes(p))); // remove Hatch Escape
    }
    //if (selectedKills !== 4) {
    else {
        setSelectedBonus(""); // clear selection
        setSelectedPenalties([]); // clear selection
    }
    }, [selectedKills]);

    useEffect(() => {
    if (selectedBonus === "4K + 4 Gens left") {
        setSelectedPenalties(prev => prev.filter(p => p === "Gen before Hook")); // keep only Gen before Hook
    }
    if (selectedBonus === "4K + 5 Gens left") {
        setSelectedPenalties([]); // clear selection
    }
    }, [selectedBonus]);

    useEffect(() => {
        if (forcedPenalties.length === 0) return;

        setSelectedPenalties(prev => {
            // Merge previous selections with forced penalties
            let mergedPenalties = new Set([...prev, ...forcedPenalties]);
            return Array.from(mergedPenalties);
        });
    }, [forcedPenalties]);
    */

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h1>Match Results</h1>
            <div className="picklist-container">
                <Picklist
                    id="kills"
                    label="Set Kills: "
                    options={killsOptions}
                    value={selectedKills}
                    onChange={handleKillsChange}
                    //onChange={setSelectedKills}
                />

                {Number(selectedKills) === 4 && (
                    <Picklist
                        id="bonus"
                        label="Set Bonus: "
                        options={bonusOptions}
                        value={selectedBonus}
                        onChange={handleBonusChange}
                        //onChange={setSelectedBonus}
                        disabled={Number(selectedKills) !== 4}
                    />
                )}

                {selectedKills && !(Number(selectedKills) === 4 && selectedBonus === "4K + 5 Gens left") && (
                    <MultiPicklist
                        label="Set Penalties: "
                        options={penaltyOptions.filter(opt => {
                            if (Number(selectedKills) === 4 && opt.value === "Hatch Escape") return false;
                            if (selectedBonus && (opt.value === "Last Gen Popped" || opt.value === "Door Opened")) return false;
                            return true;
                        })}
                        value={mergedPenalties}
                        onChange={setSelectedPenalties}
                        disabled={selectedBonus === "4K + 5 Gens left"}
                        forcedValues={forcedPenalties}
                    />
                )}

                <Picklist
                    id="pips"
                    label="Set Pips:"
                    options={pipOptions}
                    value={selectedPips}
                    onChange={setSelectedPips}
                />
                

                {/*
            <label htmlFor="match1">Set Kills: </label>
            <select
            className="picklist"
            id="match1"
            value={selectedKills}
            onChange={(e) => setSelectedKills(e.target.value)}
            >
                <option value="">-- Kill amount --</option>
                <option value="0 Kills">0</option>
                <option value="1 Kill">1</option>
                <option value="2 Kills">2</option>
                <option value="3 Kills">3</option>
                <option value="4 Kills">4</option>
            </select>

            {selectedKills && (
            <p>You selected: {selectedKills}</p>
            )}

            <label htmlFor="match2">Set Bonus: </label>
            <select
            className="picklist"
            id="match2"
            value={selectedBonus}
            onChange={(e) => setSelectedBonus(e.target.value)}
            >
                <option value="">-- Bonus --</option>
                <option value="4K + 4 Gens left">4K + 4 Gens left</option>
                <option value="4K + 5 Gens left">4K + 5 Gens left</option>
            </select>

            {selectedBonus && (
            <p>You selected: {selectedBonus}</p>
            )}
                    */}
            </div>
        </div>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
        <button className="modal-close" disabled={!isConfirmEnabled} onClick={() => {saveResults(); onClose(); addMatchToHistory();}}>
            Confirm
        </button>
      </div>
    </div>
  );
}