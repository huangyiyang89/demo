import { Col, Row, message, Empty, Typography, Button, Flex ,Tag, Spin} from "antd";
import { fetchAreas, fetchCameras, fetchEvents } from "../service";
import CameraLayout from "../component/CameraLayout";
import "../assets/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const { Title } = Typography;

const Live = () => {
  const [currentCameras, setCurrentCameras] = useState([]);
  const [checkedCameraIds, setCheckedCameraIds] = useState([]);
  const [loading,setLoading] = useState(true);
 
  const filteredCameras = checkedCameraIds.map((id) =>
    currentCameras.find((camera) => camera.Camera_id === id))
  
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
        const camerasWithDetails = cameras?.map((camera) => ({
          ...camera,
          events: events?.filter(
            (event) => event.Camera_id === camera.Camera_id
          ),
          areas: areas?.filter((area) => area.Camera_id === camera.Camera_id),
        }));

        setCurrentCameras(camerasWithDetails);
        setCheckedCameraIds(camerasWithDetails.map((camera) => camera.Camera_id));
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch", error);
        message.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    loading?<Flex style={{height:"100%",alignItems:"center",justifyContent:"center"}}><Spin size="large"></Spin></Flex>:
    <>
      <div style={{position:"absolute",top:0,height:64,alignContent:'center',width:"80vw",marginLeft:50}}>
        {currentCameras.map((camera) => (
          <Tag.CheckableTag
          style={{marginRight:16}}
          key={camera.Camera_id}
          checked={checkedCameraIds.includes(camera.Camera_id)}
          onChange={(checked) =>
            setCheckedCameraIds(
              checked
                ? [...checkedCameraIds, camera.Camera_id]
                : checkedCameraIds.filter((id) => id !== camera.Camera_id)
            )}
        >
          {camera.name} <span style={{color:camera.state?"lightgreen":"red",background:"balck",fill:"green"}}>{(camera.state?"online":"offline")}</span>
        </Tag.CheckableTag>
        ))}
      </div>
      {currentCameras.length == 0 ? (
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
      {filteredCameras.length == 1 ? (
        <div style={{ display: "flex", maxHeight: "calc(-112px + 100vh);" }}>
          <CameraLayout
            key={filteredCameras[0].Camera_id}
            camera={filteredCameras[0]}
          />
        </div>
      ) : (
        ""
      )}
      {filteredCameras.length == 2 ? (
        <Flex style={{ width: "100%" }} gap={32}>
          {filteredCameras.map((camera) => (
            <CameraLayout key={camera.Camera_id} camera={camera} horizontal />
          ))}
        </Flex>
      ) : (
        ""
      )}
      {filteredCameras.length >= 3 ? (
        <Row gutter={[16, 16]} style={{ margin: -24 }}>
          {filteredCameras.map((camera) => (
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
          
          {/* {filteredCameras.length === 3 || filteredCameras.length === 5 ? (
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
          )} */}
        </Row>
      ) : (
        ""
      )}
    </>
  );
};

export default Live;
