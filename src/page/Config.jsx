import { useState, useRef } from "react";
import DrawPad from "../component/DrawPad";
import VideoJs from "../component/VideoJs";
import videojs from "video.js";
import { Input, Select, Typography, Flex, Button, Radio, message } from "antd";
const { Title } = Typography;
const { TextArea } = Input;
import { get_cameras, detect_types } from "../mock";

export const Config = () => {
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [drawLine, setDrawLine] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [regionDescription, setRegionDescription] = useState("");
  const [selectedDetectTypes, setSelectedDetectTypes] = useState([]);
  const [drawingData, setDrawingData] = useState("");
  
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
    setDrawingData(JSON.stringify(points));
    setDrawPolygon(false);
    setDrawLine(false);
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

    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const handleSave = () => {
    const dataToSubmit = {
      cameraId: selectedCamera,
      regionName,
      regionDescription,
      detectTypes: selectedDetectTypes,
      drawingData,
    };

    console.log("Data to submit:", dataToSubmit);

    // 请求服务器
    fetch("/api/region/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })
    .then(response => response.json())
    .then(data => {
      message.success("数据保存成功");
      console.log("Server response:", data);
    })
    .catch(error => {
      message.error("数据保存失败");
      console.error("Error:", error);
    });
  };

  return (
    <>
      <Title level={4}>区域设置</Title>
      <div style={{ width: 1234, height: 540 }}>
        <Flex gap="large">
          <div
            style={{
              width: "960px",
              height: "540px",
              position: "relative",
              textAlign: "center",
            }}
          >
            <VideoJs options={options} onReady={handlePlayerReady}></VideoJs>
            <DrawPad
              onStartDrawingPolygon={drawPolygon}
              onStartDrawingLine={drawLine}
              onDrawingComplete={handleDrawingComplete}
            ></DrawPad>
          </div>
          <Flex vertical gap="middle" style={{ width: "250px" }}>
            <Select
              options={get_cameras.map((camera) => ({
                value: camera.id,
                label: camera.name,
              }))}
              placeholder="选择摄像机"
              onChange={setSelectedCamera}
            ></Select>
            <Input
              placeholder="设置区域名称"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
            />
            <Input
              placeholder="区域描述"
              value={regionDescription}
              onChange={(e) => setRegionDescription(e.target.value)}
            />
            <Select
              placeholder="设置检测类型"
              mode="multiple"
              allowClear
              options={detect_types.map((type) => ({
                value: type.name,
                label: type.name,
              }))}
              onChange={setSelectedDetectTypes}
            ></Select>
            <Radio.Group>
              <Radio.Button value="start" onClick={startDrawingLine}>画交叉线</Radio.Button>
              <Radio.Button value="end" onClick={startDrawingPolygon}>画多边形</Radio.Button>
            </Radio.Group>
            <TextArea
              rows={6}
              disabled={true}
              placeholder="画线数据"
              value={drawingData}
            ></TextArea>
            <div style={{ flex: 1 }}></div>
            <Button type="primary" onClick={handleSave}>保存</Button>
          </Flex>
        </Flex>
      </div>
    </>
  );
};
