import { PropTypes } from "prop-types";
import { Flex, Descriptions, Image } from "antd";
import VideoJs from "./VideoJs";
import { localtime } from "../service";

export const EventView = ({ event }) => {
  const items = [
    {
      key: "1",
      label: "事件编号",
      children: event.id,
    },
    {
      key: "2",
      label: "事件时间",
      children: localtime(event.time),
    },
    {
      key: "3",
      label: "摄像机编号",
      children: event.Camera_id,
    },
    
    {
      key: "4",
      label: "检测区域",
      children: event.area,
    },
    {
      key: "5",
      label: "事件类型",
      children: event.event,
    },
    {
      key: "6",
      label: "检测照片",
      children: <Image src={event.image} width={"10vw"}></Image>,
    },
  ];
  return (
    <div style={{ background: "#fff", padding: 0 }}>
      <Flex gap={24} style={{ margin: 0 }}>
        <Flex vertical={true} gap={36}>
          <Descriptions column={1} bordered layout={"vertical"} items={items} />
        </Flex>
        <div style={{ flex: 1}}>
          <VideoJs
            options={{
              sources: [
                { src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" },
              ],
            }}
            style={{ width: "100% " }}
          ></VideoJs>
        </div>
      </Flex>
    </div>
  );
};

//propstype
EventView.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventView;
