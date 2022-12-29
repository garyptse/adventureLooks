//src/frontend/PhotoLabel.js
import React, { useEffect, useState } from "react";

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

function PhotoLabel() {
  const [response, setResponse] = useState(null);
  const [imageBlurb, setImageBlurb] = useState("");
  const [imageFile, setImageFile] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      if (response) {
        const imagePrompt = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `You are an adventurer. Write a short blurb of your adventure to a location with these features
            ${response}`,
          temperature: 1,
          max_tokens: 150,
        });
        setImageBlurb(imagePrompt.data.choices[0].text);
      }
    };
    fetchData();
  }, [response]);

  const previewImage = imageFile ? URL.createObjectURL(imageFile) : null;
  return (
    <div>
      <div align="center" style={{ backgroundColor: "lightblue" }}>
        <div>
          <p>Identify Label From Photo</p>
          <input type="file" onChange={identifyLabel}></input>
          <img src={previewImage} alt="" />
          <p>{response}</p>
          <p>{imageBlurb}</p>
        </div>
      </div>
    </div>
  );
}

export default PhotoLabel;
