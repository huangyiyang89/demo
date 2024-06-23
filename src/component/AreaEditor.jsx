import { useState, useEffect } from "react";
import DrawPad from "./DrawPad";
import VideoJs from "./VideoJs";
import { Input, Select, Flex, Button, Radio, message } from "antd";
const { TextArea } = Input;
import { api_host, convertPolygonPoints } from "../service";
import axios from "axios";
import PropTypes from "prop-types";
import { fetchCameras, fetchEventTypes } from "../service";

export const AreaEditor = ({ camera = null, area = null, onUpdate }) => {
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [drawLine, setDrawLine] = useState(false);
  const [areaId, setAreaId] = useState(area?.id || null);
  const [areaName, setAreaName] = useState(area?.name || "");
  const [areaDescription, setAreaDescription] = useState(
    area?.description || ""
  );
  const [selectedDetectTypes, setSelectedDetectTypes] = useState([]);
  const [selectedDetectTypesString, setSelectedDetectTypesString] = useState(
    area?.event_type || ""
  );
  const [drawingData, setDrawingData] = useState(area?.area_coordinate || "");
  const [selectedCamera, setSelectedCamera] = useState(camera || null);
  const [cameras, setCameras] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    
    fetchCameras().then((data) => setCameras(data));
    fetchEventTypes().then((data) => setEventTypes(data));
  }, []);

  // useEffect(() => {
  //   if (camera) {
  //     setSelectedCamera(camera);
  //   }
  // }, [camera]);

  useEffect(() => {
    if (area) {
      console.log(area)
      setAreaId(area.id);
      setAreaName(area.name);
      setSelectedDetectTypesString(area.event_type);
      setAreaDescription(area.description);
      setDrawingData(area.area_coordinate || "");
      setSelectedCamera(area.camera);
    }
  }, [area]);

  useEffect(() => {
    if (eventTypes.length > 0 && selectedDetectTypesString) {
      const selectedTypes = selectedDetectTypesString
        .split(";")
        .map((id) => {
          const findEventName = eventTypes.find(
            (event) => event.id === parseInt(id, 10)
          );
          return findEventName ? findEventName.name : "";
        })
        .filter((name) => name !== "");
      setSelectedDetectTypes(selectedTypes);
    }
  }, [eventTypes, selectedDetectTypesString]);


  const resetState = () => {
    setDrawingData("");
    setAreaId(null);
    setAreaName("");
    setSelectedDetectTypes([]);
    setAreaDescription("");
    setSelectedCamera(null);

  };

  const createArea = (data) => {
    axios
      .post(api_host + "/api/device/creatArea", data)
      .then((response) => {
        if (response.status === 201) {
          message.success("数据保存成功");
          onUpdate();
          resetState();
        } else {
          message.error("数据保存失败," + response);
        }
      })
      .catch((error) => {
        message.error("数据保存失败");
        console.error("Error:", error);
      });
  };

  const updateArea = (id, data) => {
    axios
      .post(api_host + `/api/device/updateArea?area_id=${id}`, data)
      .then((response) => {
        if (response.status === 200) {
          message.success("数据更新成功");
          onUpdate();
          resetState();
        } else {
          message.error("数据更新失败");
        }
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
    console.log("drawing complete")
    setDrawingData(points.data.flatMap((obj) => Object.values(obj)).join(";"));
    setDrawPolygon(false);
    setDrawLine(false);
  };

  const handleSave = () => {
    const eventTypeIds = selectedDetectTypes
      .map((typeName) => {
        const eventType = eventTypes.find((event) => event.name === typeName);
        return eventType ? eventType.id : null;
      })
      .filter((id) => id !== null)
      .join(";");

    const dataToSubmit = {
      Camera_id: selectedCamera.Camera_id,
      name: areaName,
      description: areaDescription,
      event_type: eventTypeIds,
      area_coordinate: drawingData,
      area_type: 0,
      time: Math.floor(Date.now() / 1000),
    };

    if (areaId) {
      updateArea(areaId, dataToSubmit);
    } else {
      createArea(dataToSubmit);
    }
  };

  return (
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
          <VideoJs src={selectedCamera?.Camera_addr} />
          <DrawPad
            data={{
              type: "polygon",
              data: convertPolygonPoints(drawingData),
            }}
            onStartDrawingPolygon={drawPolygon}
            onStartDrawingLine={drawLine}
            onDrawingComplete={handleDrawingComplete}
          />
        </div>
        <Flex vertical gap="middle" style={{ width: "250px" }}>
          <Select
            defaultValue={selectedCamera?.Camera_id}
            options={cameras.map((camera) => ({
              value: camera.Camera_id,
              label: camera.name,
            }))}
            placeholder="选择摄像机"
            onChange={(value) => {
              const camera = cameras.find((cam) => cam.Camera_id === value);
              setSelectedCamera(camera);
            }}
          />
          <Input
            placeholder="设置区域名称"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
          <Select
            placeholder="设置检测类型"
            mode="multiple"
            allowClear
            options={eventTypes.map((eventType) => ({
              value: eventType.name,
              label: eventType.name,
            }))}
            value={selectedDetectTypes}
            onChange={(values) => setSelectedDetectTypes(values)}
          />
          <Radio.Group>
            {/* <Radio.Button value="start" onClick={startDrawingLine}>
              绘制交叉线
            </Radio.Button> */}
            <Radio.Button value="end" onClick={startDrawingPolygon}>
              绘制多边形
            </Radio.Button>
          </Radio.Group>
          <TextArea
            rows={6}
            disabled
            placeholder="画线数据"
            value={drawingData}
          />
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
