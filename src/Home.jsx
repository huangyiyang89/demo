import React from "react";
import "./component/VideoJS";
import VideoJS from "./component/VideoJS";
import videojs from "video.js";
import { Button, Col, Row } from "antd";

const Home = () => {
  const playerRef = React.useRef(null);

  const videoJsOptions = [
    {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
        },
      ],
    },
    {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
        },
      ],
    },
    {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: "http://vjs.zencdn.net/v/oceans.mp4",
          type: "video/mp4",
        },
      ],
    },
    {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: "http://vjs.zencdn.net/v/oceans.mp4",
            type: "video/mp4",
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
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <VideoJS options={videoJsOptions[0]} onReady={handlePlayerReady} />
          <p>
          <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="danger">Danger</Button>
          </p>
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[1]} onReady={handlePlayerReady} />
          <p>
          <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="danger">Danger</Button>
          </p>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <VideoJS options={videoJsOptions[2]} onReady={handlePlayerReady} />
          <p>
          <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="danger">Danger</Button>
          </p>
        </Col>
        <Col span={12}>
          <VideoJS options={videoJsOptions[3]} onReady={handlePlayerReady} />
          <p>
          <Button type="primary">Primary</Button>
            <Button>Default</Button>
            <Button type="danger">Danger</Button>
          </p>
        </Col>
      </Row>
    </>
  );
};

export default Home;
