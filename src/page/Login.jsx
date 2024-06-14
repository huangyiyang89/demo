import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate login request
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'admin') {
        onLogin(true);
      } else {
        onLogin(false);
      }
      setLoading(false);
    }, 1000); // Added a slight delay to simulate network latency
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
    }}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{ 
          maxWidth: 400, 
          width: '100%', 
          padding: '40px 20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="./vite.svg" alt="Logo" style={{ width: '100px', marginBottom: '10px' }} />
          <h1 style={{ margin: 0 }}>DEMO</h1>
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />} 
            placeholder="用户名" 
            size="large" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="login-form-button" 
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
