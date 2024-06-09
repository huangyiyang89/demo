import { Flex, Descriptions, Image } from "antd";

export const EventView = ({ event }) => {
  const items = [
    {
      key: "1",
      label: "事件编号",
      children: event.key,
    },
    {
      key: "2",
      label: "摄像头",
      children: event.camera,
    },
    {
      key: "3",
      label: "事件类型",
      children: event.type,
    },
    {
      key: "4",
      label: "检测照片",
      children: <Image src={event.photo} width={200}></Image>,
    },
  ];
  return (
    <div style={{ width: "1600px", background: "#fff", padding: 24 }}>
      <Flex gap={12} style={{ margin: 24 }}>
        <Flex vertical={true} gap={16}>
          <Descriptions column={1} bordered layout={"vertical"} items={items} />
        </Flex>

        <video width="100%" controls>
          <source src={event.replay_url} type="video/mp4" />
          您的浏览器不支持 HTML5 视频标签。
        </video>
      </Flex>
    </div>
  );
};
