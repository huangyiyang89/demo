// src/EventVideoPlayer.js
import { useState, useRef, useEffect } from "react";
import {
  Layout,
  Select,
  DatePicker,
  Button,
  Flex,
  Typography,
  message,
} from "antd";
import "antd/dist/reset.css";
import FlvPlayer from "../component/FlvPlayer";
import axios from "axios";
const { Title } = Typography;
const { Sider, Content } = Layout;

const Replay = () => {
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [cameras, setCameras] = useState([]);
  const playerRef = useRef(null);

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.get("/api/cameras/");
      const cameras = response.data;
      console.log("cameras:", cameras);
      setCameras(cameras);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);
  return (
    <div>
      <Title level={4}>录像回放</Title>

      <Layout>
        <Sider width={400} style={{ background: "#fff", padding: "20px" }}>
          <Flex gap="small" vertical>
            <h4>选择摄像机</h4>
            <Select
              options={cameras.map((camera) => ({
                value: camera.id,
                label: camera.name,
              }))}
              placeholder="选择摄像机"
              onChange={(e) => {
                const selectedCamera = cameras.find(
                  (camera) => camera.id === e
                );
                setSelectedCamera(selectedCamera);
              }}
              value={selectedCamera?.name}
            ></Select>
            <h4 style={{ marginTop: "20px" }}>选择时间</h4>
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
              onClick={() => {}}
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
            <FlvPlayer url={selectedCamera?.ip_addr}></FlvPlayer>
          </div>
        </Content>
      </Layout>
    </div>
  );
};
export default Replay;
