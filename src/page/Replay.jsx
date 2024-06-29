// src/EventVideoPlayer.js
import { useState, useRef } from "react";
import { Layout, Select, DatePicker, Button, Flex, message } from "antd";
import "antd/dist/reset.css";
import axios from "axios";
import Canv from "../component/Canv";
import FlvPlayer from "../component/FlvPlayer";

const { Sider, Content } = Layout;


const Replay = () => {
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [cameras, setCameras] = useState([]);
  const playerRef = useRef(null);

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


  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleReplayClick = () => {
    console.log("Replay video for date:", selectedDate);
    if (selectedDate) {
      console.log("Replay video for date:", selectedDate);
      if (playerRef.current) {
        console.log("play");
        playerRef.current.play();
      }
    }
  };

  return (
    <Layout>
      <Sider width={300} style={{ background: "#fff", padding: "20px" }}>
        <Flex gap="small" vertical>
          <h4>选择摄像机</h4>
          <Select
            options={cameras.map((camera) => ({
              value: camera.Camera_id,
              label: camera.name,
            }))}
            placeholder="选择摄像机"
            onChange={setSelectedCamera}
            onClick={fetchCameras}
          />
          <h4 style={{ marginTop: "20px" }}>选择日期</h4>
          <DatePicker
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={(value, dateString) => {
              console.log("Selected Time: ", value);
              console.log("Formatted Selected Time: ", dateString);
            }}
            onOk={handleDateChange}
          />
          <Button
            type="primary"
            style={{ marginTop: "20px" }}
            onClick={handleReplayClick}
          >
            回放
          </Button>
        </Flex>
      </Sider>
      <Content>
      <div
            style={{
              width: "100%",
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
            }}
          >
            <FlvPlayer camera={selectedCamera}></FlvPlayer>
            {selectedCamera?.areas?.map((area) => (
              <Canv key={area.id} area={area}></Canv>
            ))}
          </div>
      </Content>
    </Layout>
  );
};
export default Replay;
