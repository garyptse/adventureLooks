import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { debounce } from "../utilities/debounce";

const NavigationContainer = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #32292f;

  display: flex;
  justify-content: space-between;

  position: fixed;
  transition: top 0.3s;
  width: 100%;
  z-index: 2;
`;

const NavigationItem = styled.li`
  float: left;

  &:hover {
    background-color: #221c20;
  }
`;

const Button = styled.button`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  background-color: #32292f;
  cursor: pointer;
  border: none;
  text-decoration: none;

  &:hover {
    background-color: #221c20;
  }
`;

function NavigationBar(navigationBarProps) {
  const navigate = useNavigate();

  async function signOut() {
    try {
      await Auth.signOut({ global: true });
      navigate("/", { replace: true });
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  //Debounce hide/show navigation on scroll
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const handleScroll = debounce(() => {
    const currentScrollPos = window.pageYOffset;
    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 10
    );
    setPrevScrollPos(currentScrollPos);
  }, 100);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      <NavigationContainer style={{ top: visible ? "0" : "-60px" }}>
        <div>
          <NavigationItem>
            <Button onClick={() => navigate("/")}>Home</Button>
          </NavigationItem>
          <NavigationItem>
            <Button onClick={() => navigate("photos")}>Label Photos</Button>
          </NavigationItem>
          <NavigationItem>
            <Button onClick={() => navigate("story")}>Story Album</Button>
          </NavigationItem>
          <NavigationItem>
            <Button onClick={() => navigate("adventure")}>Adventure</Button>
          </NavigationItem>
        </div>
        <div>
          <NavigationItem>
            <Button onClick={signOut}>Logout</Button>
          </NavigationItem>
        </div>
      </NavigationContainer>
    </>
  );
}

export default NavigationBar;
