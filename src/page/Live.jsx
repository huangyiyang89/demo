import "../component/VideoJs";
import { Col, Row, message, Empty, Typography, Button, Flex } from "antd";
import { fetchAreas, fetchCameras, fetchEvents } from "../service";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import CameraLayout from "../component/CameraLayout";
import "../assets/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const { Title } = Typography;

const Live = () => {
  const [currentCameras, setCurrentCameras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cameras = await fetchCameras();
        const events = await fetchEvents();
        const areas = await fetchAreas();
        if (events.length) {
          events?.forEach((event) => {
            event.camera = cameras.find(
              (camera) => camera.Camera_id === event.Camera_id
            );
          });
        }
        console.log(events);

        const camerasWithDetails = cameras?.map((camera) => ({
          ...camera,
          events: events?.filter(
            (event) => event.Camera_id === camera.Camera_id
          ),
          areas: areas?.filter((area) => area.Camera_id === camera.Camera_id),
        }));
        console.log(camerasWithDetails);
        setCurrentCameras(camerasWithDetails);
      } catch (error) {
        console.error("Failed to fetch", error);
        message.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {currentCameras.length == null ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 200,
          }}
          description={
            <Title level={5}>摄像机列表为空，您还没有添加任何录像通道！</Title>
          }
        >
          <Link to="/cameras" key={6} state={{ openModal: true }}>
            <Button type="primary">现在去添加</Button>
          </Link>
        </Empty>
      ) : (
        ""
      )}
      {currentCameras.length == 1 ? (
        <div style={{ display: "flex", maxHeight: "calc(-112px + 100vh);" }}>
          <CameraLayout
            key={currentCameras[0].Camera_id}
            camera={currentCameras[0]}
          />
        </div>
      ) : (
        ""
      )}
      {currentCameras.length == 2 ? (
        <Flex style={{width:"100%"}} gap={32}>
          <CameraLayout
            key={currentCameras[0].Camera_id}
            camera={currentCameras[0]}
            horizontal
          />
          <CameraLayout
            key={currentCameras[1].Camera_id}
            camera={currentCameras[1]}
            horizontal
          />
        </Flex>
      ) : (
        ""
      )}
      {currentCameras.length >= 3 ? (
        <Row gutter={[16, 16]} style={{ margin: -24 }}>
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
          {currentCameras.length === 3 || currentCameras.length === 5 ? (
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
                    background: "rgba(211, 211, 211, 1)",
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
          ) : (
            ""
          )}
        </Row>
      ) : (
        ""
      )}
    </>
  );
};

export default Live;
