import React from "react";
import "../component/VideoJS";
import { Col, Row } from "antd";
import videojs from "video.js";

import { get_cameras, detect_types } from "../mock";
import { Camera } from "../component/Camera";

const Live = () => {
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
      <Row gutter={[12, 12]}>
        {get_cameras.map((camera) => (
          <Col key={camera.id} span={get_cameras.length == 1 ? 24 : 12}>
            <Camera key={camera.id} camera={camera} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Live;
