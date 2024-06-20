import { Modal } from "antd";
import PropTypes from "prop-types";
import EventView from "./EventView";
const EventModal = ({ event, open, onClose }) => {
  return (
    <Modal open={open} onCancel={onClose} footer={[]} width={"80vw"}>
      <EventView event={event}></EventView>
    </Modal>
  );
};
EventModal.propTypes = {
  event: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default EventModal;
