import { Col, Row, message, Empty, Typography, Button, Flex ,Tag, Spin} from "antd";
import CameraLayout from "../component/CameraLayout";
import "../assets/styles.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const { Title } = Typography;

const Live = () => {
  const [currentCameras, setCurrentCameras] = useState([]);
  const [checkedCameraIds, setCheckedCameraIds] = useState([]);
  const [loading,setLoading] = useState(true);
 
  const filteredCameras = checkedCameraIds.map((id) =>
    currentCameras.find((camera) => camera.id === id))
  
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/cameras/');
        const cameras = response.data;
        console.log("cameras:",cameras);
        setCurrentCameras(cameras);
        setCheckedCameraIds(cameras.map((camera) => camera.id));

      } catch (error) {
        if (error.response) {
          message.error(error.response.data.detail);
        } else {
          message.error(error.message);
        }
      }
    };
    fetchData();
    setLoading(false)
  }, []);

  return (
    loading?<Flex style={{height:"100%",alignItems:"center",justifyContent:"center"}}><Spin size="large"></Spin></Flex>:
    <>
      <div style={{position:"absolute",top:0,height:64,alignContent:'center',width:"80vw",marginLeft:50}}>
        {currentCameras.map((camera) => (
          <Tag.CheckableTag
          style={{marginRight:16}}
          key={camera.id}
          checked={checkedCameraIds.includes(camera.id)}
          onChange={(checked) =>
            setCheckedCameraIds(
              checked
                ? [...checkedCameraIds, camera.id]
                : checkedCameraIds.filter((id) => id !== camera.id)
            )}
        >
          {camera.name} <span style={{color:camera.state?"lightgreen":"red",background:"balck",fill:"green"}}>{(camera.state?"online":"offline")}</span>
        </Tag.CheckableTag>
        ))}
      </div>
      {currentCameras.length == 0 ? (
        <Empty
          image="/empty.svg"
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
        <div style={{ display: "flex", maxHeight: "calc(-112px + 100vh)" }}>
          <CameraLayout
            key={filteredCameras[0].camera_id}
            camera={filteredCameras[0]}
          />
        </div>
      ) : (
        ""
      )}
      {filteredCameras.length == 2 ? (
        <Flex style={{ width: "100%" }} gap={32}>
          {filteredCameras.map((camera) => (
            <CameraLayout key={camera.id} camera={camera} horizontal />
          ))}
        </Flex>
      ) : (
        ""
      )}
      {filteredCameras.length >= 3 ? (
        <Row gutter={[16, 16]} style={{ margin: -24 }}>
          {filteredCameras.map((camera) => (
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
