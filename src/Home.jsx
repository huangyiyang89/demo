import React from "react";
import "./component/VideoJS";
import VideoJS from "./component/VideoJS";
import videojs from "video.js";
import { Button, Col, Row } from "antd";

const Home = () => {
  const playerRef = React.useRef(null);

  //application/x-mpegURL  video/mp4
  const videoJsOptions = [
    {
      autoplay: true,
      controls: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "9:16",
        },
      ],
    },
    {
      autoplay: false,
      controls: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "9:16",
        },
      ],
    },
    {
      autoplay: false,
      controls: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
          aspectRatio: "16:9",
        },
      ],
    },
    {
      autoplay: false,
      controls: true,
      fluid: true,
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
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col span={12}>
          <VideoJS options={videoJsOptions[0]} onReady={handlePlayerReady} />
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="danger">Danger</Button>
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[1]} onReady={handlePlayerReady} />
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="danger">Danger</Button>
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[0]} onReady={handlePlayerReady} />
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="danger">Danger</Button>
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[1]} onReady={handlePlayerReady} />
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="danger">Danger</Button>
        </Col>
      </Row>
    </>
  );
};

export default Home;
