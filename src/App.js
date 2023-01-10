import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoLabel from "./frontend/pages/PhotoLabel";
import Home from "./frontend/pages/Home";
import StoryAlbum from "./frontend/pages/StoryAlbum";
import Adventure from "./frontend/pages/Adventure";

import NavigationBar from "./frontend/components/NavigationBar";
import { API } from "aws-amplify";
import * as mutations from "./graphql/mutations.ts";
import * as queries from "./graphql/queries.ts";
import userContext from "./Auth.ts";

//AMPLIFY
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    async function createUser() {
      await API.graphql({
        query: mutations.createUser,
        variables: {
          input: { name: user.attributes.sub },
        },
      })
        .then((res) => setUserID(res.data.createUser.id))
        .catch((err) => console.log(err));
    }

    async function checkUsers() {
      await API.graphql({
        query: queries.listUsers,
      })
        .then((res) => {
          const matches = res.data.listUsers.items.filter(
            (u) => u.name === user.attributes.sub
          );
          if (!matches.map((u) => u.name).includes(user.attributes.sub)) {
            console.log("Created new user");
            createUser();
          } else {
            setUserID(matches[0].id);
          }
        })
        .catch((err) => console.log(err));
    }
    if (user) checkUsers();
  }, [user]);

  return (
    <userContext.Provider value={{ user, userID }}>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />}>
            Home
          </Route>
          <Route path="photos" element={<PhotoLabel />}></Route>
          <Route path="story" element={<StoryAlbum />}></Route>
          <Route path="adventure/:imageID" element={<Adventure />}></Route>
        </Routes>
      </Router>
    </userContext.Provider>
  );
}
export default withAuthenticator(App);
