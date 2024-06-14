import "../component/VideoJs";
import { Col, Row } from "antd";
import { get_cameras } from "../mock";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import CameraLayout from "../component/CameraLayout";
import "../assets/styles.css";
import { Link } from "react-router-dom";

const Live = () => {


  return (
    <>
      <Row gutter={[18, 32]} style={{ margin: -24 }}>
        {get_cameras.map((camera) => (
          <Col
            key={camera.id}
            span={12}
            style={{ background: "rgba(211, 211, 211, 0.3)" }}
          >
            <div>
              <CameraLayout key={camera.id} camera={camera} />
            </div>
          </Col>
        ))}
        {get_cameras.length < 4 ? (
          <Col key="add" span={12}>
            <Link to="/cameras" key={6} state={{ openModal: true }}>
              <div
                className="clickable-div"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(211, 211, 211, 0.3)",
                  transition: "background 0.3s, transform 0.3s",
                  cursor: "pointer",
                }}
              >
                <PlusOutlined
                  className="plus-icon"
                  style={{
                    fontSize: 56,
                    color: "grey",
                    transition: "transform 0.3s, color 0.3s",
                  }}
                />
              </div>
            </Link>
          </Col>
        ) : null}
      </Row>
    </>
  );
};

export default Live;
