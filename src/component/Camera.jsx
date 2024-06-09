import { Flex, List } from "antd";
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoJS from "./VideoJS";
import EventImage from "./EventImage";
export const Camera = ({ camera, onReady }) => {
  const videoOption = {
    autoplay: true,
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
    <Flex>
      <div style={{ width: 200, background: "#001529" }}>
        <InfiniteScroll dataLength={camera.regions[0].events.length}>
          <List>
            {console.log(camera)}
            {camera.regions[0].events.map((event) => {
              return (
                <div key={event.id} style={{ marginTop: 8 }}>
                  <EventImage key={event.id} event={event}></EventImage>
                </div>
              );
            })}
          </List>
        </InfiniteScroll>
      </div>
      <div style={{ width: "100%" }}>
        <VideoJS options={videoOption} onReady={onReady} />
      </div>
    </Flex>
  );
};
