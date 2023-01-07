import React from "react";
import styled from "styled-components";

const ImageDescription = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  opacity: 0%;
  width: 25em;
  text-align: center;
  font-size: 0.75em;
  text-shadow: 1px 1px 4px #000000;
`;
const Image = styled.img`
  width: 100%;
`;

const StoryBox = styled.div`
  display: flex;
  position: relative;
  height: 20em;
  width: 25em;
  flex: 0 0 auto;
  margin: 0.8em;
  transition: transform 0.2s;
  z-index: 0;
  cursor: pointer;

  // CSS for the Borders
  --s: 10px; /* control the size */
  padding: var(--s);
  border: calc(2 * var(--s)) solid #0000;
  outline: 1px solid #f0f0c9;
  outline-offset: calc(-1 * var(--s));
  background: conic-gradient(from 90deg at 1px 1px, #0000 25%, #f0f0c9 0);

  &:hover ${ImageDescription} {
    opacity: 1;
    z-index: 1;
    text-size: 0.6em !important;
    transform: 0.667 translate(-50%, -50%) !important;
  }
  &:hover ${Image} {
    background-color: #000;
    opacity: 35%;
    z-index: 1;
  }
  &:hover {
    transform: scale(1.2);
    z-index: 1;
  }
`;

function StoryContainer(storyContainerProps) {
  const { children, imageFile } = storyContainerProps;
  return (
    <StoryBox {...storyContainerProps}>
      {imageFile ? <Image src={imageFile} /> : null}
      <ImageDescription>{children}</ImageDescription>
    </StoryBox>
  );
}

export default StoryContainer;
