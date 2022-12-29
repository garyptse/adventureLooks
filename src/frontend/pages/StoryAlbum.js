import React, { useState } from "react";
import styled from "styled-components";
import StoryContainer from "../components/StoryContainer";

const Title = styled.p`
  text-transform: uppercase;
`;
const Stories = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;
const AddStoryContainer = styled(StoryContainer)`
  cursor: pointer;
`;
const Page = styled.div`
  margin: 0;
  display: grid;
  place-content: center;
`;
function StoryAlbum() {
  const [clicks, onClickStory] = useState(0);
  function newStory() {
    onClickStory(clicks + 1);
    return;
  }
  return (
    <Page>
      <Title>Story Album</Title>
      <Stories>
        <AddStoryContainer
          onClick={newStory}
          imageFile={"https://picsum.photos/id/1021/200/200"}
        >
          Add a new story
        </AddStoryContainer>
        {clicks ? [...Array(clicks)].map(() => <StoryContainer />) : null}
      </Stories>
    </Page>
  );
}

export default StoryAlbum;
