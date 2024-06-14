import React from "react";
import "../component/VideoJS";
import { Col, Row } from "antd";
import videojs from "video.js";

import { get_cameras, detect_types } from "../mock";
import { Camera } from "../component/Camera";
import PlusSquareOutlined from "@ant-design/icons/PlusSquareOutlined";

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
        {get_cameras.length < 4 ? <Col key="add" span={12}><PlusSquareOutlined width={100}/></Col> : null}
      </Row>
    </>
  );
};

export default Live;
