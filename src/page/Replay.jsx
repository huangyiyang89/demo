// src/EventVideoPlayer.js
import { useState, useRef } from "react";
import { Layout, Select, DatePicker, Button, Flex} from "antd";
import VideoJs from "../component/VideoJs";
import "antd/dist/reset.css";

const { Sider, Content } = Layout;

const videoChannels = [
  { id: 1, name: "摄像机1", src: "http://vjs.zencdn.net/v/oceans.mp4#" },
  { id: 2, name: "摄像机2", src: "http://vjs.zencdn.net/v/oceans.mp4##" },
  { id: 3, name: "摄像机3", src: "http://vjs.zencdn.net/v/oceans.mp4###" },
  { id: 4, name: "摄像机4", src: "http://vjs.zencdn.net/v/oceans.mp4####" },
];

const Replay = () => {
  const [selectedChannel, setSelectedChannel] = useState(videoChannels[0].src);
  const [selectedDate, setSelectedDate] = useState(null);
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    fluid: true,
    aspectRatio: "16:9",
    sources: [{ src: selectedChannel, type: "video/mp4" }],
  };

  const handleChannelChange = (value) => {
    setSelectedChannel(value);
    if (playerRef.current) {
      playerRef.current.src([{ src: value, type: "video/mp4" }]);
    }
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  const handleReplayClick = () => {
    console.log('Replay video for date:', selectedDate);
    if (selectedDate) {
      console.log('Replay video for date:', selectedDate);
      if (playerRef.current) {
        console.log('play');
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
            defaultValue={videoChannels[0].src}
            style={{ width: "100%" }}
            onChange={handleChannelChange}
            options={videoChannels.map((channel) => ({
              value: channel.src,
              label: channel.name,
            }))}
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
        <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
      </Content>
    </Layout>
  );
};
export default Replay;
