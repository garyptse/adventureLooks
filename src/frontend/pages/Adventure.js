import styled from "styled-components";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations.ts";
import * as queries from "../../graphql/queries.ts";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Storage } from "@aws-amplify/storage";
import StoryContainer from "../components/StoryContainer";
import adventureContext from "../context/CurrentAdventure.ts";

//OPENAI: Text Generation
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const Page = styled.div`
  min-height: 110vh;
  background-color: #57886c;
  padding: 5em;
`;

const StoryContainerCentered = styled(StoryContainer)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 35em;
  height: 100%;
`;

const Input = styled.input`
  width: 100%;
`;
const Submit = styled.input`
  float: right;
  margin-top: 0.3em;
`;

async function appendToHistory({ text, imageData, onChangeImageData }) {
  await API.graphql({
    query: mutations.updateImages,
    variables: {
      input: {
        id: imageData.id,
        userImagesId: imageData.userImagesId,
        historical: imageData.historical
          ? [...imageData.historical, text]
          : [text],
      },
    },
  })
    .then((res) => {
      onChangeImageData(res.data.updateImages);
    })
    .catch((err) => console.log("getUserImageKeys error: ", err));
}

async function eraseHistory({ imageData, onChangeImageData }) {
  await API.graphql({
    query: mutations.updateImages,
    variables: {
      input: {
        id: imageData.id,
        userImagesId: imageData.userImagesId,
        historical: [],
      },
    },
  })
    .then((res) => {
      onChangeImageData(res.data.updateImages);
    })
    .catch((err) => console.log("getUserImageKeys error: ", err));
}

function Adventure() {
  const [imageData, onChangeImageData] = useState();
  const [userInput, onChangeUserInput] = useState("");
  const [loading, onChangeLoading] = useState(true);
  const [imageURL, setImageURL] = useState();
  const { setAdventureID } = useContext(adventureContext);

  let { imageID } = useParams(); //read from the react rotuer url

  useEffect(() => {
    setAdventureID(imageID);
  }, [imageID, setAdventureID]);

  //Initial run, get the Image
  useEffect(() => {
    async function getImagesQuery() {
      await API.graphql({
        query: queries.getImages,
        variables: {
          id: imageID,
        },
      })
        .then((res) => {
          onChangeImageData(res.data.getImages);
          setImageURL(
            getImage(`${res.data.getImages.userImagesId}/${imageID}`)
          );
        })
        .catch((err) => console.log("getUserImageKeys error: ", err));
    }
    async function getImage(key) {
      return await Storage.get(key).then((res) => {
        setImageURL(res);
      });
    }
    if (imageID) {
      getImagesQuery();
    }
  }, [imageID]);

  //OPENAI API
  useEffect(() => {
    async function generateInteraction() {
      await openai
        .createCompletion({
          model: "text-davinci-003",
          prompt:
            `I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. In this game, the setting is a fantasy adventure world. Each room should have at least 3 sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for my to give you my first command.\n\nThe first room has the following story: ${
              imageData.content
            }${imageData.historical.join()}`.replace(/(\r\n|\n|\r)/gm, ""),
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: ["User:"],
        })
        .then((response) => {
          appendToHistory({
            text: response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, ""),
            imageData,
            onChangeImageData,
          });
        })
        .catch((err) => console.log("OpenAI Error: ", err));
    }
    if (loading && imageData && imageData.historical.length % 2 === 0) {
      onChangeLoading(false);
      generateInteraction();
    }
  }, [imageData, loading]);

  if (!imageData) {
    return null;
  }
  return (
    <Page imageKey={imageData.id}>
      <StoryContainerCentered
        imageFile={imageURL}
        onClick={() => {
          eraseHistory({ imageData, onChangeImageData });
          onChangeLoading(true);
          onChangeUserInput("");
        }}
      >
        {imageData.content}
      </StoryContainerCentered>
      <br />
      {imageData.historical?.map((data, idx) => (
        <p key={idx}>{data}</p>
      ))}
      <form
        onSubmit={(e) => {
          //only one user response
          if (imageData.historical.length % 2 === 1) {
            const regex = "^[A-Z][^?!.]*[?.!]$";
            const userInputFormatted =
              "USER: " + userInput.replace(/(\r\n|\n|\r)/gm, "");
            //must end in punctuation
            if (userInputFormatted.match(regex)) {
              appendToHistory({
                text: userInputFormatted,
                imageData,
                onChangeImageData,
              });
              onChangeLoading(true);
              onChangeUserInput("");
            } else {
              alert("Please use correct ending punctuation in your sentence!");
            }
          } else {
            alert(
              "GPT3 just needs a little more time :)\nPlease wait while GPT3 works on your adventure"
            );
          }
          e.preventDefault();
        }}
      >
        <label>
          Your Move:
          <br />
          <Input
            value={userInput}
            onChange={(e) => {
              onChangeUserInput(e.target.value);
            }}
            placeholder={"What would you like to do?"}
          />
        </label>
        <Submit type="submit" value="Submit" />
      </form>
    </Page>
  );
}

export default Adventure;
