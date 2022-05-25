import React, { useState, useEffect } from "react";
import { ImageListItem } from "@mui/material";

const Checkmark = ({ selected }) => (
  <div
    style={
      selected
        ? { left: "4px", top: "4px", position: "absolute", zIndex: "1" }
        : { display: "none" }
    }
  >
    <svg
      style={{ fill: "white", position: "absolute" }}
      width="24px"
      height="24px"
    >
      <circle cx="12.5" cy="12.2" r="8.292" />
    </svg>
    <svg
      style={{ fill: "#06befa", position: "absolute" }}
      width="24px"
      height="24px"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  </div>
);

const imgStyle = {
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s",
  height: 164,
};
const selectedImgStyle = {
  transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
  transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s",
};

export default function SelectedPhoto({ photo, selected, onSelect }) {
  const [isSelected, setIsSelected] = useState(true);
  const { mediaType, mediaURL } = photo;

  const handleOnClick = () => {
    onSelect(!isSelected, photo);
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  let mediaHTML = undefined;

  if (mediaType == "IMAGE") {
    mediaHTML = (
      <img
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        src={`${mediaURL}`}
        srcSet={`${mediaURL}`}
        loading="lazy"
        onClick={handleOnClick}
        onerror="this.src='https://via.placeholder.com/300'"
      />
    );
  } else if (mediaType == "VIDEO") {
    mediaHTML = (
      <video
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        src={`${mediaURL}`}
        srcSet={`${mediaURL}`}
        loading="lazy"
        className="MuiImageListItem-img"
        onClick={handleOnClick}
        onerror="this.src='https://via.placeholder.com/300'"
      />
    );
  } else if (mediaType == "CAROUSEL_ALBUM") {
    mediaHTML = (
      <img
        style={
          isSelected ? { ...imgStyle, ...selectedImgStyle } : { ...imgStyle }
        }
        src={`${mediaURL}`}
        srcSet={`${mediaURL}`}
        loading="lazy"
        onClick={handleOnClick}
        onerror="this.src='https://via.placeholder.com/300'"
      />
    );
  }

  return (
    <ImageListItem variant="woven" key={mediaURL}>
      <Checkmark selected={isSelected ? true : false} />
      {mediaHTML}
    </ImageListItem>
  );
}
