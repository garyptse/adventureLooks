//src/frontend/Home.js
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ButtonContainer = styled.div`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 48vh;
  text-align: center;

  display: flex;
  justify-content: center;
`;
const HomeContainer = styled.div`
  background-color: #575366;
  height: 110vh;
  position: relative;
`;
const Title = styled.h1`
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
  top: 40vh;
  color: white;
`;
const Button = styled.button`
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  background-color: #6e7dab;
  cursor: pointer;
  border: none;
  margin: 0 1em;
  border-radius: 0.3em;

  &:hover {
    background-color: #596a9b;
  }
`;

function Home() {
  const navigate = useNavigate();
  const redirectToStory = () => {
    navigate("/story");
  };
  const redirectToPhotos = () => {
    navigate("/photos");
  };
  return (
    <HomeContainer>
      <Title>Adventure Looks</Title>
      <ButtonContainer>
        <Button onClick={redirectToPhotos}>Photos</Button>
        <Button onClick={redirectToStory}>Story</Button>
      </ButtonContainer>
    </HomeContainer>
  );
}

export default Home;
