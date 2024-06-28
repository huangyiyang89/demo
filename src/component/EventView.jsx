import { PropTypes } from "prop-types";
import { Flex, Descriptions, Image,Typography } from "antd";
import VideoJs from "./VideoJs";
import { localtime } from "../service";
const { Title } = Typography;
export const EventView = ({ event = null }) => {
  const event_items = [
    {
      key: 1,
      label: "事件类型",
      children: event?.event,
    },
    {
      key: 2,
      label: "事件时间",
      children: localtime(event?.time),
    },
    {
      key: 3,
      label: "检测照片",
      children: <Image src={event?.image} width={"10vw"}></Image>,
    },
  ];
  const camera_items = [
    {
      key: 4,
      label: "摄像机",
      children: event?.camera?.name,
    },
    {
      key: 5,
      label: "摄像机描述",
      children: event?.camera?.description,
    },
    {
      key: 6,
      label: "检测区域",
      children: event?.area,
    },
  ];
  return event ? (
    <div style={{ background: "#fff", padding: 16 }}>
      <Flex gap={24} style={{ margin: 0 }}>
        <Flex vertical={true} gap={36}>
          <Descriptions
            column={1}
            bordered
            items={event_items}
            size="small"
          />
          <Descriptions
            column={1}
            bordered
            items={camera_items}
            size="small"
          />
        </Flex>
        <div style={{ flex: 2 }}>
          <VideoJs
            options={{
              sources: [{ src: event.src }],
            }}
            style={{ width: "100% " }}
          ></VideoJs>
        </div>
      </Flex>
    </div>
  ) : (
    ""
  );
};

//propstype
EventView.propTypes = {
  event: PropTypes.object,
};

export default EventView;
