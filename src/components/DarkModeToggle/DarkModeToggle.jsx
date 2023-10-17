"use client"

import React, { useContext } from "react";
import styles from "./darkModeToggle.module.css";
import { MyThemeContext } from "../../context/MyThemeContext";

const DarkModeToggle = () => {
  const { toggle, mode } = useContext(MyThemeContext);
  return (
    <div className={styles.container} onClick={toggle}>
      <div className={styles.icon}>🌙</div>
      <div className={styles.icon}>🔆</div>
      <div
        className={styles.ball}
        style={mode === "light" ? { left: "2px" } : { right: "2px" }}
      />
    </div>
  );
};

export default DarkModeToggle;
