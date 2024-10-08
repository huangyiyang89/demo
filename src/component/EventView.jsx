import { PropTypes } from "prop-types";
import { Flex, Descriptions, Image } from "antd";
import FlvPlayer from "./FlvPlayer";

export const EventView = ({ event = null }) => {
  const event_items = [
    {
      key: 1,
      label: "事件类型",
      children: event?.eventtype.name,
    },
    {
      key: 2,
      label: "事件时间",
      children: event?.localtime,
    },
    {
      key: 3,
      label: "摄像机",
      children: event?.camera?.name,
    },
    {
      key: 4,
      label: "摄像机描述",
      children: event?.camera?.description,
    },
    {
      key: 5,
      label: "检测区域",
      children: event?.area_name,
    },
  ];
  return event ? (
    <div style={{ background: "#fff", padding: 16 }}>
      <Flex gap={24} style={{ margin: 0, flex: 1 }}>
        <Flex vertical={true} gap={36}>

          <Descriptions column={1} bordered items={event_items} size="small" style={{maxWidth:300}}  />
          <Image
            src={event.image}
            width={300}
            style={{
              borderRadius: 4,
              border: "6px solid rgba(5, 5, 5, 0.06);",
            }}
          ></Image>
        </Flex>
        <div style={{ position: "relative", width: "100%", flex: 1 }}>
          <div
            style={{
              width: "100%",
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
            }}
          >
            <FlvPlayer url={`/api/cameras/${event?.camera_id}/url?time=${event.timestamp}`}></FlvPlayer>
          </div>
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
