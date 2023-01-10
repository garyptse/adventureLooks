import styled from "styled-components";
import { API, graphqlOperation } from "aws-amplify";
import * as mutations from "../../graphql/mutations.ts";
import * as queries from "../../graphql/queries.ts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//OPENAI: Text Generation
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const Page = styled.div`
  min-height: 110vh;
  background-color: beige;
  padding: 5em;
`;

const UserForm = styled.form``;

async function appendToHistory({ text, imageData, onChangeImageData }) {
  console.log(imageData);
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
      console.log(res.data.updateImages);
    })
    .catch((err) => console.log("getUserImageKeys error: ", err));
}

function Adventure() {
  const [imageData, onChangeImageData] = useState();
  const [userInput, onChangeUserInput] = useState("");
  const [loading, onChangeLoading] = useState(true);

  let { imageID } = useParams(); //read from the react rotuer url

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
        })
        .catch((err) => console.log("getUserImageKeys error: ", err));
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
            `I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program. In this game, the setting is a fantasy adventure world. Each room should have at least 3 sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for my to give you my first command.\n\nThe first room has the following story: ${
              imageData.content
            }${
              imageData.historical ? imageData.historical.join() : ""
            }`.replace(/(\r\n|\n|\r)/gm, ""),
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: ["User:"],
        })
        .then((response) => {
          console.log("GPT3 Complete.", response.data.choices[0].text);
          appendToHistory({
            text: response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, ""),
            imageData,
            onChangeImageData,
          });
          onChangeLoading(false);
        })
        .catch((err) => console.log("OpenAI Error: ", err));
    }
    if (
      loading &&
      imageData &&
      (!imageData.historical || imageData.historical.length % 2 === 0)
    ) {
      console.log("GPT3 Processing...");
      generateInteraction();
    }
  }, [imageData, loading]);

  if (!imageData) {
    return null;
  }
  return (
    <Page>
      <p>{imageData.content}</p>
      <br />
      {imageData.historical?.map((data, idx) => (
        <p key={idx}>{data}</p>
      ))}
      <UserForm
        onSubmit={(e) => {
          appendToHistory({
            text: "USER: " + userInput.replace(/(\r\n|\n|\r)/gm, ""),
            imageData,
            onChangeImageData,
          });
          onChangeLoading(true);
          onChangeUserInput("");
          e.preventDefault();
        }}
      >
        <label>
          Your Move:
          <input
            value={userInput}
            onChange={(e) => {
              onChangeUserInput(e.target.value);
            }}
            placeholder={"What would you like to do?"}
          />
        </label>
        <input type="submit" value="Submit" />
      </UserForm>
    </Page>
  );
}

export default Adventure;
