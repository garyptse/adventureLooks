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
  color: #f0f0c9;
`;
const Stories = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;
const Page = styled.div`
  margin: 0;
  display: grid;
  place-content: center;
  background-color: #57886c;
  min-height: 110vh;
  padding: 5em 0;
`;

async function getUserImageKeys({ userID, onChangeAlbumKeys, onChangeStory }) {
  await API.graphql({
    query: queries.getUser,
    variables: {
      id: userID,
    },
  })
    .then((res) => {
      Storage.list(`${userID}/`)
        .then((result) => {
          const existingKeys = result.results.map((s3) => s3.key);
          onChangeAlbumKeys(existingKeys);

          var mapping = {};
          res.data.getUser.images.items
            .filter((item) => existingKeys.includes(`${userID}/${item.id}`))
            .forEach((item) => {
              mapping[`${userID}/${item.id}`] = item.content;
            });
          onChangeStory(mapping);
          // onChangeAlbumImages(matches);
        })
        .catch((err) => console.log("s3 list error: ", err));
      // .then((res) => {
      //   const tempArr = [];
      //   res.data.getUser.images.items.forEach((item) => {
      //     getImageUrl(`${userID}/${item.id}`)
      //       .then((key) => {
      //         tempArr.push(key);
      //       })
      //       .catch((err) => console.log("Error accessing S3: ", err));
      //   });
      //   onChangeAlbumImages(tempArr);
    })
    .catch((err) => console.log("getUserImageKeys error: ", err));
}

async function getImageUrl(key) {
  return await Storage.get(key);
}

function StoryAlbum() {
  const [albumKeys, onChangeAlbumKeys] = useState([]);
  const [albumImages, onChangeAlbumImages] = useState([]);
  const [story, onChangeStory] = useState({});
  const [refresh, onRefresh] = useState(true);

  const { userID } = useContext(userContext);

  API.graphql(graphqlOperation(subscriptions.onCreateImages)).subscribe({
    next: () => onRefresh(true),
    error: (error) => console.warn(error),
  });

  useEffect(() => {
    if (refresh && userID) {
      getUserImageKeys({ userID, onChangeAlbumKeys, onChangeStory });
      onRefresh(false);
    }
  }, [refresh, userID]);

  useEffect(() => {
    async function getImages() {
      const images = await Promise.all(
        albumKeys.map((key) => getImageUrl(key))
      ).then((value) => value);
      onChangeAlbumImages(images);
    }
    if (albumKeys.length > 0) getImages();
  }, [albumKeys]);

  return (
    <Page>
      <Title>Story Album</Title>
      <Stories>
        <StoryContainer
          onClick={() => {}}
          imageFile={"https://picsum.photos/id/1021/200/200"}
        >
          + Add New Story
        </StoryContainer>
        {albumImages.map((image, idx) => (
          <StoryContainer key={image} imageFile={image}>
            {story[albumKeys[idx]]}
          </StoryContainer>
        ))}
      </Stories>
    </Page>
  );
}

export default StoryAlbum;
