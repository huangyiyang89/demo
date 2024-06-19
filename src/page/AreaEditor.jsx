import { useState, useRef } from "react";
import DrawPad from "../component/DrawPad";
import VideoJs from "../component/VideoJs";
import videojs from "video.js";
import { Input, Select, Typography, Flex, Button, Radio, message } from "antd";
const { Title } = Typography;
const { TextArea } = Input;
import { detect_types } from "../mock";
import axios from "axios";

export const AreaEditor = () => {
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [drawLine, setDrawLine] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [areaId, setAreaId] = useState(null); // 用于存储区域ID
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [selectedDetectTypes, setSelectedDetectTypes] = useState([]);
  const [drawingData, setDrawingData] = useState("");
  const [cameras, setCameras] = useState([]);
  const createArea = (data) => {
    axios
      .post("http://localhost:8000/api/device/creatArea", data)
      .then((response) => {
        if (response.status == 201) {
          message.success("数据保存成功");
          setAreaId(response.data.id); // 假设返回的数据中有区域ID
        } else {
          message.error("数据保存失败,"+response);
        }
        console.log("Server response:", response);
      })
      .catch((error) => {
        message.error("数据保存失败,"+error);
      });
  };

  const updateArea = (id, data) => {
    axios
      .post(`/api/Area/update/${id}`, data)
      .then((response) => {
        if (response.data.success) {
          message.success("数据更新成功");
        } else {
          message.error("数据更新失败");
        }
        console.log("Server response:", response.data);
      })
      .catch((error) => {
        message.error("数据更新失败");
        console.error("Error:", error);
      });
  };

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
    setDrawingData(points.data.flatMap((obj) => Object.values(obj)).join(";"));
    setDrawPolygon(false);
    setDrawLine(false);
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/device/cameras"
      );
      setCameras(response.data);
    } catch (error) {
      message.error("获取摄像机数据失败");
    }
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
  console.log("drawingData:", drawingData);
  const handleSave = () => {
    const dataToSubmit = {
      Camera_id: selectedCamera,
      name: areaName,
      description: areaDescription,
      event_type: selectedDetectTypes.join(";"),
      area_coordinate: drawingData,
      area_type: 0,
      time:Math.floor(Date.now() / 1000)
    };
    console.log(dataToSubmit);
    if (areaId) {
      // 如果存在区域ID，调用更新接口
      updateArea(areaId, dataToSubmit);
    } else {
      // 否则，调用创建接口
      createArea(dataToSubmit);
    }
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
              options={cameras.map((camera) => ({
                value: camera.Camera_id,
                label: camera.name,
              }))}
              placeholder="选择摄像机"
              onChange={setSelectedCamera}
              onClick={fetchCameras}
            ></Select>
            <Input
              placeholder="设置区域名称"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
            />
            <Input
              placeholder="区域描述"
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
            />
            <Select
              placeholder="设置检测类型"
              mode="multiple"
              allowClear
              options={detect_types.map((type) => ({
                value: type.id,
                label: type.name,
              }))}
              onChange={setSelectedDetectTypes}
            ></Select>
            <Radio.Group>
              {/* <Radio.Button value="start" onClick={startDrawingLine}>
                画交叉线
              </Radio.Button> */}
              <Radio.Button value="end" onClick={startDrawingPolygon}>
                画多边形
              </Radio.Button>
            </Radio.Group>
            <TextArea
              rows={6}
              disabled={true}
              placeholder="画线数据"
              value={drawingData}
            ></TextArea>
            <div style={{ flex: 1 }}></div>
            <Button type="primary" onClick={handleSave}>
              新增
            </Button>
          </Flex>
        </Flex>
      </div>
    </>
  );
};
