import React from "react";

const adventureContext = React.createContext({
  adventureID: String,
  setAdventureID: () => {},
});

export default adventureContext;
