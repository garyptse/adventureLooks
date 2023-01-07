import React from "react";

const userContext = React.createContext({
  signOut: () => {},
  user: {},
  userID: null,
});

export default userContext;
