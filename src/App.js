import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoLabel from "./frontend/pages/PhotoLabel";
import Home from "./frontend/pages/Home";
import StoryAlbum from "./frontend/pages/StoryAlbum";

import NavigationBar from "./frontend/components/NavigationBar";

//AMPLIFY
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App({ signOut, user }) {
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
