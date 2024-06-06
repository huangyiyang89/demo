import React from "react";
import "../component/VideoJS";
import VideoJS from "../component/VideoJS";
import videojs from "video.js";
import { Col, Row } from "antd";

const Live = () => {
  const playerRef = React.useRef(null);

  //application/x-mpegURL  video/mp4
  const videoJsOptions = [
    {
      autoplay: true,
      controls: true,
      fluid: true,
      aspectRatio:"16:9",
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "9:16",
        },
      ],
    },
    {
      autoplay: true,
      controls: true,
      fluid: true,
      aspectRatio:"16:9",
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "9:16",
        },
      ],
    },
    {
      autoplay: true,
      controls: true,
      fluid: true,
      aspectRatio:"16:9",
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "16:9",
        },
      ],
    },
    {
      autoplay: true,
      controls: true,
      fluid: true,
      aspectRatio:"16:9",
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "1:1",
        },
      ],
    },
  ];

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
      <Row>
        <Col span={12}>
          <div></div>
          <VideoJS options={videoJsOptions[0]} onReady={handlePlayerReady} />
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[1]} onReady={handlePlayerReady} />
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[0]} onReady={handlePlayerReady} />
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[1]} onReady={handlePlayerReady} />
        </Col>
      </Row>
    </>
  );
};

export default Live;
