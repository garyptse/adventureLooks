import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoLabel from "./frontend/pages/PhotoLabel";
import Home from "./frontend/pages/Home";
import StoryAlbum from "./frontend/pages/StoryAlbum";

import NavigationBar from "./frontend/components/NavigationBar";
import { API } from "aws-amplify";
import * as mutations from "./graphql/mutations.ts";

//AMPLIFY
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App({ signOut, user }) {
  useEffect(() => {
    async function createUser() {
      await API.graphql({
        query: mutations.createUser,
        variables: {
          input: { name: user.username, id: user.attributes.sub },
        },
      }).catch((err) => console.log(err));
    }
    createUser();
    console.log("createUser", user.username, user.attributes.sub);
  }, [user]);

  return (
    <>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />}>
            Home
          </Route>
          <Route path="/photos" element={<PhotoLabel />}></Route>
          <Route path="/story" element={<StoryAlbum />}></Route>
        </Routes>
      </Router>
    </>
  );
}
export default withAuthenticator(App);
