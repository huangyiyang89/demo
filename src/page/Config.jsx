import { useState, useRef } from "react";
import DrawPad from "../component/DrawPad";
import VideoJS from "../component/VideoJS";
import videojs from "video.js";
import { Input, Select, Typography, Flex, Button } from "antd";
const { Title } = Typography;
import { get_cameras, detect_types } from "../mock";
import { Radio } from "antd";
const { TextArea } = Input;

export const Config = () => {
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [drawLine, setDrawLine] = useState(false);

  const startDrawingPolygon = () => {
    setDrawPolygon(true);
    setDrawLine(false);
  };

  const startDrawingLine = () => {
    setDrawPolygon(false);
    setDrawLine(true);
  };

  const handleDrawingComplete = (points) => {
    console.log("Drawing complete with points:", points);
    setDrawPolygon(false);
    setDrawLine(false);
    // 在这里处理绘制完成后的点坐标
  };
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
  const playerRef = useRef(null);
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
      <div style={{width:1284,height:540}}>
        <Flex gap="large">
          <div
            style={{
              width: "960px",
              height: "540px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <VideoJS options={options} onReady={handlePlayerReady}></VideoJS>
            <DrawPad
              onStartDrawingPolygon={drawPolygon}
              onStartDrawingLine={drawLine}
              onDrawingComplete={handleDrawingComplete}
            ></DrawPad>
          </div>
          <Flex vertical gap="middle" style={{ width: "300px" }}>
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
            <Radio.Group>
              <Radio.Button value="start" onClick={startDrawingLine}>画交叉线</Radio.Button>
              <Radio.Button value="end" onClick={setDrawPolygon}>画多边形</Radio.Button>
            </Radio.Group>
            <TextArea
              rows={10}
              disabled={true}
              placeholder="画线数据"
              autoSize = {false}
              
            ></TextArea>
            <div style={{ flex: 1 }}></div>
            <Button type="primary">保存</Button>
          </Flex>
        </Flex>
      </div>
    </>
  );
};
