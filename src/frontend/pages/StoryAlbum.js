import React, { useState, useEffect } from "react";
import styled from "styled-components";
import StoryContainer from "../components/StoryContainer";
import { Auth } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";

const Title = styled.h1`
  text-transform: uppercase;
  text-align: center;
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
  background-color: #d1e3dd;
  min-height: 110vh;
`;
function StoryAlbum() {
  const [clicks, onClickStory] = useState(0);
  const [user, setUser] = useState();
  const [albumImages, onChangeAlbumImages] = useState([]);

  function newStory() {
    onClickStory(clicks + 1);
    return;
  }

  useEffect(() => {
    //set the user
    async function fetchUser() {
      Auth.currentAuthenticatedUser({
        bypassCache: true, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      })
        .then((user) => {
          setUser(user);
        })
        .catch((err) => console.log(err));
    }
    fetchUser();
  }, []);

  async function getImageUrl(key) {
    return await Storage.get(key);
  }

  useEffect(() => {
    if (user?.username) {
      //get the images stored in s3
      const storageResults = Storage.list(`${user.username}/`);
      storageResults
        .then(({ results }) => {
          results.map((result) =>
            getImageUrl(result.key).then((imageUrl) => {
              onChangeAlbumImages([...albumImages, imageUrl]);
            })
          );
        })
        .catch((err) => console.log(err));
    }
  }, [user?.username]);

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
        {albumImages.map((image, idx) => (
          <StoryContainer
            key={image}
            imageFile={image ?? "https://picsum.photos/id/1021/200/200"}
          />
        ))}
        {[...new Array(clicks)].map(() => (
          <StoryContainer />
        ))}
      </Stories>
    </Page>
  );
}

export default StoryAlbum;
