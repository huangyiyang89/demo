import { Flex, List } from "antd";
import VideoJS from "./VideoJS";
import EventImage from "./EventImage";
import PropTypes from "prop-types";

export const Camera = ({ camera, onReady }) => {
  const videoOption = {
    autoplay: false,
    controls: true,
    fluid: true,
    aspectRatio: "16:9",
    sources: [
      {
        src: camera.src,
        type: "video/mp4",
        aspectRatio: "9:16",
      },
    ],
  };
  return (
    <Flex style={{ height: "auto" }}>
      <List
        style={{
          overflowY: "auto",
          width: 200,
          position: "absolute ",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {camera.regions[0].events.map((event) => {
          return (
            <div key={event.id} style={{ marginTop: 8 }}>
              <EventImage key={event.id} event={event}></EventImage>
            </div>
          );
        })}
      </List>
      <div style={{ width: "200px", height: "100%", display: "block" }}></div>
      <div style={{ flex: 1 }}>
        <VideoJS options={videoOption} onReady={onReady} />
      </div>
    </Flex>
  );
};

Camera.propTypes = {
  camera: PropTypes.object,
  onReady: PropTypes.func,
};

export default Camera;
