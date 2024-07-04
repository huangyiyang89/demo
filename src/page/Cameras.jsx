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
import {
  fetchCameras,
  deleteCamera,
  createCamera,
  updateCamera,
} from "../service";

const { Title } = Typography;

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();



  const refreshData = async () => {
    try {
      const camerasData = await fetchCameras();
      setCameras(camerasData);
    } catch (error) {
      message.error("获取摄像机数据失败");
    }
  };
  useEffect(() => {
    refreshData();
  }, [])

  useEffect(() => {
    refreshData();
    if (location.state?.openModal) {
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
      if (isEditing) {
        await updateCamera(values);
        refreshData();
        message.success("摄像机更新成功！");
      } else {
        const response = await createCamera(values);
        setCameras([...cameras, response]);
        message.success("摄像机添加成功！");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("提交表单失败");
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      await deleteCamera(cameraId);
      setCameras(cameras.filter((camera) => camera.Camera_id !== cameraId));
      message.success("摄像机删除成功！");
    } catch (error) {
      console.error(error);
      message.error("删除摄像机失败");
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
      dataIndex: "Camera_addr",
      key: "Camera_addr",
      ellipsis: true,
      width: "30%",
    },
    {
      title: "MAC",
      dataIndex: "MAC",
      key: "MAC",
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
        <span>
          <Button type="primary" size="small" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据无法恢复"
            onConfirm={() => handleDeleteCamera(record.Camera_id)}
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
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>摄像机设置</Title>
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
        rowKey="Camera_id"
      />
      <Modal
        title={isEditing ? "编辑摄像机" : "添加摄像机"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Camera_id" label="摄像机编号" hidden>
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
            name="Camera_addr"
            label="源地址"
            rules={[{ required: true, message: "请输入源地址!" },{ pattern: /^(rtsp|http):\/\/[^\s$.?#].[^\s]*$/, message: "请输入有效的 url地址!" }]}
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
            name="MAC"
            label="MAC地址"
            rules={[{ required: true, message: "请输入MAC地址!" },{pattern:"^([0-9a-fA-F]{2}(:|-)){5}[0-9a-fA-F]{2}$",message:"请输入正确的MAC地址！如 11:22:33:44:55:66 或 11-22-33-44-55-66 "}]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cameras;
