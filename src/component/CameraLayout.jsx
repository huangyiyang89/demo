import { PropTypes } from "prop-types";
import { Layout, List } from "antd";
import EventImage from "./EventImage";
import "../assets/styles.css";
import Canv from "./Canv";
import { localtime } from "../service";
import FlvPlayer from "./FlvPlayer";

const { Sider, Header, Content, Footer } = Layout;

const layoutStyle = {
  height: "100%",
};

const siderStyle = {
  backgroundColor: "#202020",
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

const textStyle = { color: "white", fontSize: 8 };

const CameraLayout = ({ camera = null, horizontal = false }) => {
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
                  paddingBottom: "56.25%",
                  height: 0,
                }}
              >
                <FlvPlayer camera={camera}></FlvPlayer>
                {camera?.areas?.map((area) => (
                  <Canv key={area.id} area={area}></Canv>
                ))}
              </div>
            </Content>
            <Footer style={footerStyle}>{camera.description}</Footer>
          </Layout>
        </Layout>
      ) : (
        ""
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
