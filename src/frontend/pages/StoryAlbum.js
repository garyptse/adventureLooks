import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import StoryContainer from "../components/StoryContainer";
import { API, graphqlOperation } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import * as subscriptions from "../../graphql/subscriptions.ts";
import * as queries from "../../graphql/queries.ts";
import userContext from "../../Auth.ts";

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

async function getUserImages(userImageID) {
  console.log(userImageID);
  await API.graphql({
    query: queries.getUser,
    variables: {
      input: {
        id: userImageID,
      },
    },
  }).catch((err) => console.log("getUserImages error: ", err));
}

function StoryAlbum() {
  const [clicks, onClickStory] = useState(0);
  const [albumImages, onChangeAlbumImages] = useState([]);

  const user = useContext(userContext);

  API.graphql(graphqlOperation(subscriptions.onCreateImages)).subscribe({
    next: (data) => console.log("data: ", data),
    error: (error) => console.warn(error),
  });

  function newStory() {
    onClickStory(clicks + 1);
    return;
  }

  async function getImageUrl(key) {
    return await Storage.get(key);
  }

  useEffect(() => {
    if (user.username) {
      //get the images stored in s3
      Storage.list(`${user.username}/`)
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
