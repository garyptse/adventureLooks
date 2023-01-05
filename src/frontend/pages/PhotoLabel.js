//src/frontend/PhotoLabel.js
import React, { useEffect, useState, useContext } from "react";
import { Storage } from "@aws-amplify/storage";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations.ts";
import * as subscriptions from "../../graphql/subscriptions.ts";
import userContext from "../../Auth.ts";

//Amplify Predictions
import { Amplify, Predictions } from "aws-amplify";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";
import awsconfig from "../../aws-exports";
Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
Amplify.register(Predictions);

//OPENAI: Text Generation
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

async function createImage({
  input: { user, labels, imageBlurb },
  setImageID,
}) {
  if (user.username && labels && imageBlurb) {
    await API.graphql({
      query: mutations.createImages,
      variables: {
        input: {
          userImagesId: user.attributes.sub,
          tags: labels,
          content: imageBlurb,
        },
      },
    })
      .then((res) => {
        setImageID(res.data.createImages.id);
      })
      .catch((err) => console.log("Create Image Error: ", err));
  }
}

function PhotoLabel() {
  const [response, setResponse] = useState(null);
  const [imageBlurb, setImageBlurb] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageID, setImageID] = useState(null);

  // API.graphql(graphqlOperation(subscriptions.onCreateImages)).subscribe({
  //   next: (data) => console.log("data: ", data),
  //   error: (error) => console.warn(error),
  // });
  const user = useContext(userContext);

  //GET LABELS
  const identifyLabel = async (event) => {
    const {
      target: { files },
    } = event;
    const [file] = files || [];
    if (!file) {
      return;
    }
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
    const fetchData = async () => {
      await openai
        .createCompletion({
          model: "text-davinci-003",
          prompt: `You are an adventurer. Write a short blurb of your adventure to a location with these features
            ${response}`,
          temperature: 1,
          max_tokens: 150,
        })
        .then((imagePrompt) => {
          setImageBlurb(imagePrompt.data.choices[0].text);
          createImage({
            input: { user, labels: response, imageBlurb },
            setImageID,
          });
        })
        .catch((err) => console.log("OpenAI Error: ", err));
    };
    fetchData();
  }, [response]);

  //ADD IMAGE TO S3
  useEffect(() => {
    async function storagePut() {
      console.log(`${user.username}/${imageID}`, imageFile);
      await Storage.put(`${user.username}/${imageID}`, imageFile, {
        contentType: "image/png", // contentType is optional
      }).catch((error) => {
        console.log("Error uploading file: ", error);
      });
    }
    if (imageID && imageFile) {
      storagePut();
    }
  }, [imageFile, imageID, user.username]);

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <div>
      <div align="center" style={{ backgroundColor: "lightblue" }}>
        <div>
          <p>Identify Label From Photo</p>
          <input type="file" onChange={identifyLabel} />
          <img src={previewImage} alt="" />
          <p>{response}</p>
          <p>{imageBlurb}</p>
        </div>
      </div>
    </div>
  );
}

export default PhotoLabel;
