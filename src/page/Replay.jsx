// src/EventVideoPlayer.js
import { useState, useRef } from "react";
import { Layout, Select, DatePicker, Button, Flex } from "antd";
import "antd/dist/reset.css";
import FlvPlayer from "../component/FlvPlayer";

const { Sider, Content } = Layout;


const Replay = () => {
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [cameras, setCameras] = useState([]);
  const playerRef = useRef(null);


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
              value: camera.id,
              label: camera.name,
            }))}
            placeholder="选择摄像机"
            onChange={setSelectedCamera}
            onClick={setSelectedCamera}
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
          </div>
      </Content>
    </Layout>
  );
};
export default Replay;
