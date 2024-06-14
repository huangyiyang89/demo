import { Flex, List } from "antd";
import VideoJs from "./VideoJs";
import EventImage from "./EventImage";
import PropTypes from "prop-types";
import Canv from "./Canv";
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
    <Flex style={{ height: "auto" }} gap={0}>
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
      <div style={{ flex: 1,position:"relative"}}>
        <VideoJs options={videoOption} onReady={onReady} />
        <Canv
          shape={{
            type: "polygon",
            data: [
              { x: 288, y: 120 },
              { x: 686, y: 120 },
              { x: 682, y: 414 },
              { x: 282, y: 393 },
              { x: 287, y: 120 },
              { x: 288, y: 120 },
            ],
          }}
        ></Canv>
        <Canv
          shape={{
            type: "polygon",
            data: [
              { x: 228, y: 120 },
              { x: 636, y: 130 },
              { x: 682, y: 454 },
              { x: 222, y: 313 },
              { x: 287, y: 110 },
              { x: 228, y: 120 },
            ],
          }}
        ></Canv>
      </div>
    </Flex>
  );
};

Camera.propTypes = {
  camera: PropTypes.object,
  onReady: PropTypes.func,
};

export default Camera;
