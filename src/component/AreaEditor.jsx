import { useState, useRef, useEffect } from "react";
import DrawPad from "./DrawPad";
import VideoJs from "./VideoJs";
import videojs from "video.js";
import { Input, Select, Flex, Button, Radio, message } from "antd";
const { TextArea } = Input;
import { api_host } from "../service";
import axios from "axios";
import PropTypes from "prop-types";

export const AreaEditor = ({ camera, area, onClose }) => {
  const playerRef = useRef(null);
  const [drawPolygon, setDrawPolygon] = useState(false);
  const [drawLine, setDrawLine] = useState(false);
  const [areaId, setAreaId] = useState(area?.id || null);
  const [areaName, setAreaName] = useState(area?.name || "");
  const [areaDescription, setAreaDescription] = useState(area?.description || "");
  const [selectedDetectTypes, setSelectedDetectTypes] = useState([]);
  const [drawingData, setDrawingData] = useState(area?.area_coordinate || "");
  const [eventTypes, setEventTypes] = useState([]);

  const fetchEventTypes = () => {
    axios
      .post(api_host + "/api/device/eventTypes")
      .then((response) => {
        if (response.status === 200) {
          const formattedEventTypes = response.data.map((eventType) => ({
            label: eventType.name,
            value: eventType.id,
          }));
          setEventTypes(formattedEventTypes);
        } else {
          message.error("获取事件类型失败");
        }
      })
      .catch((error) => {
        message.error("获取事件类型失败");
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  useEffect(() => {
    if (area) {
      setAreaId(area.id);
      setAreaName(area.name);
      setAreaDescription(area.description);
      const selectedTypes = area.event_type.split(";").map(id => {
        const eventType = eventTypes.find(event => event.value === parseInt(id, 10));
        return eventType ? eventType.value : id;
      });
      setSelectedDetectTypes(selectedTypes);
      setDrawingData(area.area_coordinate);
    } else {
      setAreaId(null);
      setAreaName("");
      setAreaDescription("");
      setSelectedDetectTypes([]);
      setDrawingData("");
    }
  }, [area, eventTypes]);

  const createArea = (data) => {
    axios
      .post(api_host + "/api/device/creatArea", data)
      .then((response) => {
        if (response.status === 201) {
          message.success("数据保存成功");
          setAreaId(response.data.id); // 假设返回的数据中有区域ID
          onClose(); // Close the modal after a successful save
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
      .post(api_host + `/api/device/updateArea?id=${id}`, data)
      .then((response) => {
        if (response.data.success) {
          message.success("数据更新成功");
          onClose(); // Close the modal after a successful update
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
    setDrawingData(points.data.flatMap((obj) => Object.values(obj)).join(";"));
    setDrawPolygon(false);
    setDrawLine(false);
  };

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
      Camera_id: camera.Camera_id,
      name: areaName,
      description: areaDescription,
      event_type: selectedDetectTypes.join(";"),
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
          <VideoJs
            options={{ sources: [{ src: camera.Camera_addr }] }}
            onReady={handlePlayerReady}
          />
          <DrawPad
            onStartDrawingPolygon={drawPolygon}
            onStartDrawingLine={drawLine}
            onDrawingComplete={handleDrawingComplete}
          />
        </div>
        <Flex vertical gap="middle" style={{ width: "250px" }}>
          <Select disabled defaultValue={camera.Camera_id}>
            <Select.Option value={camera.Camera_id}>
              {camera.name}
            </Select.Option>
          </Select>
          <Input
            placeholder="设置区域名称"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
          <Select
            placeholder="设置检测类型"
            mode="multiple"
            allowClear
            options={eventTypes}
            value={selectedDetectTypes}
            onChange={setSelectedDetectTypes}
          />
          <Radio.Group>
            <Radio.Button value="start" onClick={startDrawingLine}>
              画交叉线
            </Radio.Button>
            <Radio.Button value="end" onClick={startDrawingPolygon}>
              画多边形
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
            {areaId ? "更新" : "新增"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

// PropTypes validation
AreaEditor.propTypes = {
  camera: PropTypes.object.isRequired,
  area: PropTypes.object, // area prop is optional, used for editing existing areas
  onClose: PropTypes.func.isRequired, // onClose callback to close the modal
};
