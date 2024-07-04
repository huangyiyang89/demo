import { PropTypes } from "prop-types";
import { Layout, List, Flex, Row, Col } from "antd";
import EventImage from "./EventImage";
import "../assets/styles.css";
import Canv from "./Canv";
import { localtime } from "../service";
import FlvPlayer from "./FlvPlayer";
import PolygonCanv from "./PolygonCanv";

const { Sider, Header, Content, Footer } = Layout;

const layoutStyle = {
  height: "100%",
};

const siderStyle = {
  backgroundColor: "rgb(0, 21, 41)",
  height: "auto",
};

const headerStyle = {
  backgroundColor: "#001529",
  color: "#fff",
  textAlign: "center",
  height: 18,
  padding: 0,
  lineHeight: "normal",
};

const contentStyle = {
  padding: 0,
  margin: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const footerStyle = {
  backgroundColor: "#001529",
  color: "#fff",
  textAlign: "center",
  height: 18,
  padding: 0,
};

const textStyle = { color: "white", fontSize: 10 };

const CameraLayout = ({ camera = null, horizontal = false }) => {
  const ratioPadding = camera ? (camera.frame_height/camera.frame_width * 100).toString()+"%" : "56.25%"
  return (
    <>
      {!horizontal ? (
        <Layout style={layoutStyle}>
          <Sider style={siderStyle} width={"10vw"}>
            <List
              style={{
                overflowY: "auto",
                width: "100%",
                position: "absolute ",
                left: 0,
                top: 0,
                bottom: 0,
              }}
            >
              {camera?.events?.map((event) => (
                <List.Item
                  key={event.id}
                  style={{
                    padding: 0,
                    border: 0,
                    flexDirection: "column",
                    margin: 8,
                  }}
                >
                  <EventImage event={event} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span style={textStyle}>{event.event}</span>
                    <span style={textStyle}>{localtime(event.time)}</span>
                  </div>
                </List.Item>
              ))}
            </List>
            <div
              style={{ width: "200px", height: "100%", display: "block" }}
            ></div>
          </Sider>
          <Layout>
            <Header style={headerStyle}>{camera.name}</Header>
            <Content style={contentStyle}>
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  paddingBottom: ratioPadding,
                  height: 0,
                }}
              >
                <FlvPlayer url={camera.Camera_addr}></FlvPlayer>
                {camera?.areas?.map((area) => (
                  <PolygonCanv key={area.id} videoWidth={camera.frame_width} data={area.area_coordinate}></PolygonCanv>
                  // <Canv key={area.id} area={area}></Canv>
                ))}
              </div>
            </Content>
            <Footer style={footerStyle}>{camera.description}</Footer>
          </Layout>
        </Layout>
      ) : (
        <>
          <Flex style={{ width: "100%" }}>
            <div style={{ width: "100%"}}>
              <div style={headerStyle}>{camera.name}</div>
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  paddingBottom: ratioPadding,
                  height: 0,
                }}
              >
                <FlvPlayer url={camera.Camera_addr}></FlvPlayer>
                {camera?.areas?.map((area) => (
                  <PolygonCanv key={area.id} videoWidth={camera.frame_width} data={area.area_coordinate}></PolygonCanv>
                ))}
              </div>
              <div style={footerStyle}>{camera.description}</div>
              <Row gutter={[16, 16]}
                style={{
                  height: "10vw",
                  marginTop: 16,
                  overflowY:"auto",
                  backgroundColor:"#001529",
                  marginLeft:0,
                  marginRight:0,
                  padding:8,
                  paddingTop:16,
                  
                }}
              >
                {camera?.events?.map((event) => (
                  <Col key={camera.Camera_id} span={8}>
                    <div>
                      <EventImage event={event} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginTop: 5,
                        }}
                      >
                        <span style={textStyle}>{event.event}</span>
                        <span style={textStyle}>{localtime(event.time)}</span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Flex>
        </>
      )}
    </>
  );
};

//propsType
CameraLayout.propTypes = {
  camera: PropTypes.object,
  horizontal: PropTypes.bool,
};

export default CameraLayout;
