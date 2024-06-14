import CameraLayout from "../component/CameraLayout";
import { Col, Row } from "antd";


const videoJsOptions = {
    controls: true,
    sources: [{
      src: 'http://vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4',
      aspectRatio: "9:16",
    }]
  };


const Statistic = () => {
  return (
    <>
      Working
    </>
  );
};

export default Statistic;
