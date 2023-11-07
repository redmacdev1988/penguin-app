"use client";

import { createContext, useState } from "react";

export const GlobalContext = createContext();

// lsKeyStr_cacheTimeStamp
export const GlobalProvider = ({ children }) => {

  // value for this is a string
  const [lsKeyStr_cacheTimeStamp] = useState("cacheTimeStamp");

  // value for this is an array of bools
  const [lsKeyStr_cacheTutPageArr] = useState("cacheTutorials");

  // value for this is a yes/no
  const [lsKeyStr_shouldCacheTutorials] = useState("shouldCacheTutorials");

  const [lsKeyStr_numOfTutPages] = useState("num_of_tut_pages");
  // value for this is a string
  const [lsKeyStr_fromUrl] = useState("fromUrl");

  return (
    <GlobalContext.Provider value={{ lsKeyStr_numOfTutPages, lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_fromUrl}}>
      <div>{children}</div>
    </GlobalContext.Provider>
  );
};
