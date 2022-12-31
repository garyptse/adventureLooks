import React from "react";
import styled from "styled-components";

const ImageDescription = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  opacity: 0%;
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

  // CSS for the Borders
  --s: 10px; /* control the size */
  padding: var(--s);
  border: calc(2 * var(--s)) solid #0000;
  outline: 1px solid #000;
  outline-offset: calc(-1 * var(--s));
  background: conic-gradient(from 90deg at 1px 1px, #0000 25%, #000 0);

  &:hover ${ImageDescription} {
    opacity: 1;
  }
  &:hover ${Image} {
    background-color: #000;
    opacity: 0.5;
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
