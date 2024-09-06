// src/EventVideoPlayer.js
import { useState, useEffect } from "react";
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
import dayjs from "dayjs";

const { Title } = Typography;
const { Sider, Content } = Layout;

const Replay = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);

  const [selectedTimestamp, setSelectedTimestamp] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [url, setUrl] = useState("");

  const handleDateChange = (date) => {
    if (date) {
      const timestamp = date.unix();
      setSelectedTimestamp(timestamp);
    }
  };

  const fetchCameras = async () => {
    try {
      const response = await axios.get("/api/cameras/");
      const cameras = response.data;
      console.log("cameras:", cameras);
      setCameras(cameras);
    } catch (error) {
      if (error.response.status == 500) {
        message.error("服务器未响应，拉取摄像机列表失败！");
      } else {
        message.error(error.response.data.message);
      }
    }
  };

  const handlePlayButtonClick = () => {
    if (selectedCamera === null) {
      message.info("请选择摄像机");
      return;
    }
    if (selectedTimestamp === 0) {
      message.info("请选择时间");
      return;
    }
    setUrl(`/api/cameras/${selectedCamera.id}/url?time=${selectedTimestamp}`);
  };

  const now = dayjs();

  // 3个月之前的日期
  const threeMonthsAgo = dayjs().subtract(3, "months");

  // 禁用日期函数
  const disabledDate = (current) => {
    // 禁用今天之后的日期和三个月之前的日期
    return (
      current &&
      (current.isAfter(now, "day") || current.isBefore(threeMonthsAgo, "day"))
    );
  };

  // 禁用时间函数
  const disabledTime = (current) => {
    if (!current) return {};

    const isToday = current.isSame(now, "day");
    const isThreeMonthsAgo = current.isSame(threeMonthsAgo, "day");

    // 如果选择的是今天，禁用未来的时间
    if (isToday) {
      const hours = Array.from({ length: 24 }, (_, i) => i).filter(
        (h) => h > now.hour()
      );
      return {
        disabledHours: () => hours,
      };
    }

    // 如果选择的是三个月前的日期，禁用早于该日的时间
    if (isThreeMonthsAgo) {
      const hours = Array.from({ length: 24 }, (_, i) => i).filter(
        (h) => h < threeMonthsAgo.hour()
      );
      return {
        disabledHours: () => hours,
      };
    }

    return {};
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
              onChange={(value) => {
                handleDateChange(value);
              }}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
            <Button
              type="primary"
              style={{ marginTop: "20px" }}
              onClick={handlePlayButtonClick}
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
            <FlvPlayer url={url}></FlvPlayer>
          </div>
        </Content>
      </Layout>
    </div>
  );
};
export default Replay;
