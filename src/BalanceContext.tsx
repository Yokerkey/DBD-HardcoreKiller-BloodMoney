import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

type BalanceContextType = {
  balance: number;
  setBalance: (b: number) => void;
};

let BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  setBalance: () => {},
});

export function BalanceStateProvider({ children }: { children: React.ReactNode }) {
  let [balance, setBalance] = useState(() => {
    return localStorage.getItem("balance") !== null ? Number(localStorage.getItem("balance")) : 20;
  });

  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
  }, [balance]);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalanceState() {
  let context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalanceState must be used within a BalanceStateProvider");
  }
  return context;
}


/*
export let BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(() => {
    const stored = localStorage.getItem("balance");
    return stored !== null ? Number(stored) : 0;
  });

  // Keep localStorage in sync whenever balance changes
  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  console.log("BalanceProvider initialized with balance:", balance);
  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export let useBalance = () => useContext(BalanceContext);
*/