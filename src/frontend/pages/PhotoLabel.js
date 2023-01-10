//src/frontend/PhotoLabel.js
import React, { useEffect, useState, useContext } from "react";
import { Storage } from "@aws-amplify/storage";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations.ts";
// import * as subscriptions from "../../graphql/subscriptions.ts";
import userContext from "../../Auth.ts";

//Amplify Predictions
import { Amplify, Predictions } from "aws-amplify";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import awsconfig from "../../aws-exports";
import styled from "styled-components";
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
Amplify.register(Predictions);

const InputContainer = styled.div`
  background-color: #57886c;
  align: center;
  padding: 10em;
  min-height: 110vh;
`;

const PreviewStoryImage = styled.img`
  width: 25em;
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
        console.log("Uploaded to GraphQL");
      })
      .catch((err) => console.log("Create Image Error: ", err));
  }
}
async function storagePut({ userID, imageID, imageFile }) {
  await Storage.put(`${userID}/${imageID}`, imageFile, {
    contentType: "image/png", // contentType is optional
  })
    .then(() => {
      console.log("uploaded to s3");
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
    <div>
      <InputContainer>
        <div>
          <p>Identify Label From Photo</p>
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
          <PreviewStoryImage src={previewImage} alt="" />
          <p>{response}</p>
          <p>{imageBlurb}</p>
        </div>
        <button
          onClick={() => {
            setResponse(null);
            setImageBlurb("");
            identifyLabel(imageFile);
          }}
        >
          Refresh
        </button>
        <button
          onClick={() => {
            createImage({
              input: { userID, labels: response, imageBlurb },
              imageFile,
            });
          }}
        >
          Upload Image
        </button>
      </InputContainer>
    </div>
  );
}

export default PhotoLabel;
