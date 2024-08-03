import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Popconfirm,
  Tag,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();



  const refreshData = async () => {
    try {
      const response = await axios.get('/api/cameras/');
      const cameras = response.data;
      setCameras(cameras);

    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };
  useEffect(() => {
    refreshData();
  }, [])

  useEffect(() => {
    if (location.state?.openModal) {
      refreshData();
      setIsEditing(false);
      form.setFieldsValue({});
      setIsModalOpen(true);
    }
  }, [location.state, form]);

  const showModal = (camera = null) => {
    setIsEditing(!!camera);
    form.resetFields(); 
    form.setFieldsValue(camera || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      if (isEditing) {
        await axios.patch(`/api/cameras/${values.id}`, values);
        setCameras(cameras.map((camera) => (camera.id === values.id? values : camera)));
        message.success("摄像机更新成功！");
      } else {
        const response = await axios.post("/api/cameras/",values);
        setCameras([...cameras, response.data]);
        message.success("添加摄像机成功！");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("提交表单失败");
    }
  };

  const handleDeleteCamera = async (id) => {
    try {
      await axios.delete(`/api/cameras/${id}`);
      setCameras(cameras.filter((camera) => camera.id !== id));
      message.success("摄像机删除成功！");
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };

  const validateAspectRatio = () => {
    
    const frameWidth = form.getFieldValue("frame_width");
    const frameHeight = form.getFieldValue("frame_height");

    if (!frameWidth || !frameHeight) {
      return Promise.resolve();
    }


    const aspectRatio = frameWidth / frameHeight;

    if (aspectRatio === 16 / 9 || aspectRatio === 4 / 3) {
      return Promise.resolve();
    } else {
      return Promise.reject("宽高比必须是 16:9 或 4:3 ");
    }
  };

  const handleWidthChange = (e) => {
    const width = e.target.value;
    const height = form.getFieldValue("frame_height");

    if (height) {
      const aspectRatio = width / height;

      if (aspectRatio === 16 / 9) {
        form.setFieldsValue({ frame_height: Math.round(width / (16 / 9)) });
      } else if (aspectRatio === 4 / 3) {
        form.setFieldsValue({ frame_height: Math.round(width / (4 / 3)) });
      }
    }
  };

  const handleHeightChange = (e) => {
    const height = e.target.value;
    const width = form.getFieldValue("frame_width");

    if (width) {
      const aspectRatio = width / height;

      if (aspectRatio === 16 / 9) {
        form.setFieldsValue({ frame_width: Math.round(height * (16 / 9)) });
      } else if (aspectRatio === 4 / 3) {
        form.setFieldsValue({ frame_width: Math.round(height * (4 / 3)) });
      }
    }
  };

  const columns = [
    { title: "摄像机名称", dataIndex: "name", key: "name", ellipsis: true, width: "10%" },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "源地址",
      dataIndex: "ip_addr",
      key: "ip_addr",
      ellipsis: true,
      width: "30%",
    },
    {
      title: "mac",
      dataIndex: "mac",
      key: "mac",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      ellipsis: true,
      width: "10%",
      render: (text, record) => (
        <Tag color={record.state === 1 ? "green" : "red"}>
          {record.state === 1 ? "在线" : "离线"}
        </Tag>
      ),
    },
    {
      title: "宽",
      dataIndex: "frame_width",
      key: "frame_width",
      ellipsis: true,
      width: "10%",
    },
    {
      title: "高",
      dataIndex: "frame_height",
      key: "frame_height",
      ellipsis: true,
      width: "10%",
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (text, record) => (
        <div>
          <Button type="primary" size="small" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="注意！该摄像机下所有检测区域会同步删除。"
            onConfirm={() => handleDeleteCamera(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: "8px" }}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>录像通道设置</Title>
      <div
        style={{
          gap: "64px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Button type="primary" onClick={() => showModal()}>
          添加摄像机
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={cameras.filter((camera) => camera.state !== "deleted")}
        rowKey="id"
      />
      <Modal
        title={isEditing ? "编辑摄像机" : "添加摄像机"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="摄像机编号" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="摄像机名称"
            rules={[{ required: true, message: "请输入摄像机名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请输入描述!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ip_addr"
            label="源地址"
            rules={[{ required: true, message: "请输入源地址!" },{ pattern: /^(rtsp|http):\/\/[^\s$.?#].[^\s]*$/, message: "请输入有效的url地址!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="frame_width"
            label="宽"
            rules={[{ required: true, message: "请输入宽!" }, { validator: validateAspectRatio }]}
          >
            <Input onChange={handleWidthChange} />
          </Form.Item>
          <Form.Item
            name="frame_height"
            label="高"
            rules={[{ required: true, message: "请输入高!" }, { validator: validateAspectRatio }]}
          >
            <Input onChange={handleHeightChange} />
          </Form.Item>
          <Form.Item
            name="mac"
            label="mac地址"
            rules={[{ required: true, message: "请输入mac地址!" },{pattern:"^([0-9a-fA-F]{2}(:|-)){5}[0-9a-fA-F]{2}$",message:"请输入正确的mac地址！如 11:22:33:44:55:66 或 11-22-33-44-55-66 "}]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cameras;
