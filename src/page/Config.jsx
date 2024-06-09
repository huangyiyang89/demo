import React from "react";
import Draw from "../component/Draw";
import VideoJS from "../component/VideoJS";
import videojs from "video.js";
import { Input, Select, Typography, Flex, Button } from "antd";
const { Title } = Typography;
import { get_cameras, detect_types } from "../mock";

export const Config = () => {
  const options = {
    autoplay: false,
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
      <Title level={4}>区域设置</Title>
      <Flex gap="large">
        <div
          style={{
            width: "640px",
            height: "360px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <VideoJS options={options} onReady={handlePlayerReady}></VideoJS>
          <Draw></Draw>
        </div>
        <Flex vertical gap="middle" style={{ width: "300px" }} justify="space-between">
          <Select
            options={get_cameras.map((camera) => ({
              value: camera.id,
              label: camera.name,
            }))}
            placeholder="选择摄像机"
          ></Select>

          <Input placeholder="设置区域名称" />
          <Input placeholder="区域描述" />
          <Select
            placeholder="设置检测类型"
            mode="multiple"
            allowClear
            options={detect_types.map((type) => ({
              value: type.name,
              label: type.name,
            }))}
          ></Select>
          <Button type="primary">保存</Button>
        </Flex>
      </Flex>
    </>
  );
};
