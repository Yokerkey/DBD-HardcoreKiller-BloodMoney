export function matchCalculation(kills: string, remainingFunds: number, bonus: string, penalties: string[]) {

    let bonusMap: Record<string, number> = {
        "4K + 4 Gens left": 2,
        "4K + 5 Gens left": 4,
    };

    let penaltyMap: Record<string, number> = {
        "Gen before Hook": -2,
        "Last Gen Popped": -2,
        "Door Opened": -5,
        "Hatch Escape": -4,
    };

    let killsMap: Record<string, number> = {
        "3": 10,
        "4": 20,
    };

    
    console.log("Kills:", kills);
    let killsValue = kills ? killsMap[kills] ?? 0 : 0;
    console.log("Kills:", kills, "Value:", killsValue);
    

    let bonusValue = bonus ? bonusMap[bonus] ?? 0 : 0;

    let penaltiesValue = Array.isArray(penalties)
    ? penalties.reduce((sum, p) => sum + (penaltyMap[p] ?? 0), 0)
    : 0;

    let newBalance = remainingFunds + killsValue + bonusValue + penaltiesValue;
    console.log("Kills:", kills, "Remaining Funds:", remainingFunds, "Bonus Value:", bonusValue, "Penalties Value:", penaltiesValue, "New Balance:", newBalance);
  return newBalance;
}