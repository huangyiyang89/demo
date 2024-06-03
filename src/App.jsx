import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, theme ,ConfigProvider} from "antd";
import { Outlet } from "react-router-dom";
import zhCN from 'antd/locale/zh_CN';

const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <VideoCameraOutlined />,
                label: "实时监控",
              },
              {
                key: "2",
                icon: <ExclamationCircleOutlined />,
                label: "事件列表",
              },
              {
                key: "3",
                icon: <SaveOutlined />,
                label: "录像回放",
              },
              {
                key: "4",
                icon: <SettingOutlined />,
                label: "应用设置",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
