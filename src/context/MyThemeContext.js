"use client";

import { createContext, useState } from "react";

export const MyThemeContext = createContext();

export const MyThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <MyThemeContext.Provider value={{ toggle, mode }}>
      <div className={`theme ${mode}`}>{children}</div>
    </MyThemeContext.Provider>
  );
};
