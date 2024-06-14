import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  SaveOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, ConfigProvider } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import Login from "./Login";

const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };


  const location = useLocation();
  const selectedKey = location.pathname;
  console.log(location,selectedKey)
  return (
    <ConfigProvider locale={zhCN}>
      {isLoggedIn ? (
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              items={[
                {
                  key: "/live",
                  icon: <VideoCameraOutlined />,
                  label: <Link to="/live">实时监控</Link>,
                },
                {
                  key: "/events",
                  icon: <ExclamationCircleOutlined />,
                  label: <Link to="/events">事件列表</Link>,
                },
                {
                  key: "/statistic",
                  icon: <AreaChartOutlined />,
                  label: <Link to="/statistic">统计数据</Link>,
                },
                {
                  key: "/replay",
                  icon: <SaveOutlined />,
                  label: <Link to="/replay">录像回放</Link>,
                },
                {
                  key: "5",
                  icon: <SettingOutlined />,
                  label: "录像通道",
                  children: [
                    {
                      key: "/cameras",
                      icon: <VideoCameraOutlined />,
                      label: <Link to="/cameras">录像通道</Link>,
                    },
                    {
                      key: "/config",
                      icon: <VideoCameraOutlined />,
                      label: <Link to="/config">区域设置</Link>,
                    },
                  ],
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
                minHeight: "calc(100vh - 112px)",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ConfigProvider>
  );
};
export default App;
