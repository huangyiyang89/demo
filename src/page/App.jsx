import { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  VideoCameraOutlined,
  SaveOutlined,
  ClusterOutlined,
} from "@ant-design/icons";
import { Button, Tag, Layout, Menu, theme, ConfigProvider } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";


import Login from "./Login";



const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (login) => {
    setIsLoggedIn(login);
  };

  const location = useLocation();
  const selectedKey = location.pathname;
  const [status, setStatus] = useState(null);


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/status/");
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
                  key: "/replay",
                  icon: <SaveOutlined />,
                  label: <Link to="/replay">录像回放</Link>,
                },
                {
                  key: "/nvrs",
                  icon: <ClusterOutlined />,
                  label: <Link to="/nvrs">NVR设置</Link>,
                },
                {
                  key: "/cameras",
                  icon: <VideoCameraOutlined />,
                  label: <Link to="/cameras">录像通道</Link>,
                },
                {
                  key: "/areas",
                  icon: <SettingOutlined />,
                  label: <Link to="/areas">检测区域</Link>,
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 0,
                background: colorBgContainer,
                height: 64,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "14px",
                  width: 64,
                  height: 64,
                }}
              />
              <span style={{marginRight:15}}>
                <Tag color={status?.cpu>50?"volcano":"green"}>CPU: {status?.cpu}%</Tag>
                <Tag color={status?.npu>50?"volcano":"green"}>NPU: {status?.npu}%</Tag>
                <Tag color={status?.mem>50?"volcano":"green"}>Mem: {status?.mem}%</Tag>
                <Tag color={status?.disk>50?"volcano":"green"}>Disk: {status?.disk}%</Tag>
              </span>
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
