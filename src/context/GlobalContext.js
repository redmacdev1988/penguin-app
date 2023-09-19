"use client";

import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [csCacheTimeStamp] = useState("cacheTimeStamp");
  const [csCacheTutorials] = useState("cacheTutorials");
  const [csShouldCacheTutorials] = useState("shouldCacheTutorials");

  const [csFromUrl] = useState("fromUrl");

  return (
    <GlobalContext.Provider value={{ csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials, csFromUrl}}>
      <div>{children}</div>
    </GlobalContext.Provider>
  );
};
