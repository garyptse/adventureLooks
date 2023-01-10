//src/frontend/PhotoLabel.js
import React, { useEffect, useState, useContext } from "react";
import { Storage } from "@aws-amplify/storage";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations.ts";
// import * as subscriptions from "../../graphql/subscriptions.ts";
import userContext from "../context/Auth.ts";
import { HiRefresh } from "react-icons/hi";

//Amplify Predictions
import { Amplify, Predictions } from "aws-amplify";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import awsconfig from "../../aws-exports";
import styled from "styled-components";
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
Amplify.register(Predictions);

const Page = styled.div`
  background-color: #57886c;
  min-height: 110vh;
  padding: 6em;
`;
const InputContainer = styled.div`
  background-color: #575366;
  align: center;
  padding: 2em;
  border-radius: 0.7em;
`;
const Button = styled.button`
  background-color: #6e7dab;
  color: white;
  margin-right: 0.7em;
  border: none;
  border-radius: 0.3em;
  height: 2.5em;
  cursor: pointer;

  &:hover {
    background-color: #596a9b;
  }
`;
const RefreshIcon = styled(HiRefresh)`
  vertical-align: middle;
  margin: 0 0.3em;
`;
const PreviewStoryImage = styled.img`
  width: 25em;
`;
const Title = styled.h2`
  color: white;
`;
const Text = styled.p`
  color: white;
`;
//OPENAI: Text Generation
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

async function createImage({
  input: { userID, labels, imageBlurb },
  imageFile,
}) {
  if (userID && labels && imageBlurb) {
    await API.graphql({
      query: mutations.createImages,
      variables: {
        input: {
          userImagesId: userID,
          tags: labels,
          content: imageBlurb.replace(/(\r\n|\n|\r)/gm, ""),
          historical: [],
        },
      },
    })
      .then((res) => {
        const Data = res.data.createImages;
        storagePut({ userID: Data.userImagesId, imageID: Data.id, imageFile });
      })
      .catch((err) => console.log("Create Image Error: ", err));
  }
}
async function storagePut({ userID, imageID, imageFile }) {
  await Storage.put(`${userID}/${imageID}`, imageFile, {
    contentType: "image/png", // contentType is optional
  })
    .then(() => {
      alert("Uploaded to Story Album");
    })
    .catch((error) => {
      console.log("Error uploading file: ", error);
    });
}
function PhotoLabel() {
  const [response, setResponse] = useState(null);
  const [imageBlurb, setImageBlurb] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { userID } = useContext(userContext);

  //GET LABELS
  const identifyLabel = async (file) => {
    setImageFile(file);
    Predictions.identify({
      labels: {
        source: { file },
        type: "LABELS",
      },
    })
      .then((response) => {
        const { labels } = response;
        setResponse(
          JSON.stringify(
            labels.map((label) => label.name),
            null,
            2
          )
        );
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  //GET BLURB
  useEffect(() => {
    async function fetchData() {
      await openai
        .createCompletion({
          model: "text-davinci-003",
          prompt:
            `You are an adventurer. Write a short blurb of your adventure to a location with these features
            ${response}`.replace(/(\r\n|\n|\r)/gm, ""),
          temperature: 1,
          max_tokens: 150,
        })
        .then((imagePrompt) => {
          const blurb = imagePrompt.data.choices[0].text;
          setImageBlurb(blurb);
        })
        .catch((err) => console.log("OpenAI Error: ", err));
    }
    if (response) fetchData();
  }, [response, userID]);

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <Page>
      <InputContainer>
        <div>
          <Title>Identify Label From Photo</Title>
          <input
            type="file"
            onChange={(event) => {
              const {
                target: { files },
              } = event;
              const [file] = files || [];
              if (!file) {
                return;
              }
              identifyLabel(file);
            }}
          />
          <br />
          <PreviewStoryImage src={previewImage} alt="" />
          <Text>{response}</Text>
          <Text>{imageBlurb}</Text>
        </div>

        <Button
          onClick={() => {
            setResponse(null);
            setImageBlurb("");
            identifyLabel(imageFile);
          }}
        >
          <RefreshIcon size={24} />
        </Button>
        <Button
          onClick={() => {
            createImage({
              input: { userID, labels: response, imageBlurb },
              imageFile,
            });
          }}
        >
          Upload to Story Album
        </Button>
      </InputContainer>
    </Page>
  );
}

export default PhotoLabel;
