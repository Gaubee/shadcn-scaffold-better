
import React, { createContext, useContext } from "react";
import type { NavigationProvider } from "./types";
import type { PaneParams } from "@/components/scaffold/scaffold";

const NavigationContext =
  createContext<NavigationProvider<any> | null>(null);

export const NavigationProviderWrapper: React.FC<{
  provider: NavigationProvider<any>;
  children: React.ReactNode;
}> = ({ provider, children }) => {
  return (
    <NavigationContext.Provider value={provider}>
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation<T extends PaneParams>(): NavigationProvider<T> {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
