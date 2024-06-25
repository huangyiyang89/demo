import "../component/VideoJs";
import { Col, Row } from "antd";
import { fetchAreas, fetchCameras, fetchEvents } from "../service";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import CameraLayout from "../component/CameraLayout";
import "../assets/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Live = () => {
  const [currentCameras, setCurrentCameras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cameras = await fetchCameras();
        const events = await fetchEvents();
        const areas = await fetchAreas();

        const camerasWithDetails = cameras.map((camera) => ({
          ...camera,
          events: events.filter((event) => event.Camera_id === camera.Camera_id),
          areas: areas.filter((area) => area.Camera_id === camera.Camera_id),
        }));

        setCurrentCameras(camerasWithDetails);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Row gutter={[16, 16]} style={{ margin: -24 }} he>
        {currentCameras.map((camera) => (
          <Col
            key={camera.Camera_id}
            span={12}
            style={{ background: "rgba(211, 211, 211, 0.3)" }}
          >
            <div>
              <CameraLayout key={camera.Camera_id} camera={camera} />
            </div>
          </Col>
        ))}
        {currentCameras.length < 4 ? (
          <Col key="add" span={12}>
            <Link to="/cameras" key={6} state={{ openModal: true }}>
              <div
                className="clickable-div"
                style={{
                  height: "100%",
                  minHeight: "200px",
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
