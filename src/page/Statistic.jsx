import { Row } from "antd";

import { Col } from "antd";
import VideoCanv from "../component/VideoCanv";
import Canv from "../component/Canv";
import { get_cameras } from "../mock";
const Statistic = () => {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    fluid: true,
    aspectRatio: "16:9",
    sources: [
      {
        src: "http://d2zihajmogu5jn.cloudfront.net/elephantsdream/ed_hd.mp4",
        type: "video/mp4",
      },
    ],
  };
  const points = get_cameras[0].regions[0].points
  return (
    <>
      <Row>
        <Col span={12}>
          <div style={{ width: 960, height: 540, position: "relative",display:"block" }}>
            <Canv points={points}></Canv>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Statistic;
