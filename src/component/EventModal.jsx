import { Modal, Button, Descriptions, Image, Row, Col, Flex } from "antd";
import PropTypes from "prop-types";

const EventModal = ({ event, open, onClose }) => {

  const items = [
    {
      key: '1',
      label: '事件编号',
      children: event.id,
    },
    {
      key: '2',
      label: '摄像头',
      children: event.camera,
    },
    {
      key: '3',
      label: '事件类型',
      children: event.detect_type,
    },
    {
      key: '4',
      label: '检测照片',
      children: <Image src={event.pic_url} width={200}></Image>,
    },
  ]
  return (
    <Modal
      width={1600}
      open={open}
      onCancel={onClose}
      footer={[]}
    >
      <Flex gap={12} style={{margin:24}}>
        <Flex vertical={true} gap={16}>
          <Descriptions column={1} bordered layout={"vertical"} items={items} />
        </Flex>

        <video width="100%" controls>
          <source src={event.replay_url} type="video/mp4" />
          您的浏览器不支持 HTML5 视频标签。
        </video>
      </Flex>
    </Modal>
  );
};
EventModal.propTypes = {
  event: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default EventModal;
