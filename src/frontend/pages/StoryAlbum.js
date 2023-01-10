import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import StoryContainer from "../components/StoryContainer";
import { API, graphqlOperation } from "aws-amplify";
import { Storage } from "@aws-amplify/storage";
import * as subscriptions from "../../graphql/subscriptions.ts";
import * as queries from "../../graphql/queries.ts";
import userContext from "../../Auth.ts";
import { useNavigate } from "react-router-dom";

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

async function getUserQuery({ userID, onChangeAlbumKeys, onChangeStory }) {
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
              mapping[`${userID}/${item.id}`] = { ...item };
            });
          onChangeStory(mapping);
        })
        .catch((err) => console.log("s3 list error: ", err));
    })
    .catch((err) => console.log("getUserQuery error: ", err));
}

async function getImageUrl(key) {
  return await Storage.get(key);
}

function StoryAlbum() {
  const [albumKeys, onChangeAlbumKeys] = useState([]);
  const [albumImages, onChangeAlbumImages] = useState([]);
  const [story, onChangeStory] = useState({});
  const [refresh, onRefresh] = useState(true);

  const navigate = useNavigate();
  const { userID } = useContext(userContext);

  API.graphql(graphqlOperation(subscriptions.onCreateImages)).subscribe({
    next: () => onRefresh(true),
    error: (error) => {},
  });

  useEffect(() => {
    if (refresh && userID) {
      getUserQuery({
        userID,
        onChangeAlbumKeys,
        onChangeStory,
      });
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
          onClick={() => navigate("/photos")}
          imageFile={"https://picsum.photos/id/1021/200/200"}
        >
          + Add New Story
        </StoryContainer>
        {albumImages.map((image, idx) => (
          <StoryContainer
            key={image}
            imageFile={image}
            onClick={() => navigate(`/adventure/${story[albumKeys[idx]].id}`)}
          >
            {story[albumKeys[idx]].content}
          </StoryContainer>
        ))}
      </Stories>
    </Page>
  );
}

export default StoryAlbum;
