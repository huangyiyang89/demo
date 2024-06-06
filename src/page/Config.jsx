import React from "react";
import Draw from "../component/Draw";
import VideoJS from "../component/VideoJS";
import videojs from "video.js";
import { Typography } from "antd";
const { Title } = Typography;

export const Config = () => {
  const options = {
    autoplay: true,
    controls: true,
    aspectRatio: "16:9",
    sources: [
      {
        src: "http://vjs.zencdn.net/v/oceans.mp4",
        type: "video/mp4",
      },
    ],
  };
  const playerRef = React.useRef(null);
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };
  return (
    <>
      <Title level={4}>监控设置</Title>
      <div
        style={{
          width: "960px",
          height: "540px",
          position: "relative",
          marginTop: 30,
          marginBottom: 50,
          textAlign: "center",
        }}
      >
        <VideoJS options={options} onReady={handlePlayerReady}></VideoJS>
        <Draw></Draw>
      </div>
    </>
  );
};
