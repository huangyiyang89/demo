import { PropTypes } from "prop-types";
import { Layout, List, Image } from "antd";
import VideoJs from "./VideoJs";
import "../assets/styles.css";
import Canv from "./Canv";

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

const textStyle = { color: "white", fontSize: 12 };

const CameraLayout = ({ camera }) => {
  return (
    <Layout style={layoutStyle}>
      <Sider style={siderStyle}>
        <List
          style={{
            overflowY: "auto",
            width: 200,
            position: "absolute ",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <List.Item
              key={index}
              style={{
                padding: 0,
                border: 0,
                flexDirection: "column",
                margin: 8,
              }}
            >
              <Image src={`./images/event1.jpg`} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span style={textStyle}>安全帽检测</span>
                <span style={textStyle}>2024-04-03 12:12:33</span>
              </div>
            </List.Item>
          ))}
        </List>
        <div style={{ width: "200px", height: "100%", display: "block" }}></div>
      </Sider>
      <Layout>
        <Header style={headerStyle}>{camera.name}</Header>
        <Content style={contentStyle}>
          <div style={{ flex: 1 ,position:"relative"}}>
            <VideoJs
              options={{
                sources: [
                  { src: camera.src},
                ],
              }}
            />
            {camera.regions.map((region, index) => (
              <Canv key={index} shape={region.shape}></Canv>
            ))}
          </div>
        </Content>
        <Footer style={footerStyle}>{camera.description}</Footer>
      </Layout>
    </Layout>
  );
};

//propsType
CameraLayout.propTypes = {
  camera: PropTypes.object,
};

export default CameraLayout;
