import { useState, useEffect } from "react";
import { Input, Select, Flex, Button, message } from "antd";
const { TextArea } = Input;
import axios from "axios";
import PropTypes from "prop-types";
import FlvPlayer from "./FlvPlayer";
import PolygonDrawPad from "./PolygonDrawPad";
import { stringToPoints, pointsToString, arrayToString, stringToArray } from "../service";
import CrossLinesDrawPad from "./CrossLinesDrawPad";
import CrossDirectionDrawPad from "./CrossDirectionDrawPad";

export const AreaEditor = ({ camera, area = null, onUpdate }) => {
  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [drawingCrossLines, setDrawingCrossLines] = useState(false);
  const [drawingCrossDirection, setDrawingCrossDirection] = useState(false);

  const [areaId, setAreaId] = useState(area?.id || null);
  const [areaName, setAreaName] = useState(area?.name || "");
  const [selectedDetectTypes, setSelectedDetectTypes] = useState([]);
  const [polygonData, setPolygonData] = useState([]);
  const [crossLinesData, setCrossLinesData] = useState([]);
  const [crossDirectionData, setCrossDirectionData] = useState([]);

  const [eventTypes, setEventTypes] = useState([]);

  const aspectRatio = camera
    ? camera.frame_width / camera.frame_height
    : 16 / 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/eventtypes/");
        const eventTypes = response.data;
        setEventTypes(eventTypes);
      } catch (error) {
        if (error.response.status==500) {
          message.error("服务器未响应，，拉取事件类型列表失败！");
        } else {
          message.error(error.response.data.message);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (area) {
      console.log(area);
      setAreaId(area.id);
      setAreaName(area.name);
      setSelectedDetectTypes(stringToArray(area.algoparam?.eventtype_ids));
      setPolygonData(stringToPoints(area.coordinates));
      setCrossLinesData(stringToPoints(area.algoparam?.cross_line));
      setCrossDirectionData(stringToPoints(area.algoparam?.cross_direction));
    }
  }, [area]);

  const resetState = () => {
    setPolygonData([]);
    setCrossDirectionData([]);
    setCrossLinesData([]);
    setAreaId(null);
    setAreaName("");
    setSelectedDetectTypes([]);
  };

  const createArea = async (data) => {
    try {
      const response = await axios.post("/api/areas/", data);
      const area = response.data;
      onUpdate && onUpdate(area);
      resetState();
    } catch (error) {
      if (error.response.status==500) {
        message.error("服务器未响应，添加区域失败！");
      } else {
        message.error(error.response.data.message);
      }
    }
  };

  const updateArea = async (id, data) => {
    try {
      const response = await axios.patch(`/api/areas/${id}`, data);
      message.success("数据更新成功");
      onUpdate && onUpdate(response.data);
      resetState();
    } catch (error) {
      if (error.response.status==500) {
        message.error("服务器未响应，更新区域数据失败！");
      } else {
        message.error(error.response.data.message);
      }
    }
  };

  const startDrawingPolygon = () => {
    setPolygonData([]);
    setDrawingPolygon(true);
  };
  const startDrawingCrossLines = () => {
    setCrossLinesData([]);
    setDrawingCrossLines(true);
  };

  const startDrawingCrossDirection = () => {
    setCrossDirectionData([]);
    setDrawingCrossDirection(true);
  };

  const handlePolygonComplete = (data) => {
    setPolygonData(data);
    setDrawingPolygon(false);
  };

  const handleCrossLinesComplete = (data) => {
    setCrossLinesData(data);
    setDrawingCrossLines(false);
  };

  const handleCrossDirectionComplete = (data) => {
    setCrossDirectionData(data);
    setDrawingCrossDirection(false);
  };

  const includeCross = () => {
    if (
      selectedDetectTypes &&
      Array.isArray(selectedDetectTypes) &&
      selectedDetectTypes.includes("1202")
    ) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  };

  const handleSave = async () => {
    if (!areaName.trim()) {
      message.error("区域名称不能为空！");
      return;
    }

    const algoparam = {
      eventtype_ids: arrayToString(selectedDetectTypes),
      cross_line: pointsToString(crossLinesData),
      cross_direction: pointsToString(crossDirectionData),
    };

    const dataToSubmit = {
      camera_id: camera.id,
      name: areaName,
      coordinates: pointsToString(polygonData),
      algoparam: algoparam,
    };
    console.log("dataToSubmit:",dataToSubmit);
    if (areaId) {
      updateArea(areaId, dataToSubmit);
    } else {
      createArea(dataToSubmit);
    }
  };

  return (
    <div
      style={{ width: aspectRatio === 16 / 9 ? 1234 : 1234 - 240, height: 540 }}
    >
      <Flex gap="large">
        <div
          style={{
            width: aspectRatio === 16 / 9 ? 960 : 720,
            height: "540px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <FlvPlayer url={`/api/cameras/${camera.id}/url`} isLive={true}></FlvPlayer>

          <PolygonDrawPad
            videoWidth={camera?.frame_width}
            width={aspectRatio === 16 / 9 ? 960 : 720}
            isDrawing={drawingPolygon}
            onDrawingComplete={handlePolygonComplete}
            edit_data={polygonData}
          ></PolygonDrawPad>

          <CrossLinesDrawPad
            videoWidth={camera?.frame_width}
            width={aspectRatio === 16 / 9 ? 960 : 720}
            isDrawing={drawingCrossLines}
            onDrawingComplete={handleCrossLinesComplete}
            edit_data={crossLinesData}
          ></CrossLinesDrawPad>

          <CrossDirectionDrawPad
            videoWidth={camera?.frame_width}
            width={aspectRatio === 16 / 9 ? 960 : 720}
            isDrawing={drawingCrossDirection}
            onDrawingComplete={handleCrossDirectionComplete}
            edit_data={crossDirectionData}
          ></CrossDirectionDrawPad>
        </div>

        <Flex
          vertical
          gap="middle"
          style={{ width: "250px", alignItems: "stretch" }}
        >
          <Input value={camera.name} disabled />
          <Input
            placeholder="设置区域名称"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />

          <Button onClick={startDrawingPolygon}>绘制检测区域</Button>
          <TextArea
            rows={3}
            disabled
            placeholder="画线数据"
            value={pointsToString(polygonData)}
          />
          <Select
            placeholder="设置检测类型"
            mode="multiple"
            allowClear
            options={eventTypes.map((eventType) => ({
              value: eventType.id,
              label: eventType.name,
            }))}
            value={selectedDetectTypes}
            onChange={(values) => setSelectedDetectTypes(values)}
          />
          <div style={includeCross()}>
            <Button style={{ width: "50%" }} onClick={startDrawingCrossLines}>
              绘制围栏
            </Button>

            <Button
              style={{ width: "50%" }}
              onClick={startDrawingCrossDirection}
            >
              绘制方向
            </Button>
          </div>
          <div style={{ flex: 1 }}></div>
          <Button type="primary" onClick={handleSave}>
            {areaId ? "更新区域" : "新增区域"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

// PropTypes validation
AreaEditor.propTypes = {
  camera: PropTypes.object,
  area: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};
